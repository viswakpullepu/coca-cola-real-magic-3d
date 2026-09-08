import React, { useState } from 'react';
import { Sparkles, Coins, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/SoundSynthesizer';

interface HappinessMachineProps {
  onApplyPrizeCode: (code: string, discount: number) => void;
  onActivateDisco: () => void;
}

type SurpriseType = 'DISCO' | 'POLAR_BEAR' | 'POETRY' | 'KINDNESS';

export const HappinessMachine: React.FC<HappinessMachineProps> = ({
  onApplyPrizeCode,
  onActivateDisco,
}) => {
  const [tokens, setTokens] = useState(3);
  const [isVending, setIsVending] = useState(false);
  const [activeSurprise, setActiveSurprise] = useState<SurpriseType | null>(null);

  const handleInsertToken = () => {
    if (tokens <= 0 || isVending) return;
    setIsVending(true);
    setTokens((prev) => prev - 1);
    sound.playIceClink();

    setTimeout(() => {
      sound.playCanSnap();
      sound.playGoldenFanfare();

      const surprises: SurpriseType[] = ['DISCO', 'POLAR_BEAR', 'POETRY', 'KINDNESS'];
      const chosen = surprises[Math.floor(Math.random() * surprises.length)];
      setActiveSurprise(chosen);
      setIsVending(false);

      if (chosen === 'DISCO') {
        onActivateDisco();
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F40009', '#00F5D4', '#F59E0B', '#FFFFFF'],
      });
    }, 1400);
  };

  const handleRefillTokens = () => {
    sound.playIceClink();
    setTokens(3);
  };

  return (
    <section
      id="happiness-machine"
      className="relative py-24 bg-[#0A0A0A] border-t border-white/10 overflow-hidden"
      aria-label="Coca-Cola Happiness Machine 2.0 Viral Vending Stunt"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-[#F40009]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F40009]/15 border border-[#F40009]/30 text-[#F40009] text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Viral Classic • Happiness Machine 2.0</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
            Where Magic Dispenses Happiness
          </h2>
          <p className="text-white/60 text-base max-w-xl mx-auto">
            Inspired by the legendary college campus viral stunt. Drop a magic token into the slot to dispense unpredictable moments of joy.
          </p>
        </div>

        {/* The 3D-styled Vending Machine Console */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1C1C1C] to-[#0D0D0D] border-2 border-[#F40009]/40 shadow-2xl relative space-y-8">
          
          {/* Machine Top Banner */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs text-white/80 font-bold uppercase tracking-wider">
                Dispenser Online • Real Magic 2.0
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white font-mono">
              <Coins className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Tokens Left: <strong className="text-white">{tokens}</strong></span>
            </div>
          </div>

          {!activeSurprise ? (
            /* Machine Idle / Ready state */
            <div className="py-6 flex flex-col items-center space-y-6">
              
              {/* Token Slot Graphic */}
              <div className="w-28 h-28 rounded-full bg-black/60 border-4 border-[#F40009] flex flex-col items-center justify-center relative shadow-glow-red group cursor-pointer" onClick={handleInsertToken}>
                <div className="w-12 h-2.5 bg-[#F59E0B] rounded-full shadow-inner animate-pulse" />
                <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest mt-2">
                  COIN SLOT
                </span>
              </div>

              <div className="space-y-3">
                <button
                  disabled={tokens <= 0 || isVending}
                  onClick={handleInsertToken}
                  className="px-8 py-4 rounded-2xl bg-[#F40009] hover:bg-[#E40008] text-white font-extrabold text-sm tracking-wide shadow-glow-red flex items-center gap-2 active:scale-95 transition-all disabled:opacity-40"
                >
                  <Coins className="w-4 h-4 text-[#F59E0B]" />
                  <span>{isVending ? 'Vending Real Magic Surprise...' : 'Drop Token & Push Button'}</span>
                </button>

                {tokens <= 0 && (
                  <button
                    onClick={handleRefillTokens}
                    className="text-xs text-[#00F5D4] underline font-semibold block mx-auto"
                  >
                    Out of tokens? Click to grab 3 complimentary magic coins.
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* Dispensed Surprise View */
            <div className="py-4 space-y-6 animate-in zoom-in-95 duration-300">
              
              {/* SURPRISE 1: DISCO MODE */}
              {activeSurprise === 'DISCO' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00F5D4] to-[#EC4899] mx-auto flex items-center justify-center text-3xl animate-bounce">
                    🪩
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                    Surprise: Fizzy Disco Mode Activated!
                  </h3>
                  <p className="text-sm text-white/70 max-w-md mx-auto">
                    The entire Coca-Cola experience has transformed into a high-energy dance party. The sound frequencies are synchronized to 128 BPM!
                  </p>
                </div>
              )}

              {/* SURPRISE 2: POLAR BEAR */}
              {activeSurprise === 'POLAR_BEAR' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center text-3xl">
                    🐻‍❄️
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                    The Arctic Polar Bear Visited You!
                  </h3>
                  <p className="text-sm text-white/70 max-w-md mx-auto">
                    Coke’s legendary mascot hands you a secret 40% VIP coupon code: <strong className="font-mono text-[#F59E0B]">POLARBEAR40</strong>.
                  </p>
                  <button
                    onClick={() => onApplyPrizeCode('POLARBEAR40', 40)}
                    className="px-6 py-2.5 rounded-xl bg-[#F59E0B] text-black font-extrabold text-xs tracking-wider uppercase shadow-glow-gold"
                  >
                    Claim & Apply 40% Off Crate
                  </button>
                </div>
              )}

              {/* SURPRISE 3: POETIC TOAST */}
              {activeSurprise === 'POETRY' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#F40009]/20 text-[#F40009] mx-auto flex items-center justify-center text-3xl">
                    📜
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                    Spencerian Friendship Toast
                  </h3>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 max-w-md mx-auto text-sm italic text-white/90 leading-relaxed">
                    “May your laughter bubble like fresh carbonation on ice,<br />
                    and may every cold sip with friends feel like home twice.”
                  </div>
                </div>
              )}

              {/* SURPRISE 4: RANDOM KINDNESS */}
              {activeSurprise === 'KINDNESS' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-3xl">
                    ❤️
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                    Random Act of Shared Happiness!
                  </h3>
                  <p className="text-sm text-white/70 max-w-md mx-auto">
                    A complimentary digital ice-cold can was just broadcasted to a random visitor listening in Coke Studio.
                  </p>
                </div>
              )}

              {/* Reset to vend again */}
              <div className="pt-4 border-t border-white/10 flex justify-center gap-3">
                <button
                  onClick={() => setActiveSurprise(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Vend Another Surprise</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
