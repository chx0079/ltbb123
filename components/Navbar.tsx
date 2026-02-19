
import React from 'react';
import { ScreenType } from '../types';

interface NavbarProps {
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeScreen, setActiveScreen }) => {
  const navItems = [
    { type: ScreenType.HOME, label: '主页', icon: 'corporate_fare', materialSymbol: true },
    { type: ScreenType.PORTFOLIO, label: '投资组合', icon: 'pie_chart' },
    { type: ScreenType.SHOP, label: '商城', icon: 'storefront', hasBadge: true },
    { type: ScreenType.SETTINGS, label: '设置', icon: 'settings' },
  ];

  return (
    <nav className="relative z-50 w-full bg-[#0d1218]/90 backdrop-blur-2xl border-t border-white/5 pb-8 pt-3">
      <div className="flex justify-around items-center px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeScreen === item.type;
          return (
            <button
              key={item.type}
              onClick={() => setActiveScreen(item.type)}
              className={`flex flex-col items-center justify-center w-20 transition-all ${isActive ? 'scale-105' : 'opacity-40 active:opacity-60'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-1 relative transition-colors ${isActive ? 'bg-[#1e293b] shadow-inner border border-white/5' : ''}`}>
                <span className={`material-symbols-outlined text-3xl ${isActive ? 'text-primary fill' : 'text-white'}`}>
                  {item.icon}
                </span>
                {item.hasBadge && (
                  <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#0d1218]"></div>
                )}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(46,135,173,0.8)]"></div>
                )}
              </div>
              <span className={`text-[11px] ${isActive ? 'font-bold text-primary' : 'font-medium text-white'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
