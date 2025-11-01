
import {type NextRequest, NextResponse} from 'next/server';

// This middleware is now edge-compatible.
// It extracts the auth token and forwards it in a new header to be processed
// by a Node.js-runtime API route or server action.
export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const authToken = request.headers.get('Authorization')?.split('Bearer ')[1];

  // We are NOT verifying the token here. We are just passing it along.
  // The verification will happen in a server-side (Node.js) environment.
  if (authToken) {
    requestHeaders.set('x-id-token', authToken);
  }

  // Pass the user ID if it was already resolved and set by another part of the chain
  // (though in this setup, this is less likely to be the primary path).
  const userId = request.headers.get('x-user-id');
  if (userId) {
      requestHeaders.set('x-user-id', userId);
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
