import React, { useState, useEffect } from 'react';
import { StormCanvas } from './components/StormCanvas';
import { ThunderFlash } from './components/ThunderFlash';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { OriginStorySection } from './components/OriginStorySection';
import { PowersSection } from './components/PowersSection';
import { MissionSection } from './components/MissionSection';
import { PersonalitySection } from './components/PersonalitySection';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { DedicatedChatWindow } from './components/DedicatedChatWindow';
import { FloatingCTA } from './components/FloatingCTA';
import { EmailInspectorModal, type DispatchData } from './components/EmailInspectorModal';
import { ThorStoryModal } from './components/ThorStoryModal';
import { soundManager } from './utils/audio';
import { MailCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [thunderActive, setThunderActive] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(false);
  const [inspectorData, setInspectorData] = useState<DispatchData | null>(null);
  const [storyModalOpen, setStoryModalOpen] = useState<boolean>(false);

  const isDedicatedChat =
    typeof window !== 'undefined' &&
    (window.location.pathname === '/chat' ||
      window.location.pathname.startsWith('/chat') ||
      window.location.search.includes('chat=window'));

  // Initial page-load lightning intro flash (PRD requirement 17)
  useEffect(() => {
    if (isDedicatedChat) return;

    const timer = setTimeout(() => {
      setThunderActive(true);
    }, 400);

    // Auto-open chatbot after 3.5 seconds if not yet opened (PRD requirement B1)
    const autoOpenTimer = setTimeout(() => {
      setIsChatOpen((prev) => {
        if (!prev) {
          soundManager.playRunicChime();
          return true;
        }
        return prev;
      });
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoOpenTimer);
    };
  }, [isDedicatedChat]);

  const handleSummonThor = () => {
    setThunderActive(true);
    setIsChatOpen(true);
    window.dispatchEvent(new CustomEvent('thor:summon'));
  };

  const handleOpenInspector = (data: DispatchData) => {
    setInspectorData(data);
    setInspectorOpen(true);
  };

  if (isDedicatedChat) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000000' }}>
        <StormCanvas />
        <DedicatedChatWindow
          onOpenInspector={handleOpenInspector}
          onBackToHome={() => {
            window.location.href = '/';
          }}
        />
        <EmailInspectorModal
          isOpen={inspectorOpen}
          data={inspectorData}
          onClose={() => setInspectorOpen(false)}
        />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-abyss)' }}>
      {/* Background Interactive Storm Engine */}
      <StormCanvas />


      {/* Lightning Flash Overlay */}
      <ThunderFlash
        active={thunderActive}
        onComplete={() => setThunderActive(false)}
      />

      {/* Top Navigation */}
      <Navigation onOpenStory={() => setStoryModalOpen(true)} />

      {/* Main Content Sections */}
      <main>
        <HeroSection
          onSummonThor={handleSummonThor}
          onOpenStory={() => setStoryModalOpen(true)}
        />

        <div className="section-divider" />

        <OriginStorySection onOpenStory={() => setStoryModalOpen(true)} />

        <div className="section-divider" />

        <PowersSection />

        <div className="section-divider" />

        <MissionSection onSummonThor={handleSummonThor} />

        <div className="section-divider" />

        <PersonalitySection />
      </main>

      {/* Footer */}
      <Footer onSummonThor={handleSummonThor} />

      {/* Persistent Floating CTA */}
      <FloatingCTA onSummonThor={handleSummonThor} isChatOpen={isChatOpen} />

      {/* Conversational Chatbot Widget */}
      <Chatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenInspector={handleOpenInspector}
      />

      {/* The Sagas of Thor Modal */}
      <ThorStoryModal
        isOpen={storyModalOpen}
        onClose={() => setStoryModalOpen(false)}
      />

      {/* Evaluator Email Inspector Modal */}
      <EmailInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        data={inspectorData}
      />

      {/* Floating Evaluator Inspector Quick-Access Button if a submission exists */}
      {inspectorData && !inspectorOpen && (
        <button
          onClick={() => setInspectorOpen(true)}
          title="Review latest dispatched notification email"
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '28px',
            zIndex: 950,
            background: 'rgba(11, 22, 44, 0.9)',
            border: '1px solid var(--cyan-core)',
            borderRadius: '30px',
            padding: '10px 18px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mythic)',
            fontSize: '0.8rem',
            backdropFilter: 'blur(10px)',
          }}
        >
          <MailCheck size={16} color="var(--cyan-core)" />
          <span>Inspect Latest Dispatch</span>
        </button>
      )}
    </div>
  );
};

export default App;
