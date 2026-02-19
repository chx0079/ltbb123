
import React, { useState } from 'react';
import { UserState } from '../types';
import { SHOP_ITEMS } from '../constants';

interface ShopProps { user: UserState; }

const Shop: React.FC<ShopProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('办公家具');
  const tabs = ['办公家具', '电子设备', '室外景观', '特别限定'];

  return (
    <div className="h-full flex flex-col">
      {/* Top Header Card */}
      <div className="w-full px-4 pt-4 pb-2 bg-background-dark/80 backdrop-blur-md">
        <div className="bg-[#1a1a1a] rounded-2xl p-4 flex justify-between items-center shadow-xl border border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-0.5">积分余额</span>
            <span className="text-lg font-bold text-white">奖励积分商城</span>
          </div>
          <div className="flex items-center bg-gold/10 px-4 py-2 rounded-full border border-gold/30">
            <span className="material-symbols-outlined text-gold text-xl mr-2 fill">stars</span>
            <span className="text-gold font-black text-xl tracking-tight">{user.incentivePoints.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 px-6 pt-6 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 whitespace-nowrap text-sm font-bold transition-all border-b-2 ${
              activeTab === tab ? 'text-gold border-gold' : 'text-gray-500 border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Shop Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-6 grid grid-cols-2 gap-3 no-scrollbar pb-32">
        {SHOP_ITEMS.filter(item => item.category === activeTab).map((item) => (
          <div 
            key={item.id} 
            className={`bg-[#1a222c] rounded-2xl p-4 border flex flex-col items-center group active:scale-95 transition-all relative ${
              item.premium ? 'border-gold/30' : 'border-white/5'
            }`}
          >
            {item.premium && (
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-gold text-background-dark text-[8px] font-black rounded uppercase z-10">高级</div>
            )}
            <div className={`w-full aspect-square rounded-xl flex items-center justify-center mb-3 relative overflow-hidden ${
              item.premium ? 'bg-gold/5' : 'bg-white/5'
            }`}>
              <span className={`material-symbols-outlined text-5xl opacity-80 ${item.premium ? 'text-gold' : 'text-primary'}`}>
                {item.icon}
              </span>
              <div className={`absolute inset-0 bg-gradient-to-t from-background-dark/40 to-transparent`}></div>
            </div>
            <h3 className="text-sm font-semibold text-gray-200 mb-2 truncate w-full text-center">{item.name}</h3>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${item.premium ? 'bg-gold/20' : 'bg-white/5'}`}>
              <span className="material-symbols-outlined text-gold text-xs fill">stars</span>
              <span className="text-gold font-bold text-xs">{item.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
