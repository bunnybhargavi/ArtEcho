
'use client';

import React, {useEffect, useMemo, type ReactNode} from 'react';
import {FirebaseProvider} from '@/firebase/provider';
import {initializeFirebase} from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

function AuthHeaderSetter() {
  const {auth} = initializeFirebase();

  useEffect(() => {
    if (!auth) return;
    return auth.onIdTokenChanged(async (user) => {
      const idToken = await user?.getIdToken();
      if (typeof window !== 'undefined') {
        // Here we're setting the token on a window variable.
        // The fetch override below will then pick it up.
        (window as any).__FIREBASE_ID_TOKEN__ = idToken;
      }
    });
  }, [auth]);
  return null;
}

// Keep a reference to the original fetch function
const originalFetch =
  typeof window !== 'undefined' ? window.fetch : () => Promise.reject();

// Override the global fetch function
if (typeof window !== 'undefined') {
  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const idToken = (window as any).__FIREBASE_ID_TOKEN__;

    if (idToken && init && !init.headers?.hasOwnProperty('Authorization')) {
      const headers = new Headers(init.headers);
      headers.set('Authorization', `Bearer ${idToken}`);
      init = {...init, headers};
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
