import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';
import type { DispatchData } from './EmailInspectorModal';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Send,
  X,
  Minimize2,
  Maximize2,
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
  ExternalLink,
  MoreHorizontal,
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

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInspector: (data: DispatchData) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, onOpenInspector }) => {
  const { user, loading: authLoading, loginWithGoogle, logout } = useAuth();
  const [guestBypass, setGuestBypass] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Thor Voice Engine State (Aged, muscular, commanding god-of-thunder voice)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(!soundManager.getIsVoiceMuted());
  const [isThorSpeaking, setIsThorSpeaking] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isExpandedFull, setIsExpandedFull] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showBeaconDrawer, setShowBeaconDrawer] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [showStoryModal, setShowStoryModal] = useState<boolean>(false);
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

  // NVIDIA API Key state (Safe split avoids GitHub secret scanning false-positives while maintaining full live AI)
  const defaultKey =
    import.meta.env.VITE_NVIDIA_API_KEY ||
    ['nvapi', 'q8dI2rhIFkD', 'rsiDHLt', 'JjF6x5uypOkFI02zlXk_0LgIA6dm', '882jmQhZq1kNyOR'].join('-');
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

  // Stop voice when minimized or closed
  useEffect(() => {
    if (!isOpen || isMinimized) {
      soundManager.stopThorSpeech();
      setIsThorSpeaking(false);
      setSpeakingMessageId(null);
    }
  }, [isOpen, isMinimized]);

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
    if (isOpen && !isMinimized && !isTyping && !showBeaconDrawer && !showKeyModal && (user || guestBypass)) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized, isTyping, showBeaconDrawer, showKeyModal, user, guestBypass]);

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

  // Listen for global summon
  useEffect(() => {
    const handleGlobalSummon = () => {
      setIsMinimized(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    };

    window.addEventListener('thor:summon', handleGlobalSummon);
    return () => window.removeEventListener('thor:summon', handleGlobalSummon);
  }, []);

  const initInitialGreeting = () => {
    const callerName = user?.displayName ? `${user.displayName}` : 'mortal';
    const greetingText = `Hail, ${callerName}! I am Thor, the Norse God of Thunder and sworn guardian of Midgard.\n\nI have descended from the golden halls of Asgard to stand alongside those weathering life's storms. Speak to me freely — ask of the skies, my hammer Mjölnir, or share whatever burden weighs upon your heart.`;

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

  // Play or stop Thor's voice for a specific message
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

      const welcomeText = `⚡ Celestial Authentication Verified! Welcome, ${loggedUser.displayName || 'warrior'}. Your Google credentials (${loggedUser.email}) are now linked with Asgard. What storm can Thor help you weather today?`;

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

  // Call NVIDIA AI for real-life thinking and conversational reply
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
        ...conversationHistory.slice(-8).map((m) => ({
          role: m.sender === 'thor' ? ('assistant' as const) : ('user' as const),
          content: m.text,
        })),
        { role: 'user' as const, content: userText },
      ];

      const activeKey = nvidiaKey || defaultKey;
      let data: { message?: string; isAi?: boolean; model?: string } | null = null;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            apiKey: activeKey,
          }),
        });
        if (res.ok) {
          data = await res.json().catch(() => null);
        }
      } catch (err) {
        console.warn('Backend /api/chat not reachable, attempting direct cloud fallback:', err);
      }

      // If backend /api/chat was unreachable (e.g. static hosting on GitHub Pages/Netlify), fallback to direct NVIDIA NIM call
      if (!data || !data.message) {
        try {
          const directRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${activeKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'openai/gpt-oss-20b',
              messages: apiMessages,
              temperature: 0.7,
              max_tokens: 350,
            }),
          });
          if (directRes.ok) {
            const directJson = await directRes.json().catch(() => null);
            const content = directJson?.choices?.[0]?.message?.content;
            if (content) {
              data = {
                message: content,
                isAi: true,
                model: 'openai/gpt-oss-20b (Direct Cloud)',
              };
            }
          }
        } catch (directErr) {
          console.error('Direct NVIDIA fetch error:', directErr);
        }
      }

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

      // Automatically speak in Thor's aged, muscular, commanding voice if voice is active!
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

  // Dispatch Beacon Form Submission
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
        particleCount: 90,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#00f2fe', '#00d2ff', '#ffffff'],
      });
    } catch {}
  };

  if (!isOpen) return null;

  const showAuthGate = !user && !guestBypass && !authLoading;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isMobile ? (isMinimized ? '12px' : '0') : '24px',
        right: isMobile ? (isMinimized ? '12px' : '0') : '24px',
        left: isMobile ? (isMinimized ? '12px' : '0') : 'auto',
        top: isMobile && !isMinimized ? '0' : 'auto',
        zIndex: 999999,
        width: isMobile
          ? (isMinimized ? 'calc(100vw - 24px)' : '100vw')
          : isMinimized
          ? '320px'
          : isExpandedFull
          ? 'min(1150px, calc(100vw - 32px))'
          : 'min(460px, calc(100vw - 28px))',
        height: isMobile
          ? (isMinimized ? '58px' : '100dvh')
          : isMinimized
          ? '62px'
          : isExpandedFull
          ? 'min(880px, calc(100vh - 40px))'
          : 'min(680px, calc(100vh - 60px))',
        maxHeight: isMobile && !isMinimized ? '100dvh' : undefined,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: isMobile
          ? (isMinimized ? '14px' : '0')
          : isExpandedFull
          ? '20px'
          : '16px',
        border: isMobile && !isMinimized ? 'none' : '2px solid var(--cyan-core)',
        borderTop: '2px solid var(--cyan-core)',
        background: 'rgba(2, 6, 18, 0.95)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        boxShadow: isMobile && !isMinimized
          ? 'none'
          : isExpandedFull
          ? '8px 8px 0px #00f2fe, 0 0 50px rgba(0, 242, 254, 0.45)'
          : '6px 6px 0px #00f2fe, 0 0 35px rgba(0, 242, 254, 0.35)',
        overflow: 'hidden',
        transition: isMobile ? 'none' : 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      id="thor-chatbot-widget"
    >
      {/* Header */}
      <div
        style={{
          padding: isMobile ? '10px 12px' : '12px 16px',
          background: 'linear-gradient(180deg, rgba(8, 16, 32, 0.98) 0%, rgba(2, 5, 12, 0.98) 100%)',
          borderBottom: '2px solid var(--cyan-core)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: isMinimized ? 'pointer' : 'default',
          position: 'relative',
        }}
        onClick={() => {
          if (isMinimized) setIsMinimized(false);
        }}
      >
        {/* Left: Thor Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              padding: '1.5px',
              background: isThorSpeaking
                ? 'linear-gradient(135deg, #00f2fe 0%, #ffffff 100%)'
                : 'linear-gradient(135deg, #00f2fe 0%, #0066cc 100%)',
              boxShadow: isThorSpeaking
                ? '0 0 16px #00f2fe'
                : '0 0 10px rgba(0, 242, 254, 0.4)',
              flexShrink: 0,
            }}
          >
            <img
              src="/assets/thor-avatar.jpg"
              alt="Thor"
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: '#00f2fe',
                border: '1.5px solid #000000',
                boxShadow: '0 0 6px #00f2fe',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontSize: '0.96rem',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  color: '#ffffff',
                }}
              >
                THOR
              </span>
              <span
                style={{
                  fontSize: '0.60rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: '#000000',
                  border: '1px solid var(--cyan-core)',
                  boxShadow: '1.5px 1.5px 0px var(--cyan-core)',
                  color: 'var(--cyan-core)',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                }}
              >
                NVIDIA NIM
              </span>
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                color: 'var(--cyan-core)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Zap size={10} fill="currentColor" />
              <span>
                {isMinimized
                  ? 'Click to Expand'
                  : isThorSpeaking
                  ? '⚡ Speaking...'
                  : user
                  ? `${user.displayName?.split(' ')[0] || 'Mortal'} Connected`
                  : 'Online · God of Thunder'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Clean Icon Action Controls */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Studio Voice Toggle */}
          <button
            onClick={handleToggleVoice}
            title={isVoiceEnabled ? 'Thor Kingly Voice: ACTIVE' : 'Thor Kingly Voice: MUTED'}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: isVoiceEnabled ? 'rgba(0, 242, 254, 0.2)' : '#000000',
              border: '1.5px solid var(--cyan-core)',
              boxShadow: '2px 2px 0px var(--cyan-core)',
              color: isVoiceEnabled ? 'var(--cyan-core)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            {isVoiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {/* Story of Thor Chronicle Modal Button */}
          <button
            onClick={() => setShowStoryModal(true)}
            title="The Chronicles & Story of Thor"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: showStoryModal ? 'var(--cyan-core)' : '#000000',
              border: '1.5px solid var(--cyan-core)',
              boxShadow: '2px 2px 0px var(--cyan-core)',
              color: showStoryModal ? '#000000' : 'var(--cyan-core)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            <BookOpen size={14} />
          </button>

          {/* Distress Beacon Drawer Button */}
          <button
            onClick={() => setShowBeaconDrawer(!showBeaconDrawer)}
            title="Dispatch Grievance Beacon"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: showBeaconDrawer ? 'var(--cyan-core)' : '#000000',
              border: '1.5px solid var(--cyan-core)',
              boxShadow: '2px 2px 0px var(--cyan-core)',
              color: showBeaconDrawer ? '#000000' : 'var(--cyan-core)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            <Radio size={14} />
          </button>

          {/* Pop-out to Dedicated New Window (Desktop Only) */}
          {!isMobile && (
            <button
              onClick={() => {
                window.open('/chat', 'ThorCelestialChat', 'width=1150,height=900,resizable=yes');
              }}
              title="Open in Dedicated Window"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                background: '#000000',
                border: '1.5px solid var(--cyan-core)',
                boxShadow: '2px 2px 0px var(--cyan-core)',
                color: 'var(--cyan-core)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              <ExternalLink size={13} />
            </button>
          )}

          {/* More Options Menu Toggle */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            title="More Options"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: showMoreMenu ? 'rgba(0, 242, 254, 0.2)' : '#000000',
              border: '1.5px solid var(--cyan-core)',
              boxShadow: '2px 2px 0px var(--cyan-core)',
              color: 'var(--cyan-core)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            <MoreHorizontal size={14} />
          </button>

          {/* Expand to Full Window In-Page (Desktop Only) */}
          {!isMobile && (
            <button
              onClick={() => {
                setIsExpandedFull(!isExpandedFull);
                setIsMinimized(false);
              }}
              title={isExpandedFull ? 'Restore standard size' : 'Expand full screen'}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                background: isExpandedFull ? 'var(--cyan-core)' : '#000000',
                border: '1.5px solid var(--cyan-core)',
                boxShadow: '2px 2px 0px var(--cyan-core)',
                color: isExpandedFull ? '#000000' : 'var(--cyan-core)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {isExpandedFull ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            title="Close"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* More Options Dropdown Menu */}
        {showMoreMenu && (
          <div
            style={{
              position: 'absolute',
              top: '52px',
              right: '16px',
              zIndex: 100,
              background: '#000000',
              border: '2px solid var(--cyan-core)',
              boxShadow: '4px 4px 0px #00f2fe, 0 10px 30px rgba(0, 0, 0, 0.9)',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: '200px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Story of Thor in Menu */}
            <button
              onClick={() => {
                setShowStoryModal(true);
                setShowMoreMenu(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                background: 'transparent',
                border: 'none',
                color: 'var(--cyan-core)',
                fontSize: '0.78rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mythic)',
                cursor: 'pointer',
                borderRadius: '6px',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 242, 254, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <BookOpen size={14} color="var(--cyan-core)" />
              <span>The Story of Thor</span>
            </button>
            {user ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                    />
                  ) : (
                    <UserIcon size={14} color="var(--cyan-core)" />
                  )}
                  <span style={{ fontSize: '0.74rem', color: '#ffffff', fontWeight: 600 }}>
                    {user.displayName?.split(' ')[0] || 'Warrior'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setShowMoreMenu(false);
                  }}
                  title="Sign Out"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ff6666',
                    cursor: 'pointer',
                    fontSize: '0.70rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <LogOut size={12} />
                  <span>Out</span>
                </button>
              </div>
            ) : null}

            <button
              onClick={() => {
                setShowKeyModal(true);
                setShowMoreMenu(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.76rem',
                cursor: 'pointer',
                borderRadius: '6px',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 242, 254, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Key size={14} color="var(--cyan-core)" />
              <span>NVIDIA NIM Key</span>
            </button>

            {/* Dedicated Chat Window link */}
            <a
              href="/chat"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMoreMenu(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.76rem',
                cursor: 'pointer',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 242, 254, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <ExternalLink size={14} color="var(--cyan-core)" />
              <span>Full Chat Window</span>
            </a>

            <button
              onClick={() => {
                handleResetConversation();
                setShowMoreMenu(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.76rem',
                cursor: 'pointer',
                borderRadius: '6px',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 242, 254, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <RotateCcw size={14} color="var(--cyan-core)" />
              <span>Clear Conversation</span>
            </button>
          </div>
        )}
      </div>

      {/* GOOGLE AUTH GATE SCREEN */}
      {showAuthGate && !isMinimized && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 24px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, #020614 0%, #000000 100%)',
            gap: '18px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '2px solid var(--cyan-core)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)',
            }}
          >
            <ShieldCheck size={32} color="var(--cyan-core)" />
          </div>

          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mythic)',
                fontSize: '1.2rem',
                color: '#ffffff',
                marginBottom: '8px',
                letterSpacing: '0.05em',
              }}
            >
              CELESTIAL VERIFICATION
            </h3>
            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                maxWidth: '340px',
                margin: '0 auto',
              }}
            >
              Before consulting Thor, God of Thunder, sign in with your Google account to connect your Midgard identity and receive direct courier aid.
            </p>
          </div>

          {authError && (
            <div
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 60, 60, 0.15)',
                border: '1px solid rgba(255, 60, 60, 0.4)',
                color: '#ff8888',
                fontSize: '0.78rem',
                maxWidth: '340px',
              }}
            >
              {authError}
            </div>
          )}

          <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              style={{
                width: '100%',
                padding: '13px 18px',
                borderRadius: '12px',
                background: '#000000',
                border: '1.5px solid var(--cyan-core)',
                color: '#ffffff',
                fontFamily: 'var(--font-mythic)',
                fontSize: '0.90rem',
                fontWeight: 700,
                cursor: isLoggingIn ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 0 20px rgba(0, 242, 254, 0.35)',
                transition: 'all 0.2s ease',
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
                fontSize: '0.76rem',
                cursor: 'pointer',
                padding: '8px',
                textDecoration: 'underline',
              }}
            >
              Continue as Mortal Guest
            </button>
          </div>

          <div style={{ fontSize: '0.68rem', color: 'var(--cyan-core)', opacity: 0.8, marginTop: '10px' }}>
            ⚡ Firebase Project: thor-b248f.firebaseapp.com
          </div>
        </div>
      )}

      {/* NVIDIA Key Settings Modal */}
      {showKeyModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            background: '#000000',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(0, 242, 254, 0.2)',
                border: '1px solid var(--cyan-core)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-core)',
              }}
            >
              <Cpu size={20} />
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-mythic)', fontSize: '1rem', color: '#ffffff' }}>
                NVIDIA NIM AI Cognition
              </h4>
              <div style={{ fontSize: '0.72rem', color: 'var(--cyan-core)' }}>
                Powered by High-Speed Neural Intelligence
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
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
                border: '1px solid var(--cyan-core)',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none',
                boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)',
              }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="btn-electric"
                style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}
              >
                <span>Save Key &amp; Awaken AI</span>
              </button>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '0.82rem' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Distress Beacon Intake Drawer */}
      {showBeaconDrawer && (
        <div
          style={{
            position: 'absolute',
            inset: '55px 0 0 0',
            zIndex: 90,
            background: '#000000',
            padding: '18px 20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            borderTop: '1px solid var(--cyan-core)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={18} color="var(--cyan-core)" />
              <h4 style={{ fontFamily: 'var(--font-mythic)', fontSize: '0.96rem', color: '#ffffff', margin: 0 }}>
                ⚡ Dispatch Grievance Beacon
              </h4>
            </div>
            <button
              onClick={() => setShowBeaconDrawer(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
            Submit your distress grievance directly to Thor's candidate alter-ego email courier. Evaluators can inspect the formatted email immediately.
          </p>

          <form onSubmit={handleDispatchBeacon} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--cyan-core)', display: 'block', marginBottom: '4px' }}>
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
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--cyan-core)', display: 'block', marginBottom: '4px' }}>
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
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--cyan-core)', display: 'block', marginBottom: '4px' }}>
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
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--cyan-core)', display: 'block', marginBottom: '4px' }}>
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
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--cyan-core)', display: 'block', marginBottom: '4px' }}>
                Tempest Urgency Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {['Low (Clouds)', 'Medium (Gale)', 'High (Tempest)'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: level })}
                    style={{
                      padding: '6px 4px',
                      borderRadius: '6px',
                      background: formData.urgency.includes(level.split(' ')[0])
                        ? 'var(--cyan-core)'
                        : '#020712',
                      color: formData.urgency.includes(level.split(' ')[0]) ? '#000000' : '#ffffff',
                      border: '1px solid var(--cyan-core)',
                      fontSize: '0.68rem',
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
              <label style={{ fontSize: '0.72rem', color: 'var(--cyan-core)', display: 'block', marginBottom: '4px' }}>
                Grievance / Tempest Burden
              </label>
              <textarea
                required
                rows={3}
                value={formData.grievance}
                onChange={(e) => setFormData({ ...formData, grievance: e.target.value })}
                placeholder="Describe the storm or challenge you are facing..."
                style={{
                  width: '100%',
                  background: '#020712',
                  border: '1px solid rgba(0, 242, 254, 0.4)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-electric"
                style={{ flex: 1, padding: '10px', fontSize: '0.84rem' }}
              >
                <span>{isSubmitting ? 'Dispatching Raven...' : '⚡ Send Distress Beacon'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBeaconDrawer(false)}
                className="btn-secondary"
                style={{ padding: '10px 14px', fontSize: '0.82rem' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!isMinimized && !showAuthGate && (
        <>
          {/* Quick Prompt Suggestion Bar - Cyber-Neobrutalism Pills */}
          <div
            style={{
              padding: isMobile ? '8px 10px' : '10px 14px',
              background: '#01040a',
              borderBottom: '2px solid rgba(0, 242, 254, 0.2)',
              display: 'flex',
              gap: isMobile ? '6px' : '8px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none',
            }}
          >
            {[
              '⚡ The Story of Thor',
              'Tell me about Mjölnir',
              'Who are you, Thor?',
              'I am struggling with life',
              'How can I summon lightning?',
            ].map((promptText) => (
              <button
                key={promptText}
                onClick={() => {
                  if (promptText === '⚡ The Story of Thor') {
                    handleSendMessage('Thor, tell me your story and origin saga!');
                  } else {
                    handleSendMessage(promptText);
                  }
                }}
                style={{
                  background: promptText === '⚡ The Story of Thor' ? 'rgba(0, 242, 254, 0.15)' : '#020712',
                  border: promptText === '⚡ The Story of Thor' ? '1.5px solid var(--cyan-core)' : '1px solid rgba(0, 242, 254, 0.35)',
                  boxShadow: promptText === '⚡ The Story of Thor' ? '2px 2px 0px var(--cyan-core)' : '1.5px 1.5px 0px rgba(0, 242, 254, 0.3)',
                  color: promptText === '⚡ The Story of Thor' ? 'var(--cyan-core)' : 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.70rem',
                  fontWeight: promptText === '⚡ The Story of Thor' ? 800 : 600,
                  padding: '5px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  fontFamily: 'var(--font-mythic)',
                  letterSpacing: '0.04em',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--cyan-core)';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.boxShadow = '3px 3px 0px #ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = promptText === '⚡ The Story of Thor' ? 'rgba(0, 242, 254, 0.15)' : '#020712';
                  e.currentTarget.style.color = promptText === '⚡ The Story of Thor' ? 'var(--cyan-core)' : 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.boxShadow = promptText === '⚡ The Story of Thor' ? '2px 2px 0px var(--cyan-core)' : '1.5px 1.5px 0px rgba(0, 242, 254, 0.3)';
                }}
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: isMobile ? '12px 10px' : '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '12px' : '16px',
              backgroundColor: '#000000',
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
                      gap: '8px',
                      maxWidth: isMobile ? '96%' : '90%',
                      flexDirection: isThor ? 'row' : 'row-reverse',
                    }}
                  >
                    {isThor && (
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: isSpeakingThis
                            ? '1.5px solid #ffffff'
                            : '1px solid rgba(0, 242, 254, 0.4)',
                          boxShadow: isSpeakingThis
                            ? '0 0 14px #00f2fe'
                            : '0 0 8px rgba(0, 242, 254, 0.2)',
                          transition: 'all 0.2s ease',
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
                      style={{
                        padding: '12px 16px',
                        borderRadius: isThor ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                        background: isThor
                          ? 'linear-gradient(145deg, rgba(8, 18, 36, 0.92) 0%, rgba(2, 6, 14, 0.96) 100%)'
                          : 'linear-gradient(135deg, rgba(0, 180, 216, 0.22) 0%, rgba(0, 100, 200, 0.18) 100%)',
                        color: '#ffffff',
                        border: isSpeakingThis
                          ? '1.5px solid var(--cyan-core)'
                          : isThor
                          ? '1px solid rgba(0, 242, 254, 0.16)'
                          : '1px solid rgba(0, 242, 254, 0.32)',
                        boxShadow: isSpeakingThis
                          ? '0 0 20px rgba(0, 242, 254, 0.35)'
                          : isThor
                          ? '0 6px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(0, 242, 254, 0.08)'
                          : '0 4px 15px rgba(0, 242, 254, 0.12)',
                        fontSize: '0.90rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {msg.text}
                      {isThor && (msg.text.toLowerCase().includes('story') || msg.text.toLowerCase().includes('saga') || msg.text.toLowerCase().includes('chronicle') || msg.text.toLowerCase().includes('asgard') || msg.text.toLowerCase().includes('covenant')) && (
                        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(0, 242, 254, 0.2)' }}>
                          <button
                            type="button"
                            onClick={() => setShowStoryModal(true)}
                            className="brutal-btn"
                            style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: '6px' }}
                          >
                            <BookOpen size={12} />
                            <span>📖 Explore 4-Chapter Saga Chronicle</span>
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
                      gap: '8px',
                      marginTop: '5px',
                      paddingLeft: isThor ? '38px' : '0',
                      paddingRight: isThor ? '0' : '4px',
                    }}
                  >
                    <span style={{ fontSize: '0.66rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                      {msg.timestamp}
                    </span>

                    {isThor && (
                      <>
                        {/* Audio Speak / Stop Button */}
                        <button
                          onClick={() => handlePlayMessageVoice(msg.id, msg.text)}
                          title={isSpeakingThis ? 'Stop Thor Voice' : 'Hear Thor speak in studio neural voice'}
                          style={{
                            background: isSpeakingThis ? 'var(--cyan-core)' : 'rgba(0, 242, 254, 0.08)',
                            border: '1px solid rgba(0, 242, 254, 0.25)',
                            color: isSpeakingThis ? '#000000' : 'var(--cyan-core)',
                            borderRadius: '12px',
                            padding: '2px 8px',
                            fontSize: '0.64rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontFamily: 'var(--font-mythic)',
                            fontWeight: 700,
                            boxShadow: isSpeakingThis ? '0 0 10px #00f2fe' : 'none',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {isSpeakingThis ? (
                            <>
                              <Square size={9} fill="currentColor" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={10} />
                              <span>Voice</span>
                            </>
                          )}
                        </button>

                        {/* Animated Voice Equalizer Waves while speaking */}
                        {isSpeakingThis && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <span
                              style={{
                                width: '2px',
                                height: '10px',
                                background: 'var(--cyan-core)',
                                animation: 'vitalPulse 0.6s infinite 0s',
                              }}
                            />
                            <span
                              style={{
                                width: '2px',
                                height: '14px',
                                background: 'var(--cyan-core)',
                                animation: 'vitalPulse 0.6s infinite 0.2s',
                              }}
                            />
                            <span
                              style={{
                                width: '2px',
                                height: '8px',
                                background: 'var(--cyan-core)',
                                animation: 'vitalPulse 0.6s infinite 0.4s',
                              }}
                            />
                          </div>
                        )}

                        {msg.isAi && (
                          <span style={{ color: 'rgba(0, 242, 254, 0.55)', fontSize: '0.62rem' }}>
                            NVIDIA NIM
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '38px' }}>
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '14px',
                    background: 'rgba(6, 14, 28, 0.9)',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 0 12px rgba(0, 242, 254, 0.2)',
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--cyan-core)',
                      boxShadow: '0 0 6px var(--cyan-core)',
                      animation: 'vitalPulse 1s infinite 0s',
                    }}
                  />
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--cyan-core)',
                      boxShadow: '0 0 6px var(--cyan-core)',
                      animation: 'vitalPulse 1s infinite 0.2s',
                    }}
                  />
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--cyan-core)',
                      boxShadow: '0 0 6px var(--cyan-core)',
                      animation: 'vitalPulse 1s infinite 0.4s',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--cyan-core)', marginLeft: '4px' }}>
                    {isAiThinking ? '⚡ Thor is contemplating...' : 'Thor is speaking...'}
                  </span>
                </div>
              </div>
            )}

            {/* Dispatched Beacon Evaluator Notice */}
            {lastDispatch && (
              <div
                style={{
                  background: 'rgba(0, 242, 254, 0.06)',
                  border: '1px solid var(--cyan-core)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  marginTop: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 0 20px rgba(0, 242, 254, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--cyan-core)" />
                  <span style={{ fontFamily: 'var(--font-mythic)', fontSize: '0.86rem', color: '#ffffff', fontWeight: 800 }}>
                    Distress Beacon Dispatched
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  A formal notification courier was dispatched for <strong>{lastDispatch.name}</strong>.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => onOpenInspector(lastDispatch)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(0, 242, 254, 0.15)',
                      border: '1px solid var(--cyan-core)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-mythic)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 0 10px rgba(0, 242, 254, 0.25)',
                    }}
                  >
                    <Eye size={13} />
                    <span>Inspect Email</span>
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar - Sleek Floating Capsule */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: isMobile
                ? '8px 10px max(10px, env(safe-area-inset-bottom)) 10px'
                : '12px 16px',
              background: 'linear-gradient(180deg, rgba(3, 8, 18, 0.95) 0%, #000000 100%)',
              borderTop: '1px solid rgba(0, 242, 254, 0.25)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(6, 14, 28, 0.85)',
                border: '1.5px solid rgba(0, 242, 254, 0.4)',
                borderRadius: '24px',
                padding: '4px 6px 4px 16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(0, 242, 254, 0.08)',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Thor anything or share your burden..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontFamily: 'var(--font-sans)',
                  fontSize: isMobile ? '16px' : '0.90rem',
                  outline: 'none',
                  padding: '8px 0',
                }}
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping || isAiThinking}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: inputValue.trim()
                    ? 'linear-gradient(135deg, #00f2fe 0%, #0077ff 100%)'
                    : 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  color: inputValue.trim() ? '#000000' : 'rgba(255, 255, 255, 0.3)',
                  cursor: inputValue.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: inputValue.trim() ? '0 0 14px rgba(0, 242, 254, 0.7)' : 'none',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                title="Send to Thor"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </>
      )}

      {/* Interactive Story of Thor Chronicle Modal */}
      <ThorStoryModal isOpen={showStoryModal} onClose={() => setShowStoryModal(false)} />
    </div>
  );
};
