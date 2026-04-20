import { NextRequest, NextResponse } from 'next/server';

// Phone verification is not required — return success
export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true, message: 'Phone verification not required' });
}
