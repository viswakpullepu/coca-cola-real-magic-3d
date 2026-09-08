import React, { useState } from 'react';
import { History, Award, Rocket, Sparkles, Globe, Heart } from 'lucide-react';
import { sound } from '../audio/SoundSynthesizer';

interface TimelineEvent {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '1886',
    title: 'Jacobs’ Pharmacy, Atlanta',
    subtitle: 'Dr. John Stith Pemberton',
    description: 'The legendary formula was first concocted in a brass kettle in Atlanta, Georgia. Served with carbonated water for five cents a glass.',
    icon: <History className="w-5 h-5" />,
    accentColor: '#F40009',
  },
  {
    year: '1915',
    title: 'The Iconic Contour Bottle',
    subtitle: 'Patent No. 48,160',
    description: 'Root Glass Company of Indiana patented the hobbleskirt silhouette — designed so someone could recognize it by feel in total darkness or even shattered on the ground.',
    icon: <Award className="w-5 h-5" />,
    accentColor: '#D1D5DB',
  },
  {
    year: '1971',
    title: 'I’d Like to Buy the World a Coke',
    subtitle: 'The Hilltop Campaign',
    description: 'Recorded on a hillside in Italy, young people from around the world sang a song of peace and universal brotherhood that defined advertising history.',
    icon: <Heart className="w-5 h-5" />,
    accentColor: '#F59E0B',
  },
  {
    year: '1985',
    title: 'First Soda in Outer Space',
    subtitle: 'Space Shuttle Challenger STS-51-F',
    description: 'Astronauts tested the Coca-Cola Space Dispenser in zero gravity, sipping fizzy refreshment 200 miles above Earth.',
    icon: <Rocket className="w-5 h-5" />,
    accentColor: '#00F5D4',
  },
  {
    year: '2005',
    title: 'Zero Sugar Revolution',
    subtitle: 'Crisp Taste, Zero Calories',
    description: 'Years of taste engineering unlocked the classic mouthfeel and caramel notes with zero sugar, quickly becoming a global staple.',
    icon: <Globe className="w-5 h-5" />,
    accentColor: '#FFFFFF',
  },
  {
    year: '2026',
    title: 'Y3000 & Creations Era',
    subtitle: 'AI Co-Created Future',
    description: 'Coca-Cola Creations pairs human imagination with neural network synthesis, crafting interactive digital realms and future-flavor drops.',
    icon: <Sparkles className="w-5 h-5" />,
    accentColor: '#FF0055',
  },
];

export const HeritageTimeline: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(5);

  const handleSelectEvent = (index: number) => {
    sound.playTactileClick();
    setActiveIdx(index);
  };

  const activeEvent = TIMELINE_EVENTS[activeIdx];

  return (
    <section
      id="heritage"
      className="relative py-24 bg-[#0D0D0D] overflow-hidden"
      aria-label="Coca-Cola 140-Year Heritage Timeline"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-bold tracking-widest uppercase">
            <History className="w-3.5 h-3.5 text-[#F40009]" />
            <span>1886 — 2026 • 140 Years</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
            A Legacy of Upliftment
          </h2>
          <p className="text-white/60 text-base">
            From an Atlanta soda fountain to Earth orbit and neural AI flavor synthesis.
          </p>
        </div>

        {/* Horizontal Milestone Bar */}
        <div className="relative mb-12">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 bg-white/10 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
            {TIMELINE_EVENTS.map((event, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <button
                  key={event.year}
                  onClick={() => handleSelectEvent(idx)}
                  className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center gap-2 ${
                    isSelected
                      ? 'bg-white/15 border-white shadow-xl scale-105'
                      : 'bg-black/40 border-white/10 hover:border-white/20 text-white/60 hover:text-white'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: event.accentColor }}
                  >
                    {event.icon}
                  </div>
                  <span className="font-mono text-base font-black text-white">{event.year}</span>
                  <span className="text-[11px] truncate w-full font-medium">{event.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Spotlight Card */}
        <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-black/50 border border-white/10 space-y-3">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: activeEvent.accentColor }}
            >
              {activeEvent.icon}
            </div>
            <div className="font-mono text-3xl font-black text-white tracking-tight">
              {activeEvent.year}
            </div>
            <div className="text-xs uppercase tracking-widest text-white/50 font-semibold">
              {activeEvent.subtitle}
            </div>
          </div>

          <div className="md:col-span-8 space-y-4 text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {activeEvent.title}
            </h3>
            <p className="text-base text-white/70 leading-relaxed">
              {activeEvent.description}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F40009]" />
              <span>Preserved in the World of Coca-Cola Archives, Atlanta</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
