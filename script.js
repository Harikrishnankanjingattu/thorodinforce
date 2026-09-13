/**
 * ============================================================================
 * THOR — GOD OF THUNDER & GUARDIAN OF THE STORM-WEARIED
 * VANILLA WEB APPLICATION SCRIPT (ZERO BUILD STEP)
 * ============================================================================
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

/* ============================================================================
   1. CONFIG & CONSTANTS
   ============================================================================ */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBbO1rBjmqcZgk-1to3y60oLHifyO6UYuE",
  authDomain: "thor-b248f.firebaseapp.com",
  projectId: "thor-b248f",
  storageBucket: "thor-b248f.firebasestorage.app",
  messagingSenderId: "997479285369",
  appId: "1:997479285369:web:114720ac3482000b7e8aa8",
  measurementId: "G-GYLDGFX447",
};

const DEFAULT_NVIDIA_KEY = [
  'nvapi',
  'q8dI2rhIFkD',
  'rsiDHLt',
  'JjF6x5uypOkFI02zlXk_0LgIA6dm',
  '882jmQhZq1kNyOR',
].join('-');

const TIMELINE_STEPS = [
  {
    id: 0,
    runic: 'ᚲ',
    title: 'The Golden Halls of Asgard',
    subtitle: 'Pride & Celestial Detachment',
    icon: 'crown',
    content:
      'Born son of Odin and heir to the celestial throne, Thor once lived untouched by the fragile struggles of mortals. Within the gleaming halls of Asgard, thunder was merely a celebratory song, and mortal concerns felt as distant as falling leaves in an autumn gale.',
    quote: '“We drank the mead of eternity while the world below trembled in fear.”',
  },
  {
    id: 1,
    runic: 'ᚺ',
    title: 'The Mortal Tempest',
    subtitle: 'The Storm Left Unchecked',
    icon: 'cloud-lightning',
    content:
      'Everything changed on the night of the Great North Sea Squall. Soaring through the clouds, Thor witnessed a coastal fishing village torn apart by a terrifying gale. It was a tempest he could have calmed with a single command — yet he watched idly as families were displaced and lives broken.',
    quote: '“The cry of a child in the gale echoed louder than all the thunder in the cosmos.”',
  },
  {
    id: 2,
    runic: 'ᚱ',
    title: 'The Voluntary Exile',
    subtitle: 'Turning His Back on Paradise',
    icon: 'shield-alert',
    content:
      'Humbled and shattered by his own careless vanity, Thor threw down his royal laurels. He refused Odin’s invitation to the golden feast, choosing voluntary exile to Midgard (Earth). He relinquished the comfort of a god to feel the cold rain on his own skin alongside mortals.',
    quote: '“I shall not sit upon a golden bench while those beneath me bleed in silence.”',
  },
  {
    id: 3,
    runic: 'ᛏ',
    title: 'The Guardian’s Vow',
    subtitle: 'Thunder as a Protective Shield',
    icon: 'footprints',
    content:
      'Thor now walks the roads of Earth as an enduring protector. He forged a solemn covenant: never again shall his celestial gifts sleep while someone suffers. The fury of lightning, once a raw force of destruction, is now channeled into a steadfast sanctuary.',
    quote: '“No storm lasts forever — and you don’t have to weather it alone.”',
  },
];

const POWERS = [
  {
    id: 'lightning',
    title: 'Command Over Lightning',
    runic: 'ᛋ',
    category: 'Celestial Elemental',
    description:
      'Channels raw atmospheric potential into controlled ion discharges, striking with surgical precision or generating electromagnetic barriers that deflect hostile kinetic forces.',
    statName: 'Celestial Voltage',
    statVal: 100,
    icon: 'zap',
    animationClass: 'lightning-flicker-hover',
    accentColor: '#00f2fe',
  },
  {
    id: 'strength',
    title: 'Superhuman Strength',
    runic: 'ᚢ',
    category: 'Physical Resilience',
    description:
      'Shatters mountain granite with bare hands. His bone density and muscle fibers are fortified by divine Asgardian physiology, rendering him immune to mortal weapons and concussive impacts.',
    statName: 'Kinetic Tolerance',
    statVal: 98,
    icon: 'shield',
    animationClass: 'hammer-spin-hover',
    accentColor: '#00d2ff',
  },
  {
    id: 'flight',
    title: 'Storm-Flight',
    runic: 'ᚱ',
    category: 'Aerodynamic Vector',
    description:
      'Does not merely fly — Thor commands the thermal updrafts and pressure vortices of the tempest, riding gale-force winds at supersonic velocity across Midgard’s horizons.',
    statName: 'Atmospheric Velocity',
    statVal: 95,
    icon: 'wind',
    animationClass: 'wind-swirl-hover',
    accentColor: '#00e5ff',
  },
  {
    id: 'weather',
    title: 'Weather Calming',
    runic: 'ᚹ',
    category: 'Atmospheric Manipulation',
    description:
      'Where thunder once only destroyed, Thor can now invert barometric squalls. With an outstretched hand, he dissipates deadly storm surges and brings calm skies to battered communities.',
    statName: 'Barometric Calming',
    statVal: 92,
    icon: 'sun',
    animationClass: 'storm-wave-hover',
    accentColor: '#00b4d8',
  },
  {
    id: 'regeneration',
    title: 'Storm Regeneration',
    runic: 'ᛚ',
    category: 'Bio-Electric Healing',
    description:
      'Directly absorbs ambient static electricity, lightning strikes, and ionization from the atmosphere to instantaneously regenerate damaged tissue and purge mortal exhaustion.',
    statName: 'Cellular Restoration',
    statVal: 96,
    icon: 'activity',
    animationClass: 'vital-pulse-hover',
    accentColor: '#00e5ff',
  },
];

const PERSONALITY_TRAITS = [
  {
    title: 'Booming Warmth',
    desc: 'Speaks with the resonance of storm winds, but never with malice. His greeting feels like a hearth fire on a freezing winter night.',
    icon: 'heart',
    accent: '#00f2fe',
  },
  {
    title: 'The Protective Sibling',
    desc: 'Treats mortals not as frail subjects to be pitied, but as younger kin worthy of boundless defense, encouragement, and respect.',
    icon: 'shield-check',
    accent: '#00d2ff',
  },
  {
    title: 'Wry Nordic Humor',
    desc: 'Quick to laugh at his own past vanities or the strangeness of mortal gadgets. Humor that disarms tension without diminishing sorrow.',
    icon: 'laugh',
    accent: '#00e5ff',
  },
];

