
import React from 'react';
import { UserState } from '../types';

interface SettingsProps { 
  user: UserState; 
  onToggleSimulation: (enabled: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onToggleSimulation }) => {
  return (
    <div className="h-full flex flex-col relative">
      {/* Top Header */}
      <div className="w-full bg-[#1a1a1a]/80 backdrop-blur-md border-b border-white/5 pt-8 pb-4 px-6 flex items-center justify-center relative z-10">
        <h1 className="text-lg font-bold tracking-tight text-white">系统设置</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-12 space-y-12 no-scrollbar relative z-10">
        
        {/* Mode Selector Section */}
        <div className="flex flex-col items-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 shadow-2xl">
            <span className={`material-symbols-outlined text-4xl transition-all ${user.isSimulationMode ? 'text-gold' : 'text-primary'}`}>
              {user.isSimulationMode ? 'precision_manufacturing' : 'cloud_sync'}
            </span>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black tracking-tight">行情数据源</h2>
            <p className="text-sm text-gray-500 max-w-[240px]">
              选择您的资产表现驱动引擎，切换至真实市场需稳定网络连接。
            </p>
          </div>

          {/* Large Toggle Component */}
          <div className="w-full max-w-xs bg-[#1a1a1a] rounded-[32px] p-2 border border-white/5 shadow-2xl flex items-center relative overflow-hidden">
            {/* Sliding Highlight Background */}
            <div 
              className={`absolute top-2 bottom-2 w-[calc(50%-8px)] rounded-[24px] bg-gradient-to-br transition-all duration-500 ease-out z-0 ${
                user.isSimulationMode 
                  ? 'left-2 from-gold to-yellow-600 shadow-[0_0_20px_rgba(251,191,36,0.3)]' 
                  : 'left-[calc(50%+6px)] from-primary to-primary-dark shadow-[0_0_20px_rgba(46,135,173,0.3)]'
              }`}
            />

            <button 
              onClick={() => onToggleSimulation(true)}
              className={`flex-1 py-4 text-sm font-black transition-all relative z-10 ${user.isSimulationMode ? 'text-background-dark' : 'text-gray-500'}`}
            >
              模拟数据
            </button>
            <button 
              onClick={() => onToggleSimulation(false)}
              className={`flex-1 py-4 text-sm font-black transition-all relative z-10 ${!user.isSimulationMode ? 'text-white' : 'text-gray-500'}`}
            >
              真实市场
            </button>
          </div>

          {/* Detailed Indicator */}
          <div className={`flex flex-col items-center gap-4 transition-all duration-700 ${user.isSimulationMode ? 'opacity-100' : 'opacity-60 grayscale'}`}>
             <div className="px-6 py-3 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center gap-3">
                <span className={`material-icons-round text-sm ${user.isSimulationMode ? 'text-gold animate-pulse' : 'text-gray-600'}`}>wifi_off</span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">离线运算模式 已激活</span>
             </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-12 text-center">
           <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] mb-4">Finance Tycoon 系统控制面板</p>
           <div className="h-[1px] w-12 bg-gray-800 mx-auto"></div>
        </div>
      </div>

      {/* Ambient background effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 right-0 w-full h-full opacity-30 blur-[150px] transition-colors duration-1000 ${user.isSimulationMode ? 'bg-gold/10' : 'bg-primary/10'}`}></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background-dark to-transparent"></div>
      </div>
    </div>
  );
};

export default Settings;
