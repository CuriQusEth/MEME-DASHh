export const GAME_SPEED_START = 400; // pixels per second
export const GRAVITY = 2800; // pixels per second squared
export const JUMP_VELOCITY = -900;
export const DASH_DURATION = 0.4; // seconds
export const VIRAL_SPEED_MULTIPLIER = 1.5;

export const OBSTACLE_TYPES = [
  { emoji: '📉', name: 'Rug Pull', type: 'GROUND', width: 40, height: 40, risk: 'HIGH' },
  { emoji: '🐻', name: 'Bear', type: 'GROUND', width: 50, height: 50, risk: 'HIGH' },
  { emoji: '🧱', name: 'Paywall', type: 'TALL', width: 40, height: 80, risk: 'HIGH' },
  { emoji: '👮', name: 'SEC Agent', type: 'FLYING', width: 40, height: 40, risk: 'MED' },
];

export const ITEM_TYPES = [
  { emoji: '🪙', name: 'Meme Coin', type: 'COIN', score: 10, hype: 1 },
  { emoji: '🐸', name: 'Pepe', type: 'SUPER', score: 50, hype: 5 },
  { emoji: '🐕', name: 'Doge', type: 'SUPER', score: 50, hype: 5 },
  { emoji: '🚀', name: 'Moon Ticket', type: 'POWERUP', score: 100, hype: 20 },
];
