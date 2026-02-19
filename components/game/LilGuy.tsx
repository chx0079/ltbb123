import React, { useMemo } from 'react';

// Seeded random number generator
const mulberry32 = (a: number) => {
  return () => {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// String to hash
const cyrb128 = (str: string) => {
  let h1 = 1779033703, h2 = 3144134277,
      h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
};

interface LilGuyProps {
  seed: string;
  scale?: number;
  className?: string;
  working?: boolean;
}

export const LilGuy: React.FC<LilGuyProps> = ({ seed, scale = 4, className = '', working = true }) => {
  const colors = useMemo(() => {
    const seedNum = cyrb128(seed);
    const rand = mulberry32(seedNum);

    // Generate colors
    const skinTone = [
      '#FFCCAA', '#F5C6A5', '#E2B08E', '#C68642', '#8D5524'
    ][Math.floor(rand() * 5)];

    const shirtColor = `hsl(${Math.floor(rand() * 360)}, ${60 + rand() * 20}%, ${40 + rand() * 40}%)`;
    const hairColor = [
      '#090806', '#2C222B', '#71635A', '#B7A69E', '#D6C4C2', 
      '#CABFB1', '#DCD0BA', '#FFF5E1', '#E6CEA8', '#E5C8A8', 
      '#DEBC99', '#B89778', '#A56B46', '#B55239', '#8D4A43', 
      '#91553D', '#533D32', '#3B3024', '#554838', '#4E433F', 
      '#504444', '#6A4E42', '#A7856A', '#977961'
    ][Math.floor(rand() * 24)];

    // Generate features
    const hairStyle = Math.floor(rand() * 3); // 0: short, 1: medium, 2: long/crazy
    const hasGlasses = rand() > 0.7;
    const hasBeard = rand() > 0.8;

    return { skinTone, shirtColor, hairColor, hairStyle, hasGlasses, hasBeard };
  }, [seed]);

  return (
    <svg 
      width={32 * scale} 
      height={32 * scale} 
      viewBox="0 0 32 32" 
      className={`${className} ${working ? 'animate-bounce-slight' : ''}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Chair Back */}
      <rect x="11" y="18" width="10" height="10" fill="#444" rx="1" />
      
      {/* Body/Shirt */}
      <rect x="12" y="14" width="8" height="9" fill={colors.shirtColor} />
      
      {/* Tie/Detail */}
      <rect x="15.5" y="15" width="1" height="8" fill="rgba(0,0,0,0.2)" /> 

      {/* Head */}
      <rect x="13" y="8" width="6" height="7" fill={colors.skinTone} />
      
      {/* Hair */}
      {colors.hairStyle === 0 && (
        <>
          <rect x="13" y="7" width="6" height="2" fill={colors.hairColor} />
          <rect x="12" y="8" width="1" height="3" fill={colors.hairColor} />
          <rect x="19" y="8" width="1" height="3" fill={colors.hairColor} />
        </>
      )}
      {colors.hairStyle === 1 && (
        <>
          <rect x="12" y="6" width="8" height="3" fill={colors.hairColor} />
          <rect x="12" y="9" width="1" height="4" fill={colors.hairColor} />
          <rect x="19" y="9" width="1" height="4" fill={colors.hairColor} />
        </>
      )}
      {colors.hairStyle === 2 && (
        <>
          <rect x="12" y="5" width="8" height="4" fill={colors.hairColor} />
          <rect x="11" y="8" width="2" height="5" fill={colors.hairColor} />
          <rect x="19" y="8" width="2" height="5" fill={colors.hairColor} />
        </>
      )}

      {/* Face Features */}
      {/* Eyes */}
      <rect x="14" y="11" width="1" height="1" fill="#333" />
      <rect x="17" y="11" width="1" height="1" fill="#333" />
      
      {/* Glasses */}
      {colors.hasGlasses && (
        <>
          <rect x="13" y="11" width="3" height="1" fill="rgba(0,0,0,0.5)" />
          <rect x="16" y="11" width="3" height="1" fill="rgba(0,0,0,0.5)" />
          <rect x="12" y="11" width="1" height="1" fill="#333" /> {/* Frame side */}
          <rect x="19" y="11" width="1" height="1" fill="#333" /> {/* Frame side */}
        </>
      )}

      {/* Beard */}
      {colors.hasBeard && (
        <rect x="13" y="13" width="6" height="2" fill={colors.hairColor} opacity="0.8" />
      )}

      {/* Arms (typing animation) */}
      {working && (
        <>
          <rect x="10" y="17" width="4" height="2" fill={colors.shirtColor} className="animate-type-left" />
          <rect x="10" y="19" width="2" height="2" fill={colors.skinTone} className="animate-type-left" />
          
          <rect x="18" y="17" width="4" height="2" fill={colors.shirtColor} className="animate-type-right" />
          <rect x="20" y="19" width="2" height="2" fill={colors.skinTone} className="animate-type-right" />
        </>
      )}
    </svg>
  );
};
