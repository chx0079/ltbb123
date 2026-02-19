
import React, { useState, useEffect } from 'react';
import { UserState } from '../types';

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
      <div className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl p-4 flex justify-between items-start shadow-xl border border-white/5 mb-8 mt-6">
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

      {/* Idle Machine Visualization */}
      <div className="absolute inset-x-0 bottom-8 h-[40%] flex items-end justify-center px-4 pointer-events-none">
        <div className="relative w-full max-w-md h-full flex items-end justify-between px-2 pb-8">
          {/* Left Machine */}
          <div className="relative flex flex-col items-center mb-4 opacity-60">
            <div className="w-20 h-14 bg-[#2a3441] rounded-sm relative shadow-lg">
              <div className="absolute -top-10 left-3 w-14 h-10 border border-primary/40 rounded-sm bg-primary/5 flex items-center justify-center overflow-hidden">
                <div className="w-full h-[1px] bg-primary/30 rotate-12 animate-pulse"></div>
              </div>
              <div className="absolute -top-10 left-5 w-10 h-10 bg-slate-400/80 rounded-t-lg" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)' }}></div>
            </div>
          </div>

          {/* Center Main Unit */}
          <div className="relative z-10 flex flex-col items-center mx-2 transform mb-2 animate-float">
            <div className="w-32 h-44 bg-gradient-to-b from-[#2a3441] to-[#1a222c] rounded-2xl border border-white/10 relative shadow-2xl flex flex-col items-center justify-start p-3">
              <div className="w-full h-14 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center mb-4">
                <span className="text-sm text-primary/80 font-mono font-bold animate-pulse">
                  {user.isSimulationMode ? '模拟运算中' : '实时监听中'}
                </span>
              </div>
              <div className="w-24 h-2 bg-black rounded-full mb-8 shadow-[0_0_15px_rgba(74,222,128,0.3)]"></div>
              <div className="w-full flex flex-col gap-2 mt-auto pb-1">
                <div className="flex items-center justify-between px-2">
                  <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_#22c55e] ${user.isSimulationMode ? 'bg-gold' : 'bg-green-500'}`}></div>
                  <div className="w-16 h-2 bg-[#0f172a] rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full w-[65%] transition-all duration-1000 ${user.isSimulationMode ? 'bg-gold' : 'bg-primary'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Machine */}
          <div className="relative flex flex-col items-center mb-4 opacity-60">
            <div className="w-20 h-14 bg-[#2a3441] rounded-sm relative shadow-lg">
              <div className="absolute -top-10 left-3 w-14 h-10 border border-primary/40 rounded-sm bg-primary/5 flex items-center justify-center">
                <span className={`material-icons-round text-xs animate-spin ${user.isSimulationMode ? 'text-gold/40' : 'text-primary/30'}`} style={{ animationDuration: '3s' }}>pie_chart</span>
              </div>
              <div className="absolute -top-10 left-5 w-10 h-10 bg-slate-400/80 rounded-t-lg" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
