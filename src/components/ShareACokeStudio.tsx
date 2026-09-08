import React, { useState } from 'react';
import { Heart, Sparkles, Gift, Check, ShoppingBag, Copy, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CokeCanScene } from '../3d/CokeCanScene';
import { sound } from '../audio/SoundSynthesizer';
import { redirectToOfficialStore } from '../services/retailerService';

interface ShareACokeStudioProps {
  onAddToCart: (item: { id: string; name: string; price: number; image: string }) => void;
}

const RELATIONSHIP_TAGS = [
  'Bestie',
  'Soulmate',
  'Day One',
  'Legend',
  'Work Twin',
  'Mom',
  'Brother',
  'Champion',
];

export const ShareACokeStudio: React.FC<ShareACokeStudioProps> = ({ onAddToCart }) => {
  const [recipientName, setRecipientName] = useState('EMMA');
  const [selectedTag, setSelectedTag] = useState('Bestie');
  const [personalNote, setPersonalNote] = useState('Thanks for always bringing the real magic into my life. Ice cold Coke on me!');
  const [flavor, setFlavor] = useState('classic');
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isUnwrapped, setIsUnwrapped] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleOpenGiftModal = () => {
    sound.playCanSnap();
    setIsUnwrapped(false);
    setIsGiftModalOpen(true);
  };

  const handleUnwrap = () => {
    sound.playCanSnap();
    sound.playGoldenFanfare();
    setIsUnwrapped(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F40009', '#FFFFFF', '#F59E0B'],
    });
  };

  const handleCopyLink = () => {
    sound.playTactileClick();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOrderPhysical = () => {
    sound.playCanSnap();
    onAddToCart({
      id: `share_coke_${recipientName.toLowerCase()}_${Date.now()}`,
      name: `Share a Coke with ${recipientName} (${selectedTag})`,
      price: 4.99,
      image: flavor === 'zero' ? '#111111' : '#F40009',
    });
  };

  return (
    <section
      id="share-a-coke"
      className="relative py-24 bg-[#0E0E0E] border-t border-white/10 overflow-hidden"
      aria-label="Share a Coke 3D Virtual Gifting Campaign"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[#F40009]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F40009]/15 border border-[#F40009]/30 text-[#F40009] text-xs font-bold tracking-widest uppercase">
            <Heart className="w-3.5 h-3.5" />
            <span>Legendary Global Campaign • Share a Coke</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
            Share a Coke with Someone Special
          </h2>
          <p className="text-white/60 text-base">
            Stamp their name on an authentic 3D Coca-Cola Can, attach a heartwarming message, and send an interactive digital unboxing or an order-to-door physical keepsake.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Customizer Controls */}
          <div className="lg:col-span-6 space-y-6 bg-white/[0.03] border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-md">
            
            {/* Recipient Name */}
            <div className="space-y-2">
              <label htmlFor="share-name" className="text-xs uppercase font-bold text-white/50 tracking-wider block">
                1. Recipient Name (Printed on 3D Can)
              </label>
              <div className="relative">
                <input
                  id="share-name"
                  type="text"
                  maxLength={12}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value.toUpperCase())}
                  placeholder="E.G. SARAH"
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white font-serif italic text-lg tracking-wider focus:outline-none focus:border-[#F40009]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/40">
                  {recipientName.length}/12
                </span>
              </div>
            </div>

            {/* Relationship Tags */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-white/50 tracking-wider block">
                2. Choose Relationship Dedication
              </label>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIP_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      sound.playTactileClick();
                      setSelectedTag(tag);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedTag === tag
                        ? 'bg-[#F40009] border-[#F40009] text-white shadow-glow-red'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Flavor Selection */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-white/50 tracking-wider block">
                3. Formula Base
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'classic', label: 'Classic Red', color: '#F40009' },
                  { id: 'zero', label: 'Zero Sugar', color: '#111111' },
                  { id: 'cherry', label: 'Wild Cherry', color: '#D90429' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      sound.playTactileClick();
                      setFlavor(f.id);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      flavor === f.id
                        ? 'bg-white/20 border-white text-white'
                        : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Note */}
            <div className="space-y-2">
              <label htmlFor="share-note" className="text-xs uppercase font-bold text-white/50 tracking-wider block">
                4. Heartfelt Digital Dedication Note
              </label>
              <textarea
                id="share-note"
                rows={3}
                maxLength={140}
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-xs text-white/90 focus:outline-none focus:border-[#F40009] resize-none leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleOpenGiftModal}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#F40009] to-[#E40008] text-white font-bold text-sm tracking-wide shadow-glow-red flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Gift className="w-4 h-4" />
                <span>Preview & Send Virtual Gift</span>
              </button>

              <button
                onClick={handleOrderPhysical}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm flex items-center gap-2 transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#F40009]" />
                <span>Order Can ($4.99)</span>
              </button>

              <button
                onClick={() => {
                  sound.playCanSnap();
                  redirectToOfficialStore('https://www.coca-cola.com/us/en/offerings/share-a-coke');
                }}
                className="px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
                title="Open Official Share a Coke Store"
              >
                <span>Official Store</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#00F5D4]" />
              </button>
            </div>

          </div>

          {/* Right: Live 3D Can Rendering with Recipient's Name */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full h-[450px] sm:h-[500px] relative rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 overflow-hidden flex items-center justify-center">
              
              <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F40009]" />
                <span>Share with: <strong className="font-serif italic font-bold text-white">{recipientName || 'YOU'}</strong></span>
              </div>

              <CokeCanScene
                flavorKey={flavor}
                customLabel={recipientName ? `SHARE WITH ${recipientName}` : 'SHARE A COKE'}
                customInfusion={selectedTag}
              />
            </div>

            <div className="mt-4 text-xs text-white/50 flex items-center gap-2">
              <span>❤️ Over 1.2 billion personalized Coca-Cola bottles shared globally.</span>
            </div>
          </div>

        </div>

      </div>

      {/* Virtual Unboxing Modal */}
      {isGiftModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300"
        >
          <div className="relative w-full max-w-md bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 text-white text-center space-y-6 shadow-2xl">
            
            {!isUnwrapped ? (
              /* Wrapped Gift Card */
              <div className="space-y-6 py-6">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#F40009] to-[#BA0007] flex items-center justify-center shadow-glow-red animate-bounce">
                  <Gift className="w-10 h-10 text-white" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-white">
                    Special Delivery for {recipientName}!
                  </h3>
                  <p className="text-xs text-white/60">
                    A personalized ice-cold Coca-Cola moment has been wrapped for you.
                  </p>
                </div>

                <button
                  onClick={handleUnwrap}
                  className="w-full py-4 rounded-2xl bg-[#F40009] hover:bg-[#E40008] text-white font-extrabold text-sm tracking-wide shadow-glow-red flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tap to Unwrap Digital Can</span>
                </button>
              </div>
            ) : (
              /* Unwrapped Card View */
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-serif italic font-bold text-lg text-[#F40009]">Share a Coke</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F40009]/20 text-[#F40009] text-[10px] font-bold">
                      {selectedTag}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-white/50 uppercase tracking-wider block">Dedicated to</span>
                    <div className="text-2xl font-serif italic font-black text-white">{recipientName}</div>
                  </div>

                  <p className="text-sm text-white/80 italic leading-relaxed pt-2 border-t border-white/10">
                    “{personalNote}”
                  </p>

                  <div className="text-[10px] text-white/40 pt-1 font-mono">
                    Redeemable for 1 ice cold 330mL Can at any participating vendor.
                  </div>
                </div>

                {/* Share Link Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Gift Link'}</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playTactileClick();
                      setIsGiftModalOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
