import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ProxyContext {
  params: Promise<{
    path: string[];
  }>;
}

interface ErrorResponse {
  error: string;
  message?: string;
}

async function proxyRequest(request: NextRequest, context: ProxyContext): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const { path } = await context.params;
    const backendUrl = `${BACKEND_URL}/api/${path.join('/')}${url.search}`;

    const headers: Record<string, string> = {};

    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) headers['Authorization'] = authHeader;

    const contentType = request.headers.get('content-type');
    if (contentType) headers['Content-Type'] = contentType;

    const options: RequestInit = { method: request.method, headers };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      if (contentType?.includes('multipart/form-data')) {
        options.body = await request.formData();
      } else if (contentType?.includes('application/json')) {
        try {
          options.body = JSON.stringify(await request.json());
        } catch {
          options.body = await request.clone().text();
        }
      } else {
        options.body = await request.text();
      }
    }

    const response = await fetch(backendUrl, options);
    const text = await response.text();

    let data: unknown;
    try { data = JSON.parse(text); } catch { data = text; }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', message } as ErrorResponse,
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