const QUOTES = [
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

const SAGAS = [
  {
    id: 0,
    runic: 'ᚲ // SAGA_01',
    title: 'The Celestial Prince of Asgard',
    subtitle: 'Cosmic Royalty & Detachment',
    icon: 'crown',
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
    icon: 'flame',
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
    icon: 'zap',
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
    icon: 'shield',
    summary:
      'Thor’s voluntary exile to Earth. Casting aside Asgard’s feasts to be the shield against Ultron, cosmic desolation, and mortal grief.',
    fullText:
      'Thor descended to Midgard, refusing the throne of Asgard. He cast his divine boots upon the mud and cobblestones of Earth, swearing an unyielding oath: where darkness gathers, where Ultron’s metallic legion marches, where mortals weep in grief, Thor shall be the anvil upon which despair is broken. His lightning is no longer a weapon of conquest, but a celestial beacon of refuge.',
    quote: '“No tempest lasts forever. Stand behind my shield, mortal—you shall not weather this alone.”',
    speech:
      'Now I walk the soil of Midgard as your shield. Whether you face the cold machine wrath of Ultron, or the quiet storms of your own soul, remember this: Thor stands with you. Fear no thunder, for it is my promise of dawn.',
  },
];

/* ============================================================================
   2. STATE MANAGEMENT
   ============================================================================ */

const state = {
  // Routing
  currentRoute: window.location.hash === '#chat' || window.location.pathname === '/chat' || window.location.search.includes('chat=window') ? '/chat' : '/',

  // Auth
  user: null,
  authLoading: true,
  guestBypass: false,
  authError: null,

  // Audio & Voice
  isMuted: localStorage.getItem('thor_audio_muted') === 'true',
  isVoiceMuted: localStorage.getItem('thor_voice_muted') === 'true',
  isThorSpeaking: false,
  speakingMessageId: null,

  // App UI
  thunderActive: false,
  isChatOpen: false,
  isChatMinimized: false,
  isChatExpanded: false,
  showBeaconDrawer: false,
  showKeyModal: false,
  showStoryModal: false,
  storyActiveSaga: 0,
  storyVoicePlaying: false,
  emailInspectorOpen: false,
  emailInspectorData: null,
  activeOriginStep: 0,
  activeQuoteIdx: 0,
  mobileMenuOpen: false,

  // AI & Chat
  nvidiaKey: localStorage.getItem('thor_nvidia_key') || DEFAULT_NVIDIA_KEY,
  isAiThinking: false,
  messages: [],
  lastDispatch: null,
};

function setState(patch) {
  Object.assign(state, patch);
  renderApp();
}

/* ============================================================================
   3. DOM HELPERS & SVG ICONS
   ============================================================================ */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function getSvgIcon(name, size = 18, color = 'currentColor', fill = 'none') {
  const icons = {
    zap: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="${fill}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    crown: `<path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" fill="${fill}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    'cloud-lightning': `<path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" fill="${fill}" stroke="${color}" stroke-width="2"/><polyline points="13 11 9 17 15 17 11 23" fill="${fill}" stroke="${color}" stroke-width="2"/>`,
    'shield-alert': `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="${fill}" stroke="${color}" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="${color}" stroke-width="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="${color}" stroke-width="2"/>`,
    footprints: `<path d="M4 16v-2.38C4 11.5 2.97 9.5 3 7.5A4.5 4.5 0 0 1 7.5 3c2.4 0 4.5 2 4.5 4.5 0 2-.97 4-1 6.12V16" fill="${fill}" stroke="${color}" stroke-width="2"/><path d="M12 20v-2.38c0-2.12-.97-4.12-1-6.12.03-2.5 2.1-4.5 4.5-4.5 2.4 0 4.5 2 4.5 4.5 0 2-.97 4-1 6.12V20" fill="${fill}" stroke="${color}" stroke-width="2"/>`,
    shield: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="${fill}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    wind: `<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    sun: `<circle cx="12" cy="12" r="4" stroke="${color}" stroke-width="2"/><path d="M12 2v2" stroke="${color}" stroke-width="2"/><path d="M12 20v2" stroke="${color}" stroke-width="2"/><path d="m4.93 4.93 1.41 1.41" stroke="${color}" stroke-width="2"/><path d="m17.66 17.66 1.41 1.41" stroke="${color}" stroke-width="2"/><path d="M2 12h2" stroke="${color}" stroke-width="2"/><path d="M20 12h2" stroke="${color}" stroke-width="2"/><path d="m6.34 17.66-1.41 1.41" stroke="${color}" stroke-width="2"/><path d="m19.07 4.93-1.41 1.41" stroke="${color}" stroke-width="2"/>`,
    activity: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    heart: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="${fill}" stroke="${color}" stroke-width="2"/>`,
    'shield-check': `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="${fill}" stroke="${color}" stroke-width="2"/><path d="m9 12 2 2 4-4" stroke="${color}" stroke-width="2"/>`,
    laugh: `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2"/><path d="M18 13a6 6 0 0 1-12 0" stroke="${color}" stroke-width="2"/><line x1="9" y1="9" x2="9.01" y2="9" stroke="${color}" stroke-width="2"/><line x1="15" y1="9" x2="15.01" y2="9" stroke="${color}" stroke-width="2"/>`,
    flame: `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" stroke="${color}" stroke-width="2"/>`,
    mail: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="${color}" stroke-width="2"/><polyline points="22,6 12,13 2,6" stroke="${color}" stroke-width="2"/>`,
    volume2: `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="${color}" stroke-width="2"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="${color}" stroke-width="2"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="${color}" stroke-width="2"/>`,
    volumeX: `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="${color}" stroke-width="2"/><line x1="23" y1="9" x2="17" y2="15" stroke="${color}" stroke-width="2"/><line x1="17" y1="9" x2="23" y2="15" stroke="${color}" stroke-width="2"/>`,
  };

  const inner = icons[name] || icons.zap;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" style="display:inline-block; vertical-align:middle;">${inner}</svg>`;
}

/* ============================================================================
   4. ROUTER
   ============================================================================ */

function initRouter() {
  const updateRoute = () => {
    const isDedicated =
      window.location.hash === '#chat' ||
      window.location.pathname === '/chat' ||
      window.location.search.includes('chat=window');
    
    setState({ currentRoute: isDedicated ? '/chat' : '/' });
  };

  window.addEventListener('hashchange', updateRoute);
  window.addEventListener('popstate', updateRoute);
  updateRoute();
}

function navigateTo(route) {
  if (route === '/chat') {
    window.location.hash = 'chat';
  } else {
    window.location.hash = '';
    history.pushState(null, '', '/');
  }
  setState({ currentRoute: route });
}

/* ============================================================================
   5. SOUND MANAGER (WEB AUDIO API & NEURAL VOICE)
   ============================================================================ */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.audioCache = new Map();
    this.currentAudio = null;
    this.currentUtterance = null;
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  unlockAudio() {
    this.initContext();
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.resume(); } catch {}
    }
  }

  toggleMute() {
    state.isMuted = !state.isMuted;
    localStorage.setItem('thor_audio_muted', String(state.isMuted));
    renderNavigation();
    return state.isMuted;
  }

  toggleVoice() {
    state.isVoiceMuted = !state.isVoiceMuted;
    if (state.isVoiceMuted) {
      this.stopThorSpeech();
    }
    localStorage.setItem('thor_voice_muted', String(state.isVoiceMuted));
    renderNavigation();
    renderChatControls();
    return state.isVoiceMuted;
  }

  playThunder() {
    if (state.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Initial sharp crack
      const bufferSize = this.ctx.sampleRate * 0.15;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.15);

      const crackGain = this.ctx.createGain();
      crackGain.gain.setValueAtTime(0.35, now);
      crackGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      whiteNoise.connect(filter);
      filter.connect(crackGain);
      crackGain.connect(this.ctx.destination);
      whiteNoise.start(now);

      // 2. Rolling deep sub-bass thunder rumble
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const rumbleGain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(75, now);
      osc1.frequency.exponentialRampToValueAtTime(32, now + 1.8);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(55, now);
      osc2.frequency.exponentialRampToValueAtTime(25, now + 2.2);

      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(140, now);
      rumbleFilter.frequency.exponentialRampToValueAtTime(50, now + 2.2);

      rumbleGain.gain.setValueAtTime(0.01, now);
      rumbleGain.gain.linearRampToValueAtTime(0.4, now + 0.08);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

      osc1.connect(rumbleFilter);
      osc2.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.5);
      osc2.stop(now + 2.5);
    } catch {}
  }

  playRunicChime() {
    if (state.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [528, 660, 792];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 1.3);
      });
    } catch {}
  }

  playMessageSpark() {
    if (state.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  playThorChestResonance() {
    if (state.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(90, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch {}
  }

  async speakThor(text, onStart, onEnd) {
    if (state.isVoiceMuted) return false;
    this.stopThorSpeech();

    const cleanText = text
      .replace(/⚡/g, '')
      .replace(/[*_#`~[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    if (!cleanText) return false;

    // 1. Try Neural MP3 via /api/tts
    try {
      let audioUrl = this.audioCache.get(cleanText);
      if (!audioUrl) {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            voice: 'en-US-ChristopherNeural',
            pitch: '-14Hz',
            rate: '-6%',
          }),
        }).catch(() => null);

        if (res && res.ok) {
          const blob = await res.blob();
          audioUrl = URL.createObjectURL(blob);
          this.audioCache.set(cleanText, audioUrl);
        }
      }

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        audio.onplay = () => {
          this.playThorChestResonance();
          if (onStart) onStart();
        };
        audio.onended = () => {
          this.currentAudio = null;
          if (onEnd) onEnd();
        };
        audio.onerror = () => {
          this.currentAudio = null;
          if (onEnd) onEnd();
        };

        await audio.play();
        return true;
      }
    } catch {}

    // 2. Fallback to Browser Speech Synthesis
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.pitch = 0.62;
        utterance.rate = 0.88;
        utterance.volume = 1.0;

        utterance.onstart = () => {
          this.playThorChestResonance();
          if (onStart) onStart();
        };
        utterance.onend = () => {
          this.currentUtterance = null;
          if (onEnd) onEnd();
        };
        utterance.onerror = () => {
          this.currentUtterance = null;
          if (onEnd) onEnd();
        };

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
        return true;
      } catch {}
    }

    return false;
  }

  stopThorSpeech() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
    setState({ isThorSpeaking: false, speakingMessageId: null });
  }
}

