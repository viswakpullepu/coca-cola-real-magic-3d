import React, { useState, useEffect } from 'react';
import { Sparkles, Sliders, Save, ShoppingCart, Check, Bookmark } from 'lucide-react';
import { CokeCanScene } from '../3d/CokeCanScene';
import { sound } from '../audio/SoundSynthesizer';
import { db, SavedRecipe } from '../services/db';
import { SecurityService } from '../services/security';

interface CreationsLabProps {
  onAddToCart: (item: { id: string; name: string; price: number; image: string }) => void;
}

const BASE_FORMULAS = [
  { id: 'classic', name: 'Original 1886 Base', color: '#F40009', tag: 'Classic Sugar' },
  { id: 'zero', name: 'Zero Sugar Matrix', color: '#111111', tag: '0 Calories' },
  { id: 'cherry', name: 'Ruby Infusion Base', color: '#D90429', tag: 'Orchard Cherry' },
  { id: 'y3000', name: 'Y3000 Cyber Net', color: '#00F5D4', tag: 'AI Co-Created' },
];

const INFUSIONS = [
  { id: 'Vanilla Bean', name: 'Bourbon Vanilla', note: '+ Warm Sweetness' },
  { id: 'Wild Cherry', name: 'Orchard Cherry', note: '+ Tart Stonefruit' },
  { id: 'Spiced Lime', name: 'Key Lime & Ginger', note: '+ Zesty Citrus' },
  { id: 'Cosmic Berry', name: 'Glitch Berry', note: '+ Electric Berry' },
];

export const CreationsLab: React.FC<CreationsLabProps> = ({ onAddToCart }) => {
  const [baseFormula, setBaseFormula] = useState('y3000');
  const [infusion, setInfusion] = useState('Cosmic Berry');
  const [fizzLevel, setFizzLevel] = useState(4);
  const [customLabel, setCustomLabel] = useState('COKE Y3000');
  const [recipeName, setRecipeName] = useState('Cyber Spark Formula');
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load saved recipes from IndexedDB
  useEffect(() => {
    db.getRecipes().then((recipes) => {
      if (recipes && recipes.length > 0) {
        setSavedRecipes(recipes);
      }
    });
  }, []);

  const handleSaveRecipe = async () => {
    sound.playTactileClick();
    const sanitizedLabel = SecurityService.sanitize(customLabel.trim() || 'CREATION');
    const sanitizedName = SecurityService.sanitize(recipeName.trim() || 'Bespoke Mix');

    const newRecipe: SavedRecipe = {
      id: 'rec_' + Date.now(),
      name: sanitizedName,
      baseFlavor: baseFormula,
      infusion,
      fizzLevel,
      customLabel: sanitizedLabel,
      createdAt: Date.now(),
      colorHex: BASE_FORMULAS.find((b) => b.id === baseFormula)?.color || '#F40009',
    };

    await db.saveRecipe(newRecipe);
    const updated = await db.getRecipes();
    setSavedRecipes(updated);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleLoadRecipe = (rec: SavedRecipe) => {
    sound.playTactileClick();
    setBaseFormula(rec.baseFlavor);
    setInfusion(rec.infusion);
    setFizzLevel(rec.fizzLevel);
    setCustomLabel(rec.customLabel);
    setRecipeName(rec.name);
  };

  const handleOrderBatch = () => {
    sound.playCanSnap();
    onAddToCart({
      id: `custom_batch_${Date.now()}`,
      name: `Custom Batch: ${recipeName} (${customLabel})`,
      price: 14.99,
      image: BASE_FORMULAS.find((b) => b.id === baseFormula)?.color || '#F40009',
    });
  };

  return (
    <section
      id="creations-lab"
      className="relative py-24 bg-[#0E0E0E] border-t border-b border-white/10"
      aria-label="Coca-Cola Creations Lab Flavor Synthesizer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/20 text-[#00F5D4] text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coca-Cola Creations Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
            Synthesize Your Custom Drop
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Mix rare flavor botanicals, dial in effervescence, stamp your bespoke Spencerian typography, and order an artisan small-batch 6-pack.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Mixology Customizer Controls */}
          <div className="lg:col-span-7 space-y-8 bg-white/[0.03] p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-md">
            
            {/* 1. Base Formula Picker */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold tracking-wider text-white/50 block">
                1. Select Liquid Base Formula
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {BASE_FORMULAS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      sound.playTactileClick();
                      setBaseFormula(b.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      baseFormula === b.id
                        ? 'bg-white/15 border-white shadow-md'
                        : 'bg-black/30 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded-full mb-2" style={{ backgroundColor: b.color }} />
                    <div className="text-xs font-bold text-white truncate">{b.name}</div>
                    <div className="text-[10px] text-white/40">{b.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Flavor Infusion */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold tracking-wider text-white/50 block">
                2. Artisan Botanical Infusion
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {INFUSIONS.map((inf) => (
                  <button
                    key={inf.id}
                    onClick={() => {
                      sound.playTactileClick();
                      setInfusion(inf.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      infusion === inf.id
                        ? 'bg-[#00F5D4]/15 border-[#00F5D4] text-white'
                        : 'bg-black/30 border-white/10 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold">{inf.name}</div>
                    <div className="text-[10px] text-white/40">{inf.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Effervescence PSI Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#F59E0B]" />
                  3. Effervescence & Fizz PSI
                </span>
                <span className="font-mono text-white font-bold">
                  {fizzLevel === 1 && 'Gentle Sparkle (20 PSI)'}
                  {fizzLevel === 2 && 'Standard Crisp (28 PSI)'}
                  {fizzLevel === 3 && 'High Fizz (35 PSI)'}
                  {fizzLevel === 4 && 'Extra Effervescent (42 PSI)'}
                  {fizzLevel === 5 && 'Hyper Carbonated (50 PSI)'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={fizzLevel}
                onChange={(e) => {
                  sound.playBubblePop();
                  setFizzLevel(parseInt(e.target.value, 10));
                }}
                className="w-full accent-[#00F5D4] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* 4. Custom Can Typography & Batch Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="custom-label-input" className="text-xs uppercase font-bold tracking-wider text-white/50 block">
                  4. Can Face Typography (Printed 3D)
                </label>
                <input
                  id="custom-label-input"
                  type="text"
                  maxLength={14}
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value.toUpperCase())}
                  placeholder="E.G. REAL MAGIC"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-serif italic text-sm focus:outline-none focus:border-[#00F5D4] tracking-wider"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="recipe-name-input" className="text-xs uppercase font-bold tracking-wider text-white/50 block">
                  Batch Formula Name
                </label>
                <input
                  id="recipe-name-input"
                  type="text"
                  maxLength={24}
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="E.G. Atlanta Reserve 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00F5D4]"
                />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleOrderBatch}
                className="px-6 py-3 rounded-full bg-[#00F5D4] hover:bg-[#00d6ba] text-black font-extrabold text-sm tracking-wide shadow-glow-cyan transition-all flex items-center gap-2 active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Order Custom 6-Pack ($14.99)</span>
              </button>

              <button
                onClick={handleSaveRecipe}
                className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-sm transition-all flex items-center gap-2"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Saved to Vault</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-white/70" />
                    <span>Save to Recipe Vault</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Live 3D Can Render of Custom Drop */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="w-full h-[450px] sm:h-[500px] relative rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 overflow-hidden flex items-center justify-center">
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-mono text-[#00F5D4]">
                LIVE 3D PRINT PREVIEW
              </div>

              <CokeCanScene
                flavorKey={baseFormula}
                customLabel={customLabel}
                customInfusion={infusion}
              />
            </div>

            {/* Saved Recipes Shelf */}
            {savedRecipes.length > 0 && (
              <div className="w-full mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-1.5 text-xs uppercase font-bold text-white/50 tracking-wider">
                  <Bookmark className="w-3.5 h-3.5 text-[#00F5D4]" />
                  <span>Your Vaulted Recipes ({savedRecipes.length})</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {savedRecipes.slice(0, 4).map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => handleLoadRecipe(rec)}
                      className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 hover:border-white/30 text-left min-w-[140px] text-xs transition-all flex-shrink-0"
                    >
                      <div className="font-bold text-white truncate">{rec.name}</div>
                      <div className="text-[10px] text-white/40">{rec.customLabel} • {rec.infusion}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
