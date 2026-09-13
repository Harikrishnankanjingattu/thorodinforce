import React, { useState, useEffect } from 'react';
import { BookOpen, X, Volume2, Square, Sparkles, Shield, Zap, Flame, Crown } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ThorStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThorStoryModal: React.FC<ThorStoryModalProps> = ({ isOpen, onClose }) => {
  const [activeSaga, setActiveSaga] = useState<number>(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 640;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  const sagas = [
    {
      id: 0,
      runic: 'ᚲ // SAGA_01',
      title: 'The Celestial Prince of Asgard',
      subtitle: 'Cosmic Royalty & Detachment',
      icon: Crown,
      summary:
        'Born son of the Allfather Odin and the Earth Mother Jörð, Thor was cradled by cosmic tempests. In the golden hall of Bilskirnir, thunder was treated as mere royal sport.',
      fullText:
        'In the dawn of the Nine Realms, Thor walked the golden parapets of Asgard untouchable and proud. Born of Odin’s celestial will and Jörð’s ancient terrestrial soil, his veins crackled with primordial lightning. To the gods, mortal lives upon Midgard were fleeting as sparks from a campfire, drifting into the cold void. For centuries, Thor revelled in celestial hunts and feast-halls, deaf to the silent prayers rising through the stars.',
      quote: '“We drank the mead of eternity while mortals below trembled beneath our careless squalls.”',
      speech:
        'Hear the truth of my youth, mortal. In the golden halls of Asgard, I was prince of storms, but blind to the suffering of those below. I believed godhood was glory and feast. I was a child of thunder who had not yet found his heart.',
    },
    {
      id: 1,
      runic: 'ᚺ // SAGA_02',
      title: 'The Forging of Mjölnir',
      subtitle: 'Heart of a Dying Star',
      icon: Flame,
      summary:
        'Crafted in the subterranean fires of Nidavellir by the dwarven smiths Brokkr and Sindri. Flawed in handle, yet unmatched in cosmic devastation.',
      fullText:
        'Deep within the subterranean magma forges of Nidavellir, the dwarf masters Brokkr and Sindri trapped the burning core of a dying white dwarf star inside enchanted Uru metal. Loki, plotting mischief, stung Brokkr’s eyes as a fly, causing the bellows to falter—leaving the handle short. Yet when Thor raised the hammer, lightning arced across the cosmos. It was so dense that none without divine unyielding will could lift it from the earth.',
      quote: '“Whosoever holds this hammer, if they be worthy, shall possess the fury of the storm.”',
      speech:
        'Mjölnir was forged in the fire of a collapsing star. Its handle was shortened by Loki’s malice, yet its weight can crush mountain ranges and channel the infinite atmospheric fury of the cosmos. Only the steadfast and worthy may command it.',
    },
    {
      id: 2,
      runic: 'ᚱ // SAGA_03',
      title: 'The North Sea Cataclysm',
      subtitle: 'The Fall of Godly Vanity',
      icon: Zap,
      summary:
        'The turning of an immortal soul. Watching a fishing fleet torn apart in Midgard’s violent sea squall while holding the power to still the winds.',
      fullText:
        'The crucible came upon the North Sea of Midgard. Riding the gale above the clouds, Thor gazed downward and witnessed a mortal fishing fleet shattered by towering black waves. He saw fathers binding their sons to sinking timber, mothers weeping into the spray. Thor possessed the command to banish the storm with a flick of his wrist—yet he had delayed, consumed by regal apathy. In that terrible hour, his divine vanity collapsed beneath the screams of drowning mortals.',
      quote: '“The cry of a child in the gale broke through my golden armor and pierced my immortal core.”',
      speech:
        'Upon the North Sea, I watched mortals perish in a storm I could have silenced with a breath. In that hour, my vanity burned away. I learned that power without compassion is the mark of a monster, not a god.',
    },
    {
      id: 3,
      runic: 'ᛏ // SAGA_04',
      title: 'The Guardian’s Covenant',
      subtitle: 'Sanctuary for the Weary',
      icon: Shield,
      summary:
        'Thor’s voluntary exile to Earth. Casting aside Asgard’s feasts to be the shield against Ultron, cosmic desolation, and mortal grief.',
      fullText:
        'Thor descended to Midgard, refusing the throne of Asgard. He cast his divine boots upon the mud and cobblestones of Earth, swearing an unyielding oath: where darkness gathers, where Ultron’s metallic legion marches, where mortals weep in grief, Thor shall be the anvil upon which despair is broken. His lightning is no longer a weapon of conquest, but a celestial beacon of refuge.',
      quote: '“No tempest lasts forever. Stand behind my shield, mortal—you shall not weather this alone.”',
      speech:
        'Now I walk the soil of Midgard as your shield. Whether you face the cold machine wrath of Ultron, or the quiet storms of your own soul, remember this: Thor stands with you. Fear no thunder, for it is my promise of dawn.',
    },
  ];

  const current = sagas[activeSaga];
  const Icon = current.icon;

  const handleSpeakSaga = () => {
    if (isPlayingVoice) {
      soundManager.stopThorSpeech();
      setIsPlayingVoice(false);
      return;
    }

    soundManager.playThunder();
    soundManager.speakThor(
      current.speech,
      () => setIsPlayingVoice(true),
      () => setIsPlayingVoice(false)
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          background: 'rgba(2, 7, 18, 0.94)',
          backdropFilter: 'blur(24px)',
          border: '2px solid var(--cyan-core)',
          boxShadow: '6px 6px 0px #00f2fe, 0 0 40px rgba(0, 242, 254, 0.35)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Brutalist Banner */}
        <div
          style={{
            padding: '16px 22px',
            background: 'linear-gradient(90deg, #000000 0%, #031428 100%)',
            borderBottom: '2px solid var(--cyan-core)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'var(--cyan-core)',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                fontWeight: 900,
                boxShadow: '2px 2px 0px #ffffff',
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mythic)', fontSize: '1rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.06em' }}>
                THE CHRONICLES OF THOR
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--cyan-core)', letterSpacing: '0.05em' }}>
                // ASGARDIAN MYTHOLOGY & MORTAL COVENANT //
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.stopThorSpeech();
              setIsPlayingVoice(false);
              onClose();
            }}
            style={{
              width: '32px',
              height: '32px',
              background: '#000000',
              border: '1.5px solid var(--cyan-core)',
              color: 'var(--cyan-core)',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '2px 2px 0px var(--cyan-core)',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Saga Tabs Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: isMobile ? '8px 12px' : '12px 18px',
            background: 'rgba(0, 0, 0, 0.6)',
            borderBottom: '1px solid rgba(0, 242, 254, 0.2)',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {sagas.map((s, idx) => {
            const isSelected = activeSaga === idx;
            return (
              <button
                key={s.id}
                onClick={() => {
                  soundManager.stopThorSpeech();
                  setIsPlayingVoice(false);
                  setActiveSaga(idx);
                  soundManager.playRunicChime();
                }}
                style={{
                  background: isSelected ? 'var(--cyan-core)' : '#020712',
                  border: isSelected ? '2px solid #ffffff' : '1px solid rgba(0, 242, 254, 0.3)',
                  boxShadow: isSelected ? '3px 3px 0px #00f2fe' : 'none',
                  color: isSelected ? '#000000' : 'var(--text-secondary)',
                  padding: isMobile ? '6px 10px' : '8px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  transition: 'all 0.15s ease',
                  flex: isMobile ? 'none' : 1,
                  minWidth: isMobile ? '120px' : undefined,
                }}
              >
                <span style={{ fontSize: '0.62rem', fontWeight: 800, fontFamily: 'var(--font-mythic)' }}>
                  {s.runic}
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Saga Content Stage */}
        <div
          style={{
            padding: '24px 26px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            flex: 1,
          }}
        >
          {/* Chapter Header */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'flex-start', justifyContent: 'space-between', gap: isMobile ? '12px' : '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '14px' }}>
              <div
                style={{
                  width: isMobile ? '40px' : '52px',
                  height: isMobile ? '40px' : '52px',
                  borderRadius: '12px',
                  background: 'rgba(0, 242, 254, 0.12)',
                  border: '2px solid var(--cyan-core)',
                  boxShadow: '3px 3px 0px var(--cyan-core)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cyan-core)',
                  flexShrink: 0,
                }}
              >
                <Icon size={isMobile ? 20 : 26} />
              </div>
              <div>
                <div style={{ fontSize: '0.70rem', color: 'var(--cyan-core)', fontFamily: 'var(--font-mythic)', fontWeight: 800 }}>
                  {current.runic} · CHRONICLE
                </div>
                <h3 style={{ fontFamily: 'var(--font-mythic)', fontSize: isMobile ? '1.1rem' : '1.3rem', color: '#ffffff', margin: '2px 0 0 0', fontWeight: 900 }}>
                  {current.title}
                </h3>
                <div style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
                  {current.subtitle}
                </div>
              </div>
            </div>

            {/* Recite Audio Button */}
            <button
              onClick={handleSpeakSaga}
              style={{
                background: isPlayingVoice ? 'var(--cyan-core)' : '#000000',
                border: '2px solid var(--cyan-core)',
                boxShadow: isPlayingVoice ? '0 0 20px var(--cyan-core)' : '3px 3px 0px var(--cyan-core)',
                color: isPlayingVoice ? '#000000' : 'var(--cyan-core)',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.80rem',
                fontWeight: 800,
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                flexShrink: 0,
                width: isMobile ? '100%' : 'auto',
                transition: 'all 0.2s ease',
              }}
            >
              {isPlayingVoice ? (
                <>
                  <Square size={13} fill="currentColor" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 size={14} />
                  <span>Hear Thor Recite</span>
                </>
              )}
            </button>
          </div>

          {/* Saga Full Text */}
          <div
            style={{
              padding: '18px 20px',
              background: 'rgba(0, 0, 0, 0.7)',
              border: '1.5px solid rgba(0, 242, 254, 0.3)',
              borderRadius: '12px',
              fontSize: '0.94rem',
              lineHeight: 1.7,
              color: '#dff0fa',
              boxShadow: 'inset 0 1px 0 rgba(0, 242, 254, 0.1)',
            }}
          >
            {current.fullText}
          </div>

          {/* Mythic Quote Callout */}
          <div
            style={{
              padding: '14px 18px',
              background: 'rgba(0, 242, 254, 0.06)',
              borderLeft: '4px solid var(--cyan-core)',
              borderTop: '1px solid rgba(0, 242, 254, 0.2)',
              borderRight: '1px solid rgba(0, 242, 254, 0.2)',
              borderBottom: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: '0 10px 10px 0',
              fontStyle: 'italic',
              fontSize: '0.88rem',
              color: 'var(--cyan-core)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Sparkles size={16} color="var(--cyan-core)" style={{ flexShrink: 0 }} />
            <span>{current.quote}</span>
          </div>
        </div>

        {/* Footer Controls */}
        <div
          style={{
            padding: '12px 22px',
            background: '#000000',
            borderTop: '1px solid rgba(0, 242, 254, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Norse Mythological Saga · Studio Neural Voice
          </div>
          <button
            onClick={() => {
              soundManager.stopThorSpeech();
              setIsPlayingVoice(false);
              onClose();
            }}
            className="brutal-btn"
            style={{ padding: '6px 16px', fontSize: '0.78rem' }}
          >
            Return to Sanctuary
          </button>
        </div>
      </div>
    </div>
  );
};
