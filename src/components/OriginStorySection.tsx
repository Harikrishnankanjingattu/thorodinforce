import React, { useState } from 'react';
import { Crown, CloudLightning, ShieldAlert, Sparkles, Footprints, ChevronRight, BookOpen, Volume2 } from 'lucide-react';

interface OriginStorySectionProps {
  onOpenStory?: () => void;
}

export const OriginStorySection: React.FC<OriginStorySectionProps> = ({ onOpenStory }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const timelineSteps = [
    {
      id: 0,
      runic: 'ᚲ',
      title: 'The Golden Halls of Asgard',
      subtitle: 'Pride & Celestial Detachment',
      icon: Crown,
      content:
        'Born son of Odin and heir to the celestial throne, Thor once lived untouched by the fragile struggles of mortals. Within the gleaming halls of Asgard, thunder was merely a celebratory song, and mortal concerns felt as distant as falling leaves in an autumn gale.',
      quote: '“We drank the mead of eternity while the world below trembled in fear.”',
    },
    {
      id: 1,
      runic: 'ᚺ',
      title: 'The Mortal Tempest',
      subtitle: 'The Storm Left Unchecked',
      icon: CloudLightning,
      content:
        'Everything changed on the night of the Great North Sea Squall. Soaring through the clouds, Thor witnessed a coastal fishing village torn apart by a terrifying gale. It was a tempest he could have calmed with a single command — yet he watched idly as families were displaced and lives broken.',
      quote: '“The cry of a child in the gale echoed louder than all the thunder in the cosmos.”',
    },
    {
      id: 2,
      runic: 'ᚱ',
      title: 'The Voluntary Exile',
      subtitle: 'Turning His Back on Paradise',
      icon: ShieldAlert,
      content:
        'Humbled and shattered by his own careless vanity, Thor threw down his royal laurels. He refused Odin’s invitation to the golden feast, choosing voluntary exile to Midgard (Earth). He relinquished the comfort of a god to feel the cold rain on his own skin alongside mortals.',
      quote: '“I shall not sit upon a golden bench while those beneath me bleed in silence.”',
    },
    {
      id: 3,
      runic: 'ᛏ',
      title: 'The Guardian’s Vow',
      subtitle: 'Thunder as a Protective Shield',
      icon: Footprints,
      content:
        'Thor now walks the roads of Earth as an enduring protector. He forged a solemn covenant: never again shall his celestial gifts sleep while someone suffers. The fury of lightning, once a raw force of destruction, is now channeled into a steadfast sanctuary.',
      quote: '“No storm lasts forever — and you don’t have to weather it alone.”',
    },
  ];

  return (
    <section
      id="lore"
      style={{
        position: 'relative',
        padding: '100px 0',
        zIndex: 2,
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px auto' }}>
          <div className="badge-runic" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} />
            <span>Narrative Chronicle</span>
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
            The Descent to Midgard
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            How the prince of thunder cast aside royal complacency, felt the fragility of mortal life, 
            and bound his divine power to the protection of humanity.
          </p>
        </div>

        {/* Timeline Navigation Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '40px',
          }}
        >
          {timelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className="brutal-btn"
                style={{
                  background: isSelected ? 'rgba(0, 242, 254, 0.18)' : 'rgba(10, 19, 38, 0.65)',
                  border: isSelected ? '2px solid var(--cyan-core)' : '1.5px solid rgba(0, 242, 254, 0.3)',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '4px 4px 0px #00f2fe' : '2px 2px 0px rgba(0, 242, 254, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: isSelected
                      ? 'var(--cyan-core)'
                      : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? '#04070e' : 'var(--cyan-core)',
                    flexShrink: 0,
                    fontWeight: 800,
                    fontSize: '1.1rem',
                  }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mythic)',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: isSelected ? 'var(--cyan-core)' : 'var(--text-muted)',
                      marginTop: '3px',
                    }}
                  >
                    {step.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Chronicle Showcase Card */}
        <div
          className="brutal-glass"
          style={{
            padding: '40px',
            borderRadius: '20px',
            border: '2px solid var(--cyan-core)',
            boxShadow: '8px 8px 0px #00f2fe',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontSize: '2rem',
                  color: 'var(--cyan-core)',
                  textShadow: '0 0 15px var(--cyan-core)',
                }}
              >
                {timelineSteps[activeStep].runic}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  color: 'var(--cyan-core)',
                  textTransform: 'uppercase',
                }}
              >
                Chapter 0{activeStep + 1} of 04
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-mythic)',
                fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                color: '#ffffff',
                marginBottom: '8px',
                letterSpacing: '0.04em',
              }}
            >
              {timelineSteps[activeStep].title}
            </h3>

            <div
              style={{
                fontSize: '0.95rem',
                color: 'var(--cyan-core)',
                marginBottom: '20px',
                fontWeight: 500,
              }}
            >
              {timelineSteps[activeStep].subtitle}
            </div>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.85,
                marginBottom: '28px',
              }}
            >
              {timelineSteps[activeStep].content}
            </p>

            <div
              style={{
                background: 'rgba(0, 242, 254, 0.06)',
                borderLeft: '4px solid var(--cyan-core)',
                padding: '16px 20px',
                borderRadius: '0 10px 10px 0',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontStyle: 'italic',
                  color: '#ffffff',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                }}
              >
                {timelineSteps[activeStep].quote}
              </p>
            </div>
          </div>

          {/* Right illustration / thematic badge */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%)',
              padding: '30px',
              borderRadius: '20px',
            }}
          >
            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '2px dashed rgba(0, 242, 254, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'runeShimmer 4s infinite ease-in-out',
                position: 'relative',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontSize: '4.5rem',
                  color: 'var(--cyan-core)',
                  textShadow: '0 0 30px var(--cyan-core)',
                }}
              >
                {timelineSteps[activeStep].runic}
              </span>
            </div>

            <div
              style={{
                marginTop: '24px',
                textAlign: 'center',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Ancient Elder Futhark Key
            </div>

            <button
              onClick={() => setActiveStep((prev) => (prev + 1) % timelineSteps.length)}
              style={{
                marginTop: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: 'var(--cyan-core)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'gap var(--transition-fast)',
              }}
            >
              <span>Next Chapter</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* The Full Sagas of Thor - Cyber-Neobrutalist Recitation Banner */}
        {onOpenStory && (
          <div
            className="brutal-glass"
            style={{
              marginTop: '40px',
              padding: '28px 32px',
              borderRadius: '16px',
              border: '2px solid var(--cyan-core)',
              boxShadow: '6px 6px 0px #00f2fe',
              background: 'linear-gradient(135deg, rgba(2, 6, 18, 0.95) 0%, rgba(0, 20, 45, 0.92) 100%)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="brutal-badge">EPIC CHRONICLES</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--cyan-core)', fontWeight: 700 }}>
                  STUDIO NEURAL VOCAL RECITAL
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  marginBottom: '6px',
                  letterSpacing: '0.04em',
                }}
              >
                The Story of Thor: From Dying Star to Guardian Covenant
              </h3>
              <p style={{ fontSize: '0.90rem', color: 'rgba(255, 255, 255, 0.78)', margin: 0, lineHeight: 1.6 }}>
                Experience all 4 complete sagas with rich prose, celestial lore, and Thor's aged muscular kingly neural voice reciting every passage with thunderous presence.
              </p>
            </div>

            <button
              onClick={onOpenStory}
              className="brutal-btn"
              style={{
                padding: '16px 28px',
                borderRadius: '12px',
                background: 'var(--cyan-core)',
                border: '2px solid #ffffff',
                color: '#000000',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.92rem',
                fontWeight: 900,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                boxShadow: '3px 3px 0px #00f2fe',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
              }}
            >
              <BookOpen size={18} />
              <Volume2 size={18} />
              <span>⚡ Open &amp; Hear The Sagas</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
