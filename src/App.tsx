import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Augment, RarityFilter, RARITY_CONFIG } from './types';
import AugmentCard from './components/AugmentCard';
import AugmentModal from './components/AugmentModal';
import DataUploader from './components/DataUploader';
import GoldEfficiencyPage from './components/GoldEfficiencyPage';
import IntroPage from './components/IntroPage';
import { AUGMENT_GOLD_VALUES } from './components/AugmentModal';

const DEFAULT_DATA_URL = 'https://hextech.dtodo.cn/data/aram-mayhem-augments.zh_cn.json';
const STATS_DATA_URL = 'https://hextech.dtodo.cn/data/augments-stats-raw.json';

type ActiveTab = 'augments' | 'gold';

export interface AugmentStageStats {
  tier: string;
  augment_stage: string;
  win_rate: string;
  num_games: string;
  pick_rate: string;
}

export interface AugmentStats {
  tier: string;
  win_rate: string;
  num_games: string;
  pick_rate: string;
  augment_stage_stats: AugmentStageStats[];
}

function parseAndSortAugments(data: Record<string, Augment>): Augment[] {
  const augmentList = Object.values(data).filter(a => a.enabled);
  augmentList.sort((a, b) => a.rarity - b.rarity || a.displayName.localeCompare(b.displayName, 'zh'));
  return augmentList;
}

function parseStatsData(rawArray: [string, string, string, string, string][]): Record<string, AugmentStats> {
  const result: Record<string, AugmentStats> = {};
  for (const row of rawArray) {
    const augmentId = row[0];
    try {
      const parsed = JSON.parse(row[1]);
      result[augmentId] = parsed;
    } catch {
    }
  }
  return result;
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('augments');
  const [augments, setAugments] = useState<Augment[]>([]);
  const [statsMap, setStatsMap] = useState<Record<string, AugmentStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [showOnlyWithGoldValue, setShowOnlyWithGoldValue] = useState(false);
  const [goldSortOrder, setGoldSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [selectedAugment, setSelectedAugment] = useState<Augment | null>(null);
  const [dataSourceLabel, setDataSourceLabel] = useState<string>('远程');

  useEffect(() => {
    const augmentsPromise = fetch(DEFAULT_DATA_URL)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Record<string, Augment>>;
      });

    const statsPromise = fetch(STATS_DATA_URL)
      .then(res => {
        if (!res.ok) return [] as [string, string, string, string, string][];
        return res.json() as Promise<[string, string, string, string, string][]>;
      })
      .catch(() => [] as [string, string, string, string, string][]);

    Promise.all([augmentsPromise, statsPromise])
      .then(([augmentData, statsRaw]) => {
        setAugments(parseAndSortAugments(augmentData));
        setStatsMap(parseStatsData(statsRaw));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleUploadSuccess = useCallback((cdnUrl: string) => {
    setLoading(true);
    setError(null);
    fetch(cdnUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Record<string, Augment>) => {
        setAugments(parseAndSortAugments(data));
        setDataSourceLabel('CDN');
        setLoading(false);
      })
      .catch(err => {
        setError(`CDN 数据加载失败：${err.message}`);
        setLoading(false);
      });
  }, []);

  const filteredAugments = useMemo(() => {
    const filtered = augments.filter(augment => {
      const matchesRarity = rarityFilter === 'all' || augment.rarity === rarityFilter;
      const matchesSearch = !searchQuery ||
        augment.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        augment.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGoldFilter = !showOnlyWithGoldValue || (augment.id in AUGMENT_GOLD_VALUES);
      return matchesRarity && matchesSearch && matchesGoldFilter;
    });

    if (goldSortOrder === 'none') return filtered;

    return [...filtered].sort((augmentA, augmentB) => {
      const goldA = AUGMENT_GOLD_VALUES[augmentA.id]?.value ?? -1;
      const goldB = AUGMENT_GOLD_VALUES[augmentB.id]?.value ?? -1;
      return goldSortOrder === 'asc' ? goldA - goldB : goldB - goldA;
    });
  }, [augments, rarityFilter, searchQuery, showOnlyWithGoldValue, goldSortOrder]);

  const countByRarity = useMemo(() => {
    return {
      all: augments.length,
      0: augments.filter(a => a.rarity === 0).length,
      1: augments.filter(a => a.rarity === 1).length,
      2: augments.filter(a => a.rarity === 2).length,
    };
  }, [augments]);

  const handleCardClick = useCallback((augment: Augment) => {
    setSelectedAugment(augment);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedAugment(null);
  }, []);

  const handleExportData = useCallback(() => {
    const rawData: Record<string, Augment> = {};
    augments.forEach(augment => {
      rawData[String(augment.id)] = augment;
    });
    const jsonBlob = new Blob([JSON.stringify(rawData, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(jsonBlob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = 'augments.json';
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  }, [augments]);

  const tabs: { key: ActiveTab; label: string; icon: string }[] = [
    { key: 'augments', label: '增益图鉴', icon: 'fa-bolt' },
    { key: 'gold', label: '属性金币价值', icon: 'fa-coins' },
  ];

  const rarityLightConfig = {
    all: { color: '#0891B2', bg: 'rgba(8,145,178,0.1)', border: 'rgba(8,145,178,0.35)' },
    0: { color: '#92400E', bg: 'rgba(146,64,14,0.08)', border: 'rgba(146,64,14,0.25)' },
    1: { color: '#B45309', bg: 'rgba(180,83,9,0.08)', border: 'rgba(180,83,9,0.25)' },
    2: { color: '#BE123C', bg: 'rgba(190,18,60,0.08)', border: 'rgba(190,18,60,0.25)' },
  };

  const selectedAugmentStats = selectedAugment
    ? statsMap[String(selectedAugment.id)] ?? null
    : null;

  if (showIntro) {
    return <IntroPage onEnter={() => setShowIntro(false)} />;
  }

  const handleBackToIntro = () => setShowIntro(true);

  return (
    <div className="min-h-screen" style={{ background: '#F0F2F5' }}>
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: 'linear-gradient(135deg, #0891B2, #0E7490)' }}
              >
                <i className="fas fa-bolt text-sm text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: '#1A2332' }}>
                  海克斯大乱斗
                </h1>
                <p className="text-xs" style={{ color: '#94A3B8' }}>增益图鉴</p>
              </div>
              <button
                onClick={handleBackToIntro}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150"
                style={{
                  color: '#0891B2',
                  background: 'rgba(8,145,178,0.08)',
                  border: '1px solid rgba(8,145,178,0.25)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(8,145,178,0.15)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(8,145,178,0.08)';
                }}
              >
                <i className="fas fa-circle-info text-xs" />
                关于
              </button>
              <button
                onClick={() => setDebugMode(prev => !prev)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150"
                style={{
                  color: debugMode ? '#7C3AED' : '#94A3B8',
                  background: debugMode ? 'rgba(124,58,237,0.08)' : 'transparent',
                  border: `1px solid ${debugMode ? 'rgba(124,58,237,0.3)' : '#E2E8F0'}`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = debugMode ? 'rgba(124,58,237,0.15)' : 'rgba(0,0,0,0.04)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = debugMode ? 'rgba(124,58,237,0.08)' : 'transparent';
                }}
              >
                <i className="fas fa-bug text-xs" />
                {debugMode ? '调试中' : '调试'}
              </button>
            </div>

            {activeTab === 'augments' && (
              <div className="flex items-center gap-3">
                {!loading && augments.length > 0 && (
                  <span className="text-xs" style={{ color: '#94A3B8' }}>
                    共 <span className="font-bold" style={{ color: '#0891B2' }}>{filteredAugments.length}</span> / {augments.length} 个增益
                    <span
                      className="ml-2 px-1.5 py-0.5 rounded text-xs"
                      style={{ background: 'rgba(8,145,178,0.08)', color: '#0891B2', border: '1px solid rgba(8,145,178,0.2)' }}
                    >
                      {dataSourceLabel}
                    </span>
                  </span>
                )}
                {debugMode && !loading && augments.length > 0 && (
                  <button
                    className="filter-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{
                      color: '#92400E',
                      background: 'rgba(146,64,14,0.07)',
                      border: '1px solid rgba(146,64,14,0.2)',
                    }}
                    onClick={handleExportData}
                    title="下载全量 JSON 数据"
                  >
                    <i className="fas fa-download text-xs" />
                    下载数据
                  </button>
                )}
                {debugMode && <DataUploader onUploadSuccess={handleUploadSuccess} />}
              </div>
            )}
          </div>

          <div className="flex items-end gap-1">
            {tabs.map(tab => {
              const isActive = activeTab === tab.key;
              const tabAccent = tab.key === 'gold' ? '#B45309' : '#0891B2';
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-lg transition-all relative"
                  style={{
                    color: isActive ? tabAccent : '#94A3B8',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    border: isActive ? '1px solid #E2E8F0' : '1px solid transparent',
                    borderBottom: isActive ? '1px solid #FFFFFF' : '1px solid transparent',
                    marginBottom: isActive ? '-1px' : '0',
                  }}
                >
                  <i className={`fas ${tab.icon} text-xs`} style={{ color: isActive ? tabAccent : '#CBD5E1' }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'augments' && (
          <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
            <div className="max-w-7xl mx-auto px-6 py-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <i
                    className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: '#CBD5E1' }}
                  />
                  <input
                    type="text"
                    placeholder="搜索增益名称..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="search-input w-full pl-9 pr-4 py-2.5 rounded-lg text-sm transition-all"
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      color: '#1A2332',
                    }}
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: '#CBD5E1' }}
                      onClick={() => setSearchQuery('')}
                    >
                      <i className="fas fa-times text-xs" />
                    </button>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {([
                    { key: 'all', label: '全部', count: countByRarity.all },
                    { key: 0, label: '银色', count: countByRarity[0] },
                    { key: 1, label: '金色', count: countByRarity[1] },
                    { key: 2, label: '棱彩', count: countByRarity[2] },
                  ] as const).map(({ key, label, count }) => {
                    const isActive = rarityFilter === key;
                    const cfg = rarityLightConfig[key];

                    return (
                      <button
                        key={String(key)}
                        className="filter-btn px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                        style={{
                          color: isActive ? cfg.color : '#94A3B8',
                          background: isActive ? cfg.bg : 'transparent',
                          border: `1px solid ${isActive ? cfg.border : '#E2E8F0'}`,
                        }}
                        onClick={() => setRarityFilter(key)}
                      >
                        {key === 2 && <i className="fas fa-gem text-xs" />}
                        {key === 1 && <i className="fas fa-star text-xs" />}
                        {key === 0 && <i className="fas fa-circle text-xs" />}
                        {key === 'all' && <i className="fas fa-th text-xs" />}
                        {label}
                        <span
                          className="px-1.5 py-0.5 rounded text-xs"
                          style={{
                            background: isActive ? cfg.bg : 'rgba(0,0,0,0.04)',
                            color: isActive ? cfg.color : '#94A3B8',
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}

                  <button
                    className="filter-btn px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                    style={{
                      color: showOnlyWithGoldValue ? '#B45309' : '#94A3B8',
                      background: showOnlyWithGoldValue ? 'rgba(180,83,9,0.08)' : 'transparent',
                      border: `1px solid ${showOnlyWithGoldValue ? 'rgba(180,83,9,0.35)' : '#E2E8F0'}`,
                    }}
                    onClick={() => setShowOnlyWithGoldValue(prev => !prev)}
                  >
                    <i className="fas fa-coins text-xs" style={{ color: showOnlyWithGoldValue ? '#D97706' : '#CBD5E1' }} />
                    有金币价值
                  </button>

                  <button
                    className="filter-btn px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                    style={{
                      color: goldSortOrder !== 'none' ? '#0891B2' : '#94A3B8',
                      background: goldSortOrder !== 'none' ? 'rgba(8,145,178,0.08)' : 'transparent',
                      border: `1px solid ${goldSortOrder !== 'none' ? 'rgba(8,145,178,0.35)' : '#E2E8F0'}`,
                    }}
                    onClick={() => setGoldSortOrder(prev => {
                      if (prev === 'none') return 'desc';
                      if (prev === 'desc') return 'asc';
                      return 'none';
                    })}
                  >
                    <i
                      className={`fas text-xs ${goldSortOrder === 'asc' ? 'fa-sort-amount-up' : goldSortOrder === 'desc' ? 'fa-sort-amount-down' : 'fa-sort'}`}
                      style={{ color: goldSortOrder !== 'none' ? '#0891B2' : '#CBD5E1' }}
                    />
                    {goldSortOrder === 'asc' ? '金币升序' : goldSortOrder === 'desc' ? '金币降序' : '金币排序'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {activeTab === 'augments' && (
        <main className="max-w-7xl mx-auto px-6 py-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div
                className="w-12 h-12 rounded-full border-2 animate-spin"
                style={{ borderColor: '#0891B2', borderTopColor: 'transparent' }}
              />
              <p style={{ color: '#94A3B8' }}>正在加载增益数据...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <i className="fas fa-exclamation-triangle text-4xl" style={{ color: '#DC2626' }} />
              <p style={{ color: '#DC2626' }}>加载失败：{error}</p>
              <button
                className="px-4 py-2 rounded-lg text-sm font-bold"
                style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#DC2626' }}
                onClick={() => window.location.reload()}
              >
                重新加载
              </button>
            </div>
          )}

          {!loading && !error && filteredAugments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <i className="fas fa-search text-4xl" style={{ color: '#CBD5E1' }} />
              <p style={{ color: '#94A3B8' }}>没有找到匹配的增益</p>
              <button
                className="px-4 py-2 rounded-lg text-sm font-bold"
                style={{ background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.25)', color: '#0891B2' }}
                onClick={() => { setSearchQuery(''); setRarityFilter('all'); setShowOnlyWithGoldValue(false); }}
              >
                清除筛选
              </button>
            </div>
          )}

          {!loading && !error && filteredAugments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredAugments.map(augment => (
                <AugmentCard
                  key={augment.id}
                  augment={augment}
                  goldValue={AUGMENT_GOLD_VALUES[augment.id] ?? null}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {activeTab === 'gold' && <GoldEfficiencyPage />}

      <AugmentModal
        augment={selectedAugment}
        stats={selectedAugmentStats}
        onClose={handleModalClose}
        debugMode={debugMode}
      />
    </div>
  );
}
