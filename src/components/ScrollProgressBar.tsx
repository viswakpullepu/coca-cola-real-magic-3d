import React, { useState, useEffect } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) {
        setScrollProgress(0);
        return;
      }
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-20 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-white/[0.04]"
    >
      <div
        className="h-full bg-gradient-to-r from-[#BA0007] via-[#F40009] to-[#00F5D4] relative transition-all duration-75 ease-out shadow-glow-red"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Effervescent glowing tip */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white blur-[2px] opacity-80" />
      </div>
    </div>
  );
};
