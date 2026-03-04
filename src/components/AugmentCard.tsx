import React, { useState } from 'react';
import { Augment, getRarityKey, getLargeIconUrl, getLargeIconUrlFallback, getIconUrlFallback, renderDescription } from '../types';

interface AugmentGoldValue {
  value: number;
  breakdown: string;
}

interface AugmentCardProps {
  augment: Augment;
  goldValue: AugmentGoldValue | null;
  onClick: (augment: Augment) => void;
}

const RARITY_LIGHT = {
  0: {
    label: '银色',
    color: '#78716C',
    titleColor: '#44403C',
    bg: '#FFFFFF',
    border: '#D6D3D1',
    badgeBg: '#F5F5F4',
    badgeColor: '#78716C',
    badgeBorder: '#D6D3D1',
    iconBorder: '#D6D3D1',
    iconShadow: 'rgba(120,113,108,0.15)',
  },
  1: {
    label: '金色',
    color: '#B45309',
    titleColor: '#92400E',
    bg: '#FFFBEB',
    border: '#FDE68A',
    badgeBg: '#FEF3C7',
    badgeColor: '#B45309',
    badgeBorder: '#FCD34D',
    iconBorder: '#FCD34D',
    iconShadow: 'rgba(180,83,9,0.2)',
  },
  2: {
    label: '棱彩',
    color: '#BE123C',
    titleColor: '#9F1239',
    bg: '#FFF1F2',
    border: '#FECDD3',
    badgeBg: '#FFE4E6',
    badgeColor: '#BE123C',
    badgeBorder: '#FDA4AF',
    iconBorder: '#FDA4AF',
    iconShadow: 'rgba(190,18,60,0.2)',
  },
};

export default function AugmentCard({ augment, goldValue, onClick }: AugmentCardProps) {
  const [triedLargeFallback, setTriedLargeFallback] = useState(false);
  const [allFailed, setAllFailed] = useState(false);

  const rarityKey = getRarityKey(augment.rarity);
  const cfg = RARITY_LIGHT[rarityKey];
  const isPrismatic = rarityKey === 2;

  const largePrimary = getLargeIconUrl(augment);
  const largeFallback = getLargeIconUrlFallback(augment);
  const smallFallback = getIconUrlFallback(augment);

  let currentSrc: string;
  if (!triedLargeFallback) {
    currentSrc = largePrimary;
  } else {
    currentSrc = largeFallback !== largePrimary ? largeFallback : smallFallback;
  }

  const handleImageError = () => {
    if (!triedLargeFallback) {
      if (largeFallback === largePrimary) {
        setAllFailed(true);
      } else {
        setTriedLargeFallback(true);
      }
    } else {
      setAllFailed(true);
    }
  };

  return (
    <div
      className="card-hover cursor-pointer rounded-xl overflow-hidden relative"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
      onClick={() => onClick(augment)}
    >
      {isPrismatic && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(232,64,87,0.06), rgba(155,89,182,0.06), rgba(52,152,219,0.06))',
          }}
        />
      )}

      <div className="p-3 flex items-start gap-3 relative z-10">
        <div
          className="flex-shrink-0 rounded-lg overflow-hidden"
          style={{
            width: 52,
            height: 52,
            background: '#1A1A1A',
            border: `2px solid ${cfg.iconBorder}`,
            boxShadow: `0 0 8px ${cfg.iconShadow}`,
          }}
        >
          {!allFailed ? (
            <img
              src={currentSrc}
              alt={augment.displayName}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="fas fa-magic text-lg" style={{ color: cfg.color }} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded"
              style={{
                color: cfg.badgeColor,
                background: cfg.badgeBg,
                border: `1px solid ${cfg.badgeBorder}`,
              }}
            >
              {cfg.label}
            </span>
            {goldValue && (
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1"
                style={{
                  color: '#B45309',
                  background: 'rgba(180,83,9,0.08)',
                  border: '1px solid rgba(180,83,9,0.25)',
                }}
              >
                <i className="fas fa-coins text-xs" style={{ color: '#D97706' }} />
                {Math.round(goldValue.value)}
              </span>
            )}
          </div>
          <h3
            className="font-bold text-sm leading-tight mb-1 truncate"
            style={{ color: cfg.titleColor }}
          >
            {augment.displayName}
          </h3>
          <p
            className="text-xs leading-relaxed line-clamp-2"
            style={{ color: '#6B7280' }}
            dangerouslySetInnerHTML={{
              __html: renderDescription(augment.description, augment.spellDataValues)
                .replace(/<[^>]+>/g, ' ')
                .trim()
            }}
          />
        </div>
      </div>
    </div>
  );
}
