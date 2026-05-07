import { create } from 'zustand';

type GameState = 'MENU' | 'PLAYING' | 'REKT' | 'GARAGE' | 'LEADERBOARD';

interface GameStore {
  gameState: GameState;
  score: number;
  highScore: number;
  distance: number;
  bestDistance: number;
  coins: number;
  hypeMeter: number; // 0 to 100
  combo: number;
  isViralMode: boolean;
  selectedSkin: string;
  setGameState: (state: GameState) => void;
  addScore: (amount: number) => void;
  updateDistance: (dist: number) => void;
  addCoins: (amount: number) => void;
  addHype: (amount: number) => void;
  resetGame: () => void;
  setGameOver: () => void;
  setSkin: (skin: string) => void;
  triggerViralMode: () => void;
  endViralMode: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'MENU',
  score: 0,
  highScore: parseInt(localStorage.getItem('meme_dash_highscore') || '0'),
  distance: 0,
  bestDistance: parseInt(localStorage.getItem('meme_dash_best_distance') || '0'),
  coins: parseInt(localStorage.getItem('meme_dash_coins') || '0'),
  hypeMeter: 0,
  combo: 1,
  isViralMode: false,
  selectedSkin: '😎',

  setGameState: (state) => set({ gameState: state }),
  
  addScore: (amount) => {
    const { isViralMode, combo } = get();
    const multiplier = isViralMode ? 2 : 1;
    set((state) => ({ score: state.score + (amount * multiplier * combo) }));
  },
  
  updateDistance: (dist) => set({ distance: dist }),
  
  addCoins: (amount) => set((state) => {
    const newCoins = state.coins + amount;
    localStorage.setItem('meme_dash_coins', newCoins.toString());
    return { coins: newCoins };
  }),
  
  addHype: (amount) => set((state) => {
    if (state.isViralMode) return state;
    const newHype = Math.min(100, state.hypeMeter + amount);
    if (newHype >= 100) {
      setTimeout(() => get().triggerViralMode(), 0);
    }
    return { hypeMeter: newHype };
  }),
  
  triggerViralMode: () => {
    set({ isViralMode: true, hypeMeter: 100 });
    // Ends after 8 seconds
    setTimeout(() => {
      get().endViralMode();
    }, 8000);
  },

  endViralMode: () => set({ isViralMode: false, hypeMeter: 0 }),
  
  resetGame: () => set({
    score: 0,
    distance: 0,
    hypeMeter: 0,
    combo: 1,
    isViralMode: false,
    gameState: 'PLAYING'
  }),
  
  setGameOver: () => set((state) => {
    const newHighScore = Math.max(state.score, state.highScore);
    const newBestDist = Math.max(state.distance, state.bestDistance);
    
    if (newHighScore > state.highScore) localStorage.setItem('meme_dash_highscore', newHighScore.toString());
    if (newBestDist > state.bestDistance) localStorage.setItem('meme_dash_best_distance', newBestDist.toString());
    
    return {
      gameState: 'REKT',
      highScore: newHighScore,
      bestDistance: newBestDist,
      isViralMode: false
    };
  }),

  setSkin: (skin) => set({ selectedSkin: skin })
}));