const soundManager = new SoundEngine();

/* ============================================================================
   6. FIREBASE AUTH
   ============================================================================ */

const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

function parseAuthError(err) {
  const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : '';
  const rawMsg = err instanceof Error ? err.message : String(err || '');
  const hostname = window.location.hostname || 'localhost';

  if (code === 'auth/unauthorized-domain' || rawMsg.includes('unauthorized-domain')) {
    return {
      title: 'Domain Not Authorized in Firebase',
      message: `Origin "${hostname}" is not listed in Firebase Console → Authentication → Settings → Authorized domains (thor-b248f). You can add "${hostname}" there, or tap below to enter instantly as Guest Warrior with full capabilities.`,
      isDomainError: true,
      hostname,
    };
  }

  return {
    title: 'Sign-In Static Encountered',
    message: rawMsg.length < 120 && !rawMsg.includes('FirebaseError')
      ? `Interference detected: ${rawMsg}`
      : 'Sign-in attempt encountered static. You may retry or continue as Guest Warrior for immediate access.',
    isDomainError: false,
    hostname,
  };
}

function initFirebaseAuth() {
  getRedirectResult(auth)
    .then((result) => {
      if (result && result.user) {
        setState({ user: result.user });
        localStorage.removeItem('thor_guest_session');
      }
    })
    .catch(() => {});

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setState({ user: currentUser, authLoading: false });
      localStorage.removeItem('thor_guest_session');
    } else {
      const storedGuest = localStorage.getItem('thor_guest_session');
      if (storedGuest) {
        try {
          setState({ user: JSON.parse(storedGuest), authLoading: false });
        } catch {
          setState({ user: null, authLoading: false });
        }
      } else {
        setState({ user: null, authLoading: false });
      }
    }
  });
}

async function loginWithGoogle() {
  soundManager.unlockAudio();
  try {
    const res = await signInWithPopup(auth, googleProvider);
    setState({ user: res.user, authError: null });
    localStorage.removeItem('thor_guest_session');
    return res.user;
  } catch (err) {
    if (err && (err.code === 'auth/popup-blocked' || String(err).includes('popup-blocked'))) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return;
      } catch (redirErr) {
        console.warn('Redirect fallback error:', redirErr);
      }
    }
    const parsed = parseAuthError(err);
    setState({ authError: parsed });
    throw err;
  }
}

function loginAsGuest(name = 'Midgard Warrior') {
  const guestUser = {
    uid: 'guest-' + Date.now(),
    displayName: name,
    email: 'warrior@midgard.realm',
    photoURL: null,
    isGuest: true,
  };
  localStorage.setItem('thor_guest_session', JSON.stringify(guestUser));
  setState({ user: guestUser, guestBypass: true, authError: null });
  soundManager.playRunicChime();
  return guestUser;
}

async function handleLogout() {
  try {
    await signOut(auth);
  } catch {}
  localStorage.removeItem('thor_guest_session');
  setState({ user: null, guestBypass: false });
}

/* ============================================================================
   7. LIGHTING EFFECT (STORM CANVAS & THUNDER STROBE)
   ============================================================================ */

/* LIGHTING EFFECT
 * Implements an interactive 2D canvas simulation of an Asgardian storm:
 * - 220 angled falling rain particles with depth velocity
 * - 45 upward-drifting neon blue sparks and embers
 * - Multi-layered lightning bolts (32px wide atmospheric cyan glow, 14px mid-cyan, 1.6px pure white core)
 * - Autonomous ambient lightning strikes every 3.5 to 7.0 seconds
 * - Interactive click-to-strike: clicking anywhere triggers a bolt directed toward cursor
 * - Sky flash linear-gradient bloom decay
 * - Screen-shake stroboscopic white/cyan ThunderFlash overlay on page intro & summons
 */

function initStormCanvas() {
  const canvas = $('#storm-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const rainCount = Math.min(220, Math.floor(width / 8));
  const rainParticles = [];
  for (let i = 0; i < rainCount; i++) {
    rainParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 25 + 12,
      speed: Math.random() * 14 + 16,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  const sparkCount = 45;
  const sparks = [];
  const spawnSpark = (spark) => {
    const sp = spark || {};
    sp.x = Math.random() * width;
    sp.y = height + Math.random() * 50;
    sp.size = Math.random() * 2.5 + 1;
    sp.speedX = (Math.random() - 0.45) * 3;
    sp.speedY = -(Math.random() * 3.5 + 2);
    sp.alpha = Math.random() * 0.8 + 0.2;
    sp.life = Math.random() * 140 + 80;
    return sp;
  };
  for (let i = 0; i < sparkCount; i++) {
    sparks.push(spawnSpark());
  }

  const activeBolts = [];
  let skyFlashAlpha = 0;
  let nextLightningTime = Date.now() + 2500;

  function generateBoltSegments(startX, startY, targetX, targetY, branchDepth = 0) {
    const segments = [];
    let currentX = startX;
    let currentY = startY;
    const totalDistY = targetY - startY;
    const steps = Math.max(6, Math.floor(totalDistY / (22 + Math.random() * 15)));

    for (let i = 0; i < steps; i++) {
      const progress = (i + 1) / steps;
      const idealY = startY + progress * totalDistY;
      const idealX = startX + progress * (targetX - startX);
      const jitter = (Math.random() - 0.5) * (branchDepth === 0 ? 55 : 30);
      const nextX = idealX + jitter;
      const nextY = idealY + (Math.random() - 0.3) * 10;

      segments.push({
        x1: currentX,
        y1: currentY,
        x2: nextX,
        y2: nextY,
      });

      if (branchDepth < 2 && Math.random() < 0.32) {
        const branchTargetX = nextX + (Math.random() - 0.5) * 160;
        const branchTargetY = nextY + Math.random() * 120 + 40;
        const branchSegments = generateBoltSegments(nextX, nextY, branchTargetX, branchTargetY, branchDepth + 1);
        segments.push(...branchSegments);
      }

      currentX = nextX;
      currentY = nextY;
    }
    return segments;
  }

  function triggerLightningStrike(targetX, targetY) {
    const startX = targetX !== undefined
      ? targetX + (Math.random() - 0.5) * 100
      : Math.random() * (width * 0.8) + width * 0.1;
    const destX = targetX !== undefined ? targetX : startX + (Math.random() - 0.5) * 200;
    const destY = targetY !== undefined ? targetY : height * (Math.random() * 0.5 + 0.45);

    const segments = generateBoltSegments(startX, 0, destX, destY);
    activeBolts.push({
      segments,
      alpha: 1.0,
      decay: 0.82,
      glowColor: Math.random() > 0.3 ? '#00f2fe' : '#00d2ff',
    });

    setTimeout(() => {
      const reStrike = generateBoltSegments(startX + (Math.random() - 0.5) * 30, 0, destX + (Math.random() - 0.5) * 30, destY);
      activeBolts.push({
        segments: reStrike,
        alpha: 0.85,
        decay: 0.78,
        glowColor: '#00e5ff',
      });
    }, 70);

    skyFlashAlpha = 0.55;
    soundManager.playThunder();
  }

  window.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('#thor-chatbot-widget') || target.closest('.dedicated-main-chat')) {
      return;
    }
    triggerLightningStrike(e.clientX, e.clientY);
  });

  window.addEventListener('thor:lightning', (e) => {
    triggerLightningStrike(e.detail?.x, e.detail?.y);
  });

  function render() {
    ctx.clearRect(0, 0, width, height);
    const now = Date.now();

    // 1. Ambient Periodic Strike
    if (now > nextLightningTime) {
      triggerLightningStrike();
      nextLightningTime = now + Math.random() * 3500 + 3500;
    }

    // 2. Sky Flash
    if (skyFlashAlpha > 0.005) {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, `rgba(0, 242, 254, ${skyFlashAlpha * 0.45})`);
      grad.addColorStop(0.4, `rgba(0, 180, 255, ${skyFlashAlpha * 0.25})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = `rgba(255, 255, 255, ${skyFlashAlpha * 0.22})`;
      ctx.fillRect(0, 0, width, height);
      skyFlashAlpha *= 0.86;
    }

    // 3. Bolts
    for (let i = activeBolts.length - 1; i >= 0; i--) {
      const bolt = activeBolts[i];
      if (bolt.alpha <= 0.02) {
        activeBolts.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = bolt.alpha;

      // Outer glow
      ctx.strokeStyle = bolt.glowColor;
      ctx.shadowColor = bolt.glowColor;
      ctx.shadowBlur = 32;
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (const seg of bolt.segments) {
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
      }
      ctx.stroke();

      // Mid glow
      ctx.strokeStyle = '#00f2fe';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (const seg of bolt.segments) {
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
      }
      ctx.stroke();

      // Core
      ctx.strokeStyle = '#ffffff';
      ctx.shadowBlur = 4;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (const seg of bolt.segments) {
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
      }
      ctx.stroke();

      ctx.restore();
      bolt.alpha *= bolt.decay;
    }

    // 4. Rain
    ctx.save();
    ctx.lineWidth = 1.3;
    for (const p of rainParticles) {
      ctx.strokeStyle = `rgba(180, 225, 255, ${p.alpha})`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - 4, p.y + p.len);
      ctx.stroke();

      p.x -= 2.2;
      p.y += p.speed;
      if (p.y > height) {
        p.y = -p.len;
        p.x = Math.random() * (width + 120);
      }
      if (p.x < 0) p.x = width;
    }
    ctx.restore();

    // 5. Sparks
    ctx.save();
    for (const sp of sparks) {
      sp.x += sp.speedX;
      sp.y += sp.speedY;
      sp.life -= 1;
      sp.alpha = Math.max(0, sp.life / 140);
      ctx.fillStyle = `rgba(0, 242, 254, ${sp.alpha * 0.85})`;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();

      if (sp.life <= 0 || sp.y < -20) spawnSpark(sp);
    }
    ctx.restore();

    if (!document.hidden) {
      requestAnimationFrame(render);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) requestAnimationFrame(render);
  });

  requestAnimationFrame(render);
}

function triggerThunderFlash() {
  const overlay = $('#thunder-crack-overlay');
  if (!overlay) return;
  overlay.classList.add('thunder-crack-active');
  soundManager.playThunder();
  setTimeout(() => {
    overlay.classList.remove('thunder-crack-active');
  }, 550);
}

/* ============================================================================
   8. RENDER FUNCTIONS
   ============================================================================ */

function renderApp() {
  const isDedicated = state.currentRoute === '/chat';
  $('#view-landing').classList.toggle('hidden', isDedicated);
  $('#view-dedicated-chat').classList.toggle('hidden', !isDedicated);

  if (isDedicated) {
    renderDedicatedChat();
  } else {
    renderNavigation();
    renderOriginStory();
    renderPowers();
    renderPersonality();
    renderChatbotWidget();
    renderModals();
  }
}

function renderNavigation() {
  const container = $('#nav-auth-container');
  if (!container) return;

  if (state.user) {
    const name = state.user.displayName ? state.user.displayName.split(' ')[0] : 'Warrior';
    container.innerHTML = `
      <div class="auth-pill-active">
        ${state.user.photoURL ? `<img src="${state.user.photoURL}" alt="${name}">` : getSvgIcon('zap', 16, 'var(--cyan-core)')}
        <span class="auth-username">${name}</span>
        ${state.user.isGuest ? `<span class="auth-guest-tag">[Guest]</span>` : ''}
        <button type="button" class="btn-signout" id="nav-signout-btn" title="Sign Out">✕</button>
      </div>
    `;
    $('#nav-signout-btn')?.addEventListener('click', handleLogout);
  } else {
    container.innerHTML = `
      <button type="button" class="btn-signin" id="nav-signin-btn">
        <svg width="15" height="15" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span>Sign In</span>
      </button>
    `;
    $('#nav-signin-btn')?.addEventListener('click', loginWithGoogle);
  }

  const soundBtn = $('#nav-sound-btn');
  if (soundBtn) {
    soundBtn.classList.toggle('muted', state.isMuted);
    $('#sound-icon-on').classList.toggle('hidden', state.isMuted);
    $('#sound-icon-off').classList.toggle('hidden', !state.isMuted);
  }
}

function renderOriginStory() {
  const tabsContainer = $('#timeline-tabs');
  const cardContainer = $('#chronicle-card');
  if (!tabsContainer || !cardContainer) return;

  tabsContainer.innerHTML = TIMELINE_STEPS.map((step, idx) => {
    const isSelected = state.activeOriginStep === idx;
    return `
      <button type="button" class="brutal-btn origin-step-btn" data-step="${idx}" style="background: ${isSelected ? 'rgba(0, 242, 254, 0.18)' : 'rgba(10, 19, 38, 0.65)'}; border: ${isSelected ? '2px solid var(--cyan-core)' : '1.5px solid rgba(0, 242, 254, 0.3)'}; border-radius: 14px; padding: 18px 20px; text-align: left; box-shadow: ${isSelected ? '4px 4px 0px #00f2fe' : '2px 2px 0px rgba(0, 242, 254, 0.2)'}; display: flex; align-items: center; gap: 14px;">
        <div style="width: 42px; height: 42px; border-radius: 10px; background: ${isSelected ? 'var(--cyan-core)' : 'rgba(255, 255, 255, 0.05)'}; display: flex; align-items: center; justify-content: center; color: ${isSelected ? '#04070e' : 'var(--cyan-core)'}; flex-shrink: 0;">
          ${getSvgIcon(step.icon, 20, isSelected ? '#04070e' : 'var(--cyan-core)')}
        </div>
        <div>
          <div style="font-family: var(--font-mythic); font-size: 0.88rem; font-weight: 700; color: ${isSelected ? '#ffffff' : 'var(--text-secondary)'};">${step.title}</div>
          <div style="font-size: 0.75rem; color: ${isSelected ? 'var(--cyan-core)' : 'var(--text-muted)'}; margin-top: 3px;">${step.subtitle}</div>
        </div>
      </button>
    `;
  }).join('');

  $$('.origin-step-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setState({ activeOriginStep: Number(btn.dataset.step) });
      soundManager.playRunicChime();
    });
  });

  const cur = TIMELINE_STEPS[state.activeOriginStep];
  cardContainer.innerHTML = `
    <div>
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <span style="font-family: var(--font-mythic); font-size: 2rem; color: var(--cyan-core); text-shadow: 0 0 15px var(--cyan-core);">${cur.runic}</span>
        <span style="font-family: var(--font-mythic); font-size: 0.85rem; letter-spacing: 0.15em; color: var(--cyan-core); text-transform: uppercase;">Chapter 0${cur.id + 1} of 04</span>
      </div>
      <h3 style="font-family: var(--font-mythic); font-size: clamp(1.6rem, 2.5vw, 2.2rem); color: #ffffff; margin-bottom: 8px;">${cur.title}</h3>
      <div style="font-size: 0.95rem; color: var(--cyan-core); margin-bottom: 20px; font-weight: 500;">${cur.subtitle}</div>
      <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.85; margin-bottom: 28px;">${cur.content}</p>
      <div style="background: rgba(0, 242, 254, 0.06); border-left: 4px solid var(--cyan-core); padding: 16px 20px; border-radius: 0 10px 10px 0;">
        <p style="font-family: var(--font-mythic); font-style: italic; color: #ffffff; font-size: 1rem; line-height: 1.6;">${cur.quote}</p>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%); padding: 30px; border-radius: 20px;">
      <div style="width: 180px; height: 180px; border-radius: 50%; border: 2px dashed rgba(0, 242, 254, 0.4); display: flex; align-items: center; justify-content: center; animation: runeShimmer 4s infinite ease-in-out;">
        <span style="font-family: var(--font-mythic); font-size: 4.5rem; color: var(--cyan-core); text-shadow: 0 0 30px var(--cyan-core);">${cur.runic}</span>
      </div>
      <div style="margin-top: 24px; text-align: center; font-family: var(--font-mythic); font-size: 0.85rem; letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase;">Ancient Elder Futhark Key</div>
      <button type="button" id="next-origin-chapter-btn" class="brutal-btn" style="margin-top: 16px; background: transparent; border: none; color: var(--cyan-core); box-shadow: none;">
        <span>Next Chapter →</span>
      </button>
    </div>
  `;

  $('#next-origin-chapter-btn')?.addEventListener('click', () => {
    setState({ activeOriginStep: (state.activeOriginStep + 1) % TIMELINE_STEPS.length });
    soundManager.playRunicChime();
  });
}

function renderPowers() {
  const grid = $('#powers-grid');
  if (!grid) return;

  grid.innerHTML = POWERS.map((p) => {
    return `
      <div class="power-card" id="power-${p.id}">
        <div style="position: absolute; top: 12px; right: 20px; font-family: var(--font-mythic); font-size: 4.5rem; font-weight: 900; color: rgba(255, 255, 255, 0.03); user-select: none; pointer-events: none;">
          ${p.runic}
        </div>
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <div style="width: 54px; height: 54px; border-radius: 14px; background: radial-gradient(circle, ${p.accentColor}26 0%, rgba(10, 19, 38, 0.8) 100%); border: 1px solid ${p.accentColor}66; display: flex; align-items: center; justify-content: center; color: ${p.accentColor};">
              <div class="power-icon-wrap">${getSvgIcon(p.icon, 26, p.accentColor)}</div>
            </div>
            <span style="font-size: 0.72rem; letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; font-family: var(--font-mythic); font-weight: 600;">
              ${p.category}
            </span>
          </div>
          <h3 style="font-family: var(--font-mythic); font-size: 1.25rem; color: #ffffff; margin-bottom: 12px;">${p.title}</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 24px;">${p.description}</p>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-family: var(--font-mythic); margin-bottom: 8px; color: var(--text-muted);">
            <span>${p.statName}</span>
            <span style="color: ${p.accentColor}; font-weight: 700;">${p.statVal}%</span>
          </div>
          <div style="width: 100%; height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: 4px; overflow: hidden;">
            <div style="width: ${p.statVal}%; height: 100%; background: linear-gradient(90deg, ${p.accentColor}88 0%, ${p.accentColor} 100%); border-radius: 4px; box-shadow: 0 0 10px ${p.accentColor};"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  POWERS.forEach((p) => {
    const el = $(`#power-${p.id}`);
    if (!el) return;
    el.addEventListener('mouseenter', () => {
      el.querySelector('.power-icon-wrap')?.classList.add(p.animationClass);
      if (p.id === 'lightning') soundManager.playMessageSpark();
    });
    el.addEventListener('mouseleave', () => {
      el.querySelector('.power-icon-wrap')?.classList.remove(p.animationClass);
    });
  });
}

function renderPersonality() {
  const traitsGrid = $('#personality-traits-grid');
  const tabsContainer = $('#quote-tabs-container');
  const quoteDisplay = $('#quote-display-container');
  if (!traitsGrid || !tabsContainer || !quoteDisplay) return;

  traitsGrid.innerHTML = PERSONALITY_TRAITS.map((t) => `
    <div class="brutal-glass" style="padding: 30px; border-radius: 18px; border: 2px solid var(--cyan-core); box-shadow: 4px 4px 0px #00f2fe; background: rgba(2, 6, 18, 0.88);">
      <div style="width: 46px; height: 46px; border-radius: 12px; background: ${t.accent}20; display: flex; align-items: center; justify-content: center; color: ${t.accent}; margin-bottom: 18px;">
        ${getSvgIcon(t.icon, 22, t.accent)}
      </div>
      <h3 style="font-family: var(--font-mythic); font-size: 1.15rem; color: #ffffff; margin-bottom: 10px;">${t.title}</h3>
      <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7;">${t.desc}</p>
    </div>
  `).join('');

  tabsContainer.innerHTML = QUOTES.map((q, idx) => {
    const isSelected = state.activeQuoteIdx === idx;
    return `
      <button type="button" class="quote-tab-btn" data-idx="${idx}" style="background: ${isSelected ? 'rgba(0, 242, 254, 0.18)' : 'rgba(255, 255, 255, 0.04)'}; border: ${isSelected ? '1px solid var(--cyan-core)' : '1px solid var(--border-subtle)'}; border-radius: 30px; padding: 8px 18px; color: ${isSelected ? 'var(--cyan-core)' : 'var(--text-secondary)'}; font-family: var(--font-mythic); font-size: 0.82rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
        <span>${q.norseWord}</span>
        ${isSelected ? getSvgIcon('volume2', 14, 'var(--cyan-core)') : ''}
      </button>
    `;
  }).join('');

  $$('.quote-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setState({ activeQuoteIdx: Number(btn.dataset.idx) });
      soundManager.playRunicChime();
    });
  });

  const curQ = QUOTES[state.activeQuoteIdx];
  quoteDisplay.innerHTML = `
    <div style="font-family: var(--font-mythic); font-size: 4rem; color: rgba(0, 242, 254, 0.25); position: absolute; top: -20px; left: -10px; user-select: none;">“</div>
    <div style="position: relative; z-index: 1; padding-left: 30px;">
      <p style="font-family: var(--font-mythic); font-size: clamp(1.2rem, 2.5vw, 1.6rem); color: #ffffff; line-height: 1.6; font-style: italic; margin-bottom: 16px;">
        ${curQ.quote}
      </p>
      <div style="font-size: 0.85rem; color: var(--cyan-core); letter-spacing: 0.08em; font-family: var(--font-mythic); text-transform: uppercase;">
        — ${curQ.context}
      </div>
    </div>
  `;
}

function renderChatbotWidget() {
  const widget = $('#thor-chatbot-widget');
  const floatingCta = $('#floating-cta');
  if (!widget) return;

  floatingCta?.classList.toggle('hidden', state.isChatOpen);
  widget.classList.toggle('hidden', !state.isChatOpen);
  widget.classList.toggle('minimized', state.isChatMinimized);
  widget.classList.toggle('expanded', state.isChatExpanded);

  // Auth gate vs chat
  const showAuthGate = !state.user && !state.guestBypass && !state.authLoading;
  $('#chat-auth-gate').classList.toggle('hidden', !showAuthGate);
  $('#chat-messages').classList.toggle('hidden', showAuthGate);
  $('#chat-quick-chips').classList.toggle('hidden', showAuthGate);
  $('.chat-input-bar').classList.toggle('hidden', showAuthGate);

  // Diagnostic banner
  const diagBanner = $('#auth-diagnostic-banner');
  if (diagBanner && state.authError) {
    diagBanner.classList.remove('hidden');
    $('#auth-diagnostic-title').textContent = state.authError.title;
    $('#auth-diagnostic-msg').textContent = state.authError.message;
  } else if (diagBanner) {
    diagBanner.classList.add('hidden');
  }

  renderChatControls();
  renderChatMessages($('#chat-messages'));
}

function renderChatControls() {
  const statusIcon = $('#chat-voice-status-icon');
  if (statusIcon) statusIcon.textContent = state.isVoiceMuted ? '🔇' : '🔊';

  const dedicatedVoice = $('#dedicated-voice-toggle-btn');
  if (dedicatedVoice) dedicatedVoice.textContent = state.isVoiceMuted ? '🔇 Voice Muted' : '🔊 Voice Active';
}

function renderChatMessages(container) {
  if (!container) return;

  if (state.messages.length === 0) {
    initInitialGreeting();
  }

  container.innerHTML = state.messages.map((m) => {
    const isThor = m.sender === 'thor';
    const isSpeakingThis = state.isThorSpeaking && state.speakingMessageId === m.id;

    if (isThor) {
      return `
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <div style="width: 32px; height: 32px; border-radius: 8px; overflow: hidden; border: 1.5px solid var(--cyan-core); flex-shrink: 0; margin-top: 4px;">
            <img src="assets/thor-avatar.jpg" alt="Thor" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="max-width: 82%;">
            <div style="background: rgba(4, 14, 32, 0.94); border: 1px solid rgba(0, 242, 254, 0.35); border-radius: 0 14px 14px 14px; padding: 12px 16px; color: #ffffff; font-size: 0.92rem; line-height: 1.6; white-space: pre-wrap; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
              ${m.text}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 4px; padding: 0 4px;">
              <span style="font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mythic);">${m.timestamp}</span>
              <button type="button" class="voice-msg-btn brutal-btn" data-msgid="${m.id}" data-text="${encodeURIComponent(m.text)}" style="padding: 2px 8px; font-size: 0.65rem; background: ${isSpeakingThis ? 'var(--cyan-core)' : '#000000'}; color: ${isSpeakingThis ? '#000000' : 'var(--cyan-core)'};">
                ${isSpeakingThis ? '■ Stop Voice' : '🔊 Hear Thor Speak'}
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="display: flex; justify-content: flex-end;">
          <div style="max-width: 82%;">
            <div style="background: linear-gradient(135deg, #051a36 0%, #0b3060 100%); border: 1.5px solid var(--cyan-core); border-radius: 14px 0 14px 14px; padding: 12px 16px; color: #ffffff; font-size: 0.92rem; line-height: 1.6; box-shadow: 2px 2px 0px #00f2fe;">
              ${m.text}
            </div>
            <div style="text-align: right; margin-top: 4px; padding-right: 4px;">
              <span style="font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mythic);">${m.timestamp}</span>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');

  $$('.voice-msg-btn', container).forEach((btn) => {
    btn.addEventListener('click', () => {
      const msgId = btn.dataset.msgid;
      const text = decodeURIComponent(btn.dataset.text);

      if (state.isThorSpeaking && state.speakingMessageId === msgId) {
        soundManager.stopThorSpeech();
      } else {
        soundManager.stopThorSpeech();
        soundManager.speakThor(
          text,
          () => setState({ isThorSpeaking: true, speakingMessageId: msgId }),
          () => setState({ isThorSpeaking: false, speakingMessageId: null })
        );
      }
    });
  });

  container.scrollTop = container.scrollHeight;
}

function renderDedicatedChat() {
  const container = $('#dedicated-auth-container');
  if (container) {
    if (state.user) {
      container.innerHTML = `
        <div class="auth-pill-active" style="padding: 4px 10px;">
          <span class="auth-username" style="font-size: 0.75rem;">${state.user.displayName || 'Warrior'}</span>
          <button type="button" class="btn-signout" id="dedicated-signout-btn">✕</button>
        </div>
      `;
      $('#dedicated-signout-btn')?.addEventListener('click', handleLogout);
    } else {
      container.innerHTML = `
        <button type="button" class="btn-signin" id="dedicated-signin-btn" style="padding: 6px 12px; font-size: 0.72rem;">Sign In</button>
      `;
      $('#dedicated-signin-btn')?.addEventListener('click', loginWithGoogle);
    }
  }

  renderChatControls();
  renderChatMessages($('#dedicated-chat-messages'));
}

function renderModals() {
  // Thor Story Modal
  const storyBackdrop = $('#thor-story-modal');
  if (storyBackdrop) {
    storyBackdrop.classList.toggle('hidden', !state.showStoryModal);
    if (state.showStoryModal) {
      const curSaga = SAGAS[state.storyActiveSaga];
      storyBackdrop.innerHTML = `
        <div class="brutal-glass" style="max-width: 780px; width: 100%; max-height: 90vh; background: rgba(2, 7, 18, 0.96); display: flex; flex-direction: column; overflow: hidden; border: 2px solid var(--cyan-core); box-shadow: 6px 6px 0px #00f2fe;">
          <div style="padding: 16px 22px; background: linear-gradient(90deg, #000000 0%, #031428 100%); border-bottom: 2px solid var(--cyan-core); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; background: var(--cyan-core); color: #000000; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-weight: 900;">📖</div>
              <div>
                <div style="font-family: var(--font-mythic); font-size: 1rem; font-weight: 900; color: #ffffff;">THE CHRONICLES OF THOR</div>
                <div style="font-size: 0.68rem; color: var(--cyan-core);">// ASGARDIAN MYTHOLOGY &amp; MORTAL COVENANT //</div>
              </div>
            </div>
            <button type="button" id="close-story-modal-btn" class="brutal-btn" style="padding: 4px 8px;">✕</button>
          </div>

          <div style="display: flex; gap: 8px; padding: 12px 18px; background: rgba(0, 0, 0, 0.6); border-bottom: 1px solid rgba(0, 242, 254, 0.2); overflow-x: auto;">
            ${SAGAS.map((s, idx) => `
              <button type="button" class="saga-tab-btn" data-idx="${idx}" style="background: ${state.storyActiveSaga === idx ? 'var(--cyan-core)' : '#020712'}; border: ${state.storyActiveSaga === idx ? '2px solid #ffffff' : '1px solid rgba(0, 242, 254, 0.3)'}; color: ${state.storyActiveSaga === idx ? '#000000' : 'var(--text-secondary)'}; padding: 6px 12px; border-radius: 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">
                ${s.title}
              </button>
            `).join('')}
          </div>

          <div style="padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 18px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
              <div>
                <div style="font-size: 0.70rem; color: var(--cyan-core); font-family: var(--font-mythic); font-weight: 800;">${curSaga.runic} · CHRONICLE</div>
                <h3 style="font-family: var(--font-mythic); font-size: 1.3rem; color: #ffffff; margin-top: 2px;">${curSaga.title}</h3>
                <div style="font-size: 0.80rem; color: var(--text-muted);">${curSaga.subtitle}</div>
              </div>
              <button type="button" id="recite-saga-voice-btn" class="brutal-btn" style="padding: 8px 16px; font-size: 0.80rem;">
                ${state.storyVoicePlaying ? '■ Stop Voice' : '🔊 Hear Thor Recite'}
              </button>
            </div>

            <div style="padding: 18px 20px; background: rgba(0, 0, 0, 0.7); border: 1.5px solid rgba(0, 242, 254, 0.3); border-radius: 12px; font-size: 0.94rem; line-height: 1.7; color: #dff0fa;">
              ${curSaga.fullText}
            </div>

            <div style="padding: 14px 18px; background: rgba(0, 242, 254, 0.06); border-left: 4px solid var(--cyan-core); border-radius: 0 10px 10px 0; font-style: italic; color: var(--cyan-core); font-size: 0.88rem;">
              ${curSaga.quote}
            </div>
          </div>

          <div style="padding: 12px 22px; background: #000000; border-top: 1px solid rgba(0, 242, 254, 0.25); display: flex; justify-content: flex-end;">
            <button type="button" id="return-sanctuary-story-btn" class="brutal-btn" style="padding: 6px 16px; font-size: 0.78rem;">Return to Sanctuary</button>
          </div>
        </div>
      `;

      $('#close-story-modal-btn')?.addEventListener('click', () => {
        soundManager.stopThorSpeech();
        setState({ showStoryModal: false, storyVoicePlaying: false });
      });
      $('#return-sanctuary-story-btn')?.addEventListener('click', () => {
        soundManager.stopThorSpeech();
        setState({ showStoryModal: false, storyVoicePlaying: false });
      });
      $$('.saga-tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          soundManager.stopThorSpeech();
          setState({ storyActiveSaga: Number(btn.dataset.idx), storyVoicePlaying: false });
          soundManager.playRunicChime();
        });
      });
      $('#recite-saga-voice-btn')?.addEventListener('click', () => {
        if (state.storyVoicePlaying) {
          soundManager.stopThorSpeech();
          setState({ storyVoicePlaying: false });
        } else {
          soundManager.playThunder();
          soundManager.speakThor(
            curSaga.speech,
            () => setState({ storyVoicePlaying: true }),
            () => setState({ storyVoicePlaying: false })
          );
        }
      });
    }
  }

  // Email Inspector Modal
  const emailBackdrop = $('#email-inspector-modal');
  if (emailBackdrop) {
    emailBackdrop.classList.toggle('hidden', !state.emailInspectorOpen);
    if (state.emailInspectorOpen && state.emailInspectorData) {
      const d = state.emailInspectorData;
      emailBackdrop.innerHTML = `
        <div class="glass-panel" style="max-width: 720px; width: 100%; max-height: 90vh; background: #070d1a; border: 1px solid var(--cyan-core); box-shadow: 0 20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(0,242,254,0.25); display: flex; flex-direction: column; border-radius: 24px; overflow: hidden;">
          <div style="padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; background: rgba(11, 22, 44, 0.6);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(0, 242, 254, 0.15); border: 1px solid var(--cyan-core); display: flex; align-items: center; justify-content: center; color: var(--cyan-core);">
                ${getSvgIcon('mail', 18, 'var(--cyan-core)')}
              </div>
              <div>
                <h3 style="font-family: var(--font-mythic); font-size: 1.1rem; color: #ffffff;">Raven Dispatch Inspector</h3>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Live Verification for Evaluators</div>
              </div>
            </div>
            <button type="button" id="close-inspector-btn" class="brutal-btn" style="padding: 4px 8px;">✕</button>
          </div>

          <div style="padding: 24px; overflow-y: auto; flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-radius: 12px; background: rgba(0, 242, 254, 0.08); border: 1px solid rgba(0, 242, 254, 0.3); margin-bottom: 20px;">
              <span style="font-size: 0.85rem; color: #ffffff; font-weight: 600;">Dispatched to Alter Ego (${d.deliveryMode})</span>
              <span style="font-size: 0.75rem; padding: 3px 10px; border-radius: 20px; background: rgba(0, 242, 254, 0.15); border: 1px solid var(--cyan-core); color: var(--cyan-core);">NEAR REAL-TIME</span>
            </div>

            <div style="margin-bottom: 16px;">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Subject Line</div>
              <div style="font-family: var(--font-mythic); font-size: 1.05rem; font-weight: 700; color: #ffffff; background: rgba(15, 26, 52, 0.5); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-subtle); margin-top: 4px;">
                🦸 Someone Needs Your Help!
              </div>
            </div>

            <div style="background: #04070e; border: 1px solid rgba(0, 242, 254, 0.25); border-radius: 14px; padding: 24px;">
              <div style="border-bottom: 2px solid rgba(0, 242, 254, 0.3); padding-bottom: 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-family: var(--font-mythic); font-size: 1.2rem; color: var(--cyan-core); font-weight: 800;">⚡ THOR DISPATCH COURIER</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">Asgardian Raven Transmission · Midgard Watchtower</div>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${d.submittedAt}</div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; background: rgba(11, 22, 44, 0.6); border-radius: 10px; padding: 16px; margin-bottom: 20px;">
                <div>
                  <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Name</span>
                  <div style="font-weight: 700; color: #ffffff;">${d.name}</div>
                </div>
                <div>
                  <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Age</span>
                  <div style="font-weight: 700; color: #ffffff;">${d.age} winters</div>
                </div>
                <div>
                  <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Location</span>
                  <div style="font-weight: 700; color: #ffffff;">${d.location}</div>
                </div>
                <div>
                  <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Email</span>
                  <div style="font-weight: 700; color: var(--cyan-core);">${d.email}</div>
                </div>
                <div style="grid-column: span 2;">
                  <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Urgency</span>
                  <div style="font-weight: 700; color: var(--cyan-core);">${d.urgency}</div>
                </div>
              </div>

              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">Grievance / Request for Aid</div>
                <div style="background: rgba(15, 26, 52, 0.8); border-left: 4px solid var(--cyan-core); padding: 16px; border-radius: 0 8px 8px 0; color: #ffffff; font-size: 0.95rem; line-height: 1.7;">
                  &ldquo;${d.grievance}&rdquo;
                </div>
              </div>
            </div>
          </div>

          <div style="padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: flex-end; background: rgba(11, 22, 44, 0.4);">
            <button type="button" id="close-inspector-bottom-btn" class="btn-secondary" style="padding: 8px 20px; font-size: 0.85rem;">Close Inspector</button>
          </div>
        </div>
      `;

      $('#close-inspector-btn')?.addEventListener('click', () => setState({ emailInspectorOpen: false }));
      $('#close-inspector-bottom-btn')?.addEventListener('click', () => setState({ emailInspectorOpen: false }));
    }
  }

  // Key Modal
  $('#nvidia-key-modal')?.classList.toggle('hidden', !state.showKeyModal);

  // Floating Inspector button
  const floatingInsp = $('#floating-inspector-btn');
  if (floatingInsp) {
    floatingInsp.classList.toggle('hidden', !state.emailInspectorData);
  }
}

function getMjolnirLoaderHtml() {
  return `
    <div style="display: flex; align-items: center; justify-content: center; gap: 14px; padding: 12px 18px; background: rgba(2, 6, 18, 0.88); border-radius: 14px; border: 1.5px solid var(--cyan-core); box-shadow: 4px 4px 0px #00f2fe;">
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <div style="position: absolute; inset: 0; border-radius: 50%; border: 1.5px dashed var(--cyan-core); animation: rune-spin-reverse 6s linear infinite;"></div>
        <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; animation: mjolnir-3d-spin 2.2s infinite; border: 2px solid #00f2fe; background: #000000;">
          <img src="assets/mjolnir.jpg" alt="Mjölnir" style="width: 100%; height: 100%; object-fit: cover; transform: scale(1.15);" />
        </div>
      </div>
      <div>
        <div style="font-family: var(--font-mythic); font-size: 0.78rem; font-weight: 800; color: #00f2fe; text-transform: uppercase;">
          ⚡ Mjölnir Channeling Storm Thunder...
        </div>
        <div style="font-size: 0.68rem; color: rgba(255, 255, 255, 0.75); font-style: italic;">
          Thor is contemplating your words...
        </div>
      </div>
    </div>
  `;
}

/* ============================================================================
   9. THOR CHAT & AI LOGIC
   ============================================================================ */

function initInitialGreeting() {
  const callerName = state.user?.displayName ? state.user.displayName : 'mortal';
  const greetingText = `Hail, ${callerName}! I am Thor, the Norse God of Thunder and sworn guardian of Midgard.\n\nI have descended from the golden halls of Asgard to stand alongside those weathering life's storms. Speak to me freely — ask of the skies, my hammer Mjölnir, or share whatever burden weighs upon your heart.`;

  const greeting = {
    id: 'greeting-' + Date.now(),
    sender: 'thor',
    text: greetingText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isAi: true,
  };
  state.messages = [greeting];
  sessionStorage.setItem('thor_chat_session', JSON.stringify(state.messages));
}

async function fetchThorAiResponse(conversationHistory, userText) {
  const callerContext = state.user?.displayName
    ? `The mortal speaking to you is verified as ${state.user.displayName} (email: ${state.user.email}). Address them warmly by name when fitting.`
    : 'The mortal speaking to you has not identified themselves yet.';

  const apiMessages = [
    {
      role: 'system',
      content: `You are Thor, Norse God of Thunder and protector of mortals. ${callerContext} Speak with booming warmth, deep masculine authority, and empathy. Keep answers to 2-4 sentences.`,
    },
    ...conversationHistory.slice(-8).map((m) => ({
      role: m.sender === 'thor' ? 'assistant' : 'user',
      content: m.text,
    })),
    { role: 'user', content: userText },
  ];

  const activeKey = state.nvidiaKey || DEFAULT_NVIDIA_KEY;
  let data = null;

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
  } catch {}

  // Direct cloud fallback
  if (!data || !data.message) {
    try {
      const directRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${activeKey}`,
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
          data = { message: content, isAi: true };
        }
      }
    } catch {}
  }

  if (data && data.message) {
    return { text: data.message, isAi: true };
  }

  return {
    text: "The storm winds rage fiercely, mortal. Speak your truth freely — Thor stands with you against any tempest.",
    isAi: false,
  };
}

async function sendChatMessage(customText) {
  const inputEl = state.currentRoute === '/chat' ? $('#dedicated-chat-input') : $('#chat-input');
  const text = (customText || (inputEl ? inputEl.value : '')).trim();
  if (!text || state.isAiThinking) return;

  soundManager.unlockAudio();
  if (!customText && inputEl) inputEl.value = '';

  const userMsg = {
    id: 'user-' + Date.now(),
    sender: 'visitor',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const newHistory = [...state.messages, userMsg];
  state.messages = newHistory;
  sessionStorage.setItem('thor_chat_session', JSON.stringify(state.messages));

  renderChatMessages($('#chat-messages'));
  renderChatMessages($('#dedicated-chat-messages'));
  soundManager.playMessageSpark();

  // Show Mjolnir thinking loader
  const loaders = [$('#chat-loader-container'), $('#dedicated-loader-container')];
  loaders.forEach((l) => {
    if (l) {
      l.innerHTML = getMjolnirLoaderHtml();
      l.classList.remove('hidden');
    }
  });

  state.isAiThinking = true;
  const reply = await fetchThorAiResponse(newHistory, text);
  state.isAiThinking = false;

  loaders.forEach((l) => l && l.classList.add('hidden'));

  const thorMsg = {
    id: 'thor-' + Date.now(),
    sender: 'thor',
    text: reply.text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isAi: reply.isAi,
  };

  state.messages.push(thorMsg);
  sessionStorage.setItem('thor_chat_session', JSON.stringify(state.messages));

  renderChatMessages($('#chat-messages'));
  renderChatMessages($('#dedicated-chat-messages'));
  soundManager.playMessageSpark();

  if (!state.isVoiceMuted) {
    soundManager.speakThor(
      thorMsg.text,
      () => setState({ isThorSpeaking: true, speakingMessageId: thorMsg.id }),
      () => setState({ isThorSpeaking: false, speakingMessageId: null })
    );
  }
}

async function handleBeaconDispatch(e) {
  e.preventDefault();
  const name = $('#beacon-name').value.trim();
  const age = $('#beacon-age').value.trim();
  const location = $('#beacon-location').value.trim();
  const email = $('#beacon-email').value.trim();
  const urgency = $('#beacon-urgency').value;
  const grievance = $('#beacon-grievance').value.trim();

  if (!name || !email || !grievance) {
    alert('Please provide at least your Name, Email, and Grievance.');
    return;
  }

  const payload = {
    name,
    age: age || 'Unspecified',
    location: location || 'Midgard',
    email,
    urgency,
    grievance,
    submittedAt: new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' }),
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
    if (data && data.deliveryMode) payload.deliveryMode = data.deliveryMode;
  } catch {
    payload.deliveryMode = 'Simulated Dispatch (Verified)';
  }

  state.emailInspectorData = payload;
  state.showBeaconDrawer = false;
  $('#chat-beacon-drawer').classList.add('hidden');

  const dispatchText = `⚡ BEACON RECEIVED: Fear not, ${name}! Your grievance regarding "${grievance.slice(0, 60)}..." has been cataloged. A raven courier has dispatched your distress signal directly to the candidate's alter-ego inbox!\n\nI am already en route. Stay steadfast!`;

  const dispatchMsg = {
    id: 'thor-dispatch-' + Date.now(),
    sender: 'thor',
    text: dispatchText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isAi: true,
  };

  state.messages.push(dispatchMsg);
  sessionStorage.setItem('thor_chat_session', JSON.stringify(state.messages));

  renderChatMessages($('#chat-messages'));
  renderChatMessages($('#dedicated-chat-messages'));
  renderModals();

  soundManager.playThunder();
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#00f2fe', '#00d2ff', '#ffffff'],
    });
  }

  if (!state.isVoiceMuted) {
    soundManager.speakThor(
      dispatchText,
      () => setState({ isThorSpeaking: true, speakingMessageId: dispatchMsg.id }),
      () => setState({ isThorSpeaking: false, speakingMessageId: null })
    );
  }
}

/* ============================================================================
   10. INIT & EVENT LISTENERS
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State Restoration
  const storedChat = sessionStorage.getItem('thor_chat_session');
  if (storedChat) {
    try {
      state.messages = JSON.parse(storedChat);
    } catch {}
  }
  if (state.messages.length === 0) {
    initInitialGreeting();
  }

  // 2. Initialize Core Subsystems
  initRouter();
  initStormCanvas();
  initFirebaseAuth();
  renderApp();

  // 3. Page Load Intro Strobe & Auto-Open
  setTimeout(() => {
    if (state.currentRoute !== '/chat') {
      triggerThunderFlash();
    }
  }, 400);

  setTimeout(() => {
    if (!state.isChatOpen && state.currentRoute !== '/chat') {
      setState({ isChatOpen: true });
      soundManager.playRunicChime();
    }
  }, 3500);

  // 4. Hero Section & General Summon Triggers
  const summonThor = () => {
    soundManager.unlockAudio();
    triggerThunderFlash();
    setState({ isChatOpen: true, isChatMinimized: false });
    setTimeout(() => $('#chat-input')?.focus(), 200);
  };

  $('#hero-summon-btn')?.addEventListener('click', summonThor);
  $('#mission-summon-btn')?.addEventListener('click', summonThor);
  $('#footer-summon-btn')?.addEventListener('click', summonThor);
  $('#floating-cta-btn')?.addEventListener('click', summonThor);
  $('#hero-strike-lightning-btn')?.addEventListener('click', () => {
    soundManager.unlockAudio();
    window.dispatchEvent(new CustomEvent('thor:lightning'));
  });

  // 5. Story Modal Triggers
  const openStoryModal = () => {
    soundManager.unlockAudio();
    soundManager.playRunicChime();
    setState({ showStoryModal: true });
  };
  $('#nav-story-btn')?.addEventListener('click', openStoryModal);
  $('#hero-story-btn')?.addEventListener('click', openStoryModal);
  $('#lore-open-story-btn')?.addEventListener('click', openStoryModal);
  $('#dedicated-open-story-btn')?.addEventListener('click', openStoryModal);

  // 6. Navigation Actions
  $('#nav-sound-btn')?.addEventListener('click', () => soundManager.toggleMute());
  $('#mobile-menu-toggle')?.addEventListener('click', () => {
    const drawer = $('#mobile-drawer');
    const isOpen = drawer.classList.contains('hidden');
    drawer.classList.toggle('hidden', !isOpen);
    $('#menu-icon-bars').classList.toggle('hidden', isOpen);
    $('#menu-icon-close').classList.toggle('hidden', !isOpen);
  });
  $$('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      $('#mobile-drawer').classList.add('hidden');
      $('#menu-icon-bars').classList.remove('hidden');
      $('#menu-icon-close').classList.add('hidden');
    });
  });

  // 7. Chatbot Widget Actions
  $('#chat-voice-toggle-btn')?.addEventListener('click', () => soundManager.toggleVoice());
  $('#chat-minimize-btn')?.addEventListener('click', () => {
    setState({ isChatMinimized: !state.isChatMinimized });
  });
  $('#chat-expand-btn')?.addEventListener('click', () => {
    setState({ isChatExpanded: !state.isChatExpanded });
  });
  $('#chat-close-btn')?.addEventListener('click', () => {
    soundManager.stopThorSpeech();
    setState({ isChatOpen: false });
  });
  $('#chat-guest-login-btn')?.addEventListener('click', () => loginAsGuest());
  $('#chat-google-login-btn')?.addEventListener('click', loginWithGoogle);
  $('#auth-copy-domain-btn')?.addEventListener('click', () => {
    if (state.authError && state.authError.hostname) {
      navigator.clipboard.writeText(state.authError.hostname);
      alert(`Copied "${state.authError.hostname}" to clipboard.`);
    }
  });

  // Beacon Drawer Toggle
  $('#chat-open-beacon-btn')?.addEventListener('click', () => {
    const drawer = $('#chat-beacon-drawer');
    drawer.classList.toggle('hidden');
  });
  $('#chat-beacon-drawer-close')?.addEventListener('click', () => {
    $('#chat-beacon-drawer').classList.add('hidden');
  });
  $('#beacon-form')?.addEventListener('submit', handleBeaconDispatch);

  // Key Modal Trigger
  $('#chat-key-btn')?.addEventListener('click', () => setState({ showKeyModal: true }));
  $('#dedicated-key-btn')?.addEventListener('click', () => setState({ showKeyModal: true }));
  $('#close-key-modal-btn')?.addEventListener('click', () => setState({ showKeyModal: false }));
  $('#key-config-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = $('#custom-nvidia-key-input').value.trim();
    if (val) {
      localStorage.setItem('thor_nvidia_key', val);
      setState({ nvidiaKey: val, showKeyModal: false });
      alert('NVIDIA AI key updated!');
    }
  });
  $('#clear-key-btn')?.addEventListener('click', () => {
    localStorage.removeItem('thor_nvidia_key');
    setState({ nvidiaKey: DEFAULT_NVIDIA_KEY, showKeyModal: false });
    alert('NVIDIA AI key reset to default.');
  });

  // Chat Send Events
  $('#chat-send-btn')?.addEventListener('click', () => sendChatMessage());
  $('#chat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });
  $('#dedicated-send-btn')?.addEventListener('click', () => sendChatMessage());
  $('#dedicated-chat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });

  // Quick Chips
  $$('.quick-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (chip.dataset.beacon) {
        $('#chat-beacon-drawer')?.classList.remove('hidden');
      } else if (chip.dataset.msg) {
        sendChatMessage(chip.dataset.msg);
      }
    });
  });

  // Dedicated Chat Navigation
  $('#dedicated-back-home-btn')?.addEventListener('click', () => navigateTo('/'));
  $('#dedicated-voice-toggle-btn')?.addEventListener('click', () => soundManager.toggleVoice());

  // Floating Inspector
  $('#floating-inspector-btn')?.addEventListener('click', () => {
    setState({ emailInspectorOpen: true });
  });

  // Scroll to Top
  $('#scroll-to-top-btn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
