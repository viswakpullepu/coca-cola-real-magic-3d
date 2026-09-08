import React, { useState, useEffect, useRef } from 'react';
import { Disc3, Play, Pause, Sliders } from 'lucide-react';
import { sound } from '../audio/SoundSynthesizer';

interface TrackLoop {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  type: 'bass' | 'snap' | 'fizz' | 'ice' | 'synth' | 'ahhh';
}

export const CokeDjRemixDeck: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(110);
  const [scratchAngle, setScratchAngle] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const [tracks, setTracks] = useState<TrackLoop[]>([
    { id: 't1', name: '808 Kola Sub Bass', color: '#F40009', isActive: true, type: 'bass' },
    { id: 't2', name: 'Can Snap Snare', color: '#FFFFFF', isActive: true, type: 'snap' },
    { id: 't3', name: 'Carbonation Fizz Hi-Hat', color: '#00F5D4', isActive: true, type: 'fizz' },
    { id: 't4', name: 'Ice Cube Shaker', color: '#38BDF8', isActive: false, type: 'ice' },
    { id: 't5', name: 'Atlanta Funk Chords', color: '#F59E0B', isActive: false, type: 'synth' },
    { id: 't6', name: 'Vocal "Ahhh" Exhale', color: '#EC4899', isActive: false, type: 'ahhh' },
  ]);

  const isScratching = useRef(false);
  const lastMouseX = useRef(0);

  // Step sequencer clock
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = (60000 / bpm) / 4; // 16th note steps
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        const nextStep = (prev + 1) % 16;
        
        // Trigger sounds on beat beats
        tracks.forEach((track) => {
          if (!track.isActive) return;

          if (track.type === 'snap' && (nextStep === 4 || nextStep === 12)) {
            sound.playCanSnap();
          } else if (track.type === 'ice' && nextStep % 2 === 0) {
            sound.playIceClink();
          } else if (track.type === 'fizz' && nextStep % 4 === 0) {
            sound.playFizzHiss(0.15, 0.2);
          } else if (track.type === 'ahhh' && nextStep === 15) {
            sound.playAhhhExhale();
          } else if (track.type === 'bass' && (nextStep === 0 || nextStep === 8 || nextStep === 10)) {
            sound.playTactileClick();
          }
        });

        // Rotate vinyl slightly
        setScratchAngle((a) => a + 3);

        return nextStep;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, bpm, tracks]);

  const toggleTrack = (id: string) => {
    sound.playTactileClick();
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
  };

  // Scratch vinyl handler
  const handlePointerDown = (e: React.PointerEvent) => {
    isScratching.current = true;
    lastMouseX.current = e.clientX;
    sound.playCanSnap();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isScratching.current) return;
    const delta = e.clientX - lastMouseX.current;
    lastMouseX.current = e.clientX;
    setScratchAngle((prev) => prev + delta * 1.5);
    
    // Scratch sound
    if (Math.abs(delta) > 5) {
      sound.playFizzHiss(0.08, 0.3);
    }
  };

  const handlePointerUp = () => {
    isScratching.current = false;
  };

  return (
    <section
      id="coke-dj"
      className="relative py-24 bg-[#0D0D0D] border-t border-white/10 overflow-hidden"
      aria-label="Coke Studio Interactive DJ Remix Deck"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EC4899]/15 border border-[#EC4899]/30 text-[#EC4899] text-xs font-bold tracking-widest uppercase">
            <Disc3 className="w-3.5 h-3.5 animate-spin" />
            <span>Coke Studio DJ Booth • Bottle-Cap Turntable</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
            Remix the Sound of Real Magic
          </h2>
          <p className="text-white/60 text-base">
            Scratch the 3D Coke crown bottle cap platter, toggle synchronized acoustic layers, and craft your bespoke refreshment anthem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Scratchable Vinyl Turntable Platter */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-gradient-to-tr from-[#111111] via-[#222222] to-[#0A0A0A] border-8 border-[#333333] shadow-2xl p-4 flex items-center justify-center cursor-grab active:cursor-grabbing select-none relative group"
            >
              {/* Vinyl Grooves */}
              <div
                className="w-full h-full rounded-full border-4 border-white/5 flex items-center justify-center transition-transform duration-75"
                style={{ transform: `rotate(${scratchAngle}deg)` }}
              >
                {/* Crown Bottle Cap Centerpiece */}
                <div className="w-32 h-32 rounded-full bg-[#F40009] border-4 border-white shadow-glow-red flex flex-col items-center justify-center relative">
                  <span className="font-serif italic font-black text-white text-2xl tracking-tighter">
                    Coke
                  </span>
                  <span className="text-[8px] font-mono uppercase font-bold text-white/70 tracking-widest">
                    33⅓ RPM
                  </span>
                  {/* Center spindle hole */}
                  <div className="w-3 h-3 rounded-full bg-black/80 border border-white/30 absolute" />
                </div>
              </div>

              {/* Tonearm graphic indicator */}
              <div className="absolute top-2 right-4 w-4 h-24 bg-white/20 rounded-full rotate-45 pointer-events-none origin-top" />
            </div>

            <div className="mt-4 text-xs font-mono text-white/50">
              ← Drag platter horizontally to scratch →
            </div>

          </div>

          {/* Right: 6-Track Sequencer & Master Console */}
          <div className="lg:col-span-7 space-y-6 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            
            {/* Master Transport & BPM Controls */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sound.playTactileClick();
                    setIsPlaying(!isPlaying);
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#F40009] hover:bg-[#E40008] text-white font-extrabold text-sm flex items-center gap-2 shadow-glow-red active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isPlaying ? 'Stop Beat' : 'Play Live Mix'}</span>
                </button>

                <div className="px-3 py-1.5 rounded-xl bg-white/10 font-mono text-xs text-white">
                  Step: <strong className="text-[#00F5D4]">{activeStep + 1}</strong>/16
                </div>
              </div>

              {/* BPM Slider */}
              <div className="flex items-center gap-2 text-xs">
                <Sliders className="w-3.5 h-3.5 text-white/50" />
                <span className="font-mono text-white font-bold">{bpm} BPM</span>
                <input
                  type="range"
                  min="90"
                  max="130"
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                  className="w-24 accent-[#F40009]"
                />
              </div>
            </div>

            {/* 6 Layer Pads */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold text-white/50 tracking-wider block">
                Acoustic Sound Layers (Click to Toggle)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => toggleTrack(track.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                      track.isActive
                        ? 'bg-white/15 border-white shadow-md'
                        : 'bg-black/40 border-white/10 opacity-50 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: track.color }}
                      />
                      <span className="font-mono text-[10px] text-white/50">
                        {track.isActive ? 'ACTIVE' : 'MUTED'}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white leading-tight">
                      {track.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step Sequencer Beat Indicator */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      activeStep === i
                        ? 'bg-[#00F5D4] scale-y-150'
                        : i % 4 === 0
                        ? 'bg-white/40'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
