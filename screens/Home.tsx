
import React, { useState, useEffect } from 'react';
import { UserState } from '../types';

import { OfficeScene } from '../components/game/OfficeScene';

interface HomeProps {
  user: UserState;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      try {
        const formatter = new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          timeZone: 'Asia/Shanghai'
        });
        
        const formatted = formatter.format(now);
        setCurrentDate(formatted.replace(/星期/, ' 星期'));
      } catch (e) {
        setCurrentDate(now.toLocaleDateString('zh-CN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          weekday: 'long' 
        }));
      }
    };

    updateDate();
    const timer = setInterval(updateDate, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col p-4 relative">
      {/* Simulation Label Tag */}
      {user.isSimulationMode && (
        <div className="absolute top-2 left-4 z-50">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full backdrop-blur-md">
            <span className="text-[10px] leading-none">🔧</span>
            <span className="text-[10px] font-black text-gold uppercase tracking-widest">模拟中</span>
          </div>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl p-4 flex justify-between items-start shadow-xl border border-white/5 mb-8 mt-6 relative z-50">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold tracking-wider mb-1 flex items-center gap-1.5">
            当前北京时间
            <span className={`w-1.5 h-1.5 rounded-full ${user.isSimulationMode ? 'bg-gold animate-pulse' : 'bg-primary'}`}></span>
          </span>
          <span className="text-[15px] text-gray-100 font-medium">{currentDate || '加载中...'}</span>
          <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold text-gray-400 border border-white/5">
            {user.isSimulationMode ? '模式：内部模拟行情' : '模式：实时市场数据'}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="material-icons-round text-primary text-base">account_balance_wallet</span>
            <span className="text-white text-lg font-bold tracking-tight">¥{user.companyFunds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-icons-round text-gold text-sm">stars</span>
            <span className="text-gold font-bold text-[13px] tracking-wide">{user.incentivePoints.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Daily Profit Display */}
      <div className="flex-1 flex flex-col items-center justify-start mt-4">
        <span className="text-[11px] text-profit-green/70 uppercase tracking-[0.3em] mb-2 font-bold">今日收益</span>
        <h1 className="text-7xl font-bold text-profit-green drop-shadow-[0_0_20px_rgba(163,230,53,0.3)]">
          {user.dailyProfit >= 0 ? '+' : '-'}{'¥'}{Math.abs(user.dailyProfit).toFixed(2)}
        </h1>
      </div>

      {/* Office Scene Visualization */}
      <div className="absolute inset-x-0 bottom-24 flex items-end justify-center px-4 pointer-events-none z-0">
        <div className="w-full max-w-[320px] pointer-events-auto pb-4">
          <OfficeScene 
            employeeCount={Math.min(6, Math.max(3, (user.vipLevel || 1) * 3))} 
            dailyProfit={user.dailyProfit} 
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
