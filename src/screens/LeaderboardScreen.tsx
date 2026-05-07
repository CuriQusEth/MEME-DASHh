import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'vitalik.eth', score: 9001 },
  { rank: 2, name: 'brian.base', score: 8420 },
  { rank: 3, name: '0xDoge...', score: 7777 },
  { rank: 4, name: 'MemeLord', score: 6969 },
  { rank: 5, name: 'RektGuy', score: 420 },
];

export function LeaderboardScreen() {
  const { setGameState } = useGameStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col p-6 z-20 bg-[var(--color-bg-dark)]/90 backdrop-blur-md"
    >
      <div className="flex items-center mb-8 pb-4 border-b border-white/10">
        <button 
          onClick={() => setGameState('MENU')}
          className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors mr-4"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl md:text-3xl impact-text text-[var(--color-neon-green)] drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">LEADERBOARD</h1>
      </div>

      <div className="bg-[var(--color-neon-green)]/5 border border-[var(--color-neon-green)]/20 p-4 rounded-2xl mb-6 text-center font-bold text-xs uppercase tracking-widest text-[var(--color-neon-green)]">
        Powered by Base Mainnet & ERC-8021
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pb-20">
        {MOCK_LEADERBOARD.map((entry) => (
          <div 
            key={entry.rank}
            className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center gap-6">
              <span className={`font-black text-3xl impact-text ${entry.rank === 1 ? 'text-[var(--color-neon-pink)] meme-glow' : entry.rank === 2 ? 'text-gray-300' : entry.rank === 3 ? 'text-orange-500' : 'text-gray-600'}`}>
                #{entry.rank}
              </span>
              <span className="font-bold text-lg uppercase tracking-wider">{entry.name}</span>
            </div>
            <span className="font-black text-2xl impact-text text-[var(--color-neon-green)]">{entry.score}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
