import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ShoppingCart, Play, Settings, MessageCircle } from 'lucide-react';
import { useAccount, useSignMessage } from 'wagmi';
import { prepareAttributedTransaction } from '../lib/erc8021/attribution';

export function TitleScreen() {
  const setGameState = useGameStore(s => s.setGameState);
  const { highScore, bestDistance, coins } = useGameStore();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isGm, setIsGm] = useState(false);

  const handleSayGM = async () => {
    if (!isConnected) {
      alert("Connect your wallet on BASE first to say GM on-chain!");
      return;
    }
    
    try {
      const payload = prepareAttributedTransaction("SAY_GM");
      const message = `GM from Memelord!\nWitness my presence on Base network.\n\nPayload: ${payload}`;
      await signMessageAsync({ message } as any);
      setIsGm(true);
      setTimeout(() => setIsGm(false), 3000);
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-20"
    >
      <div className="text-center mb-10">
        <motion.h1 
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-6xl md:text-8xl impact-text leading-[0.8] tracking-tighter meme-glow"
        >
          MEME<br/>DASH
        </motion.h1>
        <p className="text-[#39FF14] font-bold text-sm tracking-[0.2em] mt-4 uppercase">BY MEME LORDS FOR MEME LORDS</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button 
          onClick={() => setGameState('PLAYING')}
          className="w-full px-8 py-5 bg-white text-black font-black text-2xl uppercase rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[8px_8px_0_var(--color-neon-green)] flex items-center justify-center gap-2"
        >
          <Play fill="currentColor" size={28} /> DASH NOW
        </button>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <button 
            onClick={() => setGameState('GARAGE')}
            className="w-full py-4 border-4 border-white text-white font-black text-lg uppercase rounded-2xl hover:bg-white hover:text-black transition-all flex flex-col items-center justify-center gap-1"
          >
            <ShoppingCart size={24} />
            VAULT
          </button>
          
          <button 
            onClick={() => setGameState('LEADERBOARD')}
            className="w-full py-4 border-4 border-white text-white font-black text-lg uppercase rounded-2xl hover:bg-white hover:text-black transition-all flex flex-col items-center justify-center gap-1"
          >
            <Trophy size={24} />
            RANKS
          </button>
        </div>

        <button 
            onClick={handleSayGM}
            className="w-full mt-2 py-4 border-2 border-[var(--color-neon-pink)] text-[var(--color-neon-pink)] font-black text-lg uppercase rounded-2xl hover:bg-[var(--color-neon-pink)] hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle size={24} />
          {isGm ? "GM LEGEND! 🤙" : "SAY GM ON-CHAIN"}
        </button>
      </div>

      <div className="mt-8 text-sm flex flex-col items-center gap-2 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <div className="font-bold flex justify-between w-full gap-8">
          <span className="text-gray-400">HIGH SCORE</span>
          <span className="text-[#39FF14] impact-text tracking-widest">{highScore}</span>
        </div>
        <div className="font-bold flex justify-between w-full gap-8 border-b border-white/5 pb-2">
          <span className="text-gray-400">BEST RUN</span>
          <span className="text-white opacity-80">{Math.floor(bestDistance)}m</span>
        </div>
        <div className="text-[var(--color-neon-pink)] font-black text-xl mt-2 tracking-widest">
          {coins} $COIN
        </div>
      </div>
    </motion.div>
  );
}
