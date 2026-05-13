'use client';

import React, { useState } from 'react';
import { GameCanvas } from '@/src/game/GameCanvas';
import { useGameStore } from '@/src/store/gameStore';
import { TitleScreen } from '@/src/screens/TitleScreen';
import { GameOverScreen } from '@/src/screens/GameOverScreen';
import { GarageScreen } from '@/src/screens/GarageScreen';
import { LeaderboardScreen } from '@/src/screens/LeaderboardScreen';
import { HUD } from '@/src/components/HUD';
import { AnimatePresence } from 'framer-motion';
import { useConnect, useAccount, useDisconnect } from 'wagmi';

function ConnectButton() {
  const { connect, connectors, isPending } = useConnect();
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);

  if (isReconnecting) {
    return (
      <button 
        disabled
        className="absolute top-6 right-6 z-50 bg-gray-500 text-white px-6 py-2 rounded-2xl flex flex-col items-center shadow-[0_0_20px_rgba(100,100,100,0.4)] text-[10px] font-black uppercase tracking-tight"
      >
        <span className="text-[8px] font-black uppercase">Wallet</span>
        RECONNECTING...
      </button>
    );
  }

  if (isConnected) {
    return (
      <button 
        onClick={() => disconnect()}
        className="absolute top-6 right-6 z-50 bg-[var(--color-neon-pink)] text-white px-6 py-2 rounded-2xl flex flex-col items-center shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:scale-105 active:scale-95 transition-all text-[10px] font-black uppercase tracking-tight"
      >
        <span className="text-[8px] font-black uppercase">Wallet</span>
        {address?.slice(0,6)}...{address?.slice(-4)}
      </button>
    );
  }

  return (
    <div className="absolute top-6 right-6 z-50 flex flex-col items-end">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isConnecting || isPending}
        className="bg-[var(--color-neon-green)] text-black px-6 py-2 rounded-2xl flex flex-col items-center shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:scale-105 active:scale-95 transition-all text-[10px] font-black uppercase tracking-tight"
      >
        <span className="text-[8px] font-black uppercase">Wallet</span>
        {isConnecting || isPending ? 'CONNECTING...' : 'CONNECT'}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <div className="mt-2 flex flex-col gap-2 w-48 bg-black/90 border border-[var(--color-neon-green)]/30 rounded-2xl p-2 backdrop-blur-md">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setIsOpen(false);
                }}
                disabled={isPending || isConnecting}
                className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-xl text-xs font-bold uppercase transition-colors text-[var(--color-neon-green)]"
              >
                {connector.name}
              </button>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const gameState = useGameStore(s => s.gameState);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[var(--color-bg-dark)] text-white font-sans selection:bg-[var(--color-neon-pink)] selection:text-white">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none z-0"></div>
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-[#39FF14]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-[#FF1493]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Global Connect Button */}
      <ConnectButton />
      
      {/* Background Game Canvas */}
      <GameCanvas />

      {/* UI Overlays */}
      <AnimatePresence mode="wait">
        {gameState === 'MENU' && <TitleScreen key="menu" />}
        {gameState === 'PLAYING' && <HUD key="hud" />}
        {gameState === 'REKT' && <GameOverScreen key="rekt" />}
        {gameState === 'GARAGE' && <GarageScreen key="garage" />}
        {gameState === 'LEADERBOARD' && <LeaderboardScreen key="leaderboard" />}
      </AnimatePresence>
    </div>
  );
}
