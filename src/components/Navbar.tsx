import React from 'react';
import { ShoppingBag, User, Sliders, Sparkles, Volume2, VolumeX, Gift, Disc3, Package } from 'lucide-react';
import { sound } from '../audio/SoundSynthesizer';
import { StudioTab } from './StudioDock';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenInsiders: () => void;
  onOpenHud: () => void;
  onlineCount: number;
  userSession: { name: string; tier: string } | null;
  isMuted: boolean;
  onToggleMute: () => void;
  onSelectTab?: (tab: StudioTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenInsiders,
  onOpenHud,
  onlineCount,
  userSession,
  isMuted,
  onToggleMute,
  onSelectTab,
}) => {
  const handleNav = (tab: StudioTab) => {
    sound.playTactileClick();
    if (onSelectTab) {
      onSelectTab(tab);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#070707]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <button
          onClick={() => handleNav('stage')}
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#F40009] rounded-lg p-1 text-left"
          aria-label="Coca-Cola Real Magic Home"
        >
          <div className="w-10 h-10 rounded-full bg-[#F40009] flex items-center justify-center shadow-glow-red group-hover:scale-105 transition-transform duration-300">
            <span className="font-serif italic font-black text-white text-lg tracking-tight">Coke</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif italic font-bold text-2xl tracking-wide text-white group-hover:text-[#F40009] transition-colors">
              Coca-Cola
            </span>
            <span className="text-[10px] tracking-widest uppercase text-white/50 -mt-1 font-semibold">
              Real Magic™ 3D
            </span>
          </div>
        </button>

        {/* Center: Clean Pavilion Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold tracking-wide uppercase" aria-label="Main Navigation">
          <button
            onClick={() => handleNav('stage')}
            className="text-white/80 hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#F40009]"
          >
            3D Stage
          </button>
          <button
            onClick={() => handleNav('happiness')}
            className="text-white/80 hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#F59E0B] flex items-center gap-1.5"
          >
            <Gift className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Happiness</span>
          </button>
          <button
            onClick={() => handleNav('sonic')}
            className="text-white/80 hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#EC4899] flex items-center gap-1.5"
          >
            <Disc3 className="w-3.5 h-3.5 text-[#EC4899]" />
            <span>Sonic DJ</span>
          </button>
          <button
            onClick={() => handleNav('create')}
            className="text-white/80 hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#00F5D4] flex items-center gap-1.5"
          >
            <span className="text-[#F40009]">❤️</span>
            <span>Share & Mix</span>
          </button>
          <button
            onClick={() => handleNav('vault')}
            className="text-white/80 hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#A855F7] flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>Vault</span>
          </button>
          <button
            onClick={() => handleNav('drops')}
            className="text-white/80 hover:text-white transition-colors py-1 hover:border-b-2 hover:border-white flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5 text-white/70" />
            <span>Drops</span>
          </button>
        </nav>

        {/* Right: Actions, Real-Time Pill, Sound, Cart & HUD */}
        <div className="flex items-center gap-3">
          
          {/* Live Fans Presence Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse" />
            <span><strong className="text-white font-mono">{onlineCount}</strong> chilling</span>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              onToggleMute();
              sound.playTactileClick();
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all"
            title={isMuted ? 'Unmute Procedural Audio' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white/40" /> : <Volume2 className="w-4 h-4 text-[#F40009]" />}
          </button>

          {/* Insiders Club Auth Button */}
          <button
            onClick={() => {
              sound.playTactileClick();
              onOpenInsiders();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white transition-all hover:scale-105"
            aria-label="Insiders Club VIP Account"
          >
            <User className="w-3.5 h-3.5 text-[#F40009]" />
            <span className="hidden sm:inline">
              {userSession ? userSession.name.split(' ')[0] : 'Insiders Club'}
            </span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => {
              sound.playTactileClick();
              onOpenCart();
            }}
            className="relative p-2.5 rounded-full bg-[#F40009] hover:bg-[#E40008] text-white shadow-glow-red transition-all hover:scale-105 active:scale-95"
            aria-label={`Shopping Cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-[#F40009] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* Settings & Accessibility HUD Trigger */}
          <button
            onClick={() => {
              sound.playTactileClick();
              onOpenHud();
            }}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white transition-all"
            title="Accessibility & GPU Performance Settings"
            aria-label="Open Accessibility and Performance Settings HUD"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
