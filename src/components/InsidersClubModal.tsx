import React, { useState } from 'react';
import { X, Crown, ShieldCheck, Check, Sparkles, LogOut, Key } from 'lucide-react';
import { UserSession, SecurityService } from '../services/security';
import { sound } from '../audio/SoundSynthesizer';

interface InsidersClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession | null;
  onLogin: (session: UserSession) => void;
  onLogout: () => void;
}

export const InsidersClubModal: React.FC<InsidersClubModalProps> = ({
  isOpen,
  onClose,
  session,
  onLogin,
  onLogout,
}) => {
  const [email, setEmail] = useState('collector@realmagic.coke');
  const [name, setName] = useState('Riley Vance');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCanSnap();
    const newSession = SecurityService.createMockSession(email, name);
    onLogin(newSession);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="insiders-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-md bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl animate-in zoom-in-95 duration-300">
        
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

        {session ? (
          /* LOGGED IN VIEW */
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F40009] to-[#FF0055] flex items-center justify-center shadow-glow-red">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 id="insiders-title" className="text-xl font-bold font-display text-white">
                  Welcome, {session.name}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#00F5D4]/20 text-[#00F5D4] text-[10px] font-mono font-bold">
                    {session.tier}
                  </span>
                  <span className="text-xs text-white/50">{session.role}</span>
                </div>
              </div>
            </div>

            {/* Perks breakdown */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="text-xs uppercase font-bold text-white/50 tracking-wider block">
                Active VIP Member Privileges
              </span>
              <div className="space-y-2 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>30-minute early drop access on Creations limited editions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Free Cold-Chain courier shipping on every crate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Double community voting power in Coke Studio drops</span>
                </div>
              </div>
            </div>

            {/* Simulated Session Token Badge */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase font-mono">
                <Key className="w-3 h-3 text-[#00F5D4]" />
                <span>PKCE Authenticated JWT Token</span>
              </div>
              <div className="font-mono text-[9px] text-white/30 truncate">
                {session.token}
              </div>
            </div>

            <button
              onClick={() => {
                sound.playTactileClick();
                onLogout();
              }}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Insiders Club</span>
            </button>
          </div>
        ) : (
          /* LOGIN FORM */
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F40009]/20 text-[#F40009] flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 id="insiders-title" className="text-xl font-bold font-display text-white">
                  Coca-Cola Insiders Club
                </h2>
                <p className="text-xs text-white/50">Exclusive early drops & custom mixology access</p>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-white/50">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#F40009]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-white/50">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#F40009]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#F40009] hover:bg-[#E40008] text-white font-bold text-sm tracking-wide shadow-glow-red flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
              >
                <Sparkles className="w-4 h-4" />
                <span>Instant Sign In with Coca-Cola ID</span>
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-xs text-white/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>OAuth 2.0 PKCE • Zero spam, immediate VIP tier</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
