import React, { useState, useEffect, useRef } from 'react';
import { PixelDesk, FloatingMoney } from './OfficeAssets';
import { LilGuy } from './LilGuy';

interface OfficeSceneProps {
  employeeCount: number;
  dailyProfit: number;
}

interface FloatingText {
  id: number;
  value: number;
  x: number;
  y: number;
}

export const OfficeScene: React.FC<OfficeSceneProps> = ({ employeeCount, dailyProfit }) => {
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const textIdCounter = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const spawnMoney = () => {
    if (employeeCount === 0) return;
    
    const randomIndex = Math.floor(Math.random() * employeeCount);
    
    const columns = 3;
    const col = randomIndex % columns;
    const row = Math.floor(randomIndex / columns);
    
    const value = Math.max(1, Math.floor(dailyProfit / (24 * 60) * 10)); 
    
    const newText: FloatingText = {
      id: textIdCounter.current++,
      value,
      x: col, 
      y: row
    };
    
    setFloatingTexts(prev => [...prev, newText]);
  };

  useEffect(() => {
    const interval = setInterval(spawnMoney, 2000); 
    return () => clearInterval(interval);
  }, [employeeCount, dailyProfit]);

  const removeText = (id: number) => {
    setFloatingTexts(prev => prev.filter(t => t.id !== id));
  };

  const columns = 3;
  
  return (
    <div className="relative w-full bg-[#1a1a1a] rounded-xl overflow-hidden p-4 border border-white/10 shadow-inner" ref={containerRef}>
      {/* Floor Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
      </div>

      <div className="grid grid-cols-3 gap-x-2 gap-y-6 relative z-10 place-items-center">
        {Array.from({ length: Math.max(1, employeeCount) }).map((_, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);
          
          const activeTexts = floatingTexts.filter(t => t.x === col && t.y === row);
          
          // Generate a deterministic seed for this employee based on index
          // In a real app, this could be a persistent ID
          const employeeSeed = `employee-${index}-${col}-${row}`;

          return (
            <div key={index} className="relative flex flex-col items-center justify-end h-20 w-16">
              {/* Employee & Desk */}
              <div className="relative transform scale-90 origin-bottom">
                {/* LilGuy sits behind the desk */}
                <LilGuy 
                  seed={employeeSeed} 
                  scale={2} 
                  className="mb-[-4px] z-0 relative mx-auto" 
                />
                <PixelDesk scale={2} className="z-10 relative mt-[-8px]" />
                
                {/* Floating Money for this desk */}
                {activeTexts.map(text => (
                  <FloatingMoney 
                    key={text.id} 
                    value={text.value} 
                    onComplete={() => removeText(text.id)} 
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Office Overlay / Lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-20"></div>
    </div>
  );
};
