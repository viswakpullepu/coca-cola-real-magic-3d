import React, { useState } from 'react';
import { Award, Sparkles, Gift, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/SoundSynthesizer';

interface GoldenTabSweepstakesProps {
  onApplyPrizeCode: (code: string, discount: number) => void;
}

interface Prize {
  id: string;
  title: string;
  code: string;
  discountPercent: number;
  badge: string;
  description: string;
}

const PRIZES: Prize[] = [
  {
    id: 'p1',
    title: 'Golden Tab Grand Prize: 30% Off Everything',
    code: 'GOLDENTAB30',
    discountPercent: 30,
    badge: 'GRAND PRIZE',
    description: 'Valid across all Limited Vault Drops, Custom Creations 6-Packs, and Merch.',
  },
  {
    id: 'p2',
    title: 'Free 4-Pack Upgrade + 20% Off',
    code: 'REALMAGIC20',
    discountPercent: 20,
    badge: 'FIRST TIER',
    description: 'Unlocked 20% savings and priority canning dispatch.',
  },
  {
    id: 'p3',
    title: 'Zero Sugar Pioneer Voucher (15% Off)',
    code: 'COKEZERO',
    discountPercent: 15,
    badge: 'WINNER',
    description: 'Instant 15% discount applied directly to your current crate checkout.',
  },
];

export const GoldenTabSweepstakes: React.FC<GoldenTabSweepstakesProps> = ({ onApplyPrizeCode }) => {
  const [hasPulled, setHasPulled] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);

  const handlePullTab = () => {
    if (hasPulled || isPulling) return;
    setIsPulling(true);
    sound.playCanSnap();

    setTimeout(() => {
      // Pick randomized prize
      const randomPrize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
      setWonPrize(randomPrize);
      setIsPulling(false);
      setHasPulled(true);

      sound.playGoldenFanfare();
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F40009', '#FFFFFF', '#00F5D4'],
      });
    }, 1200);
  };

  const handleClaim = () => {
    if (!wonPrize) return;
    sound.playTactileClick();
    onApplyPrizeCode(wonPrize.code, wonPrize.discountPercent);
    setIsClaimed(true);
  };

  return (
    <section
      id="golden-tab"
      className="relative py-24 bg-[#0D0D0D] border-t border-white/10 overflow-hidden"
      aria-label="Coca-Cola Golden Tab Instant Win Sweepstakes"
    >
      {/* Golden Aura Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F59E0B]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-bold tracking-widest uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Under The Cap • Instant Win Sweepstakes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
            Pull the Golden Tab to Win
          </h2>
          <p className="text-white/60 text-base max-w-xl mx-auto">
            A timeless Coca-Cola tradition. Crack your daily digital golden tab to reveal instant discounts, free drops, and VIP concert passes.
          </p>
        </div>

        {/* The Golden Can Tab Container */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.03] border border-white/15 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          {!hasPulled ? (
            /* Unpulled Tab Interface */
            <div className="space-y-8 flex flex-col items-center">
              
              {/* Animated Golden Tab Visual */}
              <div
                className={`w-36 h-48 rounded-3xl bg-gradient-to-b from-[#FDE047] via-[#EAB308] to-[#CA8A04] p-3 shadow-2xl flex flex-col items-center justify-between cursor-pointer group transition-all duration-300 ${
                  isPulling ? 'scale-90 rotate-12 opacity-80' : 'hover:scale-105 hover:shadow-glow-gold'
                }`}
                onClick={handlePullTab}
              >
                <div className="w-16 h-12 rounded-full border-4 border-black/30 flex items-center justify-center">
                  <div className="w-8 h-6 rounded-full bg-black/20" />
                </div>

                <div className="font-serif italic font-black text-black text-xl">
                  Coke
                </div>

                <div className="text-[10px] font-mono font-black text-black/70 tracking-widest uppercase pb-2">
                  {isPulling ? 'CRACKING...' : 'PULL TO REVEAL'}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  disabled={isPulling}
                  onClick={handlePullTab}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-extrabold text-sm tracking-wide shadow-glow-gold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isPulling ? 'Opening Sealed Golden Tab...' : 'Pull Golden Tab Now'}</span>
                </button>
                <p className="text-xs text-white/40">
                  100% win rate today. Every tab contains an official Coca-Cola reward code.
                </p>
              </div>

            </div>
          ) : (
            /* Revealed Prize Card */
            wonPrize && (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/20 text-[#F59E0B] mx-auto flex items-center justify-center">
                  <Gift className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-[#F59E0B] text-black text-xs font-black uppercase tracking-wider">
                    {wonPrize.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                    {wonPrize.title}
                  </h3>
                  <p className="text-sm text-white/60 max-w-md mx-auto">
                    {wonPrize.description}
                  </p>
                </div>

                {/* Promo Code Box */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 max-w-sm mx-auto flex items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block font-semibold">
                      Your Unique Promo Key
                    </span>
                    <span className="font-mono text-lg font-black text-[#F59E0B] tracking-wider">
                      {wonPrize.code}
                    </span>
                  </div>

                  <button
                    onClick={handleClaim}
                    disabled={isClaimed}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isClaimed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-black hover:bg-white/90 shadow'
                    }`}
                  >
                    {isClaimed ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied!</span>
                      </>
                    ) : (
                      <>
                        <span>Apply to Crate</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs text-emerald-400 font-medium">
                  {isClaimed && '✓ Discount successfully attached to your shopping crate & checkout!'}
                </div>
              </div>
            )
          )}

        </div>

      </div>
    </section>
  );
};
