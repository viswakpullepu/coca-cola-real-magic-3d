import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Play, RotateCcw, Volume2, Flame, Droplets, Smile } from 'lucide-react';
import { sound } from '../audio/SoundSynthesizer';

interface SensoryStep {
  id: number;
  title: string;
  soundName: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: SensoryStep[] = [
  {
    id: 1,
    title: 'The Snap',
    soundName: 'Metallic Tab Crack',
    description: 'The sharp aluminum pull-tab releases high-pressure carbonation seal.',
    icon: <Flame className="w-4 h-4 text-[#F40009]" />,
  },
  {
    id: 2,
    title: 'The Hiss',
    soundName: 'Pressurized Gas Release',
    description: 'A rushing plume of cold effervescent carbon dioxide escapes.',
    icon: <Sparkles className="w-4 h-4 text-[#00F5D4]" />,
  },
  {
    id: 3,
    title: 'The Clink',
    soundName: 'Heavy Ice in Glass',
    description: 'Clear dense ice cubes tumble and collide against frosted crystal.',
    icon: <Droplets className="w-4 h-4 text-[#38BDF8]" />,
  },
  {
    id: 4,
    title: 'The Pour',
    soundName: 'Liquid Effervescence & Foam',
    description: 'Rich dark cola rushes over ice, blooming into a creamy crown of foam.',
    icon: <Volume2 className="w-4 h-4 text-[#F59E0B]" />,
  },
  {
    id: 5,
    title: 'The "Ahhh"',
    soundName: 'Ultimate Satisfaction',
    description: 'The crisp, spine-tingling first sip that defines ice-cold refreshment.',
    icon: <Smile className="w-4 h-4 text-emerald-400" />,
  },
];

export const AsmrSensoryChamber: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fillProgress, setFillProgress] = useState(0.2);
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger individual step
  const handleTriggerStep = (stepNum: number) => {
    setCurrentStep(stepNum);

    if (stepNum === 1) {
      sound.playCanSnap();
      setFillProgress(0.15);
    } else if (stepNum === 2) {
      sound.playFizzHiss(1.2, 0.7);
      setFillProgress(0.25);
    } else if (stepNum === 3) {
      sound.playIceClink();
      setFillProgress(0.4);
    } else if (stepNum === 4) {
      sound.playPourLiquid(2.5);
      setFillProgress(0.9);
    } else if (stepNum === 5) {
      sound.playAhhhExhale();
      sound.playIceClink();
      setFillProgress(1.0);
    }
  };

  // Play full sequence automatically
  const handlePlayFullRitual = async () => {
    if (isPlayingFull) return;
    setIsPlayingFull(true);

    handleTriggerStep(1);
    await new Promise((r) => setTimeout(r, 1200));

    handleTriggerStep(2);
    await new Promise((r) => setTimeout(r, 1500));

    handleTriggerStep(3);
    await new Promise((r) => setTimeout(r, 1400));

    handleTriggerStep(4);
    await new Promise((r) => setTimeout(r, 2600));

    handleTriggerStep(5);
    await new Promise((r) => setTimeout(r, 2000));

    setIsPlayingFull(false);
  };

  // Canvas Glass Pour Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const glassTopY = 40;
      const glassBottomY = h - 40;
      const glassTopW = 160;
      const glassBottomW = 120;
      const centerX = w / 2;

      // 1. Draw Glass Outline (Frosted contour cup)
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - glassTopW / 2, glassTopY);
      ctx.lineTo(centerX - glassBottomW / 2, glassBottomY);
      ctx.lineTo(centerX + glassBottomW / 2, glassBottomY);
      ctx.lineTo(centerX + glassTopW / 2, glassTopY);
      ctx.stroke();

      // Frosted rim
      ctx.beginPath();
      ctx.ellipse(centerX, glassTopY, glassTopW / 2, 14, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Glass bottom thickness
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.ellipse(centerX, glassBottomY, glassBottomW / 2, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 2. Liquid Level
      const liquidHeight = (glassBottomY - glassTopY - 20) * fillProgress;
      const liquidTopY = glassBottomY - liquidHeight;

      if (fillProgress > 0.05) {
        ctx.save();
        // Clip to glass interior
        ctx.beginPath();
        ctx.moveTo(centerX - glassTopW / 2 + 3, glassTopY);
        ctx.lineTo(centerX - glassBottomW / 2 + 3, glassBottomY - 5);
        ctx.lineTo(centerX + glassBottomW / 2 - 3, glassBottomY - 5);
        ctx.lineTo(centerX + glassTopW / 2 - 3, glassTopY);
        ctx.closePath();
        ctx.clip();

        // Caramel Coke Liquid Gradient
        const grad = ctx.createLinearGradient(0, liquidTopY, 0, glassBottomY);
        grad.addColorStop(0, '#591C0B');
        grad.addColorStop(0.5, '#2B0B02');
        grad.addColorStop(1, '#110400');
        ctx.fillStyle = grad;
        ctx.fillRect(0, liquidTopY, w, glassBottomY - liquidTopY);

        // Rising Fizz Bubbles in Liquid
        for (let b = 0; b < 18; b++) {
          const bx = centerX - 40 + ((b * 17) % 80);
          const by = liquidTopY + ((time * 80 + b * 25) % (glassBottomY - liquidTopY));
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(bx + Math.sin(time + b) * 3, by, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Creamy Foam Head (when pouring)
        if (fillProgress > 0.3) {
          ctx.fillStyle = '#E8D2BD';
          ctx.beginPath();
          const foamHeight = Math.min(22, fillProgress * 24);
          ctx.ellipse(centerX, liquidTopY, glassTopW * 0.44 * (fillProgress * 0.4 + 0.6), foamHeight / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Floating Ice Cubes
        if (currentStep >= 3) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1.5;
          
          // Cube 1
          ctx.beginPath();
          ctx.roundRect(centerX - 35, liquidTopY + 8 + Math.sin(time * 2) * 2, 32, 28, 6);
          ctx.fill();
          ctx.stroke();

          // Cube 2
          ctx.beginPath();
          ctx.roundRect(centerX + 6, liquidTopY + 14 + Math.cos(time * 2) * 2, 28, 26, 5);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [fillProgress, currentStep]);

  return (
    <section
      id="asmr-chamber"
      className="relative py-24 bg-[#0A0A0A] border-t border-white/10 overflow-hidden"
      aria-label="Coca-Cola ASMR Sensory Refreshment Chamber"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F5D4]/15 border border-[#00F5D4]/30 text-[#00F5D4] text-xs font-bold tracking-widest uppercase">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Sonic Branding • Experiential ASMR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
            The 5 Steps of Pure Refreshment
          </h2>
          <p className="text-white/60 text-base">
            Coca-Cola is the world's only beverage engineered for a 5-step acoustic ritual. Put your headphones on and experience the spine-tingling pour.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: 5 Interactive Sonic Step Cards */}
          <div className="lg:col-span-7 space-y-4">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => handleTriggerStep(step.id)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 flex items-start gap-4 ${
                    isActive
                      ? 'bg-white/15 border-white shadow-xl scale-[1.01]'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] text-white/70 hover:text-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-white font-display">
                        Step {step.id}: {step.title}
                      </h4>
                      <span className="text-[10px] font-mono text-[#00F5D4] uppercase tracking-wider">
                        {step.soundName}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Master Play Button */}
            <div className="flex gap-3 pt-2">
              <button
                disabled={isPlayingFull}
                onClick={handlePlayFullRitual}
                className="flex-1 py-4 rounded-2xl bg-[#F40009] hover:bg-[#E40008] text-white font-bold text-sm tracking-wide shadow-glow-red flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isPlayingFull ? 'Pouring Ritual in Progress...' : 'Play Full 5-Step Sonic Ritual'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playTactileClick();
                  setCurrentStep(1);
                  setFillProgress(0.2);
                }}
                className="px-4 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-all"
                title="Reset Glass"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Live Interactive Frosted Glass Canvas */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm h-[480px] rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 relative p-6 flex flex-col items-center justify-center backdrop-blur-md">
              
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/80">
                CHILLED AT 3.2°C
              </div>

              <div className="absolute top-4 right-4 z-20 text-xs font-mono text-[#00F5D4]">
                {Math.round(fillProgress * 100)}% FULL
              </div>

              <canvas
                ref={canvasRef}
                width={320}
                height={400}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>

            <div className="mt-4 text-xs text-white/40 text-center font-mono">
              🎧 Best experienced with stereo headphones for binaural 3D acoustics.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
