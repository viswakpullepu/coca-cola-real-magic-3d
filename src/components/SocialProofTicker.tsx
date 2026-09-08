import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

const SOCIAL_MESSAGES = [
  { icon: '🎁', text: 'Sarah in Atlanta just personalized a "Share a Coke with Emma" can' },
  { icon: '⚡', text: 'Marco in Milan unlocked 30% OFF with a Golden Tab!' },
  { icon: '🔮', text: 'Tokyo creator just vaulted a custom Y3000 Cyber Formula' },
  { icon: '🎧', text: '439 fans are listening to Coke Studio live right now' },
  { icon: '🥫', text: 'Liam in London poured 3.2°C soda in the ASMR Chamber' },
  { icon: '✨', text: 'VIP member Riley Vance just reserved a 1915 Contour Glass crate' },
];

export const SocialProofTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SOCIAL_MESSAGES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const currentMsg = SOCIAL_MESSAGES[currentIndex];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-6 z-30 max-w-sm hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-white/15 shadow-2xl text-white animate-in slide-in-from-bottom duration-300"
    >
      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-base">
        {currentMsg.icon}
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#00F5D4]">
          <Sparkles className="w-3 h-3" />
          <span>Real Magic Live Feed</span>
        </div>
        <p className="text-xs text-white/90 font-medium truncate mt-0.5">
          {currentMsg.text}
        </p>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="text-white/40 hover:text-white transition-colors p-1"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
