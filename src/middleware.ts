
import {type NextRequest, NextResponse} from 'next/server';

export async function middleware(request: NextRequest) {
  // Pass all requests through without modification.
  return NextResponse.next();
}

// This config ensures the middleware runs on all paths except for static files.
export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};
