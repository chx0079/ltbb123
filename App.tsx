
import React, { useState, useEffect } from 'react';
import { ScreenType, UserState, Asset } from './types';
import Home from './screens/Home';
import Portfolio from './screens/Portfolio';
import Shop from './screens/Shop';
import Settings from './screens/Settings';
import Navbar from './components/Navbar';
import { ASSETS as INITIAL_ASSETS } from './constants';
import './src/index.css';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>(ScreenType.HOME);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState<{base: number, fluctuation: number, total: number} | null>(null);

  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('finance_tycoon_user_v3');
    return saved ? JSON.parse(saved) : {
      companyFunds: 0,
      incentivePoints: 0,
      dailyProfit: 0,
      vipLevel: 4,
      userId: '88294105',
      isSimulationMode: false,
      lastLoginDate: ''
    };
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('finance_tycoon_assets_v3');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  // 格式化股票代码以符合新浪 API (6位数字转 sh/sz 前缀)
  const formatSinaCode = (code: string) => {
    const c = code.replace(/[^0-9]/g, '');
    if (c.length !== 6) return code.toLowerCase(); // 如果已经是带前缀的或非6位则不处理
    if (c.startsWith('6') || c.startsWith('9') || c.startsWith('5')) return `sh${c}`;
    return `sz${c}`;
  };

  // 真实市场数据获取逻辑
  const fetchRealMarketData = async () => {
    if (assets.length === 0) return;
    
    const codes = assets.map(a => formatSinaCode(a.code)).join(',');
    // 使用相对路径，在本地由 Vite 代理处理，在生产环境由 Vercel Rewrites 处理
      const url = `/sina-api/list=${codes}`;

      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        // 处理新浪 API 的 GBK 编码
      const decoder = new TextDecoder('gbk');
      const text = decoder.decode(buffer);

      const lines = text.split('\n');
      const updatedAssets = assets.map((asset, index) => {
        const line = lines[index];
        if (!line || !line.includes('"')) return asset;

        const dataStr = line.split('"')[1];
        const parts = dataStr.split(',');
        if (parts.length < 4) return asset;

        const name = parts[0];
        const lastClose = parseFloat(parts[2]);
        const currentPrice = parseFloat(parts[3]);
        
        if (isNaN(currentPrice) || currentPrice === 0) return asset;

        const changeAmount = currentPrice - lastClose;
        const changePercent = Number(((changeAmount / lastClose) * 100).toFixed(2));

        return {
          ...asset,
          name: name || asset.name,
          currentPrice: currentPrice,
          change: changePercent,
          value: asset.quantity * currentPrice
        };
      });

      setAssets(updatedAssets);
      setIsDataLoaded(true);
    } catch (error) {
      console.error('获取实时行情失败:', error);
      setIsDataLoaded(true); // 即使失败也标记加载完成，避免卡死
    }
  };

  // 持久化用户状态
  useEffect(() => {
    localStorage.setItem('finance_tycoon_user_v3', JSON.stringify(user));
  }, [user]);

  // 持久化资产并更新公司总额和利润
  useEffect(() => {
    localStorage.setItem('finance_tycoon_assets_v3', JSON.stringify(assets));
    
    const totalValue = assets.reduce((sum, asset) => sum + (asset.quantity * asset.currentPrice), 0);
    const totalProfit = assets.reduce((sum, asset) => {
      const lastClose = asset.currentPrice / (1 + asset.change / 100);
      const dailyGain = (asset.currentPrice - lastClose) * asset.quantity;
      return sum + dailyGain;
    }, 0);
    
    setUser(prev => ({
      ...prev,
      companyFunds: totalValue,
      dailyProfit: totalProfit
    }));
  }, [assets]);

  // 行情更新循环
  useEffect(() => {
    const interval = setInterval(() => {
      if (user.isSimulationMode) {
        // 模拟模式：随机波动
        setAssets(currentAssets => {
          if (currentAssets.length === 0) {
             setIsDataLoaded(true); // 无资产时也标记完成
             return currentAssets;
          }
          return currentAssets.map(asset => {
            const newChange = Number((asset.change + (Math.random() * 0.1 - 0.05)).toFixed(2));
            const priceFactor = 1 + (newChange / 10000); 
            return {
              ...asset,
              change: newChange,
              currentPrice: Number((asset.currentPrice * priceFactor).toFixed(2))
            };
          });
        });
        setIsDataLoaded(true);
      } else {
        // 真实市场模式：调用新浪 API
        if (assets.length === 0) setIsDataLoaded(true);
        fetchRealMarketData();
      }
    }, 5000); // 每5秒更新一次
    
    // 首次加载立即执行一次
    if (assets.length === 0) setIsDataLoaded(true);
    else if (!user.isSimulationMode) fetchRealMarketData();

    return () => clearInterval(interval);
  }, [user.isSimulationMode, assets.length]);

  // 每日奖励结算逻辑
  useEffect(() => {
    if (!isDataLoaded) return;

    const today = new Date().toLocaleDateString('zh-CN');
    
    // 如果今天还没有领取过奖励
    if (user.lastLoginDate !== today) {
        const baseReward = 50;
        // 波动奖励 = |当日收益| * 0.1
        const fluctuationReward = Math.floor(Math.abs(user.dailyProfit) * 0.1);
        const totalReward = baseReward + fluctuationReward;

        setUser(prev => ({
            ...prev,
            incentivePoints: prev.incentivePoints + totalReward,
            lastLoginDate: today
        }));

        setShowRewardModal({
            base: baseReward,
            fluctuation: fluctuationReward,
            total: totalReward
        });
    }
  }, [isDataLoaded, user.dailyProfit, user.lastLoginDate]);

  const addAsset = (newAssetData: Omit<Asset, 'id' | 'change' | 'icon' | 'type' | 'value'>) => {
    setAssets(prevAssets => {
      const existingAssetIndex = prevAssets.findIndex(a => a.code === newAssetData.code);
      
      if (existingAssetIndex !== -1) {
        // 存在相同代码股票，进行合并
        const existingAsset = prevAssets[existingAssetIndex];
        const totalQuantity = existingAsset.quantity + newAssetData.quantity;
        // 加权平均成本 = (旧数量 * 旧成本 + 新数量 * 新成本) / 总数量
        const totalCostVal = (existingAsset.quantity * existingAsset.cost) + (newAssetData.quantity * newAssetData.cost);
        const newAverageCost = totalCostVal / totalQuantity;
        
        const updatedAsset = {
          ...existingAsset,
          quantity: totalQuantity,
          cost: newAverageCost,
          currentPrice: newAssetData.currentPrice, // 更新为最新价格
          value: totalQuantity * newAssetData.currentPrice,
          name: newAssetData.name // 更新名称（防止旧名称过时）
        };
        
        const newAssets = [...prevAssets];
        newAssets[existingAssetIndex] = updatedAsset;
        return newAssets;
      } else {
        // 不存在，直接添加
        const asset: Asset = {
          ...newAssetData,
          id: Date.now().toString(),
          type: 'stock',
          change: 0,
          icon: 'analytics',
          value: newAssetData.quantity * newAssetData.currentPrice
        };
        return [asset, ...prevAssets];
      }
    });
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const toggleSimulationMode = (enabled: boolean) => {
    setUser(prev => ({ ...prev, isSimulationMode: enabled }));
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case ScreenType.HOME:
        return <Home user={user} />;
      case ScreenType.PORTFOLIO:
        return <Portfolio user={user} assets={assets} onAdd={addAsset} onDelete={deleteAsset} />;
      case ScreenType.SHOP:
        return <Shop user={user} />;
      case ScreenType.SETTINGS:
        return <Settings user={user} onToggleSimulation={toggleSimulationMode} />;
      default:
        return <Home user={user} />;
    }
  };

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-background-dark text-white overflow-hidden relative supports-[height:100dvh]:h-[100dvh] h-screen">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 blur-[1px] mix-blend-overlay" 
             style={{ backgroundImage: `url('https://images.unsplash.com/photo-1611974717482-48a66504b7ae?auto=format&fit=crop&q=80&w=800')`, backgroundSize: 'cover' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f171d]/60 via-[#0f171d]/90 to-[#0f171d]"></div>
      </div>

      <main className="flex-1 overflow-hidden relative z-10">
        {renderScreen()}
      </main>

      <Navbar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

      {/* 每日奖励弹窗 */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowRewardModal(null)} />
          <div className="bg-[#1a222c] border border-profit-green/30 rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-[0_0_50px_rgba(74,222,128,0.1)] transform animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">每日结算</h2>
              <p className="text-gray-400 text-sm">新的一天，新的机遇！</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                <span className="text-gray-300">基础奖励</span>
                <span className="text-profit-green font-mono font-bold">+{showRewardModal.base}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                <span className="text-gray-300">波动奖励 <span className="text-xs text-gray-500">(收益10%)</span></span>
                <span className="text-profit-green font-mono font-bold">+{showRewardModal.fluctuation}</span>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">总计获得</span>
                <span className="text-2xl text-profit-green font-mono font-bold">+{showRewardModal.total}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowRewardModal(null)}
              className="w-full py-3 bg-profit-green text-black font-bold rounded-xl active:scale-95 transition-transform"
            >
              收下奖励
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
