'use client';

import React, { useState, useEffect } from 'react';

// --- CSS STYLES (embedded in the component) ---
const LuxuryHeroStyles = `
  :root {
    --bg: #000000;
    --fg: #ffffff;
    --gold: #D4AF37;
    --muted: #4b4b4b;
  }

  .luxury-hero-wrapper {
    position: relative;
    background-color: var(--bg);
    color: var(--fg);
    font-family: 'General Sans', sans-serif;
    overflow: hidden;
  }
  
  /* --- ANIMATED BACKGROUND --- */
  .starfield {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .star {
    position: absolute;
    bottom: 0;
    background-color: var(--gold);
    border-radius: 50%;
    animation: move-up linear infinite;
  }

  @keyframes move-up {
    0% { transform: translateY(0); opacity: 1; }
    99% { opacity: 1; }
    100% { transform: translateY(-100vh); opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .star {
      animation: none;
    }
  }

  /* --- HERO CONTENT --- */
  .hero-content-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1rem;
    opacity: 0;
    animation: fade-in 1.2s ease-in-out forwards;
    z-index: 10;
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }


  .hero-title {
    font-weight: 800;
    text-align: center;
    font-size: clamp(0.8rem, 3.2vw, 2.22rem);
    letter-spacing: clamp(0.044rem, 0.44rem, 0.22rem);
    display: flex;
  }

  .hero-title-letter {
    display: inline-block;
    transition: all 0.5s ease-in-out;
    animation: wave-glow 1.4s ease-in-out infinite alternate;
  }

  @keyframes wave-glow {
    0% { 
      color: var(--fg);
      text-shadow: 0 0 6px rgba(255,255,255,.6);
      transform: translateY(0);
    }
    100% { 
      color: var(--gold);
      text-shadow: 0 0 10px var(--gold), 0 0 20px rgba(212, 175, 55, 0.5);
      transform: translateY(-2%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-title-letter {
      animation: none;
    }
  }

  /* --- FOOTER --- */
  .hero-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: clamp(1rem, 3vw, 2rem);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: clamp(0.75rem, 2vw, 0.875rem);
    color: var(--muted);
  }
`;

interface Star {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export const LuxuryHero: React.FC = () => {
  const [starsLayers, setStarsLayers] = useState<Star[][]>([]);
  
  useEffect(() => {
    // This code now runs only on the client, after hydration.
    const generateStars = (numStars: number): Star[] => {
      return Array.from({ length: numStars }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 50 + 50,
        delay: Math.random() * -100
      }));
    };
    
    setStarsLayers([
        generateStars(50), 
        generateStars(35), 
        generateStars(20), 
    ]);
  }, []);

  const heroTitle = "PAPI HAIR DESIGN";

  return (
    <>
      <style>{LuxuryHeroStyles}</style>
      <div className="luxury-hero-wrapper">
        <div className="starfield">
          {starsLayers.map((layer, layerIndex) =>
            layer.map(star => (
              <div
                key={star.id}
                className="star"
                style={{
                  left: `${star.x}%`,
                  width: `${star.size / (layerIndex + 1)}px`,
                  height: `${star.size / (layerIndex + 1)}px`,
                  animationDuration: `${star.duration / (layerIndex + 1)}s`,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))
          )}
        </div>

        <div className="hero-content-container">
          <h1 className="hero-title">
            {heroTitle.split('').map((letter, index) => (
              <span
                key={index}
                className="hero-title-letter"
                style={{ animationDelay: `${index * 0.1}s`, whiteSpace: 'pre' }}
              >
                {letter}
              </span>
            ))}
          </h1>

          <footer className="hero-footer">
            <span>© {new Date().getFullYear()} PAPI HAIR DESIGN</span>
          </footer>
        </div>
      </div>
    </>
  );
};

export default LuxuryHero;
