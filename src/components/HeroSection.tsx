import React from 'react';
import { Zap, Compass, Sparkles, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  onSummonThor: () => void;
  onOpenStory?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSummonThor, onOpenStory }) => {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '100px',
        paddingBottom: '80px',
        overflow: 'hidden',
        zIndex: 2,
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Story & CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Runic Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <span className="badge-runic">
                <Sparkles size={14} />
                <span>Norse Mythological Lore</span>
              </span>
              <span className="badge-runic badge-gold">
                <span>ᛏ Thor Odinson</span>
              </span>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('thor:lightning'))}
                className="badge-runic"
                style={{
                  cursor: 'pointer',
                  background: 'rgba(0, 242, 254, 0.15)',
                  border: '1px solid var(--cyan-core)',
                  boxShadow: '0 0 14px rgba(0, 242, 254, 0.3)',
                }}
                title="Trigger celestial thunderbolt"
              >
                <Zap size={13} fill="#00f2fe" />
                <span>⚡ Click to Strike Lightning</span>
              </button>
            </div>

            {/* Main Heading */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  color: 'var(--cyan-core)',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  textShadow: '0 0 15px rgba(0, 242, 254, 0.5)',
                }}
              >
                Guardian of the Storm-Wearied
              </div>
              <h1
                className="electric-title-anim"
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                }}
              >
                THOR
              </h1>
              <div
                style={{
                  fontFamily: 'var(--font-ornate)',
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                  color: 'var(--cyan-core)',
                  letterSpacing: '0.1em',
                  marginTop: '4px',
                  textShadow: '0 0 20px rgba(0, 242, 254, 0.5)',
                }}
              >
                God of Thunder &amp; Tempest
              </div>
            </div>

            {/* Tagline / Catchphrase */}
            <div
              style={{
                position: 'relative',
                paddingLeft: '20px',
                borderLeft: '3px solid var(--cyan-core)',
                background: 'linear-gradient(90deg, rgba(0, 242, 254, 0.08) 0%, transparent 100%)',
                padding: '16px 20px',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)',
                  fontStyle: 'italic',
                  color: '#ffffff',
                  lineHeight: 1.5,
                  letterSpacing: '0.02em',
                }}
              >
                &ldquo;No storm lasts forever — and you don't have to weather it alone.&rdquo;
              </p>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginTop: '6px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                — The Vow to Midgard
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                maxWidth: '540px',
              }}
            >
              Exiled by choice from the feast halls of Asgard, Thor now walks the realm of mortals. 
              Channeling the fury of the gathering storm into an enduring shield, he stands between ordinary 
              people and the crises that threaten to overwhelm them.
            </p>

            {/* CTA Group */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                alignItems: 'center',
                marginTop: '12px',
              }}
            >
              <button
                onClick={onSummonThor}
                className="btn-electric"
                style={{
                  padding: '18px 38px',
                  fontSize: '1.05rem',
                  animation: 'electricPulse 3s infinite',
                }}
                id="hero-summon-btn"
              >
                <Zap size={22} fill="#00f2fe" color="#00f2fe" />
                <span>Summon Thor</span>
              </button>

              <a
                href="#lore"
                className="btn-secondary"
                style={{
                  padding: '16px 28px',
                  fontSize: '0.95rem',
                }}
              >
                <Compass size={18} color="var(--cyan-core)" />
                <span>Explore The Lore</span>
              </a>

              {onOpenStory && (
                <button
                  type="button"
                  onClick={onOpenStory}
                  className="brutal-btn"
                  style={{
                    padding: '16px 24px',
                    fontSize: '0.95rem',
                    background: 'rgba(0, 242, 254, 0.12)',
                    border: '2px solid var(--cyan-core)',
                    color: '#ffffff',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mythic)',
                    fontWeight: 800,
                    boxShadow: '4px 4px 0px #00f2fe',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <BookOpen size={18} color="var(--cyan-core)" />
                  <span>The Sagas of Thor</span>
                </button>
              )}
            </div>

            {/* Atmospheric Telemetry HUD */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginTop: '16px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Storm Charge
                </div>
                <div style={{ fontFamily: 'var(--font-mythic)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--cyan-core)' }}>
                  1.21 GV
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Mjölnir Sync
                </div>
                <div style={{ fontFamily: 'var(--font-mythic)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-asgard)' }}>
                  100% Star-Core
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Midgard Vigil
                </div>
                <div style={{ fontFamily: 'var(--font-mythic)', fontSize: '1.2rem', fontWeight: 800, color: '#4facfe' }}>
                  Active Guardian
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Artwork with Norse Frame & Glow */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Ambient Aura Background */}
            <div
              style={{
                position: 'absolute',
                width: '110%',
                height: '110%',
                background: 'radial-gradient(circle, rgba(0, 242, 254, 0.25) 0%, rgba(157, 78, 221, 0.15) 50%, transparent 75%)',
                filter: 'blur(40px)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />

            {/* Hero Image Container */}
            <div
              className="glass-panel"
              style={{
                position: 'relative',
                zIndex: 2,
                borderRadius: '24px',
                padding: '10px',
                border: '1px solid rgba(0, 242, 254, 0.35)',
                boxShadow: '0 0 50px rgba(0, 242, 254, 0.25), 0 20px 40px rgba(0,0,0,0.8)',
                maxWidth: '520px',
                width: '100%',
                overflow: 'hidden',
                animation: 'floatMjolnir 6s ease-in-out infinite',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  lineHeight: 0,
                }}
              >
                <img
                  src="/assets/thor-hero.jpg"
                  alt="Thor, Norse God of Thunder wielding Mjölnir in the tempest"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1.0)';
                  }}
                />

                {/* Gradient vignette overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 65%, rgba(4, 7, 14, 0.85) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Floating In-Art Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    background: 'rgba(7, 13, 26, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--cyan-core)',
                        boxShadow: '0 0 10px var(--cyan-core)',
                        animation: 'vitalPulse 2s infinite',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mythic)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Mjölnir Awakening
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mythic)',
                      fontSize: '0.75rem',
                      color: 'var(--gold-asgard)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    STAR-FORGED RUNES
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
