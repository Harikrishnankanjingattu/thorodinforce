import React, { useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';

interface RainParticle {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
}

interface SparkParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  life: number;
}

interface LightningSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
}

interface ActiveBolt {
  segments: LightningSegment[];
  alpha: number;
  decay: number;
  coreColor: string;
  glowColor: string;
  isMain: boolean;
}

export const StormCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize rain drops
    const rainCount = Math.min(220, Math.floor(width / 8));
    const rainParticles: RainParticle[] = [];
    for (let i = 0; i < rainCount; i++) {
      rainParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        len: Math.random() * 25 + 12,
        speed: Math.random() * 14 + 16,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    // Initialize electric sparks
    const sparkCount = 45;
    const sparks: SparkParticle[] = [];
    const spawnSpark = (spark?: SparkParticle): SparkParticle => {
      const sp = spark || {
        x: 0,
        y: 0,
        size: 1,
        speedX: 0,
        speedY: 0,
        alpha: 1,
        life: 1,
      };
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

    // Active Lightning Bolts collection
    const activeBolts: ActiveBolt[] = [];
    let skyFlashAlpha = 0;
    let nextLightningTime = Date.now() + 2500;

    const generateBoltSegments = (
      startX: number,
      startY: number,
      targetX: number,
      targetY: number,
      branchDepth = 0
    ): LightningSegment[] => {
      const segments: LightningSegment[] = [];
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
          width: Math.max(1, (1 - progress * 0.5) * (branchDepth === 0 ? 3.5 : 1.8)),
        });

        // Chance to spawn a recursive side-branch
        if (branchDepth < 2 && Math.random() < 0.32) {
          const branchTargetX = nextX + (Math.random() - 0.5) * 160;
          const branchTargetY = nextY + Math.random() * 120 + 40;
          const branchSegments = generateBoltSegments(
            nextX,
            nextY,
            branchTargetX,
            branchTargetY,
            branchDepth + 1
          );
          segments.push(...branchSegments);
        }

        currentX = nextX;
        currentY = nextY;
      }

      return segments;
    };

    const triggerLightningStrike = (targetX?: number, targetY?: number) => {
      const startX =
        targetX !== undefined
          ? targetX + (Math.random() - 0.5) * 100
          : Math.random() * (width * 0.8) + width * 0.1;
      const destX = targetX !== undefined ? targetX : startX + (Math.random() - 0.5) * 200;
      const destY = targetY !== undefined ? targetY : height * (Math.random() * 0.5 + 0.45);

      const segments = generateBoltSegments(startX, 0, destX, destY);

      activeBolts.push({
        segments,
        alpha: 1.0,
        decay: 0.82,
        coreColor: '#ffffff',
        glowColor: Math.random() > 0.3 ? '#00f2fe' : '#00d2ff',
        isMain: true,
      });

      // Quick restrike echo (fork flicker)
      setTimeout(() => {
        const reStrike = generateBoltSegments(
          startX + (Math.random() - 0.5) * 30,
          0,
          destX + (Math.random() - 0.5) * 30,
          destY
        );
        activeBolts.push({
          segments: reStrike,
          alpha: 0.85,
          decay: 0.78,
          coreColor: '#ffffff',
          glowColor: '#00e5ff',
          isMain: false,
        });
      }, 70);

      skyFlashAlpha = 0.55;
      soundManager.playThunder();
    };

    // User Interactive Click-To-Lightning: click anywhere to summon lightning!
    const handleWindowClick = (e: MouseEvent) => {
      // Don't intercept if clicking directly on an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('#thor-chatbot-widget')
      ) {
        return;
      }
      triggerLightningStrike(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleWindowClick);

    // Listen for custom event 'thor:lightning'
    const handleCustomLightning = (e: Event) => {
      const customEvent = e as CustomEvent<{ x?: number; y?: number }>;
      triggerLightningStrike(customEvent.detail?.x, customEvent.detail?.y);
    };
    window.addEventListener('thor:lightning', handleCustomLightning);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();

      // 1. Ambient periodic lightning (every 3.5 to 7 seconds)
      if (now > nextLightningTime) {
        triggerLightningStrike();
        nextLightningTime = now + Math.random() * 3500 + 3500;
      }

      // 2. Draw Atmospheric Sky Flash
      if (skyFlashAlpha > 0.005) {
        // Pure Neon Blue and White sky flash bloom
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, `rgba(0, 242, 254, ${skyFlashAlpha * 0.45})`);
        grad.addColorStop(0.4, `rgba(0, 180, 255, ${skyFlashAlpha * 0.25})`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Core white screen flash
        ctx.fillStyle = `rgba(255, 255, 255, ${skyFlashAlpha * 0.22})`;
        ctx.fillRect(0, 0, width, height);

        skyFlashAlpha *= 0.86;
      }

      // 3. Render Active Lightning Bolts (Multi-layered glow + core)
      for (let i = activeBolts.length - 1; i >= 0; i--) {
        const bolt = activeBolts[i];

        if (bolt.alpha <= 0.02) {
          activeBolts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = bolt.alpha;

        // Layer A: Wide outer electric atmospheric glow
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

        // Layer B: Intense mid-glow
        ctx.strokeStyle = '#00f2fe';
        ctx.shadowBlur = 14;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (const seg of bolt.segments) {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        // Layer C: Pure white plasma core
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

      // 4. Render Rain Droplets
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
        if (p.x < 0) {
          p.x = width;
        }
      }
      ctx.restore();

      // 5. Render Electric Sparks & Embers
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

        if (sp.life <= 0 || sp.y < -20) {
          spawnSpark(sp);
        }
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('thor:lightning', handleCustomLightning);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.95,
      }}
      aria-hidden="true"
    />
  );
};
