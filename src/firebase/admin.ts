
import {initializeApp, getApps, App} from 'firebase-admin/app';
import {credential} from 'firebase-admin';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getFirebaseAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }
  // Important! initializeApp() is called without any arguments because Firebase App Hosting
  // integrates with the initializeApp() function to provide the environment variables needed to
  // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
  // without arguments.
  return initializeApp();
}

