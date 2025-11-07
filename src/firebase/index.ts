
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Initializes and returns Firebase SDKs.
 * 
 * This function handles the initialization of the Firebase app instance.
 * It ensures that Firebase is initialized only once. In a server-side
 * context or a mixed environment, it safely retrieves the existing app
 * instance if it has already been created.
 *
 * For client-side usage, especially within a Next.js application, this
 * function should be called once at the top level of the component tree,
 * typically in a client-side provider, to ensure a single instance is used
 * throughout the application lifecycle.
 *
 * @returns An object containing the initialized FirebaseApp, Auth, and Firestore instances.
 */
export function initializeFirebase() {
  let firebaseApp: FirebaseApp;

  // Check if any Firebase apps have been initialized.
  if (!getApps().length) {
    // No apps initialized, so create a new one.
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    // An app is already initialized, retrieve it.
    firebaseApp = getApp();
  }

  // Return all the necessary Firebase service instances.
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './firestore/non-blocking-updates';
export * from './errors';
export * from './error-emitter';
