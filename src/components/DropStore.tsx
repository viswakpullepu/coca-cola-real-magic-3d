import React, { useState, useEffect } from 'react';
import { Package, Clock, ShieldCheck, Plus, Check, ExternalLink } from 'lucide-react';
import { sound } from '../audio/SoundSynthesizer';
import { getRetailerDestination, redirectToOfficialStore } from '../services/retailerService';

interface StoreItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stockLeft: number;
  description: string;
  accentColor: string;
  badge: string;
}

const STORE_ITEMS: StoreItem[] = [
  {
    id: 'drop_y3000_box',
    name: 'Y3000 Cyber Collector Vault',
    category: 'Limited Drop',
    price: 24.99,
    stockLeft: 14,
    description: 'Special edition tin vault containing 4 iridescent Y3000 cans and an AR digital portal key.',
    accentColor: '#00F5D4',
    badge: 'Selling Fast',
  },
  {
    id: 'drop_1915_glass',
    name: '1915 Georgia Green Glass 4-Pack',
    category: 'Heritage',
    price: 18.50,
    stockLeft: 28,
    description: 'Authentic heavy Georgia-green contour glass bottles made from the 1915 Root patent molds.',
    accentColor: '#D1D5DB',
    badge: 'Archival',
  },
  {
    id: 'drop_coke_studio_audio',
    name: 'Coke Studio Wireless Audio Gear',
    category: 'Hardware',
    price: 79.00,
    stockLeft: 8,
    description: 'Custom tuned 40mm beryllium drivers with iconic Georgia Red matte metallic earcups.',
    accentColor: '#F40009',
    badge: 'VIP Exclusive',
  },
  {
    id: 'drop_vintage_hoodie',
    name: 'Spencerian Script 450GSM Hoodie',
    category: 'Apparel',
    price: 48.00,
    stockLeft: 19,
    description: 'Heavyweight organic French terry cotton with tactile 3D chainstitch embroidered logo.',
    accentColor: '#F59E0B',
    badge: 'Member Only',
  },
];

interface DropStoreProps {
  onAddToCart: (item: { id: string; name: string; price: number; image: string }) => void;
}

export const DropStore: React.FC<DropStoreProps> = ({ onAddToCart }) => {
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAdd = (item: StoreItem) => {
    sound.playCanSnap();
    onAddToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.accentColor,
    });

    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  return (
    <section
      id="drop-store"
      className="relative py-24 bg-[#0A0A0A] border-t border-white/10"
      aria-label="Coca-Cola Limited Edition Creations Drop Store"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Live Drop Countdown Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F40009]/15 border border-[#F40009]/30 text-[#F40009] text-xs font-bold tracking-widest uppercase">
              <Package className="w-3.5 h-3.5" />
              <span>Limited Vault Allocations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
              Exclusive Creations Drops
            </h2>
            <p className="text-white/60 text-base max-w-xl">
              Strictly numbered production runs. Once vaulted crates sell out, formulas and apparel are permanently archived.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <Clock className="w-5 h-5 text-[#00F5D4]" />
            <div>
              <span className="text-[11px] text-white/50 uppercase tracking-wider block font-semibold">
                Drop Allocation Closes In:
              </span>
              <div className="font-mono text-xl font-black text-white tracking-wider">
                {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STORE_ITEMS.map((item) => {
            const isJustAdded = addedIds[item.id];
            return (
              <div
                key={item.id}
                className="group relative rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/25 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-black"
                    style={{ backgroundColor: item.accentColor }}
                  >
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-mono text-white/50">
                    {item.stockLeft} units left
                  </span>
                </div>

                {/* Simulated Spec Graphic Card */}
                <div className="h-44 rounded-2xl bg-black/40 border border-white/5 mb-6 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-white/15 transition-all">
                  <div
                    className="w-20 h-20 rounded-full blur-2xl opacity-40 absolute"
                    style={{ backgroundColor: item.accentColor }}
                  />
                  <div className="font-serif italic font-black text-4xl text-white/90 z-10">
                    Coke
                  </div>
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest mt-1 z-10">
                    {item.category}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-6">
                  <h3 className="font-bold text-white text-lg group-hover:text-[#F40009] transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price & Add Action */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="font-mono text-xl font-black text-white">
                    ${item.price.toFixed(2)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        sound.playCanSnap();
                        const dest = getRetailerDestination(item.id, item.name);
                        redirectToOfficialStore(dest.storeUrl);
                      }}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wide transition-all flex items-center gap-1 group"
                      title={`Buy ${item.name} at Official Store`}
                    >
                      <span>Shop Now</span>
                      <ExternalLink className="w-3 h-3 text-[#00F5D4] group-hover:text-white transition-colors" />
                    </button>

                    <button
                      onClick={() => handleAdd(item)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 active:scale-95 ${
                        isJustAdded
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#F40009] text-white hover:bg-[#E40008] shadow-glow-red'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Security & Authenticity Trust Badge */}
        <div className="mt-12 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Guaranteed Authentic Coca-Cola Co. Drop</span>
          </div>
          <div>•</div>
          <div>Express Cold-Chain Logistics</div>
          <div>•</div>
          <div>Carbon Neutral Shipping</div>
        </div>

      </div>
    </section>
  );
};
