'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * This component listens for globally emitted 'permission-error' events from errorEmitter
 * and displays them to the user using toast notifications. This provides immediate,
 * non-blocking feedback for Firestore operations that fail due to security rules.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: Error) => {
      // Log the full error for debugging purposes
      console.error('Global Firebase error caught by listener:', error);

      let title = 'Nastala chyba';
      let description = 'Operácia zlyhala. Skúste to prosím znova.';

      // Check if it's our specific permission error. In a real app, you might
      // also check for other custom error types or Firebase error codes.
      if (error instanceof FirestorePermissionError) {
        title = 'Prístup Zamietnutý';
        description = 'Nemáte dostatočné oprávnenia na vykonanie tejto akcie.';
      } else if (error.message.includes('permission-denied') || error.message.includes('insufficient permissions')) {
        // Fallback for generic permission errors that might not be wrapped
        title = 'Prístup Zamietnutý';
        description = 'Vaše oprávnenia neumožňujú túto operáciu. Kontaktujte administrátora.';
      }

      // Display the toast notification to the user
      toast.error(title, {
        description: description,
        duration: 6000, // Show for 6 seconds
      });
    };

    // Subscribe to the 'permission-error' event
    errorEmitter.on('permission-error', handleError);

    // Clean up the subscription when the component unmounts
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // This component renders nothing to the DOM
  return null;
}
