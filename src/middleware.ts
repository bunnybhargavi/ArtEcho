
import {type NextRequest, NextResponse} from 'next/server';

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const authHeader = request.headers.get('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    requestHeaders.set('x-id-token', token);
  }

  // This ensures the request is passed through to the Next.js router.
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// This config ensures the middleware runs on all paths except for static files.
export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};
