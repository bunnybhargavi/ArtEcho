
import {type NextRequest, NextResponse} from 'next/server';

// This middleware is now edge-compatible.
// It extracts the auth token and forwards it in a new header to be processed
// by a Node.js-runtime API route or server action.
export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const authHeader = request.headers.get('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    requestHeaders.set('x-id-token', token);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // This will apply the middleware to all routes.
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};
