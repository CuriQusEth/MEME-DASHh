import React from 'react';
import { GameCanvas } from './game/GameCanvas';
import { useGameStore } from './store/gameStore';
import { TitleScreen } from './screens/TitleScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { GarageScreen } from './screens/GarageScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { HUD } from './components/HUD';
import { AnimatePresence } from 'framer-motion';
import { useConnect, useAccount, useDisconnect, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Sun } from 'lucide-react';

function ConnectButton() {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { sendTransaction } = useSendTransaction();

  const handleConnect = () => {
    if (!(window as any).ethereum && connectors.length === 0) {
      alert("No crypto wallet detected! If you are on a mobile device or inside the AI Studio preview, please open this app in your normal browser (like Chrome/Safari) or install a wallet extension.");
      return;
    }
    // Safely try the first available connector
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      value: parseEther('0'),
      data: '0x474d' // 'GM' in hex
    });
  };

  if (isConnected) {
    return (
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button 
          onClick={sendGMTransaction}
          className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
        >
          <Sun size={14} /> Say GM
        </button>
        <button 
          onClick={() => disconnect()}
          className="bg-[var(--color-neon-pink)] text-white px-6 py-2 rounded-2xl flex flex-col items-center shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:scale-105 active:scale-95 transition-all text-[10px] font-black uppercase tracking-tight"
        >
          <span className="text-[8px] font-black uppercase">Wallet</span>
          {address?.slice(0,6)}...{address?.slice(-4)}
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleConnect}
      className="absolute top-6 right-6 z-50 bg-[var(--color-neon-green)] text-black px-6 py-2 rounded-2xl flex flex-col items-center shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:scale-105 active:scale-95 transition-all text-[10px] font-black uppercase tracking-tight"
    >
      <span className="text-[8px] font-black uppercase">Wallet</span>
      CONNECT
    </button>
  );
}

export function AppContent() {
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
