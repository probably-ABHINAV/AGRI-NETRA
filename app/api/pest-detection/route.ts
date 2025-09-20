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
    // Get authenticated user with proper fallback
    let userId: string;

    try {
      const authUser = await getAuthenticatedUser(request);
      if (authUser) {
        userId = authUser.id;
        console.log('✅ Authenticated user:', userId);
      } else {
        // Use a consistent demo user ID for development
        userId = crypto.randomUUID();
        console.warn('⚠️ Using demo user ID for development:', userId);
      }
    } catch (authError) {
      userId = crypto.randomUUID();
      console.warn('⚠️ Using demo user ID due to auth error:', userId);
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const cropType = formData.get('cropType') as string || 'unknown';
    const farmId = formData.get('farmId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const imagePart = bufferToGenerativePart(imageBuffer, file.type);

    // Upload image to Supabase storage
    let imageUrl = '';
    if (supabase) {
      try {
        // Create unique filename with timestamp
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop() || 'jpg';
        const fileName = `${userId}/${timestamp}-pest-detection.${fileExtension}`;

        console.log('📤 Uploading image to bucket pest-images:', fileName);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('pest-images')
          .upload(fileName, imageBuffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('❌ Storage upload error:', uploadError);
          // Continue with analysis even if upload fails
        } else if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('pest-images')
            .getPublicUrl(uploadData.path);
          imageUrl = publicUrl;
          console.log('✅ Image uploaded successfully:', publicUrl);
        }
      } catch (uploadError) {
        console.error('❌ Failed to upload image to storage:', uploadError);
      }
    } else {
      console.warn('⚠️ Supabase not configured, skipping image upload');
    }

    const prompt = `
      You are a helpful farming advisor for Indian farmers. Analyze the attached image of this plant in simple, easy-to-understand language. First identify what type of plant/crop this is, then provide your analysis.

      Write your response as if you're talking to a farmer with basic education. Use:
      - Simple words and short sentences
      - Common farming terms that farmers know
      - Clear, practical advice
      - Measurements in familiar units (like teaspoons, liters, etc.)

      Structure your analysis like this:

      ## 🔍 What I Found
      Tell me clearly what you see - is the plant healthy or sick? If sick, what's the problem?

      ## 📊 How Serious Is It?
      Rate the problem: Low Risk, Medium Risk, or High Risk
      Explain what this means for the crop

      ## 💊 Treatment Options
      **Natural/Organic Treatment:**
      - List simple home remedies or organic solutions
      - Give exact measurements (like "2 teaspoons neem oil in 1 liter water")

      **Chemical Treatment (if needed):**
      - Suggest common pesticides available in local markets
      - Give clear mixing instructions

      ## 🛡️ Prevention Tips
      - List 3-4 simple steps to prevent this problem in future
      - Use everyday farming practices

      ## ⏰ When to Act
      Tell them how urgently they need to treat this

      Keep everything simple and practical for Indian farmers.
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
        farm_id: farmId || undefined,
        crop_id: undefined, // We don't have crop ID in this context
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
        ip_address: (request.headers.get('x-forwarded-for') || request.ip || '').split(',')[0].trim() || undefined,
        user_agent: request.headers.get('user-agent') || undefined
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