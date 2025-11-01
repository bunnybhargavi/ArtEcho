
import {type NextRequest, NextResponse} from 'next/server';
import {auth} from 'firebase-admin';
import {getFirebaseAdminApp} from './firebase/admin';

async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const authToken = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!authToken) {
    return null;
  }

  try {
    const decodedToken = await auth(getFirebaseAdminApp()).verifyIdToken(
      authToken
    );
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const userId = await getUserIdFromRequest(request);

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
  // If you want to be more specific, you can adjust the matcher.
  // For example, to only apply it to API routes and server actions:
  // matcher: ['/api/:path*', '/cart/:path*', '/checkout/:path*'],
  matcher: '/:path*',
};
