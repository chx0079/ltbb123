import React, { useState } from 'react';

interface StatRow {
  stat: string;
  statZh: string;
  anchorItem: string;
  anchorItemZh: string;
  itemCost: number;
  statAmount: string;
  goldPerUnit: number;
  unit: string;
  notes: string;
  category: 'basic' | 'advanced';
}

const WIKI_PAGE_URL = 'https://leagueoflegends.fandom.com/wiki/Gold_efficiency';

const STAT_DATA: StatRow[] = [
  {
    stat: 'Health',
    statZh: '生命值',
    anchorItem: 'Ruby Crystal',
    anchorItemZh: '红玉水晶',
    itemCost: 400,
    statAmount: '+150',
    goldPerUnit: 2.67,
    unit: '/ HP',
    notes: '最基础的锚点装备',
    category: 'basic',
  },
  {
    stat: 'Mana',
    statZh: '法力值',
    anchorItem: 'Sapphire Crystal',
    anchorItemZh: '蓝玉水晶',
    itemCost: 350,
    statAmount: '+250',
    goldPerUnit: 1.4,
    unit: '/ Mana',
    notes: '',
    category: 'basic',
  },
  {
    stat: 'Attack Damage',
    statZh: '攻击力',
    anchorItem: 'Long Sword',
    anchorItemZh: '长剑',
    itemCost: 350,
    statAmount: '+10',
    goldPerUnit: 35,
    unit: '/ AD',
    notes: '',
    category: 'basic',
  },
  {
    stat: 'Ability Power',
    statZh: '法术强度',
    anchorItem: 'Amplifying Tome',
    anchorItemZh: '增幅之书',
    itemCost: 435,
    statAmount: '+20',
    goldPerUnit: 21.75,
    unit: '/ AP',
    notes: '',
    category: 'basic',
  },
  {
    stat: 'Armor',
    statZh: '护甲',
    anchorItem: 'Cloth Armor',
    anchorItemZh: '布甲',
    itemCost: 300,
    statAmount: '+15',
    goldPerUnit: 20,
    unit: '/ Armor',
    notes: '',
    category: 'basic',
  },
  {
    stat: 'Magic Resistance',
    statZh: '魔法抗性',
    anchorItem: 'Null-Magic Mantle',
    anchorItemZh: '无效魔法斗篷',
    itemCost: 300,
    statAmount: '+15',
    goldPerUnit: 20,
    unit: '/ MR',
    notes: '',
    category: 'basic',
  },
  {
    stat: 'Attack Speed',
    statZh: '攻击速度',
    anchorItem: 'Dagger',
    anchorItemZh: '匕首',
    itemCost: 300,
    statAmount: '+12%',
    goldPerUnit: 25,
    unit: '/ 1% AS',
    notes: '以 1% 攻击速度为单位',
    category: 'basic',
  },
  {
    stat: 'Critical Strike Chance',
    statZh: '暴击率',
    anchorItem: 'Cloak of Agility',
    anchorItemZh: '灵敏斗篷',
    itemCost: 600,
    statAmount: '+15%',
    goldPerUnit: 40,
    unit: '/ 1% Crit',
    notes: '以 1% 暴击率为单位',
    category: 'basic',
  },
  {
    stat: 'Ability Haste',
    statZh: '技能急速',
    anchorItem: 'Kindlegem',
    anchorItemZh: '点火宝石',
    itemCost: 800,
    statAmount: '+10 AH',
    goldPerUnit: 26.67,
    unit: '/ AH',
    notes: 'S11 后替代冷却缩减',
    category: 'basic',
  },
  {
    stat: 'Move Speed (flat)',
    statZh: '移动速度（固定）',
    anchorItem: 'Boots',
    anchorItemZh: '靴子',
    itemCost: 300,
    statAmount: '+25',
    goldPerUnit: 12,
    unit: '/ MS',
    notes: '固定移速，非百分比',
    category: 'basic',
  },
  {
    stat: 'Health Regeneration',
    statZh: '生命回复',
    anchorItem: 'Rejuvenation Bead',
    anchorItemZh: '复苏珠',
    itemCost: 150,
    statAmount: '+50%',
    goldPerUnit: 3,
    unit: '/ 1% base HP5',
    notes: '以基础生命回复百分比计',
    category: 'basic',
  },
  {
    stat: 'Mana Regeneration',
    statZh: '法力回复',
    anchorItem: 'Faerie Charm',
    anchorItemZh: '精灵符咒',
    itemCost: 150,
    statAmount: '+50%',
    goldPerUnit: 3,
    unit: '/ 1% base MP5',
    notes: '以基础法力回复百分比计',
    category: 'basic',
  },
  {
    stat: 'Percent Armor Penetration',
    statZh: '护甲穿透（百分比）',
    anchorItem: 'Last Whisper',
    anchorItemZh: '最后的轻语',
    itemCost: 1300,
    statAmount: '+20%',
    goldPerUnit: 41.67,
    unit: '/ 1% Armor Pen',
    notes: '',
    category: 'advanced',
  },
  {
    stat: 'Heal and Shield Power',
    statZh: '治疗与护盾强度',
    anchorItem: 'Forbidden Idol',
    anchorItemZh: '禁忌圣像',
    itemCost: 800,
    statAmount: '+10%',
    goldPerUnit: 50,
    unit: '/ 1% HSP',
    notes: '',
    category: 'advanced',
  },
  {
    stat: 'Lethality',
    statZh: '致命性（固定护甲穿透）',
    anchorItem: 'Serrated Dirk',
    anchorItemZh: '锯齿匕首',
    itemCost: 1100,
    statAmount: '+10',
    goldPerUnit: 30,
    unit: '/ Lethality',
    notes: '',
    category: 'advanced',
  },
  {
    stat: 'Life Steal',
    statZh: '生命偷取',
    anchorItem: 'Vampiric Scepter',
    anchorItemZh: '吸血权杖',
    itemCost: 900,
    statAmount: '+10%',
    goldPerUnit: 53.67,
    unit: '/ 1% LS',
    notes: '',
    category: 'advanced',
  },
  {
    stat: 'Magic Penetration (flat)',
    statZh: '法术穿透（固定）',
    anchorItem: "Sorcerer's Shoes",
    anchorItemZh: '法师之靴',
    itemCost: 1100,
    statAmount: '+15',
    goldPerUnit: 46.67,
    unit: '/ Magic Pen',
    notes: '',
    category: 'advanced',
  },
  {
    stat: 'Percent Magic Penetration',
    statZh: '法术穿透（百分比）',
    anchorItem: 'Blighting Jewel',
    anchorItemZh: '枯萎宝石',
    itemCost: 1200,
    statAmount: '+15%',
    goldPerUnit: 46.15,
    unit: '/ 1% Magic Pen',
    notes: '',
    category: 'advanced',
  },
  {
    stat: 'On-hit Damage',
    statZh: '攻击附加伤害',
    anchorItem: 'Recurve Bow',
    anchorItemZh: '反曲弓',
    itemCost: 1000,
    statAmount: '+15',
    goldPerUnit: 21.67,
    unit: '/ On-hit',
    notes: '',
    category: 'advanced',
  },
  {
    stat: 'Percent Movement Speed',
    statZh: '移动速度（百分比）',
    anchorItem: 'Winged Moonplate',
    anchorItemZh: '翼月护板',
    itemCost: 800,
    statAmount: '+5%',
    goldPerUnit: 53.33,
    unit: '/ 1% MS',
    notes: '',
    category: 'advanced',
  },
];

