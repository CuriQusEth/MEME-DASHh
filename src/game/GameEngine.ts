import { GRAVITY, JUMP_VELOCITY, GAME_SPEED_START, DASH_DURATION, VIRAL_SPEED_MULTIPLIER, OBSTACLE_TYPES, ITEM_TYPES } from './constants';
import { useGameStore } from '../store/gameStore';

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  emoji: string;
  type: string;
  vy?: number;
  markedForDeletion?: boolean;
  score?: number;
  hype?: number;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastTime: number = 0;
  private animationFrameId: number = 0;
  
  private player = {
    x: 50,
    y: 0, // Set to ground later
    width: 40,
    height: 40,
    vy: 0,
    isJumping: false,
    isDashing: false,
    dashTimer: 0,
    rotation: 0,
    emoji: '😎'
  };

  private groundY = 0;
  private speedTimer = 0;
  private gameSpeed = GAME_SPEED_START;
  
  private obstacles: Entity[] = [];
  private items: Entity[] = [];
  private particles: any[] = [];
  
  private spawnTimers = {
    obstacle: 0,
    item: 0
  };

  private isGameOver = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.init();
  }

  init() {
    this.groundY = this.canvas.height - 100;
    this.player.y = this.groundY - this.player.height;
    this.player.emoji = useGameStore.getState().selectedSkin || '😎';
    this.gameSpeed = GAME_SPEED_START;
    this.obstacles = [];
    this.items = [];
    this.particles = [];
    this.isGameOver = false;
  }

  start() {
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId);
  }

  jump() {
    if (!this.player.isJumping && !this.isGameOver) {
      this.player.vy = JUMP_VELOCITY;
      this.player.isJumping = true;
      this.spawnParticles(this.player.x, this.player.y + this.player.height, '💨', 3);
    }
  }

  dash() {
    if (!this.player.isDashing && !this.isGameOver) {
      this.player.isDashing = true;
      this.player.dashTimer = DASH_DURATION;
      this.spawnParticles(this.player.x, this.player.y, '⚡', 5);
    }
  }

  private loop(currentTime: number) {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (!this.isGameOver) {
      this.update(deltaTime);
    }
    this.draw();

    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  private update(dt: number) {
    const store = useGameStore.getState();
    const currentSpeed = this.gameSpeed * (store.isViralMode ? VIRAL_SPEED_MULTIPLIER : 1);
    
    // Update player
    if (this.player.isDashing) {
      this.player.dashTimer -= dt;
      if (this.player.dashTimer <= 0) {
        this.player.isDashing = false;
      }
    }

    this.player.vy += GRAVITY * dt;
    this.player.y += this.player.vy * dt;

    if (this.player.y >= this.groundY - this.player.height) {
      this.player.y = this.groundY - this.player.height;
      this.player.vy = 0;
      this.player.isJumping = false;
    }

    if (this.player.isJumping) {
      this.player.rotation += 10 * dt;
    } else {
      this.player.rotation = 0;
    }

    // Distance and game speed scaling
    this.speedTimer += dt * currentSpeed;
    if (this.speedTimer > 100) {
      store.updateDistance(store.distance + 1);
      this.speedTimer = 0;
      this.gameSpeed += 5; // Gets faster over time
    }

    const moveEntities = (entities: Entity[]) => {
      for (let i = entities.length - 1; i >= 0; i--) {
        const ent = entities[i];
        ent.x -= currentSpeed * dt;
        if (ent.x + ent.width < 0) {
          ent.markedForDeletion = true;
        }
      }
    };

    moveEntities(this.obstacles);
    moveEntities(this.items);

    this.obstacles = this.obstacles.filter(e => !e.markedForDeletion);
    this.items = this.items.filter(e => !e.markedForDeletion);

    // Spawning logic
    this.spawnTimers.obstacle -= dt;
    if (this.spawnTimers.obstacle <= 0) {
      this.spawnObstacle();
      this.spawnTimers.obstacle = (Math.random() * 1.5 + 0.8) * (GAME_SPEED_START / currentSpeed);
    }

    this.spawnTimers.item -= dt;
    if (this.spawnTimers.item <= 0) {
      this.spawnItem();
      this.spawnTimers.item = (Math.random() * 2 + 1) * (GAME_SPEED_START / currentSpeed);
    }

    this.updateParticles(dt);
    this.checkCollisions(store);
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const store = useGameStore.getState();

    // Draw background
    if (store.isViralMode) {
      this.ctx.fillStyle = `hsl(${performance.now() / 10 % 360}, 50%, 20%)`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Draw ground
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);

    // Filter effect for speed
    if (this.player.isDashing || store.isViralMode) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.ctx.font = '40px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Draw particles
    for (const p of this.particles) {
      this.ctx.globalAlpha = p.life;
      this.ctx.font = `${p.size}px Arial`;
      this.ctx.fillText(p.emoji, p.x, p.y);
      this.ctx.globalAlpha = 1;
    }
    
    this.ctx.font = '40px Arial';

    // Draw items
    for (const item of this.items) {
      this.ctx.fillText(item.emoji, item.x + item.width/2, item.y + item.height/2);
    }

    // Draw obstacles
    for (const obs of this.obstacles) {
      this.ctx.font = `${Math.max(obs.width, obs.height)}px Arial`;
      this.ctx.fillText(obs.emoji, obs.x + obs.width/2, obs.y + obs.height/2);
    }

    // Draw player
    this.ctx.save();
    this.ctx.translate(this.player.x + this.player.width/2, this.player.y + this.player.height/2);
    if (this.player.rotation) this.ctx.rotate(this.player.rotation);
    if (this.player.isDashing) {
      this.ctx.scale(1.5, 0.8);
      this.ctx.globalAlpha = 0.8;
    }
    this.ctx.font = '45px Arial';
    this.ctx.fillText(this.player.emoji, 0, 0);
    this.ctx.restore();
  }

  private checkCollisions(store: any) {
    const pBox = {
      x: this.player.x + 10,
      y: this.player.y + 10,
      w: this.player.width - 20,
      h: this.player.height - 20
    };

    // Item collisions
    for (const item of this.items) {
      const iBox = { x: item.x, y: item.y, w: item.width, h: item.height };
      if (this.isIntersecting(pBox, iBox)) {
        item.markedForDeletion = true;
        store.addScore(item.score || 0);
        store.addCoins(item.type === 'COIN' ? 1 : 0);
        store.addHype(item.hype || 0);
        this.spawnParticles(item.x, item.y, '✨', 2);
      }
    }

    // Obstacle collisions
    if (!store.isViralMode && !this.player.isDashing) {
      for (const obs of this.obstacles) {
        const oBox = { x: obs.x + 10, y: obs.y + 10, w: obs.width - 20, h: obs.height - 20 };
        if (this.isIntersecting(pBox, oBox)) {
          this.gameOver();
          break;
        }
      }
    } else {
      // Destroy obstacles if dashing or viral
      for (const obs of this.obstacles) {
        const oBox = { x: obs.x, y: obs.y, w: obs.width, h: obs.height };
        if (this.isIntersecting(pBox, oBox)) {
          obs.markedForDeletion = true;
          this.spawnParticles(obs.x, obs.y, '💥', 5);
          store.addScore(100);
        }
      }
    }
  }

  private isIntersecting(a: any, b: any) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
  }

  private spawnObstacle() {
    const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    const y = type.type === 'FLYING' 
        ? this.groundY - 120 - Math.random() * 50 
        : this.groundY - type.height;
        
    this.obstacles.push({
      x: this.canvas.width + 50,
      y,
      width: type.width,
      height: type.height,
      emoji: type.emoji,
      type: type.type
    });
  }

  private spawnItem() {
    const type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
    // Random height for items
    const y = this.groundY - 40 - Math.random() * 150;
    
    // Sometimes spawn a cluster of coins
    if (type.type === 'COIN' && Math.random() > 0.5) {
      for (let i=0; i<3; i++) {
        this.items.push({
          x: this.canvas.width + 50 + (i * 40),
          y,
          width: 30,
          height: 30,
          emoji: type.emoji,
          type: type.type,
          score: type.score,
          hype: type.hype
        });
      }
    } else {
      this.items.push({
        x: this.canvas.width + 50,
        y,
        width: 40,
        height: 40,
        emoji: type.emoji,
        type: type.type,
        score: type.score,
        hype: type.hype
      });
    }
  }

  private spawnParticles(x: number, y: number, emoji: string, count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 400,
        vy: (Math.random() - 0.5) * 400 - 200,
        life: 1,
        emoji,
        size: Math.random() * 20 + 10
      });
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += GRAVITY * 0.5 * dt;
      p.life -= dt * 2;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private gameOver() {
    this.isGameOver = true;
    this.spawnParticles(this.player.x, this.player.y, '💀', 20);
    this.stop();
    setTimeout(() => {
      useGameStore.getState().setGameOver();
    }, 1000);
  }
}
