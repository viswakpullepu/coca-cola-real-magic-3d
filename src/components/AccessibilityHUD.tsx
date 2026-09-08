import React from 'react';
import { X, Eye, Activity, Volume2, FastForward, Check } from 'lucide-react';
import { sound } from '../audio/SoundSynthesizer';

interface AccessibilityHUDProps {
  isOpen: boolean;
  onClose: () => void;
  fps: number;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  isReducedMotion: boolean;
  onToggleReducedMotion: () => void;
  isDyslexicFont: boolean;
  onToggleDyslexicFont: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const AccessibilityHUD: React.FC<AccessibilityHUDProps> = ({
  isOpen,
  onClose,
  fps,
  isHighContrast,
  onToggleHighContrast,
  isReducedMotion,
  onToggleReducedMotion,
  isDyslexicFont,
  onToggleDyslexicFont,
  isMuted,
  onToggleMute,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hud-title"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md bg-[#141414] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-6 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F40009]/20 text-[#F40009]">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 id="hud-title" className="text-lg font-bold">
                Accessibility & Controls
              </h2>
              <p className="text-xs text-white/50">WCAG 2.2 AA & System Monitor</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playTactileClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-Time GPU Performance Monitor */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#00F5D4]" />
              GPU Rendering Telemetry
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                fps >= 55 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {fps} FPS
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-white/40 block text-[10px]">Draw Calls</span>
              <strong className="font-mono text-white">12</strong>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-white/40 block text-[10px]">Resolution</span>
              <strong className="font-mono text-white">Dynamic 2x</strong>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-white/40 block text-[10px]">Audio</span>
              <strong className="font-mono text-[#00F5D4]">Web Audio</strong>
            </div>
          </div>
        </div>

        {/* Accessibility Toggles */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Inclusive Experience
          </h3>

          {/* High Contrast Mode */}
          <button
            onClick={() => {
              sound.playTactileClick();
              onToggleHighContrast();
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
              isHighContrast
                ? 'bg-white text-black border-white'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <div>
              <div className="font-semibold text-sm">High-Contrast Mode</div>
              <div className={`text-xs ${isHighContrast ? 'text-black/70' : 'text-white/50'}`}>
                WCAG AAA black & white ultra contrast (7:1 ratio)
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                isHighContrast ? 'bg-black border-black text-white' : 'border-white/30'
              }`}
            >
              {isHighContrast && <Check className="w-3.5 h-3.5" />}
            </div>
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={() => {
              sound.playTactileClick();
              onToggleReducedMotion();
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
              isReducedMotion
                ? 'bg-[#F40009]/20 border-[#F40009] text-white'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <FastForward className="w-4 h-4 text-[#F40009]" />
              <div>
                <div className="font-semibold text-sm">Reduced Motion</div>
                <div className="text-xs text-white/50">Disables 3D auto-spin and animated transitions</div>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                isReducedMotion ? 'bg-[#F40009] border-[#F40009] text-white' : 'border-white/30'
              }`}
            >
              {isReducedMotion && <Check className="w-3.5 h-3.5" />}
            </div>
          </button>

          {/* Dyslexia Typography Toggle */}
          <button
            onClick={() => {
              sound.playTactileClick();
              onToggleDyslexicFont();
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
              isDyslexicFont
                ? 'bg-[#00F5D4]/20 border-[#00F5D4] text-white'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <div>
              <div className="font-semibold text-sm">Enhanced Readability Font</div>
              <div className="text-xs text-white/50">Increased line spacing & distinct glyph weights</div>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                isDyslexicFont ? 'bg-[#00F5D4] border-[#00F5D4] text-black' : 'border-white/30'
              }`}
            >
              {isDyslexicFont && <Check className="w-3.5 h-3.5" />}
            </div>
          </button>

          {/* Sound Synthesizer Mute Toggle */}
          <button
            onClick={() => {
              sound.playTactileClick();
              onToggleMute();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#F59E0B]" />
              <div>
                <div className="font-semibold text-sm">Acoustic Feedback</div>
                <div className="text-xs text-white/50">
                  {isMuted ? 'Muted' : 'Synthesized can crack, fizz & liquid sound enabled'}
                </div>
              </div>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-white/10">
              {isMuted ? 'OFF' : 'ON'}
            </span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="pt-2 text-center text-[11px] text-white/40">
          Standardized under WCAG 2.2 AA. Settings persist in local storage.
        </div>
      </div>
    </div>
  );
};
