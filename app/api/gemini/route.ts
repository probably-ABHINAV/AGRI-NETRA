import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI model using the key from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { farmProfile, season, field, priority, customRequirements } = body;

    if (!farmProfile) {
      return NextResponse.json({ error: 'Farm profile is required.' }, { status: 400 });
    }

    // Construct a detailed prompt for the Gemini API
    const prompt = `
      You are an expert agronomist AI for a platform called AgriNetra.
      Your task is to provide detailed and actionable crop recommendations for a farmer based on the data provided.

      **Farmer's Farm Profile:**
      - **Location:** ${farmProfile.location}
      - **Soil Type:** ${farmProfile.soilType}
      - **Farm Size:** ${farmProfile.farmSize} hectares
      - **Irrigation:** ${farmProfile.irrigationType}
      - **Previous Crops:** ${farmProfile.previousCrops.join(', ')}
      - **Soil Health Details:**
        - pH: ${farmProfile.soilHealth.ph}
        - Nitrogen (N): ${farmProfile.soilHealth.nitrogen} ppm
        - Phosphorus (P): ${farmProfile.soilHealth.phosphorus} ppm
        - Potassium (K): ${farmProfile.soilHealth.potassium} ppm
        - Organic Matter: ${farmProfile.soilHealth.organicMatter}%

      **Farmer's Request:**
      - **Target Season:** ${season}
      - **Target Field:** ${field}
      - **Main Priority:** ${priority}
      - **Additional Requirements:** ${customRequirements || 'None'}

      **Your Task:**
      Please provide 3 detailed crop recommendations. For each recommendation, use markdown formatting and follow this structure exactly:
      
      ### 1. **Crop Name & Variety**
      - **Confidence Score:** (A percentage from 0% to 100%)
      - **Expected Yield:** (e.g., "4.5-5.2 tons/ha")
      - **Profitability:** (e.g., "High", "Medium", "Low")
      
      #### AI Reasoning
      (A bulleted list explaining *why* this crop is a good fit based on the provided data)
      
      #### Key Advantages
      (A bulleted list of pros)
      
      #### Potential Challenges
      (A bulleted list of cons or risks)

      #### Financials
      - **Market Price:** (Provide estimate)
      - **Investment:** (Provide estimate)
      - **ROI:** (Provide estimate)
      
      ---
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    return NextResponse.json({ recommendations: text });

  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to generate AI recommendations.' }, { status: 500 });
  }
}