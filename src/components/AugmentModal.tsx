import React, { useState, useEffect } from 'react';
import { Augment, getRarityKey, getLargeIconUrl, getLargeIconUrlFallback, getIconUrlFallback, renderDescription } from '../types';
import { AugmentStats } from '../App';

interface AugmentModalProps {
  augment: Augment | null;
  stats: AugmentStats | null;
  onClose: () => void;
}

const RARITY_LIGHT = {
  0: {
    label: '银色',
    color: '#78716C',
    titleColor: '#1C1917',
    headerBg: 'linear-gradient(135deg, #F5F5F4 0%, #FAFAF9 100%)',
    headerBorder: '#E7E5E4',
    badgeBg: '#F5F5F4',
    badgeColor: '#78716C',
    badgeBorder: '#D6D3D1',
    iconBorder: '#D6D3D1',
    iconShadow: 'rgba(120,113,108,0.15)',
    sectionBg: '#FAFAF9',
    sectionBorder: '#E7E5E4',
  },
  1: {
    label: '金色',
    color: '#B45309',
    titleColor: '#78350F',
    headerBg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF9EE 100%)',
    headerBorder: '#FDE68A',
    badgeBg: '#FEF3C7',
    badgeColor: '#B45309',
    badgeBorder: '#FCD34D',
    iconBorder: '#FCD34D',
    iconShadow: 'rgba(180,83,9,0.2)',
    sectionBg: '#FFFBEB',
    sectionBorder: '#FDE68A',
  },
  2: {
    label: '棱彩',
    color: '#BE123C',
    titleColor: '#881337',
    headerBg: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F6 100%)',
    headerBorder: '#FECDD3',
    badgeBg: '#FFE4E6',
    badgeColor: '#BE123C',
    badgeBorder: '#FDA4AF',
    iconBorder: '#FDA4AF',
    iconShadow: 'rgba(190,18,60,0.2)',
    sectionBg: '#FFF1F2',
    sectionBorder: '#FECDD3',
  },
};

interface AugmentGoldValue {
  value: number;
  breakdown: string;
}

export const AUGMENT_GOLD_VALUES: Record<number, AugmentGoldValue> = {
  2009: {
    value: 25 * 40 + 35 * 25,
    breakdown: '25% 暴击率 × 40 + 35% 攻击速度 × 25',
  },
  1082: {
    value: 20 * 35 + 10 * 26.67 + 5 * 30,
    breakdown: '20 攻击力 × 35 + 10 技能急速 × 26.67 + 5 护甲穿透（固定） × 30',
  },
};

const TIER_LABELS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  '1': { label: 'T0', color: '#DC2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.3)' },
  '2': { label: 'T1', color: '#D97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.3)' },
  '3': { label: 'T2', color: '#0891B2', bg: 'rgba(8,145,178,0.08)', border: 'rgba(8,145,178,0.3)' },
  '4': { label: 'T3', color: '#6B7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.25)' },
  '5': { label: 'T4', color: '#9CA3AF', bg: 'rgba(156,163,175,0.08)', border: 'rgba(156,163,175,0.2)' },
};

const STAGE_LABELS: Record<string, string> = {
  '1': '第一阶段',
  '2': '第二阶段',
  '3': '第三阶段',
  '4': '第四阶段',
  '5': '第五阶段',
};

function formatPercent(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return (num * 100).toFixed(1) + '%';
}

function formatCount(value: string | number): string {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
  return num.toLocaleString();
}

function WinRateBar({ rate }: { rate: number }) {
  const percentage = rate * 100;
  const color = percentage >= 52 ? '#16A34A' : percentage >= 48 ? '#0891B2' : '#DC2626';
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: 4, background: '#E2E8F0' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(percentage, 100)}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold w-10 text-right" style={{ color }}>
        {percentage.toFixed(1)}%
      </span>
    </div>
  );
}

export default function AugmentModal({ augment, stats, onClose }: AugmentModalProps) {
  const [triedLargeFallback, setTriedLargeFallback] = useState(false);
  const [triedSmallFallback, setTriedSmallFallback] = useState(false);
  const [allFailed, setAllFailed] = useState(false);

  useEffect(() => {
    setTriedLargeFallback(false);
    setTriedSmallFallback(false);
    setAllFailed(false);
  }, [augment]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!augment) return null;

  const rarityKey = getRarityKey(augment.rarity);
  const cfg = RARITY_LIGHT[rarityKey];
  const renderedDesc = renderDescription(augment.tooltip || augment.description, augment.spellDataValues);

  const largePrimary = getLargeIconUrl(augment);
  const largeFallback = getLargeIconUrlFallback(augment);
  const smallFallback = getIconUrlFallback(augment);

  let currentIconSrc: string;
  if (!triedLargeFallback) {
    currentIconSrc = largePrimary;
  } else if (!triedSmallFallback) {
    currentIconSrc = largeFallback;
  } else {
    currentIconSrc = smallFallback;
  }

  const handleIconError = () => {
    if (!triedLargeFallback) {
      if (largeFallback === largePrimary) {
        setTriedLargeFallback(true);
        setTriedSmallFallback(true);
      } else {
        setTriedLargeFallback(true);
      }
    } else if (!triedSmallFallback) {
      setTriedSmallFallback(true);
    } else {
      setAllFailed(true);
    }
  };

  const tierInfo = stats ? TIER_LABELS[stats.tier] ?? null : null;

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="modal-content relative rounded-2xl overflow-hidden w-full overflow-y-auto"
        style={{
          maxWidth: 560,
          maxHeight: '90vh',
          background: '#FFFFFF',
          border: `1px solid ${cfg.headerBorder}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px ${cfg.headerBorder}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="relative px-6 pt-6 pb-5"
          style={{
            background: cfg.headerBg,
            borderBottom: `1px solid ${cfg.headerBorder}`,
          }}
        >
          <button
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all"
            style={{ color: '#94A3B8', background: 'rgba(0,0,0,0.05)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.1)';
              (e.currentTarget as HTMLButtonElement).style.color = '#475569';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.05)';
              (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8';
            }}
            onClick={onClose}
          >
            <i className="fas fa-times text-sm" />
          </button>

          <div className="flex items-center gap-4">
            <div
              className="flex-shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 88,
                height: 88,
                background: '#1A1A1A',
                border: `2px solid ${cfg.iconBorder}`,
                boxShadow: `0 4px 16px ${cfg.iconShadow}`,
              }}
            >
              {!allFailed ? (
                <img
                  src={currentIconSrc}
                  alt={augment.displayName}
                  className="w-full h-full object-cover"
                  onError={handleIconError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fas fa-magic text-3xl" style={{ color: cfg.color }} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-md"
                  style={{
                    color: cfg.badgeColor,
                    background: cfg.badgeBg,
                    border: `1px solid ${cfg.badgeBorder}`,
                  }}
                >
                  {cfg.label}增益
                </span>
                {tierInfo && (
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-md"
                    style={{
                      color: tierInfo.color,
                      background: tierInfo.bg,
                      border: `1px solid ${tierInfo.border}`,
                    }}
                  >
                    {tierInfo.label}
                  </span>
                )}
                {!augment.enabled && (
                  <span
                    className="text-xs px-2.5 py-1 rounded-md font-bold"
                    style={{ color: '#DC2626', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)' }}
                  >
                    已禁用
                  </span>
                )}
              </div>
              <h2
                className="text-xl font-bold leading-tight"
                style={{ color: cfg.titleColor }}
              >
                {augment.displayName}
              </h2>
              <p className="text-xs mt-1.5 font-mono" style={{ color: '#94A3B8' }}>
                {augment.name}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {stats && (
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid #E2E8F0' }}
            >
              <div
                className="px-4 py-2.5 flex items-center gap-2"
                style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}
              >
                <i className="fas fa-chart-bar text-xs" style={{ color: '#0891B2' }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>
                  数据统计
                </span>
                <span className="ml-auto text-xs" style={{ color: '#94A3B8' }}>
                  {formatCount(stats.num_games)} 场
                </span>
              </div>

              <div className="grid grid-cols-3 divide-x" style={{ borderBottom: '1px solid #E2E8F0' }}>
                <div className="px-4 py-3 text-center">
                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>总胜率</div>
                  <div
                    className="text-lg font-bold"
                    style={{
                      color: parseFloat(stats.win_rate) >= 0.52
                        ? '#16A34A'
                        : parseFloat(stats.win_rate) >= 0.48
                        ? '#0891B2'
                        : '#DC2626',
                    }}
                  >
                    {formatPercent(stats.win_rate)}
                  </div>
                </div>
                <div className="px-4 py-3 text-center">
                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>选取率</div>
                  <div className="text-lg font-bold" style={{ color: '#374151' }}>
                    {formatPercent(stats.pick_rate)}
                  </div>
                </div>
                <div className="px-4 py-3 text-center">
                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>强度评级</div>
                  {tierInfo ? (
                    <div className="text-lg font-bold" style={{ color: tierInfo.color }}>
                      {tierInfo.label}
                    </div>
                  ) : (
                    <div className="text-lg font-bold" style={{ color: '#CBD5E1' }}>—</div>
                  )}
                </div>
              </div>

              {stats.augment_stage_stats && stats.augment_stage_stats.length > 0 && (
                <div className="px-4 py-3 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#94A3B8' }}>
                    各阶段胜率
                  </div>
                  {stats.augment_stage_stats.map(stageStat => (
                    <div key={stageStat.augment_stage} className="flex items-center gap-3">
                      <span
                        className="text-xs font-bold w-16 flex-shrink-0"
                        style={{ color: '#64748B' }}
                      >
                        {STAGE_LABELS[stageStat.augment_stage] ?? `阶段${stageStat.augment_stage}`}
                      </span>
                      <div className="flex-1">
                        <WinRateBar rate={parseFloat(stageStat.win_rate)} />
                      </div>
                      <span className="text-xs w-12 text-right flex-shrink-0" style={{ color: '#94A3B8' }}>
                        {formatCount(stageStat.num_games)}场
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(() => {
            const goldValue = AUGMENT_GOLD_VALUES[augment.id] ?? null;
            return (
              <div
                className="rounded-xl overflow-hidden"
                style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
              >
                <div className="flex items-center gap-2.5 px-4 py-3">
                  <i className="fas fa-coins text-sm" style={{ color: '#D97706' }} />
                  <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#92400E' }}>
                    金币价值
                  </span>
                  {goldValue ? (
                    <span
                      className="ml-auto text-sm font-bold px-2.5 py-1 rounded-md"
                      style={{ color: '#B45309', background: 'rgba(180,83,9,0.1)', border: '1px solid rgba(180,83,9,0.25)' }}
                    >
                      <i className="fas fa-coins text-xs mr-1" style={{ color: '#D97706' }} />
                      {goldValue.value}
                    </span>
                  ) : (
                    <span
                      className="ml-auto text-xs font-bold px-2.5 py-1 rounded-md"
                      style={{ color: '#94A3B8', background: '#F1F5F9', border: '1px solid #E2E8F0' }}
                    >
                      待完善
                    </span>
                  )}
                </div>
                {goldValue && (
                  <div
                    className="px-4 pb-3 text-xs"
                    style={{ color: '#92400E', opacity: 0.75 }}
                  >
                    {goldValue.breakdown}
                  </div>
                )}
              </div>
            );
          })()}

          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#94A3B8' }}>
              技能描述
            </p>
            <div
              className="augment-desc text-sm leading-relaxed px-4 py-3.5 rounded-xl"
              style={{
                color: '#374151',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                lineHeight: 1.75,
              }}
              dangerouslySetInnerHTML={{ __html: renderedDesc }}
            />
          </div>

          {Object.keys(augment.spellDataValues).length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#94A3B8' }}>
                数值参数
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(augment.spellDataValues).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
                    style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
                  >
                    <span className="text-xs font-mono truncate mr-2" style={{ color: '#94A3B8' }}>
                      {key}
                    </span>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: cfg.color }}>
                      {Number.isInteger(value) ? value : value.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
