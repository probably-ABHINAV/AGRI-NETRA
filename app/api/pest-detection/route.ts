import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const cropType = formData.get('cropType') as string;

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

    const prompt = `
      You are an expert plant pathologist for the AgriNetra platform. Analyze the attached image of a ${cropType} plant. 
      
      Your task is to:
      1.  **Identify** any visible pests, diseases, or nutrient deficiencies. If the plant looks healthy, state that clearly.
      2.  **Assess the Severity** (e.g., Low, Medium, High).
      3.  **Provide a Confidence Score** for your detection (e.g., 95%).
      4.  **Recommend Treatment:** Suggest at least one organic and one chemical treatment option with application instructions.
      5.  **Suggest Prevention:** Provide a bulleted list of preventative measures.

      Structure your response clearly using Markdown with headings for each section (e.g., "### Pest/Disease Identified").
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const text = await response.text();

    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error('Pest Detection API Error:', error);
    return NextResponse.json({ error: 'Failed to analyze the image due to a server error.' }, { status: 500 });
  }
}