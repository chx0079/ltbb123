import React from 'react';

// Common props for scalable SVGs
interface AssetProps {
  scale?: number;
  className?: string;
}

export const PixelDesk: React.FC<AssetProps> = ({ scale = 4, className = '' }) => (
  <svg 
    width={32 * scale} 
    height={32 * scale} 
    viewBox="0 0 32 32" 
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Desk Surface */}
    <rect x="2" y="14" width="28" height="2" fill="#8B4513" />
    <rect x="2" y="16" width="28" height="12" fill="#A0522D" opacity="0.8" />
    
    {/* Legs */}
    <rect x="4" y="28" width="2" height="4" fill="#5c3a21" />
    <rect x="26" y="28" width="2" height="4" fill="#5c3a21" />
    
    {/* Computer Monitor */}
    <rect x="10" y="6" width="12" height="8" fill="#333" />
    <rect x="11" y="7" width="10" height="6" fill="#87CEEB" className="animate-pulse" />
    <rect x="14" y="14" width="4" height="2" fill="#222" />
    <rect x="12" y="16" width="8" height="1" fill="#222" />
  </svg>
);

export const FloatingMoney: React.FC<{ value: number; onComplete: () => void }> = ({ value, onComplete }) => {
  return (
    <div 
      className="absolute top-0 left-1/2 -translate-x-1/2 text-green-400 font-bold text-sm pointer-events-none animate-float-up z-50"
      onAnimationEnd={onComplete}
      style={{ textShadow: '0 2px 0 rgba(0,0,0,0.5)' }}
    >
      +¥{value}
    </div>
  );
};
