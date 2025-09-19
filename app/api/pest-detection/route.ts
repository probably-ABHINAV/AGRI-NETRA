import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/database';
import { supabase, getAuthenticatedUser } from '@/lib/supabase';

// Helper function to convert a file buffer to a Gemini-compatible format
function bufferToGenerativePart(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in the environment variables.');
    return NextResponse.json(
      { error: 'Server configuration error: Missing API key.' },
      { status: 500 }
    );
  }

  try {
    // Try to get authenticated user first, fallback to client-provided ID for development
    let userId: string;
    let isAuthenticated = false;
    
    try {
      const authUser = await getAuthenticatedUser(request);
      if (authUser) {
        userId = authUser.id;
        isAuthenticated = true;
      } else {
        // Fallback to client-provided userId for development/testing
        const formUserId = request.headers.get('x-user-id') || '';
        if (!formUserId) {
          return NextResponse.json({ 
            error: 'Authentication required. Please provide authorization header or x-user-id header for testing.' 
          }, { status: 401 });
        }
        userId = formUserId;
        console.warn('Using client-provided user ID. This should not happen in production.');
      }
    } catch (authError) {
      return NextResponse.json({ error: 'Authentication failed.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const cropType = formData.get('cropType') as string;
    const farmId = formData.get('farmId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }
    if (!cropType) {
      return NextResponse.json({ error: 'Crop type is required.' }, { status: 400 });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const imagePart = bufferToGenerativePart(imageBuffer, file.type);

    // Upload image to Supabase storage if configured
    let imageUrl = '';
    if (supabase) {
      try {
        const fileName = `pest-detection/${userId}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, imageBuffer, {
            contentType: file.type,
            cacheControl: '3600'
          });

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(uploadData.path);
          imageUrl = publicUrl;
        }
      } catch (uploadError) {
        console.warn('Failed to upload image to storage:', uploadError);
        // Continue without image URL - analysis can still work
      }
    }

    const prompt = `
      You are an expert plant pathologist for the AgriNetra platform. Analyze the attached image of a ${cropType} plant. 
      
      Your task is to:
      1.  **Identify** any visible pests, diseases, or nutrient deficiencies. If the plant looks healthy, state that clearly.
      2.  **Assess the Severity** (e.g., Low, Medium, High).
      3.  **Provide a Confidence Score** for your detection (e.g., 95%).
      4.  **Recommend Treatment:** Suggest at least one organic and one chemical treatment option with application instructions.
      5.  **Suggest Prevention:** Provide a bulleted list of preventative measures.

      Structure your response clearly using Markdown with headings for each section (e.g., "### Pest/Disease Identified").
      
      Please also provide a JSON summary at the end with the format:
      {
        "detected_pest": "name or null if healthy",
        "confidence_score": 0.95,
        "severity": "Low/Medium/High",
        "treatment_summary": "brief treatment recommendation"
      }
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const text = await response.text();

    // Try to extract structured data from the response
    let detectedPest = null;
    let confidenceScore = 0.8;
    let severity = 'Medium';
    let treatmentSummary = '';

    try {
      // Look for JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*"detected_pest"[\s\S]*\}/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        detectedPest = jsonData.detected_pest;
        confidenceScore = jsonData.confidence_score || 0.8;
        severity = jsonData.severity || 'Medium';
        treatmentSummary = jsonData.treatment_summary || '';
      }
    } catch (parseError) {
      console.warn('Could not parse JSON from AI response:', parseError);
      // Use default values
    }

    // Store the pest detection in database
    try {
      const detectionData = {
        user_id: userId,
        farm_id: farmId || null,
        crop_id: null, // We don't have crop ID in this context
        image_url: imageUrl,
        detected_pest: detectedPest,
        confidence_score: confidenceScore,
        severity: severity,
        treatment_recommendation: treatmentSummary,
        ai_model_version: 'gemini-1.5-flash'
      };

      await db.createPestDetection(detectionData);
      console.log('Pest detection saved to database');
    } catch (dbError) {
      console.error('Failed to save pest detection to database:', dbError);
      // Continue anyway - we still return the analysis
    }

    // Track analytics
    try {
      await db.createAnalyticsEvent({
        user_id: userId,
        event_type: 'pest_detection_performed',
        event_data: {
          crop_type: cropType,
          has_detection: !!detectedPest,
          confidence_score: confidenceScore,
          severity: severity
        },
        session_id: `session-${Date.now()}`, // Simple session tracking
        ip_address: request.headers.get('x-forwarded-for') || request.ip,
        user_agent: request.headers.get('user-agent')
      });
    } catch (analyticsError) {
      console.error('Failed to track analytics:', analyticsError);
    }

    return NextResponse.json({ 
      analysis: text,
      detection: {
        detected_pest: detectedPest,
        confidence_score: confidenceScore,
        severity: severity,
        image_url: imageUrl
      }
    });
  } catch (error) {
    console.error('Pest Detection API Error:', error);
    return NextResponse.json({ error: 'Failed to analyze the image due to a server error.' }, { status: 500 });
  }
}