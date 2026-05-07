import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

const SKINS = [
  { id: '😎', name: 'Chad', cost: 0 },
  { id: '🐕', name: 'Doge', cost: 100 },
  { id: '🐸', name: 'Pepe', cost: 250 },
  { id: '🐱', name: 'Pop Cat', cost: 500 },
  { id: '🚀', name: 'Moon Boy', cost: 1000 },
];

export function GarageScreen() {
  const { setGameState, selectedSkin, setSkin, coins, addCoins } = useGameStore();

  const handleSelect = (skin: any) => {
    // Basic unlock logic mock for UI
    if (skin.cost <= coins || skin.cost === 0) {
        setSkin(skin.id);
    } else {
        alert("Not enough Meme Coins!");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="absolute inset-0 flex flex-col p-6 z-20 bg-[var(--color-bg-dark)]/90 backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <button 
          onClick={() => setGameState('MENU')}
          className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-4xl font-black impact-text text-white tracking-widest">VAULT</h1>
        <div className="font-bold text-[var(--color-neon-pink)] bg-white/5 border border-[var(--color-neon-pink)]/50 px-4 py-2 rounded-xl">
           {coins} $COIN
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20">
        <div className="grid grid-cols-2 gap-4">
          {SKINS.map((skin) => (
            <button
              key={skin.id}
              onClick={() => handleSelect(skin)}
              className={`p-6 rounded-3xl border-4 flex flex-col items-center gap-4 transition-all ${
                selectedSkin === skin.id 
                  ? 'bg-[var(--color-neon-green)]/10 border-[var(--color-neon-green)] shadow-[0_0_20px_rgba(57,255,20,0.2)]' 
                  : 'bg-white/5 border-transparent hover:border-white/20'
              }`}
            >
              <div className="text-6xl filter drop-shadow-lg">{skin.id}</div>
              <div className="font-black uppercase tracking-widest">{skin.name}</div>
              
              {selectedSkin === skin.id ? (
                <div className="text-[var(--color-neon-green)] font-black text-xs flex items-center gap-1 uppercase tracking-widest"><Check size={14}/> EQUIPPED</div>
              ) : (
                <div className={`font-black text-xs tracking-widest uppercase ${coins >= skin.cost ? 'text-[var(--color-neon-pink)]' : 'text-gray-500'}`}>
                  {skin.cost === 0 ? 'FREE' : `${skin.cost} $COIN`}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
