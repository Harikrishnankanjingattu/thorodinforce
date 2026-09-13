import React from 'react';
import { Zap, ArrowUp, Mail, Phone, Globe } from 'lucide-react';

interface FooterProps {
  onSummonThor: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSummonThor }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'rgba(3, 6, 13, 0.95)',
        borderTop: '1px solid rgba(0, 242, 254, 0.2)',
        paddingTop: '80px',
        paddingBottom: '40px',
      }}
    >
      <div className="container">
        {/* Top Banner: Summon Thor Final CTA */}
        <div
          className="glass-panel"
          style={{
            padding: '44px',
            borderRadius: '24px',
            border: '1px solid rgba(0, 242, 254, 0.4)',
            boxShadow: '0 0 50px rgba(0, 242, 254, 0.2)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            marginBottom: '64px',
            background: 'linear-gradient(135deg, rgba(14, 26, 52, 0.8) 0%, rgba(7, 13, 26, 0.9) 100%)',
          }}
        >
          <div>
            <div className="badge-runic" style={{ marginBottom: '10px' }}>
              <span>ᛏ Open Midgard Channel</span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-mythic)',
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                color: '#ffffff',
                marginBottom: '8px',
                letterSpacing: '0.04em',
              }}
            >
              Ready To Call Upon The Thunder?
            </h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)' }}>
              No matter how dark the clouds appear, Thor stands ready to listen.
            </p>
          </div>

          <button
            onClick={onSummonThor}
            className="btn-electric"
            style={{ padding: '16px 36px', fontSize: '1rem' }}
          >
            <Zap size={20} fill="#00f2fe" color="#00f2fe" />
            <span>Summon Thor Now</span>
          </button>
        </div>

        {/* Footer Meta Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
            marginBottom: '50px',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img
                src="/assets/thor-avatar.jpg"
                alt="Thor"
                style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                THOR · MIDGARD
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>
              An interactive mythological superhero experience &amp; conversational AI guardian built for the White Matrix Assignment Submission.
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Original interpretation rooted in public-domain Norse mythology.
            </div>
          </div>

          {/* Assignment Submission Details */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.95rem',
                color: 'var(--gold-asgard)',
                marginBottom: '16px',
                letterSpacing: '0.08em',
              }}
            >
              Prepared For
            </h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontWeight: 600, color: '#ffffff' }}>White Matrix Assignment Submission</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="var(--cyan-core)" />
                <span>+91 88 91 67 61 43</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="var(--cyan-core)" />
                <a href="mailto:harikrishnankanjingattu2005@gmail.com" style={{ color: 'var(--cyan-core)', textDecoration: 'none', wordBreak: 'break-all' }}>harikrishnankanjingattu2005@gmail.com</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={14} color="var(--cyan-core)" />
                <span>www.whitematrix.co.in</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.95rem',
                color: 'var(--cyan-core)',
                marginBottom: '16px',
                letterSpacing: '0.08em',
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <a href="#hero" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>
                  Top / The Descent
                </a>
              </li>
              <li>
                <a href="#lore" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>
                  Origin Lore
                </a>
              </li>
              <li>
                <a href="#powers" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>
                  Powers &amp; Mjölnir
                </a>
              </li>
              <li>
                <a href="#mission" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>
                  The Mission
                </a>
              </li>
              <li>
                <a href="#personality" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>
                  Voice &amp; Personality
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Back to Top */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            &copy; 2026 Thor Guardian Platform. All rights reserved. Norse Mythology Public Domain Creative Work.
          </div>

          <button
            onClick={scrollToTop}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: 'var(--cyan-core)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mythic)',
              fontSize: '0.78rem',
            }}
          >
            <span>Return to Skies</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
