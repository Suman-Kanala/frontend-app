import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ProxyContext {
  params: Promise<{
    path: string[];
  }>;
}

interface ProxyRequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string | BodyInit;
}

interface ErrorResponse {
  error: string;
  message?: string;
}

async function proxyRequest(request: NextRequest, context: ProxyContext): Promise<NextResponse> {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const url = new URL(request.url);
    const { path } = await context.params;
    const backendUrl = `${BACKEND_URL}/api/${path.join('/')}${url.search}`;

    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Copy relevant headers from the original request
    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    const options: RequestInit = {
      method: request.method,
      headers,
    };

    // Add body for non-GET requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      // Handle multipart/form-data (file uploads) - pass through as-is
      if (contentType?.includes('multipart/form-data')) {
        options.body = await request.formData();
      } 
      // Handle JSON - read and re-stringify
      else if (contentType?.includes('application/json')) {
        try {
          const jsonBody = await request.json();
          options.body = JSON.stringify(jsonBody);
        } catch (e) {
          console.error('[Proxy] Failed to parse JSON body:', e);
          // If JSON parsing fails, try to get the raw body
          const clonedRequest = request.clone();
          options.body = await clonedRequest.text();
        }
      } 
      // Handle everything else as text
      else {
        options.body = await request.text();
      }
    }

    const response = await fetch(backendUrl, options);
    const data = await response.text();

    // Try to parse as JSON, fallback to text
    let jsonData: unknown;
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = data;
    }

    return NextResponse.json(jsonData, { status: response.status });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Proxy] API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: errorMessage } as ErrorResponse,
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: ProxyContext): Promise<NextResponse> {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: ProxyContext): Promise<NextResponse> {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: ProxyContext): Promise<NextResponse> {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: ProxyContext): Promise<NextResponse> {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: ProxyContext): Promise<NextResponse> {
  return proxyRequest(request, context);
}
