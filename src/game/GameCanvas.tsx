import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './GameEngine';
import { useGameStore } from '../store/gameStore';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  
  const gameState = useGameStore(s => s.gameState);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Resize canvas to match window
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    engineRef.current = new GameEngine(canvasRef.current);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (engineRef.current) engineRef.current.stop();
    };
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING' && engineRef.current) {
      engineRef.current.init();
      engineRef.current.start();
    } else if (engineRef.current) {
      engineRef.current.stop();
    }
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING' || !engineRef.current) return;
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        engineRef.current.jump();
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        engineRef.current.dash();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (gameState !== 'PLAYING' || !engineRef.current || e.changedTouches.length === 0) return;
    
    const x = e.changedTouches[0].clientX;
    const y = e.changedTouches[0].clientY;
    
    const dx = x - touchStart.x;
    const dy = y - touchStart.y;
    
    // Simple swipe detection
    if (Math.abs(dx) > Math.abs(dy) && dx > 50) {
      // Swipe Right -> Dash
      engineRef.current.dash();
    } else if (dy < -30) {
      // Swipe Up -> Jump
      engineRef.current.jump();
    } else if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
      // Tap -> Jump
      engineRef.current.jump();
    }
  };

  const handleClick = () => {
    if (gameState === 'PLAYING' && engineRef.current) {
        engineRef.current.jump(); // Tap to jump as fallback on desktop
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full touch-none select-none ${gameState !== 'PLAYING' ? 'opacity-30 blur-sm' : ''}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    />
  );
}
