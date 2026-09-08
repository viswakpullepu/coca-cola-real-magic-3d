import React, { useState } from 'react';
import { Sparkles, Thermometer, Flame, Gauge, Plus, ArrowRight, ExternalLink } from 'lucide-react';
import { CokeCanScene } from '../3d/CokeCanScene';
import { CarbonationParticles } from '../3d/CarbonationParticles';
import { FLAVOR_PROFILES, FlavorProfile } from '../tokens/designSystem';
import { sound } from '../audio/SoundSynthesizer';
import { getRetailerDestination, redirectToOfficialStore } from '../services/retailerService';

interface HeroStageProps {
  selectedFlavor: string;
  onSelectFlavor: (flavorKey: string) => void;
  onAddToCart: (item: { id: string; name: string; price: number; image: string }) => void;
  onFpsUpdate?: (fps: number) => void;
  onTriggerFrost?: () => void;
  onNavigateTab?: (tab: 'stage' | 'happiness' | 'sonic' | 'create' | 'vault' | 'drops') => void;
}

export const HeroStage: React.FC<HeroStageProps> = ({
  selectedFlavor,
  onSelectFlavor,
  onAddToCart,
  onFpsUpdate,
  onTriggerFrost,
  onNavigateTab,
}) => {
  const [burstTrigger, setBurstTrigger] = useState(0);
  const currentProfile: FlavorProfile = FLAVOR_PROFILES[selectedFlavor] || FLAVOR_PROFILES.classic;

  const handleFlavorChange = (key: string) => {
    sound.playTactileClick();
    onSelectFlavor(key);
    setBurstTrigger((prev) => prev + 1);
  };

  const handleCanPopped = () => {
    setBurstTrigger((prev) => prev + 1);
  };

  const handleQuickAdd = () => {
    sound.playCanSnap();
    onAddToCart({
      id: `can_${currentProfile.id}_4pack`,
      name: `${currentProfile.name} (4-Pack Sleek Cans)`,
      price: 9.99,
      image: currentProfile.primaryColor,
    });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 pb-16 flex flex-col justify-between overflow-hidden bg-[#0A0A0A]"
      aria-label="Coca-Cola 3D Interactive Showcase"
    >
      {/* Dynamic Ambient Color Aura Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-40 pointer-events-none transition-all duration-700 ease-out"
        style={{ backgroundColor: currentProfile.primaryColor }}
      />

      {/* Carbonation Effervescence Particles Layer */}
      <CarbonationParticles
        burstTrigger={burstTrigger}
        bubbleColor={currentProfile.glowRgba}
        intensity={currentProfile.effervescenceRating / 4}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        
        {/* Left Column: Kinetic Typography & Flavor Description */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest uppercase text-white/70">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentProfile.primaryColor }} />
            <span>Interactive 3D Experience</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] font-display">
              Real Magic{' '}
              <span
                className="bg-clip-text text-transparent italic font-serif"
                style={{
                  backgroundImage: `linear-gradient(to right, ${currentProfile.primaryColor}, #FFFFFF)`,
                }}
              >
                Uncapped.
              </span>
            </h1>
            <p className="text-lg text-white/70 font-normal leading-relaxed pt-2">
              {currentProfile.tagline}
            </p>
          </div>

          {/* Tasting Notes Chips */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-white/40 font-semibold block">
              Flavor Architecture
            </span>
            <div className="flex flex-wrap gap-2">
              {currentProfile.flavorNotes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/90 font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={handleQuickAdd}
              className="px-6 py-3.5 rounded-full text-white font-bold text-sm tracking-wide shadow-glow-red hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
              style={{ backgroundColor: currentProfile.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Collect 4-Pack ($9.99)</span>
            </button>

            {onTriggerFrost && (
              <button
                onClick={() => {
                  sound.playIceClink();
                  onTriggerFrost();
                }}
                className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5"
                title="Freeze and wipe cold condensation on screen"
              >
                <span>❄️ Chill Screen</span>
              </button>
            )}

            {/* Direct Official Store Link */}
            <button
              onClick={() => {
                sound.playCanSnap();
                const dest = getRetailerDestination(`can_${currentProfile.id}_4pack`, currentProfile.name);
                redirectToOfficialStore(dest.storeUrl);
              }}
              className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs tracking-wide transition-all flex items-center gap-1.5"
              title={`Shop ${currentProfile.name} on Official Store`}
            >
              <span>Shop Now</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#00F5D4]" />
            </button>

            <button
              onClick={() => {
                sound.playTactileClick();
                if (onNavigateTab) onNavigateTab('create');
              }}
              className="px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs tracking-wide transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span>Creations</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/50" />
            </button>
          </div>

        </div>

        {/* Center Column: Interactive 3D Can Canvas */}
        <div className="lg:col-span-5 h-[480px] sm:h-[540px] lg:h-[620px] flex items-center justify-center relative">
          <CokeCanScene
            flavorKey={selectedFlavor}
            onFpsUpdate={onFpsUpdate}
            onCanPopped={handleCanPopped}
          />
        </div>

        {/* Right Column: Minimalist Beverage Telemetry */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-[11px] uppercase tracking-widest text-white/50 font-bold">
                Specifications
              </span>
              <span className="text-xs font-mono text-[#00F5D4] font-bold">
                EST. 1886
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider block">Serving Temp</span>
                <div className="text-lg font-mono font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Thermometer className="w-3.5 h-3.5 text-[#00F5D4]" />
                  <span>{currentProfile.temperatureCelsius}°C</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider block">Caloric Index</span>
                <div className="text-lg font-mono font-bold text-white mt-0.5">
                  {currentProfile.calories}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider block">Carbonation</span>
                <div className="text-lg font-mono font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Gauge className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>38 PSI</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider block">Effervescence</span>
                <div className="text-lg font-mono font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-[#F40009]" />
                  <span>{currentProfile.effervescenceRating}/5</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] text-[11px] text-white/40 leading-relaxed font-sans">
              330 mL sleek aluminum can. Cold-fill nitrogen charged. 100% infinitely recyclable.
            </div>
          </div>
        </div>

      </div>

      {/* Bottom: Flavor Selection Carousel Bar */}
      <div className="max-w-4xl mx-auto px-4 w-full z-20 pt-6">
        <div
          role="tablist"
          aria-label="Coca-Cola Flavors"
          className="p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-between gap-2 overflow-x-auto"
        >
          {Object.entries(FLAVOR_PROFILES).map(([key, profile]) => {
            const isSelected = selectedFlavor === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleFlavorChange(key)}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-white text-black shadow-lg scale-100'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: profile.primaryColor }}
                />
                <span className="truncate">{profile.name.replace('Coca-Cola ', '')}</span>
              </button>
            );
          })}
        </div>
      </div>

    </section>
  );
};
