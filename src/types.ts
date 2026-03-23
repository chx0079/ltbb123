export interface Augment {
  id: number;
  name: string;
  displayName: string;
  description: string;
  tooltip: string;
  rarity: number;
  enabled: boolean;
  iconLarge: string;
  iconSmall: string;
  spellDataValues: Record<string, number>;
}

export type RarityFilter = 'all' | 0 | 1 | 2;

export const RARITY_CONFIG = {
  0: { label: '银色', color: '#C8AA6E', bgColor: 'rgba(200,170,110,0.12)', borderColor: 'rgba(200,170,110,0.4)', glowColor: 'rgba(200,170,110,0.3)' },
  1: { label: '金色', color: '#F0B232', bgColor: 'rgba(240,178,50,0.12)', borderColor: 'rgba(240,178,50,0.4)', glowColor: 'rgba(240,178,50,0.3)' },
  2: { label: '棱彩', color: '#E84057', bgColor: 'rgba(232,64,87,0.12)', borderColor: 'rgba(232,64,87,0.4)', glowColor: 'rgba(232,64,87,0.3)' },
} as const;

export function getRarityKey(rarity: number): 0 | 1 | 2 {
  if (rarity === 0 || rarity === 1 || rarity === 2) return rarity;
  return 0;
}

export function getIconUrl(augment: Augment): string {
  const lowerName = augment.name.toLowerCase();
  return `https://cdn.dtodo.cn/hextech/augment-icons/${lowerName}_small.png`;
}

export function getIconUrlFallback(augment: Augment): string {
  const nameWithoutPrefix = augment.name.toLowerCase().replace(/^aram_/, '');
  return `https://cdn.dtodo.cn/hextech/augment-icons/${nameWithoutPrefix}_small.png`;
}

export function getIconUrlNoUnderscore(augment: Augment): string {
  const nameWithoutPrefix = augment.name.toLowerCase().replace(/^aram_/, '').replace(/_/g, '');
  return `https://cdn.dtodo.cn/hextech/augment-icons/${nameWithoutPrefix}_small.png`;
}

export function getLargeIconUrl(augment: Augment): string {
  const lowerName = augment.name.toLowerCase();
  return `https://cdn.dtodo.cn/hextech/augment-icons/${lowerName}_large.png`;
}

export function getLargeIconUrlFallback(augment: Augment): string {
  const nameWithoutPrefix = augment.name.toLowerCase().replace(/^aram_/, '');
  return `https://cdn.dtodo.cn/hextech/augment-icons/${nameWithoutPrefix}_large.png`;
}

export function renderDescription(desc: string, spellDataValues: Record<string, number>): string {
  let result = desc;
  Object.entries(spellDataValues).forEach(([key, value]) => {
    const displayValue = Number.isInteger(value) ? value : Math.round(value * 100);
    result = result.replace(new RegExp(`@${key}@`, 'g'), String(displayValue));
    result = result.replace(new RegExp(`@${key}\\*100@`, 'g'), String(Math.round(value * 100)));
  });
  result = result.replace(/%i:[^%]+%/g, '');
  result = result.replace(/<br>/g, '<br/>');
  return result;
}
