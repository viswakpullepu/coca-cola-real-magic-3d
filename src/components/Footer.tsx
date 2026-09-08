import React, { useState } from 'react';
import { RefreshCw, Droplets, Leaf, Shield, ArrowUp, X } from 'lucide-react';
import { sound } from '../audio/SoundSynthesizer';
import { StudioTab } from './StudioDock';

interface FooterProps {
  onSelectTab?: (tab: StudioTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const [modalContent, setModalContent] = useState<'PRIVACY' | 'TERMS' | null>(null);

  const scrollToTop = () => {
    sound.playTactileClick();
    if (onSelectTab) onSelectTab('stage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openModal = (type: 'PRIVACY' | 'TERMS') => {
    sound.playTactileClick();
    setModalContent(type);
  };

  return (
    <footer className="bg-[#050505] text-white border-t border-white/10 pt-20 pb-12" aria-label="Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Sustainability & Environmental Stewardship Pledges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/10">
          
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#00F5D4]/10 text-[#00F5D4] flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">World Without Waste</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Every sleek aluminum can is infinitely recyclable. We aim to collect and recycle a bottle or can for every one we sell.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 flex-shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">100%+ Water Replenishment</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                We return over 100% of the water used in our finished beverages back to natural watersheds and local communities globally.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">Net Zero Carbon by 2040</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Decarbonizing our entire supply chain, cold-chain transport network, and renewable manufacturing facilities.
              </p>
            </div>
          </div>

        </div>

        {/* AEO / SEO Answer Engine Optimization Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-white/40 tracking-wider">
            <Shield className="w-4 h-4 text-[#F40009]" />
            <span>Frequently Asked Questions • Real Magic Knowledge Hub</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 className="font-bold text-sm text-white">
                What makes Coca-Cola's 3D interactive can rendering unique?
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                The 3D can is generated in real time using Three.js with custom physically-based metallic shaders, realistic cold condensation normal mapping, and a dynamic 2D canvas texture synthesizer that recalculates typography and logos on the fly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 className="font-bold text-sm text-white">
                How do Coca-Cola Creations limited drops work?
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Coca-Cola Creations is an ongoing global innovation platform bringing limited-edition flavor collaborations inspired by gaming, music, and AI. Each drop is produced in strictly allocated crates with verifiable certificates.
              </p>
            </div>
          </div>
        </div>

        {/* Global Footer Links & Back to Top */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#F40009] flex items-center justify-center font-serif italic font-black text-white text-sm">
              Coke
            </div>
            <div className="text-xs text-white/50">
              © 2026 The Coca-Cola Company. “Coca-Cola”, the Dynamic Ribbon device, and the Contour Bottle are registered trademarks.
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/60">
            <button
              onClick={() => openModal('PRIVACY')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => openModal('TERMS')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all text-xs"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Interactive Privacy / Terms Modal */}
      {modalContent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300 text-left"
        >
          <div className="relative w-full max-w-lg bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg font-display">
                {modalContent === 'PRIVACY' ? 'Privacy & Data Protection' : 'Terms of Digital Service'}
              </h3>
              <button
                onClick={() => setModalContent(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-white/70 space-y-3 leading-relaxed max-h-80 overflow-y-auto pr-2">
              {modalContent === 'PRIVACY' ? (
                <>
                  <p>
                    The Coca-Cola Company is committed to safeguarding your personal data in full compliance with GDPR, CCPA, and global privacy standards.
                  </p>
                  <p>
                    All customized labels, recipe formulations, and cart items are stored securely on your local device (via Native IndexedDB) or cryptographically masked. We do not sell or monetize personal customer identities.
                  </p>
                  <p>
                    Payment details are processed exclusively through PCI-DSS Level 1 simulated encrypted tokenization.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Welcome to the Coca-Cola Real Magic 3D Interactive Platform. By customizing 3D cans, participating in Coke Studio sessions, or reserving limited-edition drops, you agree to uphold our community standards of upliftment and respect.
                  </p>
                  <p>
                    All Spencerian script assets, trademarks, bottle contours, and sound formulations remain the exclusive property of The Coca-Cola Company © 2026.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-5 py-2.5 rounded-xl bg-[#F40009] hover:bg-[#E40008] text-white font-bold text-xs shadow-glow-red"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
