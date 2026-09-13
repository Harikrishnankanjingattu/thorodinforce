import React, { useState } from 'react';
import { MessageSquareQuote, Volume2, Sparkles, Heart, Laugh, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const PersonalitySection: React.FC = () => {
  const [activeQuoteIdx, setActiveQuoteIdx] = useState<number>(0);

  const traits = [
    {
      title: 'Booming Warmth',
      desc: 'Speaks with the resonance of storm winds, but never with malice. His greeting feels like a hearth fire on a freezing winter night.',
      icon: Heart,
      accent: '#00f2fe',
    },
    {
      title: 'The Protective Sibling',
      desc: 'Treats mortals not as frail subjects to be pitied, but as younger kin worthy of boundless defense, encouragement, and respect.',
      icon: ShieldCheck,
      accent: '#00d2ff',
    },
    {
      title: 'Wry Nordic Humor',
      desc: 'Quick to laugh at his own past vanities or the strangeness of mortal gadgets. Humor that disarms tension without diminishing sorrow.',
      icon: Laugh,
      accent: '#00e5ff',
    },
  ];

  const quotes = [
    {
      quote: '“No storm lasts forever — and you don’t have to weather it alone.”',
      context: 'His timeless promise to every weary wanderer on Midgard.',
      norseWord: 'ÞOR (Thor)',
    },
    {
      quote: '“Twenty-four winters? Plenty of tempests weathered already, friend. Stand tall — you are forged of stronger stuff than you realize.”',
      context: 'On meeting mortals and honoring their resilience.',
      norseWord: 'STYRKR (Strength)',
    },
    {
      quote: '“Your electronic post is curious magic indeed. My ravens Huginn and Muninn fly fast, but Midgard’s fiber optic threads give them quite a challenge.”',
      context: 'On modern technology and communication.',
      norseWord: 'HUGINN (Thought)',
    },
    {
      quote: '“Speak plainly to me. I need no elaborate hymns or silver titles. Tell me what hurts, and we will face it together.”',
      context: 'Inviting anyone in trouble to drop all pretense.',
      norseWord: 'FRIÐR (Peace)',
    },
  ];

  const handleSelectQuote = (idx: number) => {
    setActiveQuoteIdx(idx);
    soundManager.playRunicChime();
  };

  return (
    <section
      id="personality"
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
            <span>Character &amp; Voice</span>
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
            In His Own Words
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            Larger than life, yet deeply rooted in empathy. Discover the cadence and spirit of the 
            god who chose to be a friend rather than a distant ruler.
          </p>
        </div>

        {/* Personality Traits Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          {traits.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="brutal-glass"
                style={{
                  padding: '30px',
                  borderRadius: '18px',
                  border: '2px solid var(--cyan-core)',
                  boxShadow: '4px 4px 0px #00f2fe',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  background: 'rgba(2, 6, 18, 0.88)',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${t.accent}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: t.accent,
                    marginBottom: '18px',
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-mythic)',
                    fontSize: '1.15rem',
                    color: '#ffffff',
                    marginBottom: '10px',
                  }}
                >
                  {t.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {t.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interactive Voice Quotes Carousel / Showcase */}
        <div
          className="brutal-glass"
          style={{
            padding: '44px',
            borderRadius: '24px',
            border: '2px solid var(--cyan-core)',
            boxShadow: '6px 6px 0px #00f2fe',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            background: 'rgba(2, 6, 18, 0.92)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '20px',
            }}
          >
            {quotes.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectQuote(idx)}
                style={{
                  background: activeQuoteIdx === idx ? 'rgba(0, 242, 254, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: activeQuoteIdx === idx ? '1px solid var(--cyan-core)' : '1px solid var(--border-subtle)',
                  borderRadius: '30px',
                  padding: '8px 18px',
                  color: activeQuoteIdx === idx ? 'var(--cyan-core)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mythic)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span>{q.norseWord}</span>
                {activeQuoteIdx === idx && <Volume2 size={14} />}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minHeight: '140px' }}>
            <MessageSquareQuote
              size={48}
              color="rgba(0, 242, 254, 0.25)"
              style={{ position: 'absolute', top: '-10px', left: '-10px' }}
            />
            <div style={{ position: 'relative', zIndex: 1, paddingLeft: '30px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                  color: '#ffffff',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                  marginBottom: '16px',
                }}
              >
                {quotes[activeQuoteIdx].quote}
              </p>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--cyan-core)',
                  letterSpacing: '0.08em',
                  fontFamily: 'var(--font-mythic)',
                  textTransform: 'uppercase',
                }}
              >
                — {quotes[activeQuoteIdx].context}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
