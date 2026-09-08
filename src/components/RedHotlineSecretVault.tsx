import React, { useState } from 'react';
import { Phone, PhoneCall, Sparkles, Lock, Unlock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/SoundSynthesizer';

interface RedHotlineSecretVaultProps {
  onUnlockNebula: () => void;
  onApplyPrizeCode: (code: string, discount: number) => void;
}

export const RedHotlineSecretVault: React.FC<RedHotlineSecretVaultProps> = ({
  onUnlockNebula,
  onApplyPrizeCode,
}) => {
  const [callState, setCallState] = useState<'RINGING' | 'CONNECTED' | 'UNLOCKED'>('RINGING');
  const [transcriptLine, setTranscriptLine] = useState(0);

  const TRANSCRIPT = [
    'Connecting to Classified Atlanta Archives [1886-SEC-VAULT]...',
    '“Agent, you have breached the Red Magic Hotline.”',
    '“A deep-space botanical formula has been declassified: Project Cosmic Nebula.”',
    '“Authorization granted. 3D Can Shaders updated to Galactic Iridescence.”',
  ];

  const handleAnswerCall = () => {
    sound.playCanSnap();
    sound.playIceClink();
    setCallState('CONNECTED');

    // Step through transcript
    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step < TRANSCRIPT.length) {
        setTranscriptLine(step);
      } else {
        clearInterval(timer);
        setCallState('UNLOCKED');
        sound.playGoldenFanfare();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#06B6D4', '#EC4899', '#FFFFFF'],
        });
        onUnlockNebula();
        onApplyPrizeCode('NEBULA1886', 35);
      }
    }, 1100);
  };

  const handleInspectCan = () => {
    sound.playCanSnap();
    onUnlockNebula();
    const hero = document.getElementById('hero');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="red-hotline"
      className="relative py-20 bg-[#07020D] border-t border-purple-500/20 overflow-hidden text-white"
      aria-label="Coca-Cola Red Hotline Secret Easter Egg Vault"
    >
      {/* Ultraviolet Nebula Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A855F7]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold tracking-widest uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>Classified Secret Vault • Red Magic Hotline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
            The Direct Hotline to Secret Vault 1886
          </h2>
          <p className="text-white/60 text-sm max-w-lg mx-auto">
            The red telephone is ringing. Pick up the receiver to declassify the unreleased 6th formula: Coca-Cola Cosmic Nebula.
          </p>
        </div>

        {/* Rotary Telephone Console */}
        <div className="p-8 rounded-3xl bg-white/[0.03] border border-purple-500/30 backdrop-blur-xl shadow-2xl max-w-xl mx-auto space-y-6">
          
          {callState === 'RINGING' && (
            <div className="py-6 flex flex-col items-center space-y-6">
              <div
                onClick={handleAnswerCall}
                className="w-24 h-24 rounded-full bg-[#F40009] flex items-center justify-center text-white shadow-glow-red cursor-pointer animate-bounce group hover:scale-105 transition-transform"
                title="Click to answer the hotline"
              >
                <PhoneCall className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-1">
                <div className="font-mono text-xs uppercase tracking-widest text-[#F40009] font-bold">
                  INCOMING ENCRYPTED TRANSMISSION...
                </div>
                <div className="text-xs text-white/50">Caller ID: Pemberton Secret Archives, Atlanta</div>
              </div>

              <button
                onClick={handleAnswerCall}
                className="px-8 py-3.5 rounded-2xl bg-[#F40009] hover:bg-[#E40008] text-white font-extrabold text-sm tracking-wide shadow-glow-red active:scale-95 transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Pick Up Red Receiver</span>
              </button>
            </div>
          )}

          {callState === 'CONNECTED' && (
            <div className="py-8 space-y-4 font-mono text-left">
              <div className="flex items-center gap-2 text-xs text-purple-400">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>SECURE LINE ACTIVE [256-BIT QUANTUM CIPHER]</span>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/20 text-xs text-white/90 leading-relaxed min-h-[80px]">
                {TRANSCRIPT[transcriptLine]}
              </div>
            </div>
          )}

          {callState === 'UNLOCKED' && (
            <div className="py-4 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-300 mx-auto flex items-center justify-center">
                <Unlock className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-purple-500 text-black text-xs font-black uppercase tracking-wider">
                  SECRET FLAVOR UNLOCKED
                </span>
                <h3 className="text-2xl font-bold font-display text-white">
                  Coca-Cola Cosmic Nebula
                </h3>
                <p className="text-xs text-white/70 max-w-sm mx-auto">
                  A stardust-infused formula with galactic starfruit and deep violet caramel. Promo code <strong className="font-mono text-[#00F5D4]">NEBULA1886</strong> (35% OFF) has been attached to your crate!
                </p>
              </div>

              <button
                onClick={handleInspectCan}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white font-extrabold text-xs tracking-wider uppercase shadow-glow-cyan flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Spin 3D Nebula Can on Stage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
