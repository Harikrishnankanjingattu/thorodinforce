import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';
import type { DispatchData } from './EmailInspectorModal';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Send,
  Zap,
  RotateCcw,
  Eye,
  CheckCircle2,
  Key,
  Cpu,
  Radio,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  Volume2,
  VolumeX,
  Square,
  ArrowLeft,
  Activity,
  Compass,
  X,
  BookOpen,
} from 'lucide-react';
import { ThorStoryModal } from './ThorStoryModal';

interface ChatMessage {
  id: string;
  sender: 'thor' | 'visitor';
  text: string;
  timestamp: string;
  isAi?: boolean;
  model?: string;
}

interface DedicatedChatWindowProps {
  onOpenInspector: (data: DispatchData) => void;
  onBackToHome?: () => void;
}

export const DedicatedChatWindow: React.FC<DedicatedChatWindowProps> = ({
  onOpenInspector,
  onBackToHome,
}) => {
  const { user, loading: authLoading, loginWithGoogle, logout } = useAuth();
  const [guestBypass, setGuestBypass] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Thor Voice Engine State
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(!soundManager.getIsVoiceMuted());
  const [isThorSpeaking, setIsThorSpeaking] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showBeaconDrawer, setShowBeaconDrawer] = useState<boolean>(false);
  const [showStoryModal, setShowStoryModal] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });
  const [mobileTab, setMobileTab] = useState<'chat' | 'telemetry'>('chat');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // NVIDIA API Key state
  const defaultKey = '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';
  const [nvidiaKey, setNvidiaKey] = useState<string>(defaultKey);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [tempKeyInput, setTempKeyInput] = useState<string>(defaultKey);

  // Beacon / Grievance form data
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    email: '',
    urgency: 'Medium (Rising Gale)',
    grievance: '',
  });

  const [lastDispatch, setLastDispatch] = useState<DispatchData | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isAiThinking, isThorSpeaking]);

  // Sync authenticated user info to form data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isTyping && !showBeaconDrawer && !showKeyModal && (user || guestBypass)) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isTyping, showBeaconDrawer, showKeyModal, user, guestBypass]);

  // Load state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('thor_nvidia_key');
      if (storedKey) {
        setNvidiaKey(storedKey);
        setTempKeyInput(storedKey);
      }
    }

    const savedChat = sessionStorage.getItem('thor_chat_session');
    const savedData = sessionStorage.getItem('thor_chat_data');
    const savedLastDispatch = sessionStorage.getItem('thor_last_dispatch');

    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          initInitialGreeting();
        }
      } catch {
        initInitialGreeting();
      }
    } else {
      initInitialGreeting();
    }

    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch {}
    }

    if (savedLastDispatch) {
      try {
        setLastDispatch(JSON.parse(savedLastDispatch));
      } catch {}
    }
  }, [user]);

  // Save state
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('thor_chat_session', JSON.stringify(messages));
      sessionStorage.setItem('thor_chat_data', JSON.stringify(formData));
    }
  }, [messages, formData]);

  useEffect(() => {
    if (lastDispatch) {
      sessionStorage.setItem('thor_last_dispatch', JSON.stringify(lastDispatch));
    }
  }, [lastDispatch]);

  const initInitialGreeting = () => {
    const callerName = user?.displayName ? `${user.displayName}` : 'mortal';
    const greetingText = `Hail, ${callerName}! I am Thor, the Norse God of Thunder and sworn guardian of Midgard.\n\nI have descended from the golden halls of Asgard to stand alongside those weathering life's storms. Speak to me freely in this celestial chamber — ask of the skies, my hammer Mjölnir, or share whatever burden weighs upon your heart.`;

    const greeting: ChatMessage = {
      id: 'greeting-' + Date.now(),
      sender: 'thor',
      text: greetingText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAi: true,
      model: 'openai/gpt-oss-20b',
    };
    setMessages([greeting]);
  };

  const handlePlayMessageVoice = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      soundManager.stopThorSpeech();
      setIsThorSpeaking(false);
      setSpeakingMessageId(null);
    } else {
      soundManager.stopThorSpeech();
      soundManager.speakThor(
        text,
        () => {
          setIsThorSpeaking(true);
          setSpeakingMessageId(msgId);
        },
        () => {
          setIsThorSpeaking(false);
          setSpeakingMessageId(null);
        }
      );
    }
  };

  const handleToggleVoice = () => {
    const muted = soundManager.toggleVoice();
    setIsVoiceEnabled(!muted);
    if (muted) {
      setIsThorSpeaking(false);
      setSpeakingMessageId(null);
    } else {
      soundManager.playRunicChime();
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setAuthError(null);
      soundManager.playRunicChime();
      const loggedUser = await loginWithGoogle();
      setIsLoggingIn(false);

      const welcomeText = `⚡ Celestial Authentication Verified! Welcome, ${loggedUser.displayName || 'warrior'}. Your Google credentials (${loggedUser.email}) are linked with Asgard. What storm can Thor help you weather today?`;

      const welcomeMsg: ChatMessage = {
        id: 'auth-success-' + Date.now(),
        sender: 'thor',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: true,
      };
      setMessages((prev) => [...prev, welcomeMsg]);

      if (isVoiceEnabled) {
        soundManager.speakThor(
          welcomeText,
          () => {
            setIsThorSpeaking(true);
            setSpeakingMessageId(welcomeMsg.id);
          },
          () => {
            setIsThorSpeaking(false);
            setSpeakingMessageId(null);
          }
        );
      }
    } catch (err: unknown) {
      setIsLoggingIn(false);
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Google login issue:', msg);
      if (msg.includes('popup-closed-by-user')) {
        setAuthError('Sign-in window was closed. Tap below to retry.');
      } else {
        setAuthError('Sign-in attempt encountered static. You may retry or continue as guest.');
      }
    }
  };

  const handleSaveNvidiaKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = tempKeyInput.trim();
    setNvidiaKey(cleanKey);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thor_nvidia_key', cleanKey);
    }
    setShowKeyModal(false);
    soundManager.playRunicChime();

    const keyConfirmedMsg: ChatMessage = {
      id: 'key-confirmed-' + Date.now(),
      sender: 'thor',
      text: cleanKey
        ? '⚡ NVIDIA NIM AI Neural Link Connected! Thor is thinking with high-speed neural cognition.'
        : 'NVIDIA API key cleared. Thor continues with native Asgardian instincts.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAi: true,
    };
    setMessages((prev) => [...prev, keyConfirmedMsg]);
  };

  const handleResetConversation = () => {
    soundManager.stopThorSpeech();
    setIsThorSpeaking(false);
    setSpeakingMessageId(null);

    sessionStorage.removeItem('thor_chat_session');
    sessionStorage.removeItem('thor_chat_data');
    sessionStorage.removeItem('thor_last_dispatch');
    setFormData({
      name: user?.displayName || '',
      age: '',
      location: '',
      email: user?.email || '',
      urgency: 'Medium (Rising Gale)',
      grievance: '',
    });
    setLastDispatch(null);
    setInputValue('');
    setIsTyping(false);
    setIsAiThinking(false);
    setIsSubmitting(false);
    setShowBeaconDrawer(false);
    initInitialGreeting();
    soundManager.playRunicChime();
  };

  const fetchNvidiaAiResponse = async (
    conversationHistory: ChatMessage[],
    userText: string
  ): Promise<{ text: string; isAi: boolean; model?: string }> => {
    try {
      setIsAiThinking(true);
      const callerContext = user?.displayName
        ? `The mortal speaking to you is verified as ${user.displayName} (email: ${user.email}). Address them warmly by name when fitting.`
        : 'The mortal speaking to you has not identified themselves yet.';

      const apiMessages = [
        {
          role: 'system' as const,
          content: `You are Thor, Norse God of Thunder and protector of mortals. ${callerContext} Speak with booming warmth, deep masculine authority, and empathy. Keep answers to 2-4 sentences.`,
        },
        ...conversationHistory.slice(-10).map((m) => ({
          role: m.sender === 'thor' ? ('assistant' as const) : ('user' as const),
          content: m.text,
        })),
        { role: 'user' as const, content: userText },
      ];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          apiKey: nvidiaKey || defaultKey,
        }),
      });

      const data = await res.json().catch(() => null);
      setIsAiThinking(false);

      if (data && data.message) {
        return {
          text: data.message,
          isAi: data.isAi ?? true,
          model: data.model || 'openai/gpt-oss-20b',
        };
      }
    } catch (err) {
      console.error('NVIDIA fetch error:', err);
    }

    setIsAiThinking(false);
    return {
      text: "The storm winds rage fiercely, mortal. Speak your truth freely — Thor stands with you against any tempest.",
      isAi: false,
    };
  };

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputValue).trim();
    if (!text || isTyping || isAiThinking) return;

    if (!customText) {
      setInputValue('');
    }

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'visitor',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    soundManager.playMessageSpark();

    const aiResp = await fetchNvidiaAiResponse(newHistory, text);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const thorMsg: ChatMessage = {
        id: 'thor-' + Date.now(),
        sender: 'thor',
        text: aiResp.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: aiResp.isAi,
        model: aiResp.model,
      };
      setMessages((prev) => [...prev, thorMsg]);
      soundManager.playMessageSpark();

      if (isVoiceEnabled) {
        soundManager.speakThor(
          thorMsg.text,
          () => {
            setIsThorSpeaking(true);
            setSpeakingMessageId(thorMsg.id);
          },
          () => {
            setIsThorSpeaking(false);
            setSpeakingMessageId(null);
          }
        );
      }
    }, 300);
  };

  const handleDispatchBeacon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.grievance.trim()) {
      alert('Please provide at least your Name, Email, and Grievance so the courier can find you.');
      return;
    }

    setIsSubmitting(true);
    const submittedAt = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const payload: DispatchData = {
      name: formData.name,
      age: formData.age || 'Unspecified',
      location: formData.location || 'Midgard',
      email: formData.email,
      urgency: formData.urgency,
      grievance: formData.grievance,
      submittedAt,
      status: 'sent',
      deliveryMode: 'Vercel / SMTP Cloud Dispatch',
    };

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);

      if (data && data.status) {
        payload.status = data.status;
        if (data.deliveryMode) payload.deliveryMode = data.deliveryMode;
      }
    } catch {
      payload.status = 'simulated';
      payload.deliveryMode = 'Simulated Dispatch (Dev Mode)';
    }

    setLastDispatch(payload);
    setIsSubmitting(false);
    setShowBeaconDrawer(false);

    const dispatchText = `⚡ BEACON RECEIVED: Fear not, ${formData.name}! Your grievance regarding "${formData.grievance.slice(
      0,
      60
    )}..." has been cataloged. A raven courier has dispatched your distress signal directly to the candidate's alter-ego inbox!\n\nI am already en route. Stay steadfast!`;

    const dispatchMsg: ChatMessage = {
      id: 'thor-dispatch-' + Date.now(),
      sender: 'thor',
      text: dispatchText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAi: true,
      model: 'openai/gpt-oss-20b',
    };
    setMessages((prev) => [...prev, dispatchMsg]);
    soundManager.playThunder();

    if (isVoiceEnabled) {
      soundManager.speakThor(
        dispatchText,
        () => {
          setIsThorSpeaking(true);
          setSpeakingMessageId(dispatchMsg.id);
        },
        () => {
          setIsThorSpeaking(false);
          setSpeakingMessageId(null);
        }
      );
    }

    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#00f2fe', '#00d2ff', '#ffffff'],
      });
    } catch {}
  };

  const showAuthGate = !user && !guestBypass && !authLoading;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          minHeight: isMobile ? '60px' : '74px',
          padding: isMobile ? '8px 12px' : '0 24px',
          background: 'linear-gradient(180deg, #020714 0%, #000000 100%)',
          borderBottom: '2px solid var(--cyan-core)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.9)',
          gap: isMobile ? '6px' : '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              title="Return to Home Sanctuary"
              style={{
                background: 'rgba(0, 242, 254, 0.1)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                color: 'var(--cyan-core)',
                padding: isMobile ? '6px 8px' : '8px 14px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-mythic)',
                fontSize: isMobile ? '0.72rem' : '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowLeft size={isMobile ? 14 : 16} />
              {!isMobile && <span>Sanctuary</span>}
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
            <div
              style={{
                position: 'relative',
                width: isMobile ? '36px' : '44px',
                height: isMobile ? '36px' : '44px',
                borderRadius: '10px',
                padding: '2px',
                background: isThorSpeaking
                  ? 'linear-gradient(135deg, #00f2fe 0%, #ffffff 100%)'
                  : 'linear-gradient(135deg, #00f2fe 0%, #0077ff 100%)',
                boxShadow: isThorSpeaking
                  ? '0 0 20px #00f2fe'
                  : '0 0 12px rgba(0, 242, 254, 0.5)',
                flexShrink: 0,
              }}
            >
              <img
                src="/assets/thor-avatar.jpg"
                alt="Thor Avatar"
                style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#00f2fe',
                  border: '1.5px solid #000000',
                  boxShadow: '0 0 8px #00f2fe',
                }}
              />
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontSize: isMobile ? '0.86rem' : '1.15rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  letterSpacing: '0.04em',
                }}
              >
                THOR {isMobile ? 'COMMUNICATOR' : 'CELESTIAL COMMUNICATOR'}
                {!isMobile && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: '#000000',
                      background: 'var(--cyan-core)',
                      padding: '2px 8px',
                      borderRadius: '5px',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 800,
                      boxShadow: '0 0 10px var(--cyan-core)',
                    }}
                  >
                    NVIDIA AI · STUDIO VOICE
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: isMobile ? '0.66rem' : '0.75rem',
                  color: 'var(--cyan-core)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Zap size={10} fill="currentColor" />
                <span>
                  {isThorSpeaking
                    ? '⚡ Speaking...'
                    : user
                    ? (isMobile ? user.displayName?.split(' ')[0] || 'Verified' : `Verified Mortal: ${user.displayName || user.email}`)
                    : 'Relay Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px' }}>
          {/* Studio Voice Toggle */}
          <button
            onClick={handleToggleVoice}
            title={isVoiceEnabled ? 'Thor Kingly Voice: ACTIVE' : 'Thor Kingly Voice: MUTED'}
            style={{
              background: isVoiceEnabled ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: isVoiceEnabled ? '1.5px solid var(--cyan-core)' : '1px solid rgba(0, 242, 254, 0.3)',
              color: isVoiceEnabled ? 'var(--cyan-core)' : 'var(--text-muted)',
              cursor: 'pointer',
              padding: isMobile ? '6px 8px' : '8px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.80rem',
              fontFamily: 'var(--font-mythic)',
              fontWeight: 700,
              boxShadow: isVoiceEnabled ? '0 0 14px rgba(0, 242, 254, 0.4)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {isVoiceEnabled ? <Volume2 size={isMobile ? 14 : 16} /> : <VolumeX size={isMobile ? 14 : 16} />}
            {!isMobile && <span>{isVoiceEnabled ? 'Kingly Voice Active' : 'Voice Muted'}</span>}
          </button>

          {/* Story of Thor Button */}
          <button
            onClick={() => setShowStoryModal(true)}
            title="The Sagas of Thor - Interactive Chronicles & Voice Recitation"
            className="brutal-btn"
            style={{
              background: 'rgba(0, 242, 254, 0.15)',
              border: '2px solid var(--cyan-core)',
              color: '#ffffff',
              cursor: 'pointer',
              padding: isMobile ? '6px 8px' : '8px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.80rem',
              fontFamily: 'var(--font-mythic)',
              fontWeight: 800,
              boxShadow: '2px 2px 0px #00f2fe',
              transition: 'all 0.15s ease',
            }}
          >
            <BookOpen size={isMobile ? 14 : 16} color="var(--cyan-core)" />
            {!isMobile && <span>Story of Thor</span>}
          </button>

          {/* Dispatch Beacon Button */}
          <button
            onClick={() => setShowBeaconDrawer(!showBeaconDrawer)}
            title="Launch Distress Beacon"
            style={{
              background: showBeaconDrawer ? 'var(--cyan-core)' : 'rgba(0, 242, 254, 0.15)',
              border: '1.5px solid var(--cyan-core)',
              color: showBeaconDrawer ? '#000000' : 'var(--cyan-core)',
              cursor: 'pointer',
              padding: isMobile ? '6px 8px' : '8px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.80rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mythic)',
              boxShadow: '0 0 14px rgba(0, 242, 254, 0.3)',
            }}
          >
            <Radio size={isMobile ? 14 : 16} />
            {!isMobile && <span>Dispatch Beacon</span>}
          </button>

          {/* Reset Conversation */}
          <button
            onClick={handleResetConversation}
            title="Start New Conversation"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              color: 'var(--cyan-core)',
              cursor: 'pointer',
              padding: isMobile ? '6px 8px' : '8px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mythic)',
            }}
          >
            <RotateCcw size={isMobile ? 14 : 15} />
            {!isMobile && <span>Clear</span>}
          </button>

          {/* User Auth Profile Badge */}
          {user ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                borderRadius: '10px',
                background: 'rgba(0, 242, 254, 0.1)',
                border: '1px solid var(--cyan-core)',
              }}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <UserIcon size={16} color="var(--cyan-core)" />
              )}
              <span style={{ fontSize: '0.80rem', color: '#ffffff', fontWeight: 700 }}>
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
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: '#000000',
                border: '1.5px solid var(--cyan-core)',
                color: '#ffffff',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.80rem',
                fontWeight: 700,
                cursor: isLoggingIn ? 'wait' : 'pointer',
                boxShadow: '0 0 12px rgba(0, 242, 254, 0.3)',
              }}
            >
              <span>{isLoggingIn ? 'Connecting...' : 'Sign In with Google'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Tab Switcher when on mobile screen */}
      {isMobile && (
        <div
          style={{
            display: 'flex',
            background: '#01050e',
            borderBottom: '2px solid var(--cyan-core)',
            padding: '6px 10px',
            gap: '8px',
            zIndex: 40,
          }}
        >
          <button
            type="button"
            onClick={() => setMobileTab('chat')}
            className="brutal-btn"
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '8px',
              background: mobileTab === 'chat' ? 'var(--cyan-core)' : 'rgba(0, 242, 254, 0.08)',
              color: mobileTab === 'chat' ? '#000000' : 'var(--cyan-core)',
              border: '1.5px solid var(--cyan-core)',
              fontFamily: 'var(--font-mythic)',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: mobileTab === 'chat' ? '2px 2px 0px #00f2fe' : 'none',
            }}
          >
            <Zap size={14} />
            <span>Thor Chat Stage</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('telemetry')}
            className="brutal-btn"
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '8px',
              background: mobileTab === 'telemetry' ? 'var(--cyan-core)' : 'rgba(0, 242, 254, 0.08)',
              color: mobileTab === 'telemetry' ? '#000000' : 'var(--cyan-core)',
              border: '1.5px solid var(--cyan-core)',
              fontFamily: 'var(--font-mythic)',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: mobileTab === 'telemetry' ? '2px 2px 0px #00f2fe' : 'none',
            }}
          >
            <BookOpen size={14} />
            <span>Telemetry &amp; Sagas</span>
          </button>
        </div>
      )}

      {/* Main Workspace (Split Grid on desktop, Tab-switched on mobile) */}
      <div
        style={{
          flex: 1,
          display: isMobile ? 'flex' : 'grid',
          gridTemplateColumns: isMobile ? undefined : '320px 1fr',
          flexDirection: isMobile ? 'column' : undefined,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left Rail: Telemetry & Asgard Telecommunications */}
        {(!isMobile || mobileTab === 'telemetry') && (
          <aside
            style={{
              width: isMobile ? '100%' : '320px',
              flex: isMobile ? 1 : undefined,
              background: 'linear-gradient(180deg, #020612 0%, #000000 100%)',
              borderRight: isMobile ? 'none' : '1px solid rgba(0, 242, 254, 0.25)',
              padding: isMobile ? '16px 14px' : '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              overflowY: 'auto',
            }}
          >
          {/* Large Hero Portrait */}
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1.5px solid var(--cyan-core)',
              boxShadow: '0 0 25px rgba(0, 242, 254, 0.3)',
              aspectRatio: '4/3',
            }}
          >
            <img
              src="/assets/thor-hero.jpg"
              alt="Thor God of Thunder"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.85) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '12px 14px',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mythic)', fontSize: '0.90rem', fontWeight: 800, color: '#ffffff' }}>
                  Thor, God of Thunder
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--cyan-core)' }}>
                  Wielder of Mjölnir · Guardian of Mortals
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Status Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: '#01050e',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Activity size={20} color="var(--cyan-core)" />
              <div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Neural Intelligence
                </div>
                <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700 }}>
                  NVIDIA NIM Active (20B)
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: '#01050e',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Compass size={20} color="var(--cyan-core)" />
              <div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Vocal Synthesis
                </div>
                <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700 }}>
                  Studio Neural Human Voice
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowKeyModal(true)}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid var(--cyan-core)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--cyan-core)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.78rem',
                fontWeight: 700,
                boxShadow: '0 0 10px rgba(0, 242, 254, 0.2)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={16} />
                <span>NVIDIA NIM Key</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#ffffff', opacity: 0.8 }}>Active</span>
            </button>
          </div>

          {/* Sagas of Thor Card */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              background: 'rgba(0, 242, 254, 0.07)',
              border: '2px solid var(--cyan-core)',
              boxShadow: '4px 4px 0px #00f2fe',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <BookOpen size={16} color="var(--cyan-core)" />
              <div style={{ fontFamily: 'var(--font-mythic)', fontSize: '0.84rem', fontWeight: 900, color: '#ffffff' }}>
                The Sagas of Thor
              </div>
            </div>
            <p style={{ fontSize: '0.73rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.4, margin: '0 0 10px 0' }}>
              Read the 4 mythic chapters and listen to Thor's kingly neural voice recite each saga.
            </p>
            <button
              onClick={() => setShowStoryModal(true)}
              className="brutal-btn"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                background: 'var(--cyan-core)',
                border: '2px solid #ffffff',
                color: '#000000',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.78rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '2px 2px 0px #00f2fe',
              }}
            >
              ⚡ Hear Chronicles
            </button>
          </div>

          {/* Quick Beacon Callout */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              background: 'rgba(0, 242, 254, 0.06)',
              border: '1px solid var(--cyan-core)',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Radio size={16} color="var(--cyan-core)" />
              <div style={{ fontFamily: 'var(--font-mythic)', fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>
                Alter-Ego Raven Courier
              </div>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 10px 0' }}>
              Submit a formal distress grievance directly to the candidate's inbox.
            </p>
            <button
              onClick={() => setShowBeaconDrawer(true)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                background: 'var(--cyan-core)',
                border: 'none',
                color: '#000000',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 0 12px var(--cyan-core)',
              }}
            >
              ⚡ Launch Distress Beacon
            </button>
          </div>
        </aside>
        )}

        {/* Right Stage: Spacious Cinema Chat View */}
        {(!isMobile || mobileTab === 'chat') && (
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#000000',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          {/* Quick Prompt Pill Bar */}
          <div
            style={{
              padding: isMobile ? '8px 10px' : '10px 24px',
              background: '#01040a',
              borderBottom: '1px solid rgba(0, 242, 254, 0.2)',
              display: 'flex',
              gap: isMobile ? '6px' : '8px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {[
              '⚡ The Story of Thor',
              'Who are you, Thor?',
              'Tell me the story of Mjölnir',
              'I am struggling with life and feel overwhelmed',
              'Why did you leave Asgard for Midgard?',
              'How can I summon lightning?',
            ].map((pText) => (
              <button
                key={pText}
                onClick={() => handleSendMessage(pText)}
                style={{
                  background: 'rgba(0, 242, 254, 0.08)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  color: 'var(--cyan-core)',
                  fontSize: '0.75rem',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mythic)',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                ⚡ {pText}
              </button>
            ))}
          </div>

          {/* Chat Messages Feed */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: isMobile ? '14px 10px' : '24px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '12px' : '18px',
            }}
          >
            {messages.map((msg) => {
              const isThor = msg.sender === 'thor';
              const isSpeakingThis = speakingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isThor ? 'flex-start' : 'flex-end',
                    maxWidth: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: isMobile ? '8px' : '12px',
                      maxWidth: isMobile ? '95%' : '82%',
                      flexDirection: isThor ? 'row' : 'row-reverse',
                    }}
                  >
                    {isThor && (
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: isSpeakingThis
                            ? '2px solid #ffffff'
                            : '1.5px solid var(--cyan-core)',
                          boxShadow: isSpeakingThis
                            ? '0 0 20px #00f2fe'
                            : '0 0 10px rgba(0, 242, 254, 0.4)',
                        }}
                      >
                        <img
                          src="/assets/thor-avatar.jpg"
                          alt="Thor"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <div
                      className="brutal-glass"
                      style={{
                        padding: '16px 20px',
                        borderRadius: isThor ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                        background: isThor ? 'rgba(2, 7, 20, 0.92)' : 'rgba(0, 30, 60, 0.88)',
                        color: '#ffffff',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: isSpeakingThis
                          ? '2px solid #ffffff'
                          : isThor
                          ? '2px solid rgba(0, 242, 254, 0.55)'
                          : '2px solid var(--cyan-core)',
                        boxShadow: isSpeakingThis
                          ? '4px 4px 0px #00f2fe, 0 0 25px rgba(0, 242, 254, 0.5)'
                          : isThor
                          ? '4px 4px 0px rgba(0, 242, 254, 0.35)'
                          : '4px 4px 0px #00f2fe',
                        fontSize: '1rem',
                        lineHeight: 1.65,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.text}

                      {/* Interactive Thor Story Chronicle Trigger inside message */}
                      {isThor && (msg.text.toLowerCase().includes('saga') || msg.text.toLowerCase().includes('story') || msg.text.toLowerCase().includes('mjölnir') || msg.text.toLowerCase().includes('mjolnir') || msg.text.toLowerCase().includes('asgard')) && (
                        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(0, 242, 254, 0.25)' }}>
                          <button
                            type="button"
                            onClick={() => setShowStoryModal(true)}
                            className="brutal-btn"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: 'rgba(0, 242, 254, 0.15)',
                              border: '1.5px solid var(--cyan-core)',
                              color: 'var(--cyan-core)',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '0.78rem',
                              fontFamily: 'var(--font-mythic)',
                              fontWeight: 800,
                              cursor: 'pointer',
                              boxShadow: '2px 2px 0px #00f2fe',
                            }}
                          >
                            <BookOpen size={13} />
                            <span>📖 Read &amp; Hear The 4 Sagas of Thor</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata and Audio Voice Trigger */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '6px',
                      paddingLeft: isThor ? '48px' : '0',
                      paddingRight: isThor ? '0' : '10px',
                    }}
                  >
                    <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
                      {msg.timestamp}
                    </span>

                    {isThor && (
                      <>
                        <button
                          onClick={() => handlePlayMessageVoice(msg.id, msg.text)}
                          title={isSpeakingThis ? 'Stop Thor Voice' : 'Hear Thor speak in studio neural voice'}
                          style={{
                            background: isSpeakingThis ? 'var(--cyan-core)' : 'rgba(0, 242, 254, 0.12)',
                            border: '1px solid var(--cyan-core)',
                            color: isSpeakingThis ? '#000000' : 'var(--cyan-core)',
                            borderRadius: '8px',
                            padding: '3px 10px',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontFamily: 'var(--font-mythic)',
                            fontWeight: 700,
                            boxShadow: isSpeakingThis ? '0 0 12px #00f2fe' : 'none',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {isSpeakingThis ? (
                            <>
                              <Square size={11} fill="currentColor" />
                              <span>Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={12} />
                              <span>Play Kingly Voice</span>
                            </>
                          )}
                        </button>

                        {isSpeakingThis && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <span
                              style={{
                                width: '3px',
                                height: '12px',
                                background: 'var(--cyan-core)',
                                animation: 'vitalPulse 0.6s infinite 0s',
                              }}
                            />
                            <span
                              style={{
                                width: '3px',
                                height: '18px',
                                background: 'var(--cyan-core)',
                                animation: 'vitalPulse 0.6s infinite 0.2s',
                              }}
                            />
                            <span
                              style={{
                                width: '3px',
                                height: '10px',
                                background: 'var(--cyan-core)',
                                animation: 'vitalPulse 0.6s infinite 0.4s',
                              }}
                            />
                          </div>
                        )}

                        {msg.isAi && (
                          <span style={{ color: 'var(--cyan-core)', fontSize: '0.68rem' }}>
                            ⚡ NVIDIA AI
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Spark Typing / NVIDIA AI Thinking Indicator */}
            {(isTyping || isAiThinking) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '48px' }}>
                <div
                  style={{
                    padding: '12px 20px',
                    borderRadius: '16px',
                    background: '#020714',
                    border: '1px solid var(--cyan-core)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 16px rgba(0, 242, 254, 0.35)',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--cyan-core)',
                      boxShadow: '0 0 10px var(--cyan-core)',
                      animation: 'vitalPulse 1s infinite 0s',
                    }}
                  />
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--cyan-core)',
                      boxShadow: '0 0 10px var(--cyan-core)',
                      animation: 'vitalPulse 1s infinite 0.2s',
                    }}
                  />
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--cyan-core)',
                      boxShadow: '0 0 10px var(--cyan-core)',
                      animation: 'vitalPulse 1s infinite 0.4s',
                    }}
                  />
                  <span style={{ fontSize: '0.84rem', color: 'var(--cyan-core)', marginLeft: '6px' }}>
                    {isAiThinking ? '⚡ Thor is contemplating with neural intelligence...' : 'Thor is speaking...'}
                  </span>
                </div>
              </div>
            )}

            {/* Dispatched Beacon Evaluator Notice */}
            {lastDispatch && (
              <div
                style={{
                  background: 'rgba(0, 242, 254, 0.08)',
                  border: '1.5px solid var(--cyan-core)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 0 25px rgba(0, 242, 254, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--cyan-core)" />
                  <span style={{ fontFamily: 'var(--font-mythic)', fontSize: '0.92rem', color: '#ffffff', fontWeight: 800 }}>
                    Email Dispatched to Candidate Alter-Ego
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  A live notification was dispatched for <strong>{lastDispatch.name}</strong>. Evaluators can inspect the exact formatted transmission:
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => onOpenInspector(lastDispatch)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: 'rgba(0, 242, 254, 0.2)',
                      border: '1.5px solid var(--cyan-core)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-mythic)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 0 14px rgba(0, 242, 254, 0.35)',
                    }}
                  >
                    <Eye size={15} />
                    <span>Inspect Dispatched Email</span>
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar - Sleek Floating Command Capsule */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: isMobile
                ? '8px 10px max(10px, env(safe-area-inset-bottom)) 10px'
                : '16px 24px',
              background: 'linear-gradient(180deg, rgba(2, 6, 16, 0.95) 0%, #000000 100%)',
              borderTop: '1px solid rgba(0, 242, 254, 0.25)',
            }}
          >
            <div
              className="brutal-glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(2, 6, 18, 0.88)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '2px solid var(--cyan-core)',
                borderRadius: '16px',
                padding: isMobile ? '4px 6px 4px 14px' : '8px 10px 8px 20px',
                boxShadow: '4px 4px 0px #00f2fe, 0 0 20px rgba(0, 242, 254, 0.15)',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isMobile ? "Ask Thor anything..." : "Speak your truth to Thor — ask anything or share your deepest burden..."}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontFamily: 'var(--font-sans)',
                  fontSize: isMobile ? '16px' : '0.98rem',
                  outline: 'none',
                  padding: isMobile ? '8px 0' : '10px 0',
                }}
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping || isAiThinking}
                className="brutal-btn"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: inputValue.trim()
                    ? 'var(--cyan-core)'
                    : 'rgba(255, 255, 255, 0.06)',
                  border: '2px solid #ffffff',
                  color: inputValue.trim() ? '#000000' : 'rgba(255, 255, 255, 0.3)',
                  cursor: inputValue.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: inputValue.trim() ? '2px 2px 0px #00f2fe' : 'none',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                title="Send to Thor"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </main>
        )}
      </div>

      {/* GOOGLE AUTH GATE SCREEN OVERLAY */}
      {showAuthGate && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 24px',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.94)',
            backdropFilter: 'blur(20px)',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '2px solid var(--cyan-core)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 35px rgba(0, 242, 254, 0.6)',
            }}
          >
            <ShieldCheck size={38} color="var(--cyan-core)" />
          </div>

          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mythic)',
                fontSize: '1.4rem',
                color: '#ffffff',
                marginBottom: '10px',
                letterSpacing: '0.08em',
              }}
            >
              CELESTIAL VERIFICATION
            </h3>
            <p
              style={{
                fontSize: '0.90rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '420px',
                margin: '0 auto',
              }}
            >
              Before consulting Thor in his dedicated sanctuary, sign in with your Google account to connect your Midgard identity and receive direct courier aid.
            </p>
          </div>

          {authError && (
            <div
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 60, 60, 0.15)',
                border: '1px solid rgba(255, 60, 60, 0.4)',
                color: '#ff8888',
                fontSize: '0.82rem',
                maxWidth: '380px',
              }}
            >
              {authError}
            </div>
          )}

          <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '12px',
                background: '#000000',
                border: '1.5px solid var(--cyan-core)',
                color: '#ffffff',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: isLoggingIn ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
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
              <span>{isLoggingIn ? 'Summoning Google...' : 'Sign In with Google'}</span>
            </button>

            <button
              onClick={() => {
                setGuestBypass(true);
                soundManager.playRunicChime();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.80rem',
                cursor: 'pointer',
                padding: '8px',
                textDecoration: 'underline',
              }}
            >
              Continue as Mortal Guest
            </button>
          </div>
        </div>
      )}

      {/* NVIDIA Key Settings Modal */}
      {showKeyModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 998,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#000000',
              border: '1.5px solid var(--cyan-core)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 0 40px rgba(0, 242, 254, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(0, 242, 254, 0.2)',
                    border: '1px solid var(--cyan-core)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cyan-core)',
                  }}
                >
                  <Cpu size={22} />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-mythic)', fontSize: '1.05rem', color: '#ffffff', margin: 0 }}>
                    NVIDIA NIM AI Cognition
                  </h4>
                  <div style={{ fontSize: '0.74rem', color: 'var(--cyan-core)' }}>
                    High-Speed Neural Intelligence (20B)
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Pre-configured with your active NVIDIA API key. Thor thinks and speaks in real-time with authentic Norse mythic wisdom.
            </p>

            <form onSubmit={handleSaveNvidiaKey} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="password"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="nvapi-xxxxxxxxxxxxxxxxxxxxxxxx"
                style={{
                  width: '100%',
                  background: '#02050c',
                  border: '1.5px solid var(--cyan-core)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#ffffff',
                  fontSize: '0.90rem',
                  outline: 'none',
                  boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)',
                }}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  className="btn-electric"
                  style={{ flex: 1, padding: '12px', fontSize: '0.85rem' }}
                >
                  <span>Save Key &amp; Awaken AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="btn-secondary"
                  style={{ padding: '12px 20px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Distress Beacon Intake Modal / Drawer */}
      {showBeaconDrawer && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 997,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#000000',
              border: '1.5px solid var(--cyan-core)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 0 50px rgba(0, 242, 254, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Radio size={22} color="var(--cyan-core)" />
                <h4 style={{ fontFamily: 'var(--font-mythic)', fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
                  ⚡ Dispatch Grievance Beacon
                </h4>
              </div>
              <button
                onClick={() => setShowBeaconDrawer(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Submit your distress grievance directly to Thor's candidate alter-ego email courier. Evaluators can inspect the formatted email immediately.
            </p>

            <form onSubmit={handleDispatchBeacon} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--cyan-core)', display: 'block', marginBottom: '4px' }}>
                  Your Name / Warrior Call {user && <span style={{ color: '#ffffff', opacity: 0.7 }}>(Google Linked)</span>}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Erik the Storm-Wearied"
                  style={{
                    width: '100%',
                    background: '#020712',
                    border: '1px solid rgba(0, 242, 254, 0.4)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--cyan-core)', display: 'block', marginBottom: '4px' }}>
                    Winters Seen (Age)
                  </label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 28"
                    style={{
                      width: '100%',
                      background: '#020712',
                      border: '1px solid rgba(0, 242, 254, 0.4)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--cyan-core)', display: 'block', marginBottom: '4px' }}>
                    Midgard Realm / City
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Kochi, Kerala"
                    style={{
                      width: '100%',
                      background: '#020712',
                      border: '1px solid rgba(0, 242, 254, 0.4)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--cyan-core)', display: 'block', marginBottom: '4px' }}>
                  Raven Courier Email {user && <span style={{ color: '#ffffff', opacity: 0.7 }}>(Google Linked)</span>}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. visitor@midgard.org"
                  style={{
                    width: '100%',
                    background: '#020712',
                    border: '1px solid rgba(0, 242, 254, 0.4)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--cyan-core)', display: 'block', marginBottom: '4px' }}>
                  Tempest Urgency Level
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {['Low (Clouds)', 'Medium (Gale)', 'High (Tempest)'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: level })}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        background: formData.urgency === level ? 'var(--cyan-core)' : '#020712',
                        border: '1px solid var(--cyan-core)',
                        color: formData.urgency === level ? '#000000' : 'var(--cyan-core)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--cyan-core)', display: 'block', marginBottom: '4px' }}>
                  The Nature of Your Grievance / Challenge
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.grievance}
                  onChange={(e) => setFormData({ ...formData, grievance: e.target.value })}
                  placeholder="Tell Thor what weighs heavy upon your heart..."
                  style={{
                    width: '100%',
                    background: '#020712',
                    border: '1px solid rgba(0, 242, 254, 0.4)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-electric"
                  style={{ flex: 1, padding: '12px', fontSize: '0.86rem' }}
                >
                  <span>{isSubmitting ? '⚡ Dispatching Beacon...' : '⚡ Dispatch Grievance Beacon'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowBeaconDrawer(false)}
                  className="btn-secondary"
                  style={{ padding: '12px 18px', fontSize: '0.86rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* The Sagas & Story of Thor Modal */}
      <ThorStoryModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
      />
    </div>
  );
};
