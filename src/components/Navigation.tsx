import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { Volume2, VolumeX, Menu, X, User as UserIcon, LogOut, ExternalLink, MessageSquare, BookOpen } from 'lucide-react';

interface NavigationProps {
  onOpenStory?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenStory }) => {
  const { user, loginWithGoogle, logout } = useAuth();
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playRunicChime();
    }
  };

  const navLinks = [
    { label: 'Origin Lore', href: '#lore' },
    { label: 'Powers & Mjölnir', href: '#powers' },
    { label: 'The Mission', href: '#mission' },
    { label: 'Voice & Creed', href: '#personality' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(5, 9, 18, 0.75)',
        borderBottom: '1px solid rgba(0, 242, 254, 0.15)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Logo / Brand */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0b1f47 0%, #00d2ff 100%)',
              padding: '2px',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src="/assets/thor-avatar.jpg"
              alt="Thor Avatar"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mythic)',
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '0.1em',
                color: '#ffffff',
                lineHeight: 1.1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              THOR
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(0, 242, 254, 0.15)',
                  border: '1px solid rgba(0, 242, 254, 0.4)',
                  color: 'var(--cyan-core)',
                  letterSpacing: '0.08em',
                }}
              >
                NORSE
              </span>
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
              }}
            >
              God of Thunder
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '28px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                transition: 'all var(--transition-fast)',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--cyan-core)';
                e.currentTarget.style.textShadow = '0 0 10px rgba(0, 242, 254, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions (Google Auth + Sound toggle + Mobile menu) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Google Auth Status / Button */}
          {user ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '10px',
                background: 'rgba(0, 242, 254, 0.1)',
                border: '1px solid var(--cyan-core)',
                boxShadow: '0 0 12px rgba(0, 242, 254, 0.25)',
              }}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid var(--cyan-core)',
                  }}
                />
              ) : (
                <UserIcon size={16} color="var(--cyan-core)" />
              )}
              <span
                style={{
                  fontSize: '0.80rem',
                  fontFamily: 'var(--font-mythic)',
                  color: '#ffffff',
                  fontWeight: 700,
                  maxWidth: '90px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.displayName?.split(' ')[0] || 'Warrior'}
              </span>
              <button
                onClick={() => logout()}
                title="Sign Out"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginWithGoogle()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: '#000000',
                border: '1px solid var(--cyan-core)',
                color: '#ffffff',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(0, 242, 254, 0.2)',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign In</span>
            </button>
          )}

          {/* Story of Thor Button */}
          {onOpenStory && (
            <button
              onClick={onOpenStory}
              title="The Sagas of Thor - Chronicles & Voice Recitation"
              className="brutal-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: 'rgba(0, 242, 254, 0.12)',
                border: '2px solid var(--cyan-core)',
                color: '#ffffff',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '3px 3px 0px #00f2fe',
                transition: 'all 0.15s ease',
              }}
            >
              <BookOpen size={14} color="var(--cyan-core)" />
              <span>Story of Thor</span>
            </button>
          )}

          {/* Dedicated Chat Window Launcher */}
          <a
            href="/chat"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Dedicated Thor Chat Window"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              background: '#000000',
              border: '1px solid var(--cyan-core)',
              color: 'var(--cyan-core)',
              fontFamily: 'var(--font-mythic)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textDecoration: 'none',
              boxShadow: '0 0 14px rgba(0, 242, 254, 0.25)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 242, 254, 0.6)';
              e.currentTarget.style.background = 'rgba(0, 242, 254, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 14px rgba(0, 242, 254, 0.25)';
              e.currentTarget.style.background = '#000000';
            }}
          >
            <MessageSquare size={14} color="var(--cyan-core)" />
            <span>Chat Window</span>
            <ExternalLink size={12} color="var(--cyan-core)" />
          </a>

          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Thunder & Chimes' : 'Mute Sounds'}
            style={{
              background: 'rgba(15, 26, 52, 0.6)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '10px',
              color: isMuted ? 'var(--text-muted)' : 'var(--cyan-core)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: isMuted ? 'none' : '0 0 12px rgba(0, 242, 254, 0.25)',
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '8px',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'rgba(6, 11, 23, 0.96)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-mythic)',
                fontSize: '1rem',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/chat"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-mythic)',
              fontSize: '1rem',
              color: 'var(--cyan-core)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              padding: '10px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(0, 242, 254, 0.2)',
              marginTop: '6px',
            }}
          >
            <span>Open Chat Window</span>
            <ExternalLink size={16} />
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
