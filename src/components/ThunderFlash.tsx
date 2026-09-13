import React, { useEffect } from 'react';
import { soundManager } from '../utils/audio';

interface ThunderFlashProps {
  active: boolean;
  onComplete: () => void;
}

export const ThunderFlash: React.FC<ThunderFlashProps> = ({ active, onComplete }) => {
  useEffect(() => {
    if (active) {
      soundManager.playThunder();
      const timer = setTimeout(() => {
        onComplete();
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div
      className="thunder-crack-overlay thunder-crack-active"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    />
  );
};
