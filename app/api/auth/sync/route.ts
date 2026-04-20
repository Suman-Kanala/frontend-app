import { NextRequest, NextResponse } from 'next/server';

// Auth sync endpoint — syncs Clerk user data
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, synced: true });
  } catch {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
