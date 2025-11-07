'use client';

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { toast } from 'sonner';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY || '';

export const requestNotificationPermission = async (userId: string) => {
  const app = getApp();
  const messaging = getMessaging(app);
  const firestore = getFirestore(app);

  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      
      if (currentToken) {
        // Save the token to Firestore
        const userDocRef = doc(firestore, 'users', userId);
        await updateDoc(userDocRef, {
          fcmTokens: arrayUnion(currentToken)
        });
        return currentToken;
      } else {
        console.error('No registration token available. Request permission to generate one.');
      }
    } else {
      console.warn('Unable to get permission to notify.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
  return null;
};

export const initializeForegroundMessageListener = () => {
    const app = getApp();
    const messaging = getMessaging(app);
    const unsubscribe = onMessage(messaging, (payload) => {
        if (payload.notification) {
            toast.info(payload.notification.title, {
                description: payload.notification.body
            });
        }
    });
    return unsubscribe;
};
