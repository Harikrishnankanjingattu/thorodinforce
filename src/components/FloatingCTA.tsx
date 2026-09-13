import React from 'react';
import { Zap } from 'lucide-react';

interface FloatingCTAProps {
  onSummonThor: () => void;
  isChatOpen: boolean;
}

export const FloatingCTA: React.FC<FloatingCTAProps> = ({ onSummonThor, isChatOpen }) => {
  if (isChatOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 900,
      }}
    >
      <button
        onClick={onSummonThor}
        className="btn-electric"
        style={{
          padding: '16px 26px',
          borderRadius: '50px',
          boxShadow: '0 0 25px rgba(0, 242, 254, 0.6), 0 0 50px rgba(157, 78, 221, 0.3)',
          animation: 'electricPulse 2.5s infinite ease-in-out',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '2px solid #00f2fe',
        }}
        id="persistent-summon-cta"
        aria-label="Summon Thor to open conversational AI guardian"
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Zap size={22} fill="#00f2fe" color="#00f2fe" />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.1em' }}>
            SUMMON THOR
          </div>
          <div style={{ fontSize: '0.65rem', color: '#ccefff', letterSpacing: '0.04em', fontFamily: 'var(--font-sans)', textTransform: 'none' }}>
            Need help? Talk to me
          </div>
        </div>
      </button>
    </div>
  );
};
