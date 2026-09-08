import React, { useState } from 'react';
import { X, Lock, CreditCard, CheckCircle2, Printer, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from './CartDrawer';
import { SecurityService } from '../services/security';
import { db, OrderRecord } from '../services/db';
import { sound } from '../audio/SoundSynthesizer';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountPercent: number;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountPercent,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'PAYMENT' | 'PROCESSING' | 'SUCCESS'>('PAYMENT');
  const [name, setName] = useState('Alex Taylor');
  const [email, setEmail] = useState('alex.taylor@example.com');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [idempotencyKey] = useState(() => SecurityService.generateIdempotencyKey());
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const tax = (subtotal - discountAmount) * 0.08;
  const total = Math.max(0, subtotal - discountAmount + tax);

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playTactileClick();
    setStep('PROCESSING');

    // Simulate 3D Secure / Stripe processing
    setTimeout(async () => {
      const orderId = 'ORD-' + Math.floor(Math.random() * 899999 + 100000);
      const newOrder: OrderRecord = {
        orderId,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        totalAmount: total,
        currency: 'USD',
        status: 'COMPLETED',
        idempotencyKey,
        timestamp: Date.now(),
        customerEmail: email,
      };

      // Save to IndexedDB
      await db.saveOrder(newOrder);
      setCompletedOrder(newOrder);
      setStep('SUCCESS');

      // Audio & Confetti celebration
      sound.playCanSnap();
      sound.playIceClink();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F40009', '#00F5D4', '#FFFFFF', '#F59E0B'],
      });

      onOrderSuccess();
    }, 1800);
  };

  const handlePrint = () => {
    sound.playTactileClick();
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-xl bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        {step !== 'PROCESSING' && (
          <button
            onClick={() => {
              sound.playTactileClick();
              onClose();
            }}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: PAYMENT FORM */}
        {step === 'PAYMENT' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F40009] flex items-center justify-center shadow-glow-red">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 id="checkout-title" className="text-xl font-bold font-display">
                  Secure Checkout
                </h2>
                <p className="text-xs text-white/50">Simulated Stripe Enterprise Payment Gateway</p>
              </div>
            </div>

            {/* Total Callout */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-white/50 uppercase tracking-wider block">Due Today</span>
                <div className="text-2xl font-black font-mono text-white">${total.toFixed(2)}</div>
              </div>
              <div className="text-right text-xs text-white/60">
                <div>Items: {items.reduce((a, b) => a + b.quantity, 0)}</div>
                <div>Idempotency Key: <span className="font-mono text-[10px] text-white/40">{idempotencyKey.slice(0, 14)}...</span></div>
              </div>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-white/50">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#F40009]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-white/50">Receipt Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#F40009]"
                  />
                </div>
              </div>

              {/* Card Number */}
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-white/50">Card Details</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(SecurityService.formatCardNumber(e.target.value))}
                    maxLength={19}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-[#F40009]"
                  />
                  <CreditCard className="w-5 h-5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-white/50">Expiry</label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={5}
                    placeholder="MM/YY"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-[#F40009]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-white/50">CVV</label>
                  <input
                    type="password"
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                    placeholder="•••"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-[#F40009]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#F40009] hover:bg-[#E40008] text-white font-bold text-sm tracking-wide shadow-glow-red flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
              >
                <Lock className="w-4 h-4" />
                <span>Authorize & Pay ${total.toFixed(2)} USD</span>
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-xs text-white/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PCI-DSS Level 1 Compliant • Zero raw card data saved</span>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING STATE */}
        {step === 'PROCESSING' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full border-4 border-[#F40009] border-t-transparent animate-spin" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-display">
                Authorizing Real Magic Transaction...
              </h3>
              <p className="text-sm text-white/50 font-mono">
                Verifying idempotency signature • TLS 1.3
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & RECEIPT */}
        {step === 'SUCCESS' && completedOrder && (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-white">
                  Payment Confirmed!
                </h2>
                <p className="text-xs text-white/50">
                  Order <span className="font-mono text-white">{completedOrder.orderId}</span> has been queued for canning & dispatch.
                </p>
              </div>
            </div>

            {/* Printable Digital Receipt Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="font-serif italic font-bold text-sm text-white">The Coca-Cola Company</span>
                <span className="text-white/50">{new Date(completedOrder.timestamp).toLocaleDateString()}</span>
              </div>

              <div className="space-y-1 text-white/80">
                <div>Customer: <strong className="text-white">{name}</strong></div>
                <div>Email: {completedOrder.customerEmail}</div>
                <div>Card: {SecurityService.maskCard(cardNumber)}</div>
                <div>Status: <span className="text-emerald-400 font-bold">PAID • FULFILLMENT READY</span></div>
              </div>

              {/* Items */}
              <div className="border-t border-b border-white/10 py-2 space-y-1">
                {completedOrder.items.map((i) => (
                  <div key={i.id} className="flex justify-between text-white/70">
                    <span>{i.name} (x{i.quantity})</span>
                    <span>${(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm font-bold text-white pt-1">
                <span>Total Amount</span>
                <span>${completedOrder.totalAmount.toFixed(2)} USD</span>
              </div>

              {/* Barcode Stamp */}
              <div className="pt-2 text-center text-white/30 text-[9px] tracking-widest">
                ||||| | |||| |||||| || | |||| |||| ||||| |||||||
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={() => {
                  sound.playTactileClick();
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl bg-[#F40009] hover:bg-[#E40008] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow-red"
              >
                <span>Done & Return Home</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
