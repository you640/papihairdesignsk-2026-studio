'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { initializeFirebase } from '@/firebase';
import { toast } from 'sonner';

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  isAdmin: boolean;
  isAdminLoading: boolean;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  // User authentication state
  user: User | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null; // Error from auth listener
  isAdmin: boolean;
  isAdminLoading: boolean;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseClientProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseClientProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true, // Start loading until first auth event
    userError: null,
    isAdmin: false,
    isAdminLoading: true,
  });
  
  const { firebaseApp, auth, firestore } = initializeFirebase();


  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth || !firestore) { 
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth or Firestore service not provided."), isAdmin: false, isAdminLoading: false });
      return;
    }

    setUserAuthState(prev => ({ ...prev, isUserLoading: true, isAdminLoading: true }));

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => { 
        if (firebaseUser) {
            const userRef = doc(firestore, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
              try {
                await setDoc(userRef, {
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                });
              } catch(e) {
                console.error("Failed to create user document:", e)
              }
            }

            const adminRef = doc(firestore, 'roles_admin', firebaseUser.uid);
            try {
                const adminDoc = await getDoc(adminRef);
                const isAdmin = adminDoc.exists();
                setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null, isAdmin, isAdminLoading: false });
            } catch (error) {
                console.error("Error checking admin status:", error);
                setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: error as Error, isAdmin: false, isAdminLoading: false });
            }
        } else {
            setUserAuthState({ user: null, isUserLoading: false, userError: null, isAdmin: false, isAdminLoading: false });
        }
      },
      (error) => { 
        console.error("FirebaseClientProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error, isAdmin: false, isAdminLoading: false });
      }
    );
    return () => unsubscribe();
  }, [auth, firestore]);

  const contextValue = useMemo((): FirebaseContextState => ({
      firebaseApp: firebaseApp,
      firestore: firestore,
      auth: auth,
      ...userAuthState
  }), [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

// HOOKS

/** Hook to access all Firebase services and user state. */
export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseClientProvider.');
  }
  return context;
};

/** Hook to access Firestore instance. Throws if not available. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  if (!firestore) throw new Error("Firestore not available");
  return firestore;
};

/** Hook to access Auth instance. Throws if not available. */
export const useAuth = (): Auth => {
    const { auth } = useFirebase();
    if (!auth) throw new Error("Auth not available");
    return auth;
};

/** Hook to access the current user's state. */
export const useUser = (): Omit<FirebaseContextState, 'firebaseApp' | 'firestore' | 'auth'> => {
    const { user, isUserLoading, userError, isAdmin, isAdminLoading } = useFirebase();
    return { user, isUserLoading, userError, isAdmin, isAdminLoading };
}

// NON-BLOCKING AUTH FUNCTIONS

/** Initiates email/password sign-up and handles UI feedback. */
export const initiateEmailSignUp = (auth: Auth | null, email: string, password: string) => {
  if (!auth) {
    toast.error("Chyba pripojenia", { description: "Autentifikačná služba nie je k dispozícii." });
    return;
  }
  createUserWithEmailAndPassword(auth, email, password).catch(error => {
    toast.error("Registrácia zlyhala", { description: error.message });
  });
};

/** Initiates email/password sign-in and handles UI feedback. */
export const initiateEmailSignIn = (auth: Auth | null, email: string, password: string) => {
  if (!auth) {
    toast.error("Chyba pripojenia", { description: "Autentifikačná služba nie je k dispozícii." });
    return;
  }
  signInWithEmailAndPassword(auth, email, password).catch(error => {
    toast.error("Prihlásenie zlyhalo", { description: "Skontrolujte prihlasovacie údaje a skúste to znova." });
  });
};

/** Initiates sign-out process safely. */
export const initiateSignOut = () => {
  try {
    const { auth } = initializeFirebase();
    if (auth) {
      firebaseSignOut(auth);
      toast.success("Boli ste odhlásený.");
    }
  } catch(e) {
    console.error("Failed to sign out, Firebase Auth might not be initialized.", e);
    toast.error("Odhlásenie zlyhalo", { description: "Vyskytla sa chyba." });
  }
};
