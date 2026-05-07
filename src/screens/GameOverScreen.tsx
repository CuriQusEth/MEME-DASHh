import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { RefreshCcw, Home, Upload } from 'lucide-react';
import { useAccount, useSignMessage } from 'wagmi';
import { prepareAttributedTransaction } from '../lib/erc8021/attribution';

export function GameOverScreen() {
  const { score, distance, setGameState, resetGame } = useGameStore();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRestart = () => {
    resetGame();
  };

  const submitScoreOnChain = async () => {
    if (!isConnected || !address) {
      alert("Please connect wallet first (Top right)");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Simulate attribution and transaction recording for SIWE
      const payload = prepareAttributedTransaction("SCORE_SUBMIT");
      const message = `I am a Meme Lord.\nRecording my legendary dash on Base.\nScore: ${score}\nDistance: ${Math.floor(distance)}m\n\nPayload: ${payload}`;
      
      const sig = await signMessageAsync({ message } as any);
      console.log("SIWE Signature:", sig);
      
      // Simulate network request
      await new Promise(r => setTimeout(r, 1000));
      setSubmitted(true);
    } catch (e: any) {
      console.error(e);
      alert("Failed to submit: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-20 bg-black/80 backdrop-blur-md"
    >
      <div className="text-center mb-8">
        <h1 className="text-6xl md:text-8xl impact-text text-[var(--color-neon-pink)] drop-shadow-[0_0_30px_rgba(255,20,147,0.8)] leading-[0.8] tracking-tighter">REKT.</h1>
        <p className="text-white font-bold text-sm tracking-[0.2em] mt-4 uppercase">You got rug pulled.</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl w-full max-w-sm mb-8 shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
          <span className="text-gray-400 font-bold text-xs tracking-widest uppercase">FINAL SCORE</span>
          <span className="text-[var(--color-neon-green)] impact-text text-3xl">{score}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-bold text-xs tracking-widest uppercase">DISTANCE DASHED</span>
          <span className="text-white font-black text-xl">{Math.floor(distance)}M</span>
        </div>
      </div>

      {submitted ? (
        <div className="bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)] p-4 rounded-xl border border-[var(--color-neon-green)]/50 mb-6 font-bold text-center w-full max-w-sm text-sm uppercase tracking-wider backdrop-blur-md">
          🏆 Legendary Dash Recorded on Base!
        </div>
      ) : (
        <button
          onClick={submitScoreOnChain}
          disabled={isSubmitting}
          className="w-full max-w-sm bg-[var(--color-neon-green)] text-black font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-2 mb-6 transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 uppercase"
        >
          <Upload size={24} />
          {isSubmitting ? "SIGNING..." : "RECORD DISTANCE"}
        </button>
      )}

      <div className="flex gap-4 w-full max-w-sm">
        <button 
          onClick={handleRestart}
          className="flex-1 bg-white text-black font-black py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0_var(--color-neon-pink)] uppercase"
        >
          <RefreshCcw size={20} /> AGAIN
        </button>
        <button 
          onClick={() => setGameState('MENU')}
          className="flex-1 bg-transparent border-4 border-white text-white font-black py-4 rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 uppercase"
        >
          <Home size={20} /> MENU
        </button>
      </div>
    </motion.div>
  );
}
