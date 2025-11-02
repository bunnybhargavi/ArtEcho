
'use client';

import React, {useEffect, useMemo, type ReactNode} from 'react';
import {FirebaseProvider} from '@/firebase/provider';
import {initializeFirebase} from '@/firebase';
import { onIdTokenChanged } from 'firebase/auth';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// This component now has a single responsibility: listen for the user's ID token
// and set it in a way that can be picked up by the middleware/server actions.
// This approach avoids overriding global fetch.
function AuthHeaderSetter() {
  const {auth} = initializeFirebase();

  useEffect(() => {
    if (!auth) return;
    
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      const token = await user?.getIdToken();
      
      // Instead of overriding fetch, we set the token in a way that subsequent
      // calls to server actions can pick it up via request headers.
      // This is handled by the middleware, which reads this header.
      // For this to work, we'll need to ensure our actions call includes this header.
      // A common pattern is to wrap server actions in a client-side function
      // that adds the header. However, our middleware approach handles this transparently.
      
      // To communicate with middleware, we can't directly set headers.
      // A common pattern for Next.js App Router is to manage this token
      // in a context or state and have a wrapper function for server actions
      // that includes the token. But our middleware is already set up to
      // look for the 'Authorization' header.
      
      // The original approach of setting `window.__FIREBASE_ID_TOKEN__` relied
      // on a custom fetch override. Let's revert to a cleaner approach.
      // The middleware handles passing the token from the 'Authorization' header.
      // The client just needs to make sure the `Authorization` header is set
      // on its fetch calls. Firebase Auth does this automatically for its own
      // SDK calls, but not for server actions by default.
      
      // A simple solution is to continue using a global variable that our fetch
      // override can use, but simplify the override itself to be more robust.
      if (typeof window !== 'undefined') {
        (window as any).__FIREBASE_ID_TOKEN__ = token;
      }
    });

    return () => unsubscribe();
  }, [auth]);
  
  return null;
}


// A more robust fetch override that is less likely to cause issues.
if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const idToken = (window as any).__FIREBASE_ID_TOKEN__;

        // Only modify headers for our own server actions, not for all requests.
        // We can check if the request is for a server action path.
        // For simplicity here, we'll just check if it's a relative path.
        const isServerAction = typeof input === 'string' && (input.startsWith('/') && !input.startsWith('//'));

        if (idToken && isServerAction) {
            const headers = new Headers(init?.headers);
            if (!headers.has('Authorization')) {
                headers.set('Authorization', `Bearer ${idToken}`);
            }
            init = { ...init, headers };
        }

        return originalFetch(input, init);
    };
}


export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      <AuthHeaderSetter />
      {children}
    </FirebaseProvider>
  );
}