function GoldBadge({ value, unit }: { value: number; unit: string }) {
  const isHighValue = value >= 35;
  const isMidValue = value >= 20 && value < 35;

  const color = isHighValue ? '#B45309' : isMidValue ? '#0891B2' : '#6B7280';
  const bg = isHighValue
    ? 'rgba(180,83,9,0.08)'
    : isMidValue
    ? 'rgba(8,145,178,0.08)'
    : 'rgba(107,114,128,0.08)';
  const border = isHighValue
    ? 'rgba(180,83,9,0.25)'
    : isMidValue
    ? 'rgba(8,145,178,0.25)'
    : 'rgba(107,114,128,0.2)';

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-sm"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      <i className="fas fa-coins text-xs" style={{ color: '#D97706' }} />
      {value}
      <span className="text-xs font-normal" style={{ opacity: 0.7 }}>{unit}</span>
    </span>
  );
}

function StatTable({ rows }: { rows: StatRow[] }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            {['属性', '锚点装备', '装备价格', '属性量', '每点金币价值', '备注'].map(header => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: '#94A3B8' }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.stat}
              className="transition-colors"
              style={{
                background: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                borderBottom: '1px solid #F1F5F9',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(8,145,178,0.04)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLTableRowElement).style.background =
                  index % 2 === 0 ? '#FFFFFF' : '#FAFAFA';
              }}
            >
              <td className="px-4 py-3">
                <div className="font-bold" style={{ color: '#1A2332' }}>
                  {row.statZh}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                  {row.stat}
                </div>
              </td>
              <td className="px-4 py-3">
                <div style={{ color: '#374151' }}>{row.anchorItemZh}</div>
                <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                  {row.anchorItem}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="flex items-center gap-1" style={{ color: '#6B7280' }}>
                  <i className="fas fa-coins text-xs" style={{ color: '#D97706' }} />
                  {row.itemCost}
                </span>
              </td>
              <td className="px-4 py-3 font-mono" style={{ color: '#374151' }}>
                {row.statAmount}
              </td>
              <td className="px-4 py-3">
                <GoldBadge value={row.goldPerUnit} unit={row.unit} />
              </td>
              <td className="px-4 py-3 text-xs" style={{ color: '#94A3B8', maxWidth: 180 }}>
                {row.notes || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GoldEfficiencyPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const basicRows = STAT_DATA.filter(
    row =>
      row.category === 'basic' &&
      (!searchQuery ||
        row.statZh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.stat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.anchorItemZh.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const advancedRows = STAT_DATA.filter(
    row =>
      row.category === 'advanced' &&
      (!searchQuery ||
        row.statZh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.stat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.anchorItemZh.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalFiltered = basicRows.length + advancedRows.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #D97706, #B45309)' }}
          >
            <i className="fas fa-coins text-sm text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: '#1A2332' }}>
              属性金币价值参考表
            </h2>
            <p className="text-xs" style={{ color: '#94A3B8' }}>
              数据来源：
              <a
                href={WIKI_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 hover:underline"
                style={{ color: '#0891B2' }}
              >
                League of Legends Wiki · Gold Efficiency
                <i className="fas fa-external-link-alt ml-1 text-xs" />
              </a>
            </p>
          </div>
        </div>

        <div
          className="mt-4 p-3.5 rounded-xl text-xs"
          style={{
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            color: '#92400E',
          }}
        >
          <i className="fas fa-info-circle mr-1.5" style={{ color: '#D97706' }} />
          金币效率 = 装备提供的所有属性总价值 / 装备实际售价 × 100%。以下每点金币价值以基础装备为锚点反推得出，用于后续计算海克斯增益的理论价值。
        </div>
      </div>

      <div className="mb-5 relative max-w-sm">
        <i
          className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-sm"
          style={{ color: '#CBD5E1' }}
        />
        <input
          type="text"
          placeholder="搜索属性名称..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input w-full pl-9 pr-4 py-2.5 rounded-lg text-sm"
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

      {basicRows.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-1 h-4 rounded-full"
              style={{ background: '#0891B2' }}
            />
            <h3 className="text-sm font-bold" style={{ color: '#1A2332' }}>
              基础属性
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(8,145,178,0.08)', color: '#0891B2', border: '1px solid rgba(8,145,178,0.2)' }}>
              {basicRows.length} 条
            </span>
          </div>
          <StatTable rows={basicRows} />
        </div>
      )}

      {advancedRows.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-1 h-4 rounded-full"
              style={{ background: '#B45309' }}
            />
            <h3 className="text-sm font-bold" style={{ color: '#1A2332' }}>
              进阶属性
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(180,83,9,0.08)', color: '#B45309', border: '1px solid rgba(180,83,9,0.2)' }}>
              {advancedRows.length} 条
            </span>
          </div>
          <StatTable rows={advancedRows} />
        </div>
      )}

      {totalFiltered === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <i className="fas fa-search text-3xl" style={{ color: '#CBD5E1' }} />
          <p style={{ color: '#94A3B8' }}>没有找到匹配的属性</p>
        </div>
      )}

      <p className="mt-3 text-xs text-right" style={{ color: '#94A3B8' }}>
        共 {totalFiltered} / {STAT_DATA.length} 条属性数据
      </p>
    </div>
  );
}
