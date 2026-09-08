import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Shield, Check, ExternalLink } from 'lucide-react';
import { sound } from '../audio/SoundSynthesizer';
import { getRetailerDestination, redirectToOfficialStore } from '../services/retailerService';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  storeUrl?: string;
  storeName?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenCheckout: (discountPercent: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const total = Math.max(0, subtotal - discountAmount);

  const freeShippingThreshold = 35.0;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playTactileClick();
    const cleanCode = promoInput.trim().toUpperCase();

    if (cleanCode === 'REALMAGIC20') {
      setDiscountPercent(20);
      setPromoMessage('20% Real Magic VIP discount applied!');
    } else if (cleanCode === 'COKEZERO') {
      setDiscountPercent(15);
      setPromoMessage('15% Zero Sugar Pioneer discount applied!');
    } else {
      setPromoMessage('Invalid promo code. Try "REALMAGIC20"');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-md bg-[#111111] border-l border-white/10 h-full flex flex-col justify-between p-6 text-white shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h2 id="cart-title" className="text-xl font-bold font-display">
              Your Coca-Cola Crate
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-mono">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playTactileClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="py-3 border-b border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/70 font-medium">
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Free Express Shipping Unlocked!
                </span>
              ) : (
                `Add $${remainingForFreeShipping.toFixed(2)} more for Free Shipping`
              )}
            </span>
            <span className="font-mono text-white/50">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F40009] rounded-full transition-all duration-300"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                🥫
              </div>
              <p className="text-sm font-semibold text-white/80">Your crate is currently empty</p>
              <p className="text-xs text-white/50 max-w-xs">
                Explore our 3D Can Showcase, synthesize a custom drop, or grab limited collector vault tins.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const dest = getRetailerDestination(item.id, item.name);
              const storeUrl = item.storeUrl || dest.storeUrl;
              const storeName = item.storeName || dest.storeName;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-serif italic font-bold text-white text-xs shadow-md border border-white/20"
                      style={{ backgroundColor: item.image || '#F40009' }}
                    >
                      Coke
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <div className="text-xs font-mono text-white/60">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>

                    {/* Quantity adjustments */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg bg-black/40 border border-white/10">
                        <button
                          onClick={() => {
                            sound.playTactileClick();
                            onUpdateQuantity(item.id, -1);
                          }}
                          className="p-1 text-white/60 hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => {
                            sound.playTactileClick();
                            onUpdateQuantity(item.id, 1);
                          }}
                          className="p-1 text-white/60 hover:text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          sound.playTactileClick();
                          onRemoveItem(item.id);
                        }}
                        className="p-1.5 rounded-lg text-white/40 hover:text-[#F40009] transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Official Store Redirect Action for Item */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-white/50 truncate max-w-[170px]" title={storeName}>
                      {storeName}
                    </span>
                    <button
                      onClick={() => {
                        sound.playCanSnap();
                        redirectToOfficialStore(storeUrl);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#F40009] text-white/90 hover:text-white font-medium flex items-center gap-1 transition-all group"
                      title={`Buy ${item.name} at ${storeName}`}
                    >
                      <span>Shop Now</span>
                      <ExternalLink className="w-3 h-3 text-[#00F5D4] group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Promo Code & Summary Footer */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-4">
            
            {/* Promo code input */}
            <form onSubmit={handleApplyPromo} className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo (try REALMAGIC20)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#F40009] uppercase"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1 transition-all"
                >
                  <Tag className="w-3 h-3" />
                  <span>Apply</span>
                </button>
              </div>
              {promoMessage && (
                <div className={`text-[11px] font-medium ${discountPercent > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {promoMessage}
                </div>
              )}
            </form>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>VIP Discount ({discountPercent}%)</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-white/70">
                <span>Shipping</span>
                <span className="font-mono">{remainingForFreeShipping === 0 ? 'FREE' : '$4.99'}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                sound.playCanSnap();
                onOpenCheckout(discountPercent);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#F40009] hover:bg-[#E40008] text-white font-bold text-sm tracking-wide shadow-glow-red flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>Proceed to Instant Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Direct Official Coca-Cola Store Redirect Option */}
            <button
              onClick={() => {
                sound.playCanSnap();
                redirectToOfficialStore('https://www.coca-colastore.com/');
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span>Shop All at Official Coca-Cola Store ↗</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-white/40">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 256-Bit Encrypted Secure Checkout</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
