
import {type NextRequest, NextResponse} from 'next/server';
import {auth} from 'firebase-admin';
import {getFirebaseAdminApp} from './firebase/admin';


export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const authToken = request.headers.get('Authorization')?.split('Bearer ')[1];

  let userId: string | null = null;
  if (authToken) {
      try {
        // The middleware can run in edge or node, we can't be sure which.
        // firebase-admin only works in node.
        if (typeof process.env.NEXT_RUNTIME === 'undefined' || process.env.NEXT_RUNTIME === 'nodejs') {
            const decodedToken = await auth(getFirebaseAdminApp()).verifyIdToken(
              authToken
            );
            userId = decodedToken.uid;
        }
      } catch (error) {
        // Token is invalid or expired. We can't set the user ID.
        console.log('Auth token verification failed in middleware, proceeding without user ID.');
      }
  }

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
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};
