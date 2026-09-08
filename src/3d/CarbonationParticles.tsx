import React, { useEffect, useRef } from 'react';

interface CarbonationParticlesProps {
  burstTrigger?: number;
  bubbleColor?: string;
  intensity?: number;
}

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobbleOffset: number;
  opacity: number;
  maxOpacity: number;
}

export const CarbonationParticles: React.FC<CarbonationParticlesProps> = ({
  burstTrigger = 0,
  bubbleColor = 'rgba(255, 255, 255, 0.7)',
  intensity = 1.0
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize bubble pool
    const bubbleCount = Math.floor(45 * intensity);
    bubblesRef.current = [];

    const createBubble = (startY?: number): Bubble => {
      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : Math.random() * height,
        radius: Math.random() * 2.8 + 1.2,
        speedY: Math.random() * 1.8 + 0.9,
        wobbleSpeed: Math.random() * 0.04 + 0.02,
        wobbleAmp: Math.random() * 25 + 10,
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: 0,
        maxOpacity: Math.random() * 0.5 + 0.3
      };
    };

    for (let i = 0; i < bubbleCount; i++) {
      bubblesRef.current.push(createBubble());
    }

    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.min(6, Math.max(-3, (currentScrollY - lastScrollY) * 0.12));
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let time = 0;
    const render = () => {
      time += 0.02;
      scrollVelocity *= 0.94; // Smooth velocity decay
      ctx.clearRect(0, 0, width, height);

      bubblesRef.current.forEach((b, idx) => {
        // Ascend with scroll kinetic boost
        b.y -= (b.speedY + Math.max(0, scrollVelocity));
        const wobbleX = b.x + Math.sin(time * b.wobbleSpeed * 50 + b.wobbleOffset) * (b.wobbleAmp * 0.1);

        // Fade in near bottom, full in middle, fade out near top
        if (b.y > height * 0.8) {
          b.opacity = Math.min(b.maxOpacity, b.opacity + 0.02);
        } else if (b.y < height * 0.15) {
          b.opacity = Math.max(0, b.opacity - 0.03);
        } else {
          b.opacity = b.maxOpacity;
        }

        // Draw bubble
        ctx.beginPath();
        ctx.arc(wobbleX, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubbleColor.replace(/[\d.]+\)$/g, `${b.opacity})`);
        ctx.fill();

        // Highlight glint on top-left of bubble
        ctx.beginPath();
        ctx.arc(wobbleX - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.85})`;
        ctx.fill();

        // Reset if reached top
        if (b.y < -10 || b.opacity <= 0) {
          bubblesRef.current[idx] = createBubble(height + 10);
        }
      });

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [intensity, bubbleColor]);

  // Burst effect when trigger updates
  useEffect(() => {
    if (!burstTrigger || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;

    // Spawn 25 sudden celebratory bubbles from bottom center
    for (let i = 0; i < 25; i++) {
      bubblesRef.current.push({
        x: width * 0.5 + (Math.random() * 120 - 60),
        y: height * 0.6 + (Math.random() * 40 - 20),
        radius: Math.random() * 4.5 + 2,
        speedY: Math.random() * 5 + 3,
        wobbleSpeed: Math.random() * 0.08 + 0.04,
        wobbleAmp: Math.random() * 40 + 20,
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: 0.9,
        maxOpacity: 0.9
      });
    }
  }, [burstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
