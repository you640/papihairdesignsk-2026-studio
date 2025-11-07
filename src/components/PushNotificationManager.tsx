'use client';

import { useEffect } from 'react';
import { useUser } from '@/firebase/provider';
import { requestNotificationPermission, initializeForegroundMessageListener } from '@/firebase/messaging';

export default function PushNotificationManager() {
  const { user } = useUser();

  useEffect(() => {
    // Only run this on the client
    if (typeof window === 'undefined') return;

    if (user) {
        requestNotificationPermission(user.uid);
        const unsubscribe = initializeForegroundMessageListener();
        return () => unsubscribe();
    }
  }, [user]);

  // This is a side-effect component, it doesn't render anything
  return null;
}
