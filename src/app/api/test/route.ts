import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'API server is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ 
    success: true, 
    message: 'POST request received',
    data: body,
    timestamp: new Date().toISOString()
  });
} 