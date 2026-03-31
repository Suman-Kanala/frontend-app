import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AuthSyncRequest {
  email: string;
  name: string;
  picture?: string;
  [key: string]: unknown;
}

interface AuthSyncResponse {
  _id?: string;
  email: string;
  name: string;
  picture?: string;
  role?: string;
  [key: string]: unknown;
}

interface ErrorResponse {
  error: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' } as ErrorResponse, { status: 401 });
    }

    const body: AuthSyncRequest = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data: AuthSyncResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Auth sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as ErrorResponse,
      { status: 500 }
    );
  }
}
