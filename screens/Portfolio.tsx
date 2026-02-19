
import React, { useState } from 'react';
import { UserState, Asset } from '../types';

interface PortfolioProps { 
  user: UserState; 
  assets: Asset[];
  onAdd: (asset: Omit<Asset, 'id' | 'change' | 'icon' | 'type' | 'value'>) => void;
  onDelete: (id: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ user, assets, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    quantity: '',
    cost: ''
  });
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [fetchedStock, setFetchedStock] = useState<{name: string, currentPrice: number, formattedCode: string} | null>(null);

  const fetchStockInfo = async (code: string) => {
    // 自动转换 6 位数字代码
    let finalCode = code.trim();
    if (/^\d{6}$/.test(finalCode)) {
      if (finalCode.startsWith('6') || finalCode.startsWith('5') || finalCode.startsWith('9')) finalCode = 'sh' + finalCode;
      else finalCode = 'sz' + finalCode;
    } else {
        // 如果输入不规范，不做处理，交给 API 报错或失败
    }
    
    const baseUrl = import.meta.env.DEV ? '/sina-api' : 'https://hq.sinajs.cn';
    const url = `${baseUrl}/list=${finalCode}`;

    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder('gbk');
      const text = decoder.decode(buffer);
      
      // text format: var hq_str_sz300750="宁德时代,375.610,..."
      if (!text.includes('="')) return null;
      
      const content = text.split('="')[1];
      const parts = content.split(',');
      
      if (parts.length < 4) return null;
      
      return {
        name: parts[0],
        currentPrice: parseFloat(parts[3]),
        formattedCode: finalCode
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleCodeBlur = async () => {
    if (!formData.code) return;
    setIsFetching(true);
    setFetchError('');
    setFetchedStock(null);
    
    const info = await fetchStockInfo(formData.code);
    if (info) {
        setFetchedStock(info);
    } else {
        setFetchError('无法获取股票信息');
    }
    setIsFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFetchError('');

    const qty = parseFloat(formData.quantity);
    const cost = parseFloat(formData.cost);

    if (!formData.code || isNaN(qty) || isNaN(cost)) {
        return;
    }

    let stockInfo = fetchedStock;
    if (!stockInfo) {
        setIsFetching(true);
        stockInfo = await fetchStockInfo(formData.code);
        setIsFetching(false);
    }
    
    if (!stockInfo) {
        setFetchError('无法获取股票信息，请检查代码是否正确');
        return;
    }

    onAdd({
      name: stockInfo.name,
      code: stockInfo.formattedCode,
      quantity: qty,
      cost: cost,
      currentPrice: stockInfo.currentPrice
    });
    
    setFormData({ code: '', quantity: '', cost: '' });
    setFetchedStock(null);
    setIsAdding(false);
  };

  const toggleEditMode = () => {
    setIsEditingMode(!isEditingMode);
    if (isAdding) setIsAdding(false);
  };

  const toggleAddMode = () => {
    setIsAdding(!isAdding);
    if (isEditingMode) setIsEditingMode(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Header */}
      <div className="w-full px-4 pt-4 pb-2">
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center shadow-xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold tracking-wider mb-0.5 uppercase">股票资产总额</span>
            <div className="flex items-center gap-1.5">
              <span className="material-icons-round text-primary text-base">analytics</span>
              <span className="text-white text-lg font-bold tracking-tight">¥{user.companyFunds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-bold tracking-wider mb-0.5 uppercase">奖励积分</span>
            <div className="flex items-center gap-1">
              <span className="material-icons-round text-gold text-sm">stars</span>
              <span className="text-gold font-bold text-[15px] tracking-wide">{user.incentivePoints.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-4 no-scrollbar">
        <div className="flex justify-between items-end px-1 pt-2">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-100">我的股票</h2>
            <p className="text-xs text-gray-500 mt-0.5">实时行情 • {assets.length} 只股票</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleEditMode}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95 ${
                isEditingMode ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
              title={isEditingMode ? "完成" : "编辑"}
            >
              <span className="material-icons-round text-xl">{isEditingMode ? 'check' : 'edit'}</span>
            </button>
            <button 
              onClick={toggleAddMode}
              className={`flex items-center gap-1 px-4 h-10 rounded-full text-xs font-bold transition-all active:scale-95 ${
                isAdding ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-primary text-white shadow-lg shadow-primary/20'
              }`}
            >
              <span className="material-icons-round text-sm">{isAdding ? 'close' : 'add'}</span>
              <span>{isAdding ? '取消' : '添加股票'}</span>
            </button>
          </div>
        </div>

        {/* Add Stock Form */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-5 rounded-2xl border border-primary/30 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              {fetchError && (
                <div className="text-red-500 text-xs font-bold px-2 py-1 bg-red-500/10 rounded border border-red-500/20 mb-2">
                    {fetchError}
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-4">
                <div className="col-span-1 relative">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">股票代码</label>
                  <div className="relative">
                    <input 
                      autoFocus
                      required
                      type="text" 
                      maxLength={10}
                      placeholder="如: 600519 或 sz300750"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors uppercase"
                      value={formData.code}
                      onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      onBlur={handleCodeBlur}
                    />
                    {isFetching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <span className="material-icons-round animate-spin text-primary text-sm">sync</span>
                        </div>
                    )}
                  </div>
                  {fetchedStock && (
                      <div className="mt-2 flex items-center gap-2 text-xs bg-primary/10 border border-primary/20 p-2 rounded-lg text-primary">
                          <span className="font-bold">{fetchedStock.name}</span>
                          <span className="opacity-60">|</span>
                          <span>现价: ¥{fetchedStock.currentPrice.toFixed(2)}</span>
                      </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">持有数量</label>
                  <input 
                    required
                    type="number" 
                    placeholder="100"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    value={formData.quantity}
                    onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">持仓成本</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    placeholder="1650.00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    value={formData.cost}
                    onChange={e => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  />
                </div>
              </div>

              {/* Profit/Loss Preview */}
              {fetchedStock && formData.quantity && formData.cost && !isNaN(parseFloat(formData.quantity)) && !isNaN(parseFloat(formData.cost)) && (
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">预计浮动盈亏</span>
                          {(() => {
                              const qty = parseFloat(formData.quantity);
                              const cost = parseFloat(formData.cost);
                              const current = fetchedStock.currentPrice;
                              const profit = (current - cost) * qty;
                              const profitPercent = ((current - cost) / cost) * 100;
                              const isProfit = profit >= 0;
                              
                              return (
                                  <div className={`text-right ${isProfit ? 'text-profit-green' : 'text-red-500'}`}>
                                      <div className="text-sm font-bold flex items-center justify-end gap-1">
                                          <span>{isProfit ? '+' : ''}{profit.toFixed(2)}</span>
                                          <span className="text-[10px] bg-current/10 px-1 py-0.5 rounded">
                                              {isProfit ? '+' : ''}{profitPercent.toFixed(2)}%
                                          </span>
                                      </div>
                                  </div>
                              );
                          })()}
                      </div>
                  </div>
              )}
              
              <button 
                type="submit"
                disabled={isFetching}
                className={`w-full font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 ${
                    isFetching ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                保存持仓
              </button>
            </div>
          </form>
        )}

        {/* Stock List */}
        <div className="space-y-3">
          {assets.length === 0 ? (
            <div className="py-20 text-center space-y-4 opacity-40">
              <span className="material-symbols-outlined text-6xl">query_stats</span>
              <p className="text-sm font-medium">暂无股票持仓<br/><span className="text-[10px] opacity-60">点击右上角添加您的第一支股票</span></p>
            </div>
          ) : (
            assets.map((asset) => (
              <div 
                key={asset.id} 
                className={`group relative bg-[#1a1a1a]/60 p-4 rounded-2xl flex flex-col gap-3 border backdrop-blur-sm transition-all overflow-hidden ${
                  isEditingMode ? 'border-primary/40 ring-1 ring-primary/20' : 'border-white/5'
                }`}
              >
                
                {/* Delete Button - Only visible in editing mode */}
                {isEditingMode && (
                  <button 
                    onClick={() => onDelete(asset.id)}
                    className="absolute right-3 top-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center z-30 shadow-lg animate-in fade-in zoom-in duration-200 active:scale-90"
                    aria-label="删除持仓"
                  >
                    <span className="material-icons-round text-lg">delete</span>
                  </button>
                )}

                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">analytics</span>
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-gray-100">{asset.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
                        <span>{asset.code}</span>
                        <span className="px-1.5 py-0.5 bg-white/5 rounded text-[8px] font-bold">STOCK</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-right ${isEditingMode ? 'pr-10' : ''} transition-all`}>
                    <div className="text-[16px] font-black text-white">¥{(asset.quantity * asset.currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className={`text-[11px] font-bold flex items-center justify-end gap-1 ${asset.change >= 0 ? 'text-profit-green' : 'text-loss-red'}`}>
                      <span className="material-icons-round text-[10px]">{asset.change >= 0 ? 'trending_up' : 'trending_down'}</span>
                      {asset.change >= 0 ? '+' : ''}{asset.change}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 py-2 px-2 bg-white/5 rounded-xl border border-white/5 z-10">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 font-bold uppercase">持股成本</span>
                    <span className="text-xs font-mono text-gray-300">¥{asset.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-gray-500 font-bold uppercase">当前价格</span>
                    <span className={`text-xs font-mono font-bold ${asset.currentPrice >= asset.cost ? 'text-profit-green' : 'text-loss-red'}`}>
                        ¥{asset.currentPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-gray-500 font-bold uppercase">浮动盈亏</span>
                    {(() => {
                        const profit = (asset.currentPrice - asset.cost) * asset.quantity;
                        const isProfit = profit >= 0;
                        return (
                            <span className={`text-xs font-mono font-bold ${isProfit ? 'text-profit-green' : 'text-red-500'}`}>
                                {isProfit ? '+' : ''}{profit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                        );
                    })()}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-gray-500 font-bold uppercase">盈亏比</span>
                    {(() => {
                        const profitPercent = ((asset.currentPrice - asset.cost) / asset.cost) * 100;
                        const isProfit = profitPercent >= 0;
                        return (
                            <span className={`text-xs font-mono font-bold ${isProfit ? 'text-profit-green' : 'text-red-500'}`}>
                                {isProfit ? '+' : ''}{profitPercent.toFixed(2)}%
                            </span>
                        );
                    })()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-1 text-center py-4 pb-32">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-gray-800"></span>
            当前支持 A股 (sh/sz) 代码录入
            <span className="w-8 h-[1px] bg-gray-800"></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
