import React from 'react';
import { Shield, HeartHandshake, CloudRain, Zap } from 'lucide-react';

interface MissionSectionProps {
  onSummonThor: () => void;
}

export const MissionSection: React.FC<MissionSectionProps> = ({ onSummonThor }) => {
  return (
    <section
      id="mission"
      style={{
        position: 'relative',
        padding: '100px 0',
        zIndex: 2,
        background: 'linear-gradient(180deg, rgba(7, 13, 26, 0) 0%, rgba(10, 20, 42, 0.6) 50%, rgba(7, 13, 26, 0) 100%)',
      }}
    >
      <div className="container">
        <div
          className="glass-panel"
          style={{
            padding: '56px 48px',
            borderRadius: '28px',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            boxShadow: '0 0 50px rgba(0, 242, 254, 0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Radial Backlight */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '820px' }}>
            <div className="badge-runic" style={{ marginBottom: '20px' }}>
              <Shield size={14} />
              <span>Sacred Covenant</span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-mythic)',
                fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '0.04em',
                marginBottom: '24px',
              }}
            >
              &ldquo;To Stand Between Mortals &amp; The Storm.&rdquo;
            </h2>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.85,
                marginBottom: '36px',
              }}
            >
              The storm is not always rain, wind, and lightning. Often, the fiercest tempests are fought 
              within the quiet chambers of the human spirit — grief, isolation, insurmountable challenges, 
              or carrying a burden so heavy it threatens to break you.
            </p>

            {/* Two Pillars of Protection */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '24px',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  background: 'rgba(5, 10, 22, 0.65)',
                  border: '1px solid rgba(0, 242, 254, 0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <CloudRain size={22} color="var(--cyan-core)" />
                  <h4 style={{ fontFamily: 'var(--font-mythic)', fontSize: '1.05rem', color: '#ffffff' }}>
                    The Outer Tempests
                  </h4>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Natural cataclysms, disasters, physical vulnerability, and perils where human strength 
                  falls short against elemental fury.
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(5, 10, 22, 0.65)',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  borderRadius: '16px',
                  padding: '24px',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <HeartHandshake size={22} color="var(--cyan-core)" />
                  <h4 style={{ fontFamily: 'var(--font-mythic)', fontSize: '1.05rem', color: '#ffffff' }}>
                    The Inner Tempests
                  </h4>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Loneliness, quiet desperation, unspoken distress, and the belief that you are utterly forgotten. 
                  No soul calls upon Thor in vain.
                </p>
              </div>
            </div>

            {/* Bottom Call to Action Callout */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <button
                onClick={onSummonThor}
                className="btn-electric"
                style={{ padding: '16px 36px' }}
              >
                <Zap size={20} fill="#00f2fe" color="#00f2fe" />
                <span>Call Upon The Thunder</span>
              </button>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Every message is heard personally by Thor and dispatched in real time.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
