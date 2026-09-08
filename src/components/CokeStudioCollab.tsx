import React, { useState, useEffect } from 'react';
import { Radio, Heart, Flame, Music, Zap, Sparkles, Coffee } from 'lucide-react';
import { realtime, RealtimeMessage } from '../services/realtime';
import { sound } from '../audio/SoundSynthesizer';

interface FloatingCheer {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

export const CokeStudioCollab: React.FC = () => {
  const [onlineCount, setOnlineCount] = useState(418);
  const [floatingCheers, setFloatingCheers] = useState<FloatingCheer[]>([]);
  const [votes, setVotes] = useState({
    starlight: 1420,
    ozone: 980,
    matcha: 640,
  });
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // Subscribe to realtime broadcast channel
    const unsubscribe = realtime.subscribe((msg: RealtimeMessage) => {
      if (msg.type === 'CHEER') {
        const emoji = (msg.payload.emoji as string) || '❤️';
        spawnCheer(emoji);
      } else if (msg.type === 'VOTE') {
        const candidate = msg.payload.candidate as 'starlight' | 'ozone' | 'matcha';
        if (candidate && votes[candidate] !== undefined) {
          setVotes((prev) => ({
            ...prev,
            [candidate]: prev[candidate] + 1,
          }));
        }
      }
    });

    const timer = setInterval(() => {
      setOnlineCount(realtime.getOnlineCount());
    }, 2500);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [votes]);

  const spawnCheer = (emoji: string) => {
    sound.playBubblePop();
    const newCheer: FloatingCheer = {
      id: Math.random().toString(36).substring(2, 9),
      emoji,
      x: Math.random() * 80 + 10,
      y: 80,
    };

    setFloatingCheers((prev) => [...prev.slice(-15), newCheer]);

    setTimeout(() => {
      setFloatingCheers((prev) => prev.filter((c) => c.id !== newCheer.id));
    }, 2000);
  };

  const handleSendCheer = (emoji: string) => {
    sound.playBubblePop();
    spawnCheer(emoji);
    realtime.send('CHEER', { emoji });
  };

  const handleCastVote = (candidate: 'starlight' | 'ozone' | 'matcha') => {
    if (hasVoted) return;
    sound.playTactileClick();
    setHasVoted(true);
    setVotes((prev) => ({ ...prev, [candidate]: prev[candidate] + 1 }));
    realtime.send('VOTE', { candidate });
  };

  const totalVotes = votes.starlight + votes.ozone + votes.matcha;

  return (
    <section
      id="coke-studio"
      className="relative py-24 bg-[#0A0A0A] overflow-hidden"
      aria-label="Coca-Cola Studio Live Collaborative Session"
    >
      {/* Floating Real-Time Cheer Emojis Layer */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {floatingCheers.map((cheer) => (
          <div
            key={cheer.id}
            className="absolute text-3xl select-none animate-fizz"
            style={{
              left: `${cheer.x}%`,
              top: `${cheer.y}%`,
            }}
          >
            {cheer.emoji}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F40009]/15 border border-[#F40009]/30 text-[#F40009] text-xs font-bold tracking-widest uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Coke Studio Live Session</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
            The Sound of Real Magic
          </h2>
          <p className="text-white/60 text-base">
            Music, sound design, and live community energy in real time across the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Live Sound Lounge & Cheering Console */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs uppercase font-bold text-white tracking-wider">
                    Broadcast Room #01
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-white/90">
                  {onlineCount} Connected
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white font-display">
                Global Chill & Beat Room
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Connect your headphones. Send live cheers to everyone listening right now or trigger synthesized Coke ice clinks and carbonation snaps.
              </p>
            </div>

            {/* Synthesizer Jam Pads */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold text-white/40 tracking-wider block">
                Live Acoustic Jam Pads
              </span>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => sound.playCanSnap()}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-white flex flex-col items-center gap-1.5 transition-all active:scale-95"
                >
                  <Flame className="w-5 h-5 text-[#F40009]" />
                  <span>Can Snap</span>
                </button>
                <button
                  onClick={() => sound.playFizzHiss(1.2, 0.6)}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-white flex flex-col items-center gap-1.5 transition-all active:scale-95"
                >
                  <Sparkles className="w-5 h-5 text-[#00F5D4]" />
                  <span>Fizz Rush</span>
                </button>
                <button
                  onClick={() => sound.playIceClink()}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-white flex flex-col items-center gap-1.5 transition-all active:scale-95"
                >
                  <Coffee className="w-5 h-5 text-[#F59E0B]" />
                  <span>Ice Clink</span>
                </button>
              </div>
            </div>

            {/* Cheer Console */}
            <div className="space-y-3 pt-2">
              <span className="text-xs uppercase font-bold text-white/40 tracking-wider block">
                Tap to Send Real-Time Reactions
              </span>
              <div className="flex gap-2">
                {['❤️', '🔥', '🎵', '⚡', '✨', '🥤'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSendCheer(emoji)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                    title={`Send ${emoji} cheer`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Community Drop Voting */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold text-[#00F5D4] tracking-wider">
                <Music className="w-3.5 h-3.5" />
                <span>Next Limited Edition Community Drop</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                Vote For Fall 2026 Flavor
              </h3>
              <p className="text-sm text-white/60">
                Fans dictate our limited batch creation line. The leading formula goes directly into our automated canning facility.
              </p>
            </div>

            {/* Voting Options */}
            <div className="space-y-4">
              
              {/* Option 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF0055]" />
                    Starlight Cosmic Berry (47%)
                  </span>
                  <span className="font-mono text-white/60">{votes.starlight.toLocaleString()} votes</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF0055] to-[#7B2CBF] transition-all duration-500"
                    style={{ width: `${(votes.starlight / totalVotes) * 100}%` }}
                  />
                </div>
              </div>

              {/* Option 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#00F5D4]" />
                    Ozone Vanilla Frost (32%)
                  </span>
                  <span className="font-mono text-white/60">{votes.ozone.toLocaleString()} votes</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00F5D4] to-[#0284C7] transition-all duration-500"
                    style={{ width: `${(votes.ozone / totalVotes) * 100}%` }}
                  />
                </div>
              </div>

              {/* Option 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-emerald-400" />
                    Matcha Fizzy Citrus (21%)
                  </span>
                  <span className="font-mono text-white/60">{votes.matcha.toLocaleString()} votes</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 transition-all duration-500"
                    style={{ width: `${(votes.matcha / totalVotes) * 100}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Voting Action */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50">
                {hasVoted ? '✓ Vote recorded on live ledger' : 'Cast your vote now:'}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={hasVoted}
                  onClick={() => handleCastVote('starlight')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    hasVoted
                      ? 'opacity-40 cursor-not-allowed border-white/10 text-white'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                >
                  Vote Starlight
                </button>
                <button
                  disabled={hasVoted}
                  onClick={() => handleCastVote('ozone')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    hasVoted
                      ? 'opacity-40 cursor-not-allowed border-white/10 text-white'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                >
                  Vote Ozone
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
