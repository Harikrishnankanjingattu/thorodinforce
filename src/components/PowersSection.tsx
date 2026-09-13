import React, { useState } from 'react';
import { Zap, Shield, Wind, Sun, Activity, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PowerCard {
  id: string;
  title: string;
  runic: string;
  category: string;
  description: string;
  statName: string;
  statVal: number;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string; style?: React.CSSProperties }>;
  animationClass: string;
  accentColor: string;
}

export const PowersSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const powers: PowerCard[] = [
    {
      id: 'lightning',
      title: 'Command Over Lightning',
      runic: 'ᛋ',
      category: 'Celestial Elemental',
      description:
        'Channels raw atmospheric potential into controlled ion discharges, striking with surgical precision or generating electromagnetic barriers that deflect hostile kinetic forces.',
      statName: 'Celestial Voltage',
      statVal: 100,
      icon: Zap,
      animationClass: 'lightning-flicker-hover',
      accentColor: '#00f2fe',
    },
    {
      id: 'strength',
      title: 'Superhuman Strength',
      runic: 'ᚢ',
      category: 'Physical Resilience',
      description:
        'Shatters mountain granite with bare hands. His bone density and muscle fibers are fortified by divine Asgardian physiology, rendering him immune to mortal weapons and concussive impacts.',
      statName: 'Kinetic Tolerance',
      statVal: 98,
      icon: Shield,
      animationClass: 'hammer-spin-hover',
      accentColor: '#00d2ff',
    },
    {
      id: 'flight',
      title: 'Storm-Flight',
      runic: 'ᚱ',
      category: 'Aerodynamic Vector',
      description:
        'Does not merely fly — Thor commands the thermal updrafts and pressure vortices of the tempest, riding gale-force winds at supersonic velocity across Midgard’s horizons.',
      statName: 'Atmospheric Velocity',
      statVal: 95,
      icon: Wind,
      animationClass: 'wind-swirl-hover',
      accentColor: '#00e5ff',
    },
    {
      id: 'weather',
      title: 'Weather Calming',
      runic: 'ᚹ',
      category: 'Atmospheric Manipulation',
      description:
        'Where thunder once only destroyed, Thor can now invert barometric squalls. With an outstretched hand, he dissipates deadly storm surges and brings calm skies to battered communities.',
      statName: 'Barometric Calming',
      statVal: 92,
      icon: Sun,
      animationClass: 'storm-wave-hover',
      accentColor: '#00b4d8',
    },
    {
      id: 'regeneration',
      title: 'Storm Regeneration',
      runic: 'ᛚ',
      category: 'Bio-Electric Healing',
      description:
        'Directly absorbs ambient static electricity, lightning strikes, and ionization from the atmosphere to instantaneously regenerate damaged tissue and purge mortal exhaustion.',
      statName: 'Cellular Restoration',
      statVal: 96,
      icon: Activity,
      animationClass: 'vital-pulse-hover',
      accentColor: '#00e5ff',
    },
  ];

  return (
    <section
      id="powers"
      style={{
        position: 'relative',
        padding: '100px 0',
        zIndex: 2,
      }}
    >
      <div className="container">
        {/* Section Title */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px auto' }}>
          <div className="badge-runic" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} />
            <span>Divine Capacities</span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-mythic)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              color: '#ffffff',
              letterSpacing: '0.06em',
              textShadow: '0 0 25px rgba(0, 242, 254, 0.3)',
              marginBottom: '16px',
            }}
          >
            Powers &amp; Divine Artifact
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            Forged in celestial storms and honed through mortal solidarity. Explore the attributes 
            that make Thor both an unstoppable tempest and a steadfast protector.
          </p>
        </div>

        {/* Powers Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '60px',
          }}
        >
          {powers.map((p) => {
            const Icon = p.icon;
            const isHovered = hoveredCard === p.id;
            return (
              <div
                key={p.id}
                className="glass-panel"
                onMouseEnter={() => {
                  setHoveredCard(p.id);
                  if (p.id === 'lightning') soundManager.playMessageSpark();
                }}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  padding: '32px',
                  borderRadius: '20px',
                  border: isHovered ? '2px solid var(--cyan-core)' : '2px solid rgba(0, 242, 254, 0.35)',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isHovered
                    ? '6px 6px 0px #00f2fe, 0 0 30px rgba(0, 242, 254, 0.35)'
                    : '3px 3px 0px rgba(0, 242, 254, 0.3)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  background: 'rgba(2, 6, 18, 0.88)',
                }}
              >
                {/* Background Runic Watermark */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '20px',
                    fontFamily: 'var(--font-mythic)',
                    fontSize: '4.5rem',
                    fontWeight: 900,
                    color: 'rgba(255, 255, 255, 0.03)',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                >
                  {p.runic}
                </div>

                <div>
                  {/* Top Icon & Category */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '14px',
                        background: `radial-gradient(circle, ${p.accentColor}26 0%, rgba(10, 19, 38, 0.8) 100%)`,
                        border: `1px solid ${p.accentColor}66`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: p.accentColor,
                        boxShadow: isHovered ? `0 0 20px ${p.accentColor}88` : 'none',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <div className={isHovered ? p.animationClass : ''}>
                        <Icon size={26} />
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        letterSpacing: '0.12em',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mythic)',
                        fontWeight: 600,
                      }}
                    >
                      {p.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-mythic)',
                      fontSize: '1.25rem',
                      color: '#ffffff',
                      marginBottom: '12px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      marginBottom: '24px',
                    }}
                  >
                    {p.description}
                  </p>
                </div>

                {/* Stat Bar Indicator */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mythic)',
                      marginBottom: '8px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>{p.statName}</span>
                    <span style={{ color: p.accentColor, fontWeight: 700 }}>{p.statVal}%</span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${p.statVal}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${p.accentColor}88 0%, ${p.accentColor} 100%)`,
                        borderRadius: '4px',
                        boxShadow: `0 0 10px ${p.accentColor}`,
                        transition: 'width 1s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Artifact Showcase: Mjölnir */}
        <div
          className="brutal-glass"
          style={{
            padding: '40px',
            borderRadius: '24px',
            border: '2px solid var(--cyan-core)',
            boxShadow: '8px 8px 0px #00f2fe, 0 0 45px rgba(0, 242, 254, 0.25)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            background: 'rgba(2, 6, 18, 0.92)',
          }}
        >
          {/* Mjölnir Visual */}
          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              boxShadow: '0 0 35px rgba(0, 242, 254, 0.25)',
              maxHeight: '380px',
            }}
          >
            <img
              src="/assets/mjolnir.jpg"
              alt="Mjölnir — Geometric Star-Forged War Hammer"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.5s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1.0)';
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: '#000000',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--cyan-core)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.75rem',
                color: 'var(--cyan-core)',
                fontWeight: 700,
                boxShadow: '0 0 10px rgba(0, 242, 254, 0.4)',
              }}
            >
              ENCHANTED STAR-METAL
            </div>
          </div>

          {/* Mjölnir Specs & Lore */}
          <div>
            <div className="badge-runic badge-gold" style={{ marginBottom: '14px' }}>
              <span>ᛗ Symbolic Conduit</span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-mythic)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                color: '#ffffff',
                marginBottom: '12px',
                letterSpacing: '0.04em',
              }}
            >
              Mjölnir: The Star-Forged Hammer
            </h3>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '24px',
              }}
            >
              Forged in the heart of a dying celestial star and etched with Elder Futhark runes of binding. 
              Mjölnir cannot be wielded for selfish conquest; its enchantments only awaken in defense of the 
              vulnerable. Whenever cast into the tempest, it cleaves the squall and returns instantly to Thor’s hand.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '20px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Forging Medium
                </div>
                <div style={{ fontFamily: 'var(--font-mythic)', fontSize: '1rem', color: '#ffffff', fontWeight: 700 }}>
                  Dying Star Core
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Enchantment
                </div>
                <div style={{ fontFamily: 'var(--font-mythic)', fontSize: '1rem', color: 'var(--gold-asgard)', fontWeight: 700 }}>
                  Return-to-Hand
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Aesthetic Note
                </div>
                <div style={{ fontFamily: 'var(--font-mythic)', fontSize: '1rem', color: 'var(--cyan-core)', fontWeight: 700 }}>
                  Geometric Runic
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Status
                </div>
                <div style={{ fontFamily: 'var(--font-mythic)', fontSize: '1rem', color: '#4facfe', fontWeight: 700 }}>
                  Resonating with Midgard
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .lightning-flicker-hover {
          animation: lightningFlicker 0.4s infinite;
        }
        .hammer-spin-hover {
          animation: hammerSpin 0.6s ease-in-out;
        }
        .wind-swirl-hover {
          animation: windSwirl 0.8s linear infinite;
        }
        .storm-wave-hover {
          animation: stormWave 0.8s ease-in-out infinite;
        }
        .vital-pulse-hover {
          animation: vitalPulse 0.8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
