import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { db } from '@/lib/database';
import { getAuthenticatedUser } from '@/lib/supabase';

const MODEL_NAME = 'gemini-1.5-flash';

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
        const headerUserId = request.headers.get('x-user-id') || '';
        if (!headerUserId) {
          return NextResponse.json({ 
            error: 'Authentication required. Please provide authorization header or x-user-id header for testing.' 
          }, { status: 401 });
        }
        userId = headerUserId;
        console.warn('Using client-provided user ID. This should not happen in production.');
      }
    } catch (authError) {
      return NextResponse.json({ error: 'Authentication failed.' }, { status: 401 });
    }

    const body = await request.json();
    const { history, message, consultationId } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Format the history for the Gemini API
    const chatHistory = (history || []).map((msg: { sender: string; message: string }) => ({
      role: msg.sender === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.message }],
    }));

    // Start a chat session with the existing history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = await response.text();

    // Store user message in database if userId is provided
    if (userId) {
      try {
        await db.createChatMessage({
          consultation_id: consultationId || null,
          sender_id: userId,
          message: message,
          attachments: null,
          is_ai_response: false
        });

        // Store AI response
        await db.createChatMessage({
          consultation_id: consultationId || null,
          sender_id: userId, // Use the same user ID but mark as AI response
          message: text,
          attachments: null,
          is_ai_response: true
        });

        console.log('Chat messages saved to database');
      } catch (dbError) {
        console.error('Failed to save chat messages to database:', dbError);
        // Continue anyway - we still return the response
      }

      // Track analytics for chat usage
      try {
        await db.createAnalyticsEvent({
          user_id: userId,
          event_type: 'chat_message_sent',
          event_data: {
            message_length: message.length,
            has_consultation: !!consultationId,
            response_length: text.length
          },
          session_id: `chat-session-${Date.now()}`,
          ip_address: request.headers.get('x-forwarded-for') || request.ip,
          user_agent: request.headers.get('user-agent')
        });
      } catch (analyticsError) {
        console.error('Failed to track chat analytics:', analyticsError);
      }
    }

    return NextResponse.json({ response: text });

  } catch (error) {
    console.error('Gemini Chat API error:', error);
    return NextResponse.json({ error: 'Failed to get response from AI due to a server error.' }, { status: 500 });
  }
}