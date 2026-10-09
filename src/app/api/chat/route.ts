import { NextRequest, NextResponse } from 'next/server';
import { processDrishtiQuery } from '@/lib/ai/drishtiChatEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing message parameter.' },
        { status: 400 }
      );
    }

    // Process with the multi-hazard intelligence engine
    const response = await processDrishtiQuery(message, history || []);

    return NextResponse.json({
      success: true,
      ...response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process DRISHTI intelligence query.',
        details: error?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
