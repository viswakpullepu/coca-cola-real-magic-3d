import React from 'react';
import { Sparkles, Gift, Disc3, Heart, Compass, Package } from 'lucide-react';
import { sound } from '../audio/SoundSynthesizer';

export type StudioTab = 'stage' | 'happiness' | 'sonic' | 'create' | 'vault' | 'drops';

interface StudioDockProps {
  activeTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
}

interface DockItem {
  id: StudioTab;
  label: string;
  icon: React.ReactNode;
  accent: string;
}

const DOCK_ITEMS: DockItem[] = [
  { id: 'stage', label: '3D Stage', icon: <Sparkles className="w-3.5 h-3.5" />, accent: '#F40009' },
  { id: 'happiness', label: 'Happiness Hub', icon: <Gift className="w-3.5 h-3.5" />, accent: '#F59E0B' },
  { id: 'sonic', label: 'Sonic Studio', icon: <Disc3 className="w-3.5 h-3.5" />, accent: '#EC4899' },
  { id: 'create', label: 'Share & Mix', icon: <Heart className="w-3.5 h-3.5" />, accent: '#00F5D4' },
  { id: 'vault', label: 'Secret Vault', icon: <Compass className="w-3.5 h-3.5" />, accent: '#A855F7' },
  { id: 'drops', label: 'Vault Drops', icon: <Package className="w-3.5 h-3.5" />, accent: '#FFFFFF' },
];

export const StudioDock: React.FC<StudioDockProps> = ({ activeTab, onSelectTab }) => {
  const handleTabClick = (tabId: StudioTab) => {
    sound.playTactileClick();
    onSelectTab(tabId);

    // Smooth scroll to main studio viewport if scrolled down
    const mainSection = document.getElementById('studio-viewport');
    if (mainSection) {
      mainSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Studio Experience Switcher"
      className="sticky top-20 z-30 py-3 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/[0.08]"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between gap-1 overflow-x-auto shadow-xl">
          {DOCK_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-white text-black shadow-md scale-100 font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span style={{ color: isActive ? '#000000' : item.accent }}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
