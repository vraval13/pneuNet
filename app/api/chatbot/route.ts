import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with proper error handling
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const runtime = 'edge'; // Recommended for chat applications

export async function POST(req: Request) {
  try {
    // Verify the API key is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const { message } = await req.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
    });

    const prompt = `As a medical professional, provide a concise answer to: "${message}"`;
    
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    return new NextResponse(JSON.stringify({ reply: text }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to process request',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}