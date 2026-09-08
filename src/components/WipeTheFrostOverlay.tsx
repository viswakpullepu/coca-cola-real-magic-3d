import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X, RotateCcw } from 'lucide-react';
import { sound } from '../audio/SoundSynthesizer';

interface WipeTheFrostOverlayProps {
  isActive: boolean;
  onClose: () => void;
}

export const WipeTheFrostOverlay: React.FC<WipeTheFrostOverlayProps> = ({ isActive, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wipedPercent, setWipedPercent] = useState(0);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fill with cold frosty translucent mist
    const initFrost = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(230, 245, 255, 0.88)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add frosty noise and ice crystals
      for (let i = 0; i < 600; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 4 + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pre-wipe a small peek hole in the center
      ctx.globalCompositeOperation = 'destination-out';
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        20,
        canvas.width / 2,
        canvas.height / 2,
        140
      );
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 140, 0, Math.PI * 2);
      ctx.fill();
    };

    initFrost();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initFrost();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive]);

  const wipeAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';

    // Soft feathered circular wipe
    const grad = ctx.createRadialGradient(x, y, 10, x, y, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.8)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.arc(x, y, 60, 0, Math.PI * 2);
    ctx.fill();

    // Occasional drip streak running downward
    if (Math.random() > 0.6) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() * 4 - 2), y + Math.random() * 45 + 20);
      ctx.lineWidth = Math.random() * 3 + 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.stroke();
    }

    setWipedPercent((prev) => Math.min(100, prev + 0.3));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDrawing.current = true;
    sound.playBubblePop();
    wipeAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;
    wipeAt(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const handleResetFrost = () => {
    sound.playIceClink();
    setWipedPercent(0);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(230, 245, 255, 0.88)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-300">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full cursor-crosshair active:cursor-grabbing"
      />

      {/* Floating Controls */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs shadow-2xl">
        <Sparkles className="w-4 h-4 text-[#00F5D4]" />
        <span>Wipe with your mouse or finger to defog cold glass</span>
        <span className="font-mono text-[#00F5D4] font-bold">{Math.round(wipedPercent)}% Cleared</span>

        <button
          onClick={handleResetFrost}
          className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
          title="Refreeze Glass"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            sound.playTactileClick();
            onClose();
          }}
          className="p-1 rounded-lg bg-[#F40009] hover:bg-[#E40008] text-white"
          title="Exit Frost Mode"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
