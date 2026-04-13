import { NextRequest, NextResponse } from 'next/server';
import { clerkFrontendApiProxy } from '@clerk/nextjs/server';

export async function proxy(request: NextRequest): Promise<Response> {
  // Only forward Clerk's own API path to the Clerk handler
  if (request.nextUrl.pathname.startsWith('/__clerk')) {
    const clerkResponse = await clerkFrontendApiProxy(request);
    if (clerkResponse) return clerkResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
