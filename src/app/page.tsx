'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// --- CSS STYLES (embedded in the component) ---
const WelcomePageStyles = `
  :root {
    --bg: #000000;
    --gold: #D4AF37;
    --muted: #4b4b4b;
  }

  .loader-page-wrapper {
    position: fixed;
    inset: 0;
    background-color: var(--bg);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.8s ease-in-out;
  }

  .loader-bar-container {
    width: clamp(250px, 50vw, 500px);
    height: 1rem;
    border: 1px solid var(--gold);
    background-color: var(--muted);
    border-radius: 1rem;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
    overflow: hidden;
  }

  .loader-bar-progress {
    width: 0%;
    height: 100%;
    background-color: var(--gold);
    border-radius: 1rem;
    transition: width 4s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: 0 0 10px var(--gold);
  }
`;

export default function WelcomePage() {
  const [progress, setProgress] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Start loading animation
    const progressTimer = setTimeout(() => setProgress(100), 100);

    const redirectTimer = setTimeout(() => {
      setRedirecting(true);
      router.replace('/home');
    }, 4500); // Wait for progress bar animation to complete

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <>
      <style>{WelcomePageStyles}</style>
      <div className="loader-page-wrapper" style={{ opacity: redirecting ? 0 : 1 }}>
        <div className="loader-bar-container">
          <div className="loader-bar-progress" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </>
  );
}
