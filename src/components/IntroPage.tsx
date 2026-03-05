import React from 'react';

interface IntroPageProps {
  onEnter: () => void;
}

export default function IntroPage({ onEnter }: IntroPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: 'linear-gradient(135deg, #F0F4FF 0%, #F0F2F5 50%, #FFF7ED 100%)' }}
    >
      <div className="max-w-3xl w-full">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0891B2, #0E7490)' }}
          >
            <i className="fas fa-bolt text-2xl text-white" />
          </div>
          <h1 className="text-4xl font-black mb-3" style={{ color: '#1A2332', letterSpacing: '-0.5px' }}>
            海克斯大乱斗图鉴
          </h1>
          <p className="text-base" style={{ color: '#64748B' }}>
            用数据读懂每一个增益的真实价值
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div
            className="rounded-2xl p-6"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(8,145,178,0.1)' }}
            >
              <i className="fas fa-chart-line text-base" style={{ color: '#0891B2' }} />
            </div>
            <h3 className="font-bold text-base mb-2" style={{ color: '#1A2332' }}>胜率</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
              反映真实对局结果，天然包含英雄适配、阵容协同与版本环境。结合选取率一起看，才能排除样本偏差。
            </p>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(180,83,9,0.08)' }}
            >
              <i className="fas fa-coins text-base" style={{ color: '#B45309' }} />
            </div>
            <h3 className="font-bold text-base mb-2" style={{ color: '#1A2332' }}>属性金币价值</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
              将增益属性换算为等价金币，建立统一比较基准。衡量的是理论上限，与实际胜率的差距才是关键信息。
            </p>
          </div>

        </div>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(139,92,246,0.1)' }}
            >
              <i className="fas fa-not-equal text-base" style={{ color: '#7C3AED' }} />
            </div>
            <h3 className="font-bold text-base" style={{ color: '#1A2332' }}>两者结合：偏差才是真正的信号</h3>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#475569' }}>
            胜率告诉你<strong style={{ color: '#1A2332' }}>结果</strong>，金币价值告诉你<strong style={{ color: '#1A2332' }}>理论预期</strong>。单独看任何一个都不完整，两者的偏差才是最有价值的信息——它能帮你区分"强度来自数值"还是"强度来自机制"。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.15)' }}
            >
              <div className="flex-shrink-0 mt-0.5">
                <i className="fas fa-arrow-trend-up text-sm" style={{ color: '#DC2626' }} />
              </div>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: '#DC2626' }}>金币价值高，胜率低</p>
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>属性本身不弱，但条件苛刻、玩家不会用，或该属性在大乱斗节奏下发挥受限</p>
              </div>
            </div>
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.15)' }}
            >
              <div className="flex-shrink-0 mt-0.5">
                <i className="fas fa-magnifying-glass text-sm" style={{ color: '#059669' }} />
              </div>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: '#059669' }}>金币价值低，胜率高</p>
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>存在隐性机制收益或非预期交互，纯数值无法解释其强度，值得重点审查</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 mb-10 flex items-start gap-4"
          style={{
            background: 'rgba(8,145,178,0.05)',
            border: '1px solid rgba(8,145,178,0.2)',
          }}
        >
          <div
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
            style={{ background: 'rgba(8,145,178,0.12)' }}
          >
            <i className="fas fa-lightbulb text-sm" style={{ color: '#0891B2' }} />
          </div>
          <div>
            <p className="text-sm font-bold mb-1" style={{ color: '#0E7490' }}>如何使用本工具</p>
            <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
              在<strong>增益图鉴</strong>中浏览所有海克斯，查看每个增益的胜率、选取率与T级评定；在<strong>属性金币价值</strong>中查阅各属性的理论换算基准，辅助判断增益的数值合理性。
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-base text-white transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #0891B2, #0E7490)',
              boxShadow: '0 4px 16px rgba(8,145,178,0.35)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(8,145,178,0.45)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(8,145,178,0.35)';
            }}
          >
            <i className="fas fa-bolt text-sm" />
            进入图鉴
            <i className="fas fa-arrow-right text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
