import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

export function HUD() {
  const { score, distance, coins, hypeMeter, isViralMode } = useGameStore();

  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none flex flex-col md:flex-row justify-between z-10 px-6 pt-6 md:px-10 md:pt-8 gap-4">
      <div className="flex flex-col gap-1 items-start">
        <span className="text-[var(--color-neon-pink)] text-xs font-black tracking-widest uppercase flex items-center gap-2">
           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Live Run
        </span>
        <span className="text-4xl md:text-5xl font-black impact-text tracking-tighter text-[var(--color-neon-green)] meme-glow leading-none">{Math.floor(distance)}M</span>
      </div>

      <div className="flex flex-col w-full max-w-xs md:items-end">
        <div className="bg-white/5 border-l-4 border-[var(--color-neon-pink)] p-4 backdrop-blur-md w-full">
          <div className="text-2xl font-black italic mb-2 uppercase text-white">SCORE {score}</div>
          <div className="h-2 w-full bg-white/10 overflow-hidden rounded-full">
            <motion.div 
              className={`h-full ${isViralMode ? 'bg-[var(--color-neon-pink)] animate-pulse' : 'bg-[var(--color-neon-green)]'}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, hypeMeter))}%` }}
              transition={{ type: 'spring', bounce: 0 }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
             <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Hype Meter</span>
             <span className="text-[12px] text-[var(--color-neon-green)] uppercase font-black">{coins} $COIN</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isViralMode && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0, y: -50 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-7xl impact-text text-transparent bg-clip-text hype-gradient filter drop-shadow-[0_0_30px_rgba(255,20,147,0.8)] text-center leading-[0.9]"
          >
            VIRAL<br/>MODE!!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
