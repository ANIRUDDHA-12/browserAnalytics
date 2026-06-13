import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 1. CORS Preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      // FIXED: Changed "Allow-Control" to "Access-Control"
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
  });
}

// 2. The Ingestion Engine
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, emotion, message, url, category, browser_metadata,screenshot } = body;

    if (!projectId || !emotion || !message) {
      return NextResponse.json(
        { error: 'Missing Fields: Required projectId, emotion, message' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error: insertError } = await supabase
      .from('feedbacks')
      .insert({
        project_id: projectId,
        emotion: emotion,
        message: message,
        url: url || 'Unknown Url',
        category: category || 'General',
        browser_metadata: browser_metadata || {},
        screenshot:screenshot || null
      });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(
      { success: true, message: 'Feedback successfully ingested.' },
      { 
        status: 200, 
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );

  } catch (error: any) {
    console.error("API Ingestion Error", error.message);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

// 3. The Debugger
export async function GET() {
  return NextResponse.json({ 
    message: "The Ingestion Engine is alive! Please send a POST request to submit feedback." 
  });
}