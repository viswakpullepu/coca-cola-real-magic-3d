import React, { useState, useEffect } from 'react';
import { ExternalLink, ShoppingBag, CheckCircle2, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { sound } from '../audio/SoundSynthesizer';
import { RetailerDestination, redirectToOfficialStore } from '../services/retailerService';

interface ShopRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: RetailerDestination | null;
  productPrice?: number;
  productImage?: string;
  onOpenCart: () => void;
}

export const ShopRedirectModal: React.FC<ShopRedirectModalProps> = ({
  isOpen,
  onClose,
  destination,
  productPrice = 9.99,
  productImage,
  onOpenCart,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isAutoRedirectActive, setIsAutoRedirectActive] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(null);
      return;
    }

    // Default to prompt mode with optional auto-countdown if active
    if (isAutoRedirectActive) {
      setCountdown(5);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            if (destination) {
              redirectToOfficialStore(destination.storeUrl);
            }
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isAutoRedirectActive, destination, onClose]);

  if (!isOpen || !destination) return null;

  const handleShopNow = () => {
    sound.playCanSnap();
    redirectToOfficialStore(destination.storeUrl);
    onClose();
  };

  const handleOpenCartClick = () => {
    sound.playTactileClick();
    onClose();
    onOpenCart();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shop-redirect-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#141414] border border-white/15 p-6 md:p-8 text-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Glow accent */}
        <div
          className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: productImage || '#F40009' }}
        />

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playTactileClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          aria-label="Close redirect modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
                Item Added to Crate
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-white/60">
                {destination.badge}
              </span>
            </div>
            <h3 id="shop-redirect-title" className="text-lg font-bold text-white">
              Official Buying Store Ready
            </h3>
          </div>
        </div>

        {/* Product Details Card */}
        <div className="my-5 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-serif italic font-bold text-white text-sm shadow-inner flex-shrink-0 border border-white/20"
            style={{ backgroundColor: productImage || '#F40009' }}
          >
            Coke
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{destination.name}</h4>
            <p className="text-xs text-white/60 line-clamp-1 mt-0.5">{destination.description}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-mono font-bold text-[#00F5D4]">
                ${productPrice.toFixed(2)}
              </span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-[11px] text-white/50 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Merchant
              </span>
            </div>
          </div>
        </div>

        {/* Retailer Info Box */}
        <div className="mb-6 p-4 rounded-2xl bg-[#1B1B1B] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">Official Retailer Store:</span>
            <span className="font-bold text-white flex items-center gap-1">
              {destination.storeName}
            </span>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Would you like to complete your purchase on the original buying store, or continue exploring the Coca-Cola 3D Interactive Stage?
          </p>

          {countdown !== null && (
            <div className="pt-2 text-xs font-mono text-amber-400 flex items-center justify-between">
              <span>Auto-redirecting in {countdown}s...</span>
              <button
                onClick={() => setCountdown(null)}
                className="text-xs text-white/60 hover:text-white underline"
              >
                Cancel auto-redirect
              </button>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs text-white/60">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={isAutoRedirectActive}
                onChange={(e) => setIsAutoRedirectActive(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-[#F40009] focus:ring-0 w-3.5 h-3.5 accent-[#F40009]"
              />
              <span>Enable 5s countdown auto-redirect</span>
            </label>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleShopNow}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#BA0007] via-[#F40009] to-[#E40008] hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-glow-red flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Shop Now on Official Store (Redirect ↗)</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleOpenCartClick}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white/70" />
              <span>View In-App Crate</span>
            </button>

            <button
              onClick={() => {
                sound.playTactileClick();
                onClose();
              }}
              className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <span>Stay in 3D Studio</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
