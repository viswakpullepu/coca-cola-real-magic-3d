import React, { useState } from 'react';
import { Compass, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { sound } from '../audio/SoundSynthesizer';
import { FLAVOR_PROFILES } from '../tokens/designSystem';

interface AuraTasteQuizProps {
  onSelectFlavor: (flavorKey: string) => void;
  onAddToCart: (item: { id: string; name: string; price: number; image: string }) => void;
}

interface Question {
  id: number;
  prompt: string;
  subtitle: string;
  options: Array<{
    text: string;
    sub: string;
    flavorTarget: 'classic' | 'zero' | 'cherry' | 'vanilla' | 'y3000';
    icon: string;
  }>;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: 'What is your prime creative hour & energy?',
    subtitle: 'Choose your natural rhythm of the day',
    options: [
      { text: 'Golden Hour Sunset', sub: 'Warm nostalgic radiance', flavorTarget: 'classic', icon: '🌅' },
      { text: 'Midnight Neon City', sub: 'Cyberpunk nocturnal focus', flavorTarget: 'y3000', icon: '⚡' },
      { text: 'Crisp 6 AM Dawn', sub: 'High-discipline clean start', flavorTarget: 'zero', icon: '🧊' },
      { text: 'Velvety Late Evening', sub: 'Cozy vinyl records & books', flavorTarget: 'vanilla', icon: '🌙' },
    ],
  },
  {
    id: 2,
    prompt: 'What describes your ideal taste sensation?',
    subtitle: 'How your palate craves refreshment',
    options: [
      { text: 'Maximum Crisp, Zero Sugar', sub: 'Pure clean effervescence', flavorTarget: 'zero', icon: '🖤' },
      { text: 'Tart Orchard Stonefruit', sub: 'Vibrant sweet cherry burst', flavorTarget: 'cherry', icon: '🍒' },
      { text: 'Timeless Caramel Kola', sub: 'The unchanged 1886 standard', flavorTarget: 'classic', icon: '🥫' },
      { text: 'AI Electric Synthetics', sub: 'Uncharted cosmic botanicals', flavorTarget: 'y3000', icon: '🔮' },
    ],
  },
  {
    id: 3,
    prompt: 'What music carries your flow state?',
    subtitle: 'The sonic frequency of your soul',
    options: [
      { text: 'Synthwave & Electronic', sub: 'Pulsing cybernetic beats', flavorTarget: 'y3000', icon: '🎧' },
      { text: 'Classic Motown & Soul', sub: 'Warm horns and timeless bass', flavorTarget: 'classic', icon: '🎷' },
      { text: 'Smooth Lo-Fi Chillhop', sub: 'Rainy afternoon velvet piano', flavorTarget: 'vanilla', icon: '☕' },
      { text: 'Modern Alt-Pop & Rock', sub: 'Punchy anthemic hooks', flavorTarget: 'cherry', icon: '🎸' },
    ],
  },
];

export const AuraTasteQuiz: React.FC<AuraTasteQuizProps> = ({ onSelectFlavor, onAddToCart }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultFlavor, setResultFlavor] = useState<string | null>(null);

  const handleSelectOption = (target: string) => {
    sound.playTactileClick();
    const updated = [...answers, target];
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate winner flavor (highest frequency)
      const counts: Record<string, number> = {};
      updated.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
      let highestKey = 'classic';
      let max = 0;
      Object.entries(counts).forEach(([k, count]) => {
        if (count > max) {
          max = count;
          highestKey = k;
        }
      });

      setResultFlavor(highestKey);
      sound.playGoldenFanfare();
    }
  };

  const handleApplyAura = () => {
    if (!resultFlavor) return;
    sound.playCanSnap();
    onSelectFlavor(resultFlavor);
    // Scroll to 3D can hero
    const hero = document.getElementById('hero');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderAuraPack = () => {
    if (!resultFlavor) return;
    const profile = FLAVOR_PROFILES[resultFlavor] || FLAVOR_PROFILES.classic;
    sound.playCanSnap();
    onAddToCart({
      id: `aura_${resultFlavor}_crate`,
      name: `Aura Match: ${profile.name} (Curated 4-Pack)`,
      price: 9.99,
      image: profile.primaryColor,
    });
  };

  const handleReset = () => {
    sound.playTactileClick();
    setCurrentStep(0);
    setAnswers([]);
    setResultFlavor(null);
  };

  const matchedProfile = resultFlavor ? FLAVOR_PROFILES[resultFlavor] : null;

  return (
    <section
      id="taste-quiz"
      className="relative py-24 bg-[#0A0A0A] border-t border-white/10 overflow-hidden"
      aria-label="Coca-Cola Aura Personality Taste Quiz"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F5D4]/15 border border-[#00F5D4]/30 text-[#00F5D4] text-xs font-bold tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>AI Flavor Discovery • 30-Second Match</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
            What Is Your Coca-Cola Aura?
          </h2>
          <p className="text-white/60 text-base max-w-xl mx-auto">
            Answer 3 quick sensory questions to discover which formula synchronizes with your personal energy.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl">
          
          {!resultFlavor ? (
            /* Quiz Active Question */
            <div className="space-y-8">
              
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2">
                {QUESTIONS.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? 'w-8 bg-[#00F5D4]'
                        : idx < currentStep
                        ? 'w-2 bg-white/60'
                        : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Prompt */}
              <div className="space-y-1">
                <span className="text-xs uppercase font-mono tracking-widest text-[#00F5D4]">
                  Question {currentStep + 1} of 3
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  {QUESTIONS[currentStep].prompt}
                </h3>
                <p className="text-xs text-white/50">
                  {QUESTIONS[currentStep].subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                {QUESTIONS[currentStep].options.map((opt) => (
                  <button
                    key={opt.text}
                    onClick={() => handleSelectOption(opt.flavorTarget)}
                    className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00F5D4]/40 transition-all duration-200 group flex items-start gap-4 active:scale-95"
                  >
                    <span className="text-2xl p-2 rounded-xl bg-black/40 border border-white/5 group-hover:scale-110 transition-transform">
                      {opt.icon}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-[#00F5D4] transition-colors">
                        {opt.text}
                      </div>
                      <div className="text-xs text-white/50 mt-0.5">{opt.sub}</div>
                    </div>
                  </button>
                ))}
              </div>

            </div>
          ) : (
            /* Quiz Result Calculation Card */
            matchedProfile && (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl shadow-lg border-2 border-white/20"
                  style={{ backgroundColor: matchedProfile.primaryColor }}
                >
                  ✨
                </div>

                <div className="space-y-2">
                  <span className="px-3.5 py-1 rounded-full bg-white/10 text-xs font-mono tracking-widest uppercase text-white/80">
                    Aura Frequency Match 98.4%
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black text-white font-display">
                    {matchedProfile.name}
                  </h3>
                  <p className="text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
                    {matchedProfile.description}
                  </p>
                </div>

                {/* Flavor Notes */}
                <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                  {matchedProfile.flavorNotes.map((note) => (
                    <span
                      key={note}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={handleApplyAura}
                    className="px-6 py-3.5 rounded-2xl bg-[#00F5D4] hover:bg-[#00d6ba] text-black font-extrabold text-sm tracking-wide shadow-glow-cyan flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Morph 3D Can to My Aura</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleOrderAuraPack}
                    className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm tracking-wide flex items-center gap-2 transition-all active:scale-95"
                  >
                    <span>Order Aura 4-Pack ($9.99)</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                    title="Retake Quiz"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          )}

        </div>

      </div>
    </section>
  );
};
