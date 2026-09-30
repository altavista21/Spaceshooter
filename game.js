// Space Shooter 2D - Complete Game Engine

// -----------------------------------------------------------------------------
// Audio Manager (Web Audio API Synthesizer)
// -----------------------------------------------------------------------------
class AudioManager {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.vibrationEnabled = true;

    this.musicInterval = null;
    this.musicStep = 0;
    this.musicBassNotes = [110, 110, 130, 110, 146.83, 130, 110, 98];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playLaser(type = 'player') {
    if (!this.soundEnabled || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'player') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'plasma') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  }

  playHit() {
    if (!this.soundEnabled || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playExplosion(isLarge = false) {
    if (!this.soundEnabled || !this.ctx) return;
    this.init();

    const duration = isLarge ? 0.6 : 0.25;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isLarge ? 800 : 1200, now);
    filter.frequency.exponentialRampToValueAtTime(30, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isLarge ? 0.35 : 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);

    if (isLarge) {
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(150, now);
      subOsc.frequency.exponentialRampToValueAtTime(20, now + duration);

      subGain.gain.setValueAtTime(0.3, now);
      subGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + duration);
    }
  }

  playPowerUp() {
    if (!this.soundEnabled || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  playBomb() {
    if (!this.soundEnabled || !this.ctx) return;
    this.init();

    this.playExplosion(true);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.7);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  playWarning() {
    if (!this.soundEnabled || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const startTime = now + i * 0.25;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, startTime);
      osc.frequency.setValueAtTime(110, startTime + 0.12);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    }
  }

  startMusic() {
    if (!this.musicEnabled) return;
    if (this.musicInterval) return;

    this.init();
    this.musicStep = 0;

    this.musicInterval = setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const note = this.musicBassNotes[this.musicStep % this.musicBassNotes.length];
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);

      this.musicStep++;
    }, 180);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  vibrate(pattern) {
    if (this.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }
}

const audioManager = new AudioManager();

// -----------------------------------------------------------------------------
// Input Manager (Touch Controls & Pointer Events)
// -----------------------------------------------------------------------------
class InputManager {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.isTouching = false;
    this.touchX = 0;
    this.touchY = 0;
    this.activePointerId = null;
    this.autoFire = true;
    this.isManualFiring = false;
    this.enabled = true;

    this.setupListeners();
  }

  setupListeners() {
    const getCanvasCoords = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const targetW = (this.game && this.game.width) ? this.game.width : rect.width;
      const targetH = (this.game && this.game.height) ? this.game.height : rect.height;
      return {
        x: (e.clientX - rect.left) * (targetW / (rect.width || 1)),
        y: (e.clientY - rect.top) * (targetH / (rect.height || 1))
      };
    };

    const handlePointerDown = (e) => {
      if (!this.enabled) return;
      if (e.target !== this.canvas && e.target.id !== 'game-container') return;

      this.isTouching = true;
      this.activePointerId = e.pointerId;

      try {
        if (this.canvas.setPointerCapture) {
          this.canvas.setPointerCapture(e.pointerId);
        }
      } catch (err) {}

      const coords = getCanvasCoords(e);
      this.touchX = coords.x;
      this.touchY = coords.y;

      audioManager.init();
    };

    const handlePointerMove = (e) => {
      if (!this.enabled || !this.isTouching) return;
      if (this.activePointerId !== null && e.pointerId !== this.activePointerId) return;

      const coords = getCanvasCoords(e);
      this.touchX = coords.x;
      this.touchY = coords.y;
    };

    const handlePointerUp = (e) => {
      if (this.activePointerId !== null && e.pointerId === this.activePointerId) {
        this.isTouching = false;
        this.activePointerId = null;
        try {
          if (this.canvas.releasePointerCapture) {
            this.canvas.releasePointerCapture(e.pointerId);
          }
        } catch (err) {}
      }
    };

    this.canvas.addEventListener('pointerdown', handlePointerDown);
    this.canvas.addEventListener('pointermove', handlePointerMove);
    this.canvas.addEventListener('pointerup', handlePointerUp);
    this.canvas.addEventListener('pointercancel', handlePointerUp);

    const container = document.getElementById('game-container');
    container.addEventListener('contextmenu', (e) => e.preventDefault());
    container.addEventListener('touchstart', (e) => {
      if (e.target === this.canvas) e.preventDefault();
    }, { passive: false });
    container.addEventListener('touchmove', (e) => {
      if (e.target === this.canvas) e.preventDefault();
    }, { passive: false });

    const fireBtn = document.getElementById('btn-manual-fire');
    if (fireBtn) {
      const startFire = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.isManualFiring = true;
      };
      const stopFire = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.isManualFiring = false;
      };

      fireBtn.addEventListener('pointerdown', startFire);
      fireBtn.addEventListener('pointerup', stopFire);
      fireBtn.addEventListener('pointercancel', stopFire);
      fireBtn.addEventListener('mouseleave', stopFire);
    }
  }

  isFiring() {
    if (!this.enabled) return false;
    if (this.autoFire) {
      return this.isTouching;
    } else {
      return this.isManualFiring;
    }
  }

  reset() {
    this.isTouching = false;
    this.activePointerId = null;
    this.isManualFiring = false;
  }
}

// -----------------------------------------------------------------------------
// Parallax Background Engine
// -----------------------------------------------------------------------------
class Starfield {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.stars = [];
    this.nebulas = [];
    this.init();
  }

  init() {
    this.stars = [];
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.2 + 0.5,
        speed: Math.random() * 0.4 + 0.2,
        color: '#7090ff',
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    for (let i = 0; i < 40; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 1.0 + 0.6,
        color: '#00eeff',
        alpha: Math.random() * 0.8 + 0.2
      });
    }

    for (let i = 0; i < 20; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 3 + 2,
        speed: Math.random() * 2.2 + 1.4,
        color: '#ffffff',
        alpha: Math.random() * 0.9 + 0.3
      });
    }

    this.nebulas = [
      { x: this.width * 0.2, y: this.height * 0.2, radius: 140, color: 'rgba(120, 0, 255, 0.08)', speed: 0.2 },
      { x: this.width * 0.8, y: this.height * 0.6, radius: 180, color: 'rgba(0, 180, 255, 0.06)', speed: 0.15 },
      { x: this.width * 0.4, y: this.height * 0.9, radius: 160, color: 'rgba(255, 0, 128, 0.06)', speed: 0.25 }
    ];
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.init();
  }

  update(dt) {
    const speedMult = dt * 60;
    for (let star of this.stars) {
      star.y += star.speed * speedMult;
      if (star.y > this.height) {
        star.y = 0;
        star.x = Math.random() * this.width;
      }
    }

    for (let neb of this.nebulas) {
      neb.y += neb.speed * speedMult;
      if (neb.y - neb.radius > this.height) {
        neb.y = -neb.radius;
        neb.x = Math.random() * this.width;
      }
    }
  }

  draw(ctx) {
    for (let neb of this.nebulas) {
      const grad = ctx.createRadialGradient(neb.x, neb.y, 10, neb.x, neb.y, neb.radius);
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(neb.x, neb.y, neb.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let star of this.stars) {
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.alpha;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1.0;
  }
}

// -----------------------------------------------------------------------------
// Particle Engine & Pools
// -----------------------------------------------------------------------------
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.size = 2;
    this.color = '#ffffff';
    this.alpha = 1;
    this.life = 1;
    this.decay = 0.02;
    this.shape = 'circle';
  }

  spawn(x, y, vx, vy, size, color, life, shape = 'circle') {
    this.active = true;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
    this.life = 1;
    this.decay = 1 / life;
    this.alpha = 1;
    this.shape = shape;
  }

  update(dt) {
    if (!this.active) return;
    this.x += this.vx * dt * 60;
    this.y += this.vy * dt * 60;
    this.life -= this.decay * dt * 60;
    this.alpha = Math.max(0, this.life);
    if (this.life <= 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
    ctx.restore();
  }
}

class ParticleEngine {
  constructor(maxParticles = 300) {
    this.particles = [];
    for (let i = 0; i < maxParticles; i++) {
      this.particles.push(new Particle());
    }
    this.shakeTime = 0;
    this.shakeIntensity = 0;
  }

  getFreeParticle() {
    for (let p of this.particles) {
      if (!p.active) return p;
    }
    return null;
  }

  emitExplosion(x, y, color = '#ff5500', count = 20, speed = 4) {
    for (let i = 0; i < count; i++) {
      const p = this.getFreeParticle();
      if (!p) break;
      const angle = Math.random() * Math.PI * 2;
      const spd = (Math.random() * 0.8 + 0.2) * speed;
      const vx = Math.cos(angle) * spd;
      const vy = Math.sin(angle) * spd;
      const size = Math.random() * 4 + 2;
      const life = Math.random() * 20 + 15;
      p.spawn(x, y, vx, vy, size, color, life);
    }
  }

  emitEngineFlame(x, y, color = '#00eeff', vxSpread = 0.8) {
    const p = this.getFreeParticle();
    if (p) {
      const vx = (Math.random() - 0.5) * vxSpread;
      const vy = Math.random() * 2 + 3;
      const size = Math.random() * 3 + 2;
      p.spawn(x, y, vx, vy, size, color, 12, 'square');
    }
  }

  emitHitSparks(x, y, color = '#ffff00', count = 6) {
    for (let i = 0; i < count; i++) {
      const p = this.getFreeParticle();
      if (!p) break;
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 3 + 1;
      p.spawn(x, y, Math.cos(angle) * spd, Math.sin(angle) * spd, 2, color, 10);
    }
  }

  triggerScreenShake(duration = 0.3, intensity = 8) {
    this.shakeTime = duration;
    this.shakeIntensity = intensity;
  }

  update(dt) {
    for (let p of this.particles) {
      p.update(dt);
    }
    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
    }
  }

  draw(ctx) {
    for (let p of this.particles) {
      p.draw(ctx);
    }
  }

  getShakeOffset() {
    if (this.shakeTime > 0) {
      return {
        x: (Math.random() - 0.5) * this.shakeIntensity,
        y: (Math.random() - 0.5) * this.shakeIntensity
      };
    }
    return { x: 0, y: 0 };
  }

  clear() {
    for (let p of this.particles) {
      p.reset();
    }
    this.shakeTime = 0;
  }
}

// -----------------------------------------------------------------------------
// Bullet Entity & Pool
// -----------------------------------------------------------------------------
class Bullet {
  constructor() {
    this.reset();
  }

  reset() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = -12;
    this.radius = 4;
    this.damage = 10;
    this.isEnemy = false;
    this.color = '#00eeff';
    this.type = 'normal';
  }

  spawn(x, y, vx, vy, damage, isEnemy = false, color = '#00eeff', radius = 4, type = 'normal') {
    this.active = true;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.isEnemy = isEnemy;
    this.color = color;
    this.radius = radius;
    this.type = type;
  }

  update(dt, width, height) {
    if (!this.active) return;
    const speedMult = dt * 60;
    this.x += this.vx * speedMult;
    this.y += this.vy * speedMult;

    if (this.x < -20 || this.x > width + 20 || this.y < -30 || this.y > height + 30) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;

    if (this.type === 'plasma') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y - this.radius, this.radius, Math.PI, 0);
      ctx.lineTo(this.x + this.radius, this.y + this.radius);
      ctx.arc(this.x, this.y + this.radius, this.radius, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}

// -----------------------------------------------------------------------------
// Power-Up Entity & Pool
// -----------------------------------------------------------------------------
class PowerUp {
  constructor() {
    this.reset();
  }

  reset() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.type = 'POWER';
    this.radius = 16;
    this.vy = 1.5;
    this.angle = 0;
  }

  spawn(x, y, type) {
    this.active = true;
    this.x = x;
    this.y = y;
    this.type = type;
    this.vy = 1.5;
    this.angle = 0;
  }

  update(dt, height) {
    if (!this.active) return;
    const speedMult = dt * 60;
    this.y += this.vy * speedMult;
    this.angle += 0.05 * speedMult;

    if (this.y - this.radius > height) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.translate(this.x, this.y);

    let color = '#00eeff';
    let label = 'P';
    if (this.type === 'POWER') { color = '#ffaa00'; label = 'P'; }
    else if (this.type === 'SHIELD') { color = '#00aaff'; label = 'S'; }
    else if (this.type === 'HEALTH') { color = '#00ff66'; label = 'H'; }
    else if (this.type === 'RAPID FIRE') { color = '#ff00ee'; label = 'R'; }
    else if (this.type === 'BOMB') { color = '#ff3300'; label = 'B'; }

    ctx.shadowColor = color;
    ctx.shadowBlur = 12;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + Math.sin(this.angle) * 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(10, 15, 30, 0.8)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 1);

    ctx.restore();
  }
}

// -----------------------------------------------------------------------------
// Player Ship
// -----------------------------------------------------------------------------
class Player {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.radius = 20;

    this.x = width / 2;
    this.y = height * 0.8;
    this.targetX = this.x;
    this.targetY = this.y;

    this.maxHp = 100;
    this.hp = 100;
    this.maxShield = 100;
    this.shield = 50;

    this.weaponLevel = 1;
    this.fireTimer = 0;
    this.baseFireInterval = 0.16;
    this.rapidFireTimer = 0;

    this.hitFlashTimer = 0;
    this.invulnerableTimer = 0;
  }

  reset(width, height) {
    this.width = width;
    this.height = height;
    this.x = width / 2;
    this.y = height * 0.8;
    this.targetX = this.x;
    this.targetY = this.y;
    this.hp = this.maxHp;
    this.shield = 50;
    this.weaponLevel = 1;
    this.fireTimer = 0;
    this.rapidFireTimer = 0;
    this.hitFlashTimer = 0;
    this.invulnerableTimer = 0;
  }

  update(dt, inputManager, particleEngine, bulletPool) {
    if (inputManager.isTouching) {
      this.targetX = inputManager.touchX;
      this.targetY = inputManager.touchY - 25;
    }

    const lerpSpeed = 15;
    this.x += (this.targetX - this.x) * Math.min(1, lerpSpeed * dt);
    this.y += (this.targetY - this.y) * Math.min(1, lerpSpeed * dt);

    const margin = this.radius;
    this.x = Math.max(margin, Math.min(this.width - margin, this.x));
    this.y = Math.max(margin + 40, Math.min(this.height - margin - 20, this.y));

    particleEngine.emitEngineFlame(this.x - 6, this.y + 18, '#00eeff');
    particleEngine.emitEngineFlame(this.x + 6, this.y + 18, '#00eeff');

    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
    if (this.rapidFireTimer > 0) this.rapidFireTimer -= dt;

    const currentInterval = this.rapidFireTimer > 0 ? this.baseFireInterval * 0.5 : this.baseFireInterval;
    this.fireTimer += dt;

    if (inputManager.isFiring() && this.fireTimer >= currentInterval) {
      this.fireTimer = 0;
      this.shoot(bulletPool);
    }
  }

  shoot(bulletPool) {
    const level = this.weaponLevel;
    const bulletSpeed = -14;

    if (level === 1) {
      this.spawnBullet(bulletPool, this.x, this.y - 20, 0, bulletSpeed, 15, '#00eeff', 4, 'normal');
      audioManager.playLaser('player');
    } else if (level === 2) {
      this.spawnBullet(bulletPool, this.x - 10, this.y - 15, 0, bulletSpeed, 14, '#00eeff', 4, 'normal');
      this.spawnBullet(bulletPool, this.x + 10, this.y - 15, 0, bulletSpeed, 14, '#00eeff', 4, 'normal');
      audioManager.playLaser('player');
    } else if (level === 3) {
      this.spawnBullet(bulletPool, this.x, this.y - 20, 0, bulletSpeed, 15, '#00eeff', 4, 'normal');
      this.spawnBullet(bulletPool, this.x - 12, this.y - 10, -2, bulletSpeed, 12, '#00eeff', 4, 'normal');
      this.spawnBullet(bulletPool, this.x + 12, this.y - 10, 2, bulletSpeed, 12, '#00eeff', 4, 'normal');
      audioManager.playLaser('player');
    } else if (level === 4) {
      for (let i = -2; i <= 2; i++) {
        const angle = i * 0.18;
        const vx = Math.sin(angle) * 14;
        const vy = -Math.cos(angle) * 14;
        this.spawnBullet(bulletPool, this.x + i * 4, this.y - 15, vx, vy, 12, '#ffaa00', 4, 'normal');
      }
      audioManager.playLaser('player');
    } else if (level >= 5) {
      this.spawnBullet(bulletPool, this.x, this.y - 22, 0, bulletSpeed, 35, '#a000ff', 8, 'plasma');
      this.spawnBullet(bulletPool, this.x - 16, this.y - 10, -1.5, bulletSpeed, 15, '#00eeff', 4, 'normal');
      this.spawnBullet(bulletPool, this.x + 16, this.y - 10, 1.5, bulletSpeed, 15, '#00eeff', 4, 'normal');
      audioManager.playLaser('plasma');
    }
  }

  spawnBullet(bulletPool, x, y, vx, vy, damage, color, radius, type) {
    for (let b of bulletPool) {
      if (!b.active) {
        b.spawn(x, y, vx, vy, damage, false, color, radius, type);
        break;
      }
    }
  }

  takeDamage(amount, particleEngine) {
    if (this.invulnerableTimer > 0) return false;

    this.hitFlashTimer = 0.15;
    this.invulnerableTimer = 0.3;

    if (this.shield > 0) {
      this.shield -= amount;
      if (this.shield < 0) {
        this.hp += this.shield;
        this.shield = 0;
      }
    } else {
      this.hp -= amount;
    }

    if (this.hp < 0) this.hp = 0;

    particleEngine.emitHitSparks(this.x, this.y, '#ff3300', 10);
    audioManager.playHit();
    audioManager.vibrate(80);

    return this.hp <= 0;
  }

  draw(ctx, inputManager) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (inputManager.isTouching) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 238, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 25, 24, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(0, 238, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(0, 25, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (this.shield > 0) {
      ctx.save();
      ctx.strokeStyle = `rgba(0, 238, 255, ${0.4 + (this.shield / this.maxShield) * 0.4})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00eeff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (this.hitFlashTimer > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 15;
    } else {
      ctx.fillStyle = '#00eeff';
      ctx.shadowColor = '#00eeff';
      ctx.shadowBlur = 8;
    }

    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(20, 12);
    ctx.lineTo(10, 14);
    ctx.lineTo(0, 18);
    ctx.lineTo(-10, 14);
    ctx.lineTo(-20, 12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -5, 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff3366';
    ctx.fillRect(-16, 2, 3, 10);
    ctx.fillRect(13, 2, 3, 10);

    ctx.restore();
  }
}

// -----------------------------------------------------------------------------
// Enemy AI Entity
// -----------------------------------------------------------------------------
class Enemy {
  constructor() {
    this.reset();
  }

  reset() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.type = 'BASIC';
    this.radius = 16;
    this.hp = 20;
    this.maxHp = 20;
    this.speed = 2;
    this.scoreValue = 100;
    this.fireTimer = 0;
    this.fireInterval = 2;
    this.time = 0;
    this.startX = 0;
    this.color = '#ff3366';
    this.hitFlashTimer = 0;
  }

  spawn(x, y, type, waveMultiplier = 1) {
    this.active = true;
    this.x = x;
    this.y = y;
    this.startX = x;
    this.type = type;
    this.time = Math.random() * Math.PI * 2;
    this.fireTimer = Math.random() * 1.5;
    this.hitFlashTimer = 0;

    if (type === 'BASIC') {
      this.radius = 16;
      this.maxHp = Math.round(20 * waveMultiplier);
      this.speed = 2.2 * Math.min(1.8, waveMultiplier);
      this.scoreValue = 100;
      this.fireInterval = 2.2;
      this.color = '#ff3366';
    } else if (type === 'ZIGZAG') {
      this.radius = 14;
      this.maxHp = Math.round(15 * waveMultiplier);
      this.speed = 3.0 * Math.min(1.8, waveMultiplier);
      this.scoreValue = 150;
      this.fireInterval = 1.8;
      this.color = '#ffaa00';
    } else if (type === 'TANK') {
      this.radius = 26;
      this.maxHp = Math.round(80 * waveMultiplier);
      this.speed = 1.2;
      this.scoreValue = 350;
      this.fireInterval = 1.5;
      this.color = '#ff00ee';
    } else if (type === 'KAMIKAZE') {
      this.radius = 12;
      this.maxHp = Math.round(12 * waveMultiplier);
      this.speed = 4.2 * Math.min(1.8, waveMultiplier);
      this.scoreValue = 200;
      this.fireInterval = 999;
      this.color = '#ff3300';
    } else if (type === 'ELITE') {
      this.radius = 22;
      this.maxHp = Math.round(120 * waveMultiplier);
      this.speed = 1.6;
      this.scoreValue = 500;
      this.fireInterval = 1.2;
      this.color = '#00ff88';
    }

    this.hp = this.maxHp;
  }

  update(dt, player, bulletPool, width, height) {
    if (!this.active) return;

    const speedMult = dt * 60;
    this.time += dt * 3;
    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;

    if (this.type === 'BASIC') {
      this.y += this.speed * speedMult;
    } else if (this.type === 'ZIGZAG') {
      this.y += this.speed * speedMult;
      this.x = this.startX + Math.sin(this.time) * 60;
    } else if (this.type === 'TANK') {
      this.y += this.speed * speedMult;
    } else if (this.type === 'KAMIKAZE') {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      this.x += (dx / dist) * this.speed * speedMult;
      this.y += (dy / dist) * this.speed * speedMult;
    } else if (this.type === 'ELITE') {
      this.y += this.speed * 0.7 * speedMult;
      this.x = this.startX + Math.sin(this.time * 0.5) * 80;
    }

    this.fireTimer += dt;
    if (this.fireTimer >= this.fireInterval && this.y > 0 && this.y < height * 0.8) {
      this.fireTimer = 0;
      this.shoot(bulletPool, player);
    }

    if (this.y - this.radius > height + 20) {
      this.active = false;
    }
  }

  shoot(bulletPool, player) {
    const bulletSpeed = 5;

    if (this.type === 'BASIC') {
      this.spawnBullet(bulletPool, this.x, this.y + 15, 0, bulletSpeed, 10, '#ff3366');
      audioManager.playLaser('enemy');
    } else if (this.type === 'ZIGZAG') {
      this.spawnBullet(bulletPool, this.x, this.y + 15, 0, bulletSpeed + 1, 10, '#ffaa00');
      audioManager.playLaser('enemy');
    } else if (this.type === 'TANK') {
      this.spawnBullet(bulletPool, this.x - 12, this.y + 20, 0, bulletSpeed, 12, '#ff00ee');
      this.spawnBullet(bulletPool, this.x + 12, this.y + 20, 0, bulletSpeed, 12, '#ff00ee');
      audioManager.playLaser('enemy');
    } else if (this.type === 'ELITE') {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const angle = Math.atan2(dy, dx);

      for (let offset of [-0.2, 0, 0.2]) {
        const vx = Math.cos(angle + offset) * bulletSpeed;
        const vy = Math.sin(angle + offset) * bulletSpeed;
        this.spawnBullet(bulletPool, this.x, this.y + 20, vx, vy, 12, '#00ff88');
      }
      audioManager.playLaser('enemy');
    }
  }

  spawnBullet(bulletPool, x, y, vx, vy, damage, color) {
    for (let b of bulletPool) {
      if (!b.active) {
        b.spawn(x, y, vx, vy, damage, true, color, 4, 'normal');
        break;
      }
    }
  }

  takeDamage(amount, particleEngine) {
    this.hp -= amount;
    this.hitFlashTimer = 0.1;
    particleEngine.emitHitSparks(this.x, this.y, this.color, 4);

    return this.hp <= 0;
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.hitFlashTimer > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
    } else {
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
    }

    if (this.type === 'BASIC') {
      ctx.beginPath();
      ctx.moveTo(0, 16);
      ctx.lineTo(14, -12);
      ctx.lineTo(-14, -12);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'ZIGZAG') {
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.lineTo(12, 0);
      ctx.lineTo(0, -15);
      ctx.lineTo(-12, 0);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'TANK') {
      ctx.beginPath();
      ctx.moveTo(0, 22);
      ctx.lineTo(20, 8);
      ctx.lineTo(18, -18);
      ctx.lineTo(-18, -18);
      ctx.lineTo(-20, 8);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'KAMIKAZE') {
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(10, -10);
      ctx.lineTo(0, -6);
      ctx.lineTo(-10, -10);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'ELITE') {
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(18, 10);
      ctx.lineTo(22, -14);
      ctx.lineTo(8, -8);
      ctx.lineTo(0, -18);
      ctx.lineTo(-8, -8);
      ctx.lineTo(-22, -14);
      ctx.lineTo(-18, 10);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}

// -----------------------------------------------------------------------------
// Boss Entity
// -----------------------------------------------------------------------------
class Boss {
  constructor() {
    this.reset();
  }

  reset() {
    this.active = false;
    this.x = 0;
    this.y = -100;
    this.targetY = 120;
    this.maxHp = 1000;
    this.hp = 1000;
    this.radius = 65;
    this.fireTimer = 0;
    this.phase = 1;
    this.time = 0;
    this.hitFlashTimer = 0;
    this.spiralAngle = 0;
  }

  spawn(width, waveNumber) {
    this.active = true;
    this.x = width / 2;
    this.y = -120;
    this.targetY = 130;
    this.maxHp = 800 + waveNumber * 400;
    this.hp = this.maxHp;
    this.radius = 65;
    this.phase = 1;
    this.fireTimer = 0;
    this.time = 0;
    this.spiralAngle = 0;
    this.hitFlashTimer = 0;
  }

  update(dt, player, bulletPool, particleEngine, width) {
    if (!this.active) return;

    const speedMult = dt * 60;
    this.time += dt;
    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;

    if (this.y < this.targetY) {
      this.y += 1.5 * speedMult;
      return;
    }

    this.x = width / 2 + Math.sin(this.time * 0.8) * (width * 0.3);

    const hpRatio = this.hp / this.maxHp;
    if (hpRatio > 0.75) this.phase = 1;
    else if (hpRatio > 0.50) this.phase = 2;
    else if (hpRatio > 0.25) this.phase = 3;
    else this.phase = 4;

    this.fireTimer += dt;
    const fireInterval = this.phase === 4 ? 0.12 : (0.25 - this.phase * 0.03);

    if (this.fireTimer >= fireInterval) {
      this.fireTimer = 0;
      this.shootPhase(bulletPool, player);
    }
  }

  shootPhase(bulletPool, player) {
    const bulletSpeed = 5;

    if (this.phase === 1) {
      this.spawnBullet(bulletPool, this.x - 40, this.y + 40, 0, bulletSpeed, 12, '#ff3366');
      this.spawnBullet(bulletPool, this.x, this.y + 50, 0, bulletSpeed, 12, '#ff3366');
      this.spawnBullet(bulletPool, this.x + 40, this.y + 40, 0, bulletSpeed, 12, '#ff3366');
      audioManager.playLaser('enemy');
    } else if (this.phase === 2) {
      for (let i = -2; i <= 2; i++) {
        const vx = i * 1.8;
        this.spawnBullet(bulletPool, this.x, this.y + 45, vx, bulletSpeed, 12, '#ffaa00');
      }
      audioManager.playLaser('enemy');
    } else if (this.phase === 3) {
      this.spiralAngle += 0.35;
      const vx = Math.cos(this.spiralAngle) * bulletSpeed;
      const vy = Math.sin(this.spiralAngle) * bulletSpeed + 1;
      this.spawnBullet(bulletPool, this.x, this.y + 40, vx, vy, 14, '#ff00ee');
      this.spawnBullet(bulletPool, this.x, this.y + 40, -vx, -vy + 2, 14, '#ff00ee');
      audioManager.playLaser('enemy');
    } else if (this.phase === 4) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const angle = Math.atan2(dy, dx);
      const vx = Math.cos(angle) * 7;
      const vy = Math.sin(angle) * 7;

      this.spawnBullet(bulletPool, this.x, this.y + 45, vx, vy, 15, '#ff0000', 5);
      this.spawnBullet(bulletPool, this.x - 50, this.y + 30, (Math.random() - 0.5) * 4, bulletSpeed, 10, '#ff3366');
      this.spawnBullet(bulletPool, this.x + 50, this.y + 30, (Math.random() - 0.5) * 4, bulletSpeed, 10, '#ff3366');
      audioManager.playLaser('enemy');
    }
  }

  spawnBullet(bulletPool, x, y, vx, vy, damage, color, radius = 4) {
    for (let b of bulletPool) {
      if (!b.active) {
        b.spawn(x, y, vx, vy, damage, true, color, radius, 'normal');
        break;
      }
    }
  }

  takeDamage(amount, particleEngine) {
    this.hp -= amount;
    this.hitFlashTimer = 0.08;
    particleEngine.emitHitSparks(this.x, this.y, '#ff3366', 6);

    return this.hp <= 0;
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.hitFlashTimer > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 20;
    } else {
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 15;
    }

    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(40, 20);
    ctx.lineTo(65, -10);
    ctx.lineTo(45, -45);
    ctx.lineTo(20, -35);
    ctx.lineTo(0, -50);
    ctx.lineTo(-20, -35);
    ctx.lineTo(-45, -45);
    ctx.lineTo(-65, -10);
    ctx.lineTo(-40, 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = this.phase === 4 ? '#ff0000' : '#00eeff';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, 18 + Math.sin(this.time * 6) * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// -----------------------------------------------------------------------------
// Collision Helper
// -----------------------------------------------------------------------------
function checkCircleCollision(x1, y1, r1, x2, y2, r2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return (dx * dx + dy * dy) <= (r1 + r2) * (r1 + r2);
}

// -----------------------------------------------------------------------------
// Game Class (Main Game Loop & State Machine)
// -----------------------------------------------------------------------------
class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.state = 'MENU'; // MENU, HOW_TO_PLAY, SETTINGS, PLAYING, PAUSED, GAME_OVER

    this.width = 360;
    this.height = 640;

    this.inputManager = new InputManager(this.canvas, this);
    this.starfield = new Starfield(this.width, this.height);
    this.particleEngine = new ParticleEngine(250);

    this.player = new Player(this.width, this.height);
    this.boss = new Boss();

    // Object Pools
    this.bullets = [];
    for (let i = 0; i < 150; i++) this.bullets.push(new Bullet());

    this.enemies = [];
    for (let i = 0; i < 30; i++) this.enemies.push(new Enemy());

    this.powerUps = [];
    for (let i = 0; i < 15; i++) this.powerUps.push(new PowerUp());

    // Game stats
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('space_shooter_high_score') || '0', 10);
    this.wave = 1;
    this.kills = 0;

    this.combo = 1;
    this.comboTimer = 0;

    // Spawning system
    this.waveState = 'WAVE_ACTIVE'; // WAVE_ACTIVE, BOSS_WARNING, BOSS_ACTIVE, WAVE_COMPLETE
    this.enemiesToSpawn = 0;
    this.enemiesSpawned = 0;
    this.spawnTimer = 0;
    this.spawnInterval = 1.2;
    this.waveDelayTimer = 0;

    this.lastTime = performance.now();

    this.initCanvasSize();
    this.bindUIEvents();
    this.updateHighScoreDisplay();

    // Start Animation Frame Loop
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  initCanvasSize() {
    const container = document.getElementById('game-container');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const w = container.clientWidth;
    const h = container.clientHeight;

    this.width = w;
    this.height = h;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;

    this.ctx.scale(dpr, dpr);

    this.starfield.resize(w, h);
    if (this.player) {
      this.player.width = w;
      this.player.height = h;
    }
  }

  bindUIEvents() {
    window.addEventListener('resize', () => this.initCanvasSize());

    // Main Menu Buttons
    document.getElementById('btn-start-game').addEventListener('click', () => {
      this.startGame();
    });

    document.getElementById('btn-how-to-play').addEventListener('click', () => {
      this.showScreen('how-to-play-screen');
    });

    document.getElementById('btn-close-how-to-play').addEventListener('click', () => {
      this.showScreen('menu-screen');
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
      this.showScreen('settings-screen');
    });

    document.getElementById('btn-close-settings').addEventListener('click', () => {
      this.showScreen('menu-screen');
    });

    // Pause Screen Buttons
    document.getElementById('btn-pause').addEventListener('click', (e) => {
      e.stopPropagation();
      this.pauseGame();
    });

    document.getElementById('btn-resume').addEventListener('click', () => {
      this.resumeGame();
    });

    document.getElementById('btn-restart-pause').addEventListener('click', () => {
      this.startGame();
    });

    document.getElementById('btn-main-menu-pause').addEventListener('click', () => {
      this.exitToMenu();
    });

    // Game Over Buttons
    document.getElementById('btn-play-again').addEventListener('click', () => {
      this.startGame();
    });

    document.getElementById('btn-main-menu-go').addEventListener('click', () => {
      this.exitToMenu();
    });

    // Settings Toggle Toggles
    const toggleSound = document.getElementById('btn-toggle-sound');
    toggleSound.addEventListener('click', () => {
      audioManager.soundEnabled = !audioManager.soundEnabled;
      toggleSound.textContent = audioManager.soundEnabled ? 'ON' : 'OFF';
      toggleSound.classList.toggle('active', audioManager.soundEnabled);
    });

    const toggleMusic = document.getElementById('btn-toggle-music');
    toggleMusic.addEventListener('click', () => {
      audioManager.musicEnabled = !audioManager.musicEnabled;
      toggleMusic.textContent = audioManager.musicEnabled ? 'ON' : 'OFF';
      toggleMusic.classList.toggle('active', audioManager.musicEnabled);
      if (audioManager.musicEnabled && this.state === 'PLAYING') {
        audioManager.startMusic();
      } else {
        audioManager.stopMusic();
      }
    });

    const toggleAutoFire = document.getElementById('btn-toggle-autofire');
    toggleAutoFire.addEventListener('click', () => {
      this.inputManager.autoFire = !this.inputManager.autoFire;
      toggleAutoFire.textContent = this.inputManager.autoFire ? 'ON' : 'OFF';
      toggleAutoFire.classList.toggle('active', this.inputManager.autoFire);

      const manualBtn = document.getElementById('btn-manual-fire');
      if (manualBtn) {
        manualBtn.classList.toggle('hidden', this.inputManager.autoFire);
      }
    });

    const toggleVibe = document.getElementById('btn-toggle-vibration');
    toggleVibe.addEventListener('click', () => {
      audioManager.vibrationEnabled = !audioManager.vibrationEnabled;
      toggleVibe.textContent = audioManager.vibrationEnabled ? 'ON' : 'OFF';
      toggleVibe.classList.toggle('active', audioManager.vibrationEnabled);
    });
  }

  showScreen(screenId) {
    const screens = document.querySelectorAll('.ui-screen');
    screens.forEach(s => s.classList.add('hidden'));

    if (screenId) {
      const active = document.getElementById(screenId);
      if (active) active.classList.remove('hidden');
    }
  }

  updateHighScoreDisplay() {
    document.getElementById('menu-high-score-val').textContent = this.highScore.toLocaleString();
  }

  startGame() {
    this.score = 0;
    this.wave = 1;
    this.kills = 0;
    this.combo = 1;
    this.comboTimer = 0;

    this.player.reset(this.width, this.height);
    this.boss.reset();
    this.particleEngine.clear();

    // Clear object pools
    for (let b of this.bullets) b.reset();
    for (let e of this.enemies) e.reset();
    for (let p of this.powerUps) p.reset();

    this.inputManager.reset();
    this.inputManager.enabled = true;

    this.startWave(this.wave);

    this.state = 'PLAYING';
    this.showScreen('hud-screen');

    audioManager.startMusic();
  }

  startWave(waveNumber) {
    this.wave = waveNumber;
    document.getElementById('hud-wave').textContent = this.wave;

    if (waveNumber % 5 === 0) {
      // Boss Wave
      this.waveState = 'BOSS_WARNING';
      this.waveDelayTimer = 2.5; // Warning screen display time

      const warningOverlay = document.getElementById('boss-warning-overlay');
      if (warningOverlay) warningOverlay.classList.remove('hidden');

      audioManager.playWarning();
      this.particleEngine.triggerScreenShake(1.2, 10);
    } else {
      // Standard Wave
      this.waveState = 'WAVE_ACTIVE';
      this.enemiesToSpawn = 6 + waveNumber * 4;
      this.enemiesSpawned = 0;
      this.spawnInterval = Math.max(0.4, 1.4 - waveNumber * 0.08);
      this.spawnTimer = 0;

      const bossHpWrap = document.getElementById('boss-hp-container');
      if (bossHpWrap) bossHpWrap.classList.add('hidden');
    }
  }

  pauseGame() {
    if (this.state !== 'PLAYING') return;
    this.state = 'PAUSED';
    this.inputManager.enabled = false;
    audioManager.stopMusic();
    document.getElementById('pause-screen').classList.remove('hidden');
  }

  resumeGame() {
    if (this.state !== 'PAUSED') return;
    this.state = 'PLAYING';
    this.inputManager.enabled = true;
    document.getElementById('pause-screen').classList.add('hidden');
    audioManager.startMusic();
  }

  exitToMenu() {
    this.state = 'MENU';
    this.inputManager.reset();
    audioManager.stopMusic();
    this.updateHighScoreDisplay();
    this.showScreen('menu-screen');
  }

  gameOver() {
    this.state = 'GAME_OVER';
    this.inputManager.enabled = false;
    audioManager.stopMusic();

    let isNewHigh = false;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('space_shooter_high_score', this.highScore.toString());
      isNewHigh = true;
    }

    document.getElementById('go-score').textContent = this.score.toLocaleString();
    document.getElementById('go-high-score').textContent = this.highScore.toLocaleString();
    document.getElementById('go-wave').textContent = this.wave;
    document.getElementById('go-kills').textContent = this.kills;

    const newHighBadge = document.getElementById('new-high-score-tag');
    if (newHighBadge) {
      newHighBadge.classList.toggle('hidden', !isNewHigh);
    }

    this.showScreen('game-over-screen');
  }

  triggerBomb() {
    audioManager.playBomb();
    this.particleEngine.triggerScreenShake(0.6, 15);

    // Destroy all active regular enemies
    for (let enemy of this.enemies) {
      if (enemy.active) {
        enemy.active = false;
        this.particleEngine.emitExplosion(enemy.x, enemy.y, enemy.color, 20);
        this.addScore(enemy.scoreValue);
        this.kills++;
      }
    }

    // Damage Boss if active
    if (this.boss.active) {
      this.boss.takeDamage(200, this.particleEngine);
      if (this.boss.hp <= 0) {
        this.onBossDefeated();
      }
    }

    // Clear all enemy bullets
    for (let b of this.bullets) {
      if (b.active && b.isEnemy) {
        b.active = false;
      }
    }
  }

  addScore(points) {
    this.score += points * this.combo;
    document.getElementById('hud-score').textContent = this.score.toLocaleString();
  }

  increaseCombo() {
    this.combo = Math.min(5, this.combo + 1);
    this.comboTimer = 4; // Combo expiry timer

    const badge = document.getElementById('hud-combo-container');
    const val = document.getElementById('hud-combo-val');
    if (badge && val) {
      val.textContent = `${this.combo}x`;
      badge.classList.remove('hidden');
    }
  }

  resetCombo() {
    this.combo = 1;
    this.comboTimer = 0;
    const badge = document.getElementById('hud-combo-container');
    if (badge) badge.classList.add('hidden');
  }

  spawnPowerUpDrop(x, y, isBoss = false) {
    const chance = isBoss ? 1.0 : 0.22;
    if (Math.random() <= chance) {
      const types = ['POWER', 'SHIELD', 'HEALTH', 'RAPID FIRE', 'BOMB'];
      const chosenType = types[Math.floor(Math.random() * types.length)];

      for (let p of this.powerUps) {
        if (!p.active) {
          p.spawn(x, y, chosenType);
          break;
        }
      }
    }
  }

  onBossDefeated() {
    this.boss.active = false;
    this.particleEngine.emitExplosion(this.boss.x, this.boss.y, '#ff0055', 60, 8);
    this.particleEngine.triggerScreenShake(1.0, 18);
    audioManager.playExplosion(true);
    audioManager.vibrate([100, 50, 100, 50, 200]);

    this.addScore(5000);
    this.spawnPowerUpDrop(this.boss.x, this.boss.y, true);

    const bossHpWrap = document.getElementById('boss-hp-container');
    if (bossHpWrap) bossHpWrap.classList.add('hidden');

    this.waveState = 'WAVE_COMPLETE';
    this.waveDelayTimer = 2.0;
  }

  // Main Game Loop (requestAnimationFrame)
  gameLoop(timestamp) {
    const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    if (this.state === 'PLAYING') {
      this.update(dt);
    }

    this.render();

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  update(dt) {
    // Background & Particles
    this.starfield.update(dt);
    this.particleEngine.update(dt);

    // Combo Expiry Timer
    if (this.combo > 1) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.resetCombo();
      }
    }

    // Player Update
    this.player.update(dt, this.inputManager, this.particleEngine, this.bullets);

    // Spawner State Machine
    if (this.waveState === 'WAVE_ACTIVE') {
      this.spawnTimer += dt;
      if (this.spawnTimer >= this.spawnInterval && this.enemiesSpawned < this.enemiesToSpawn) {
        this.spawnTimer = 0;
        this.spawnEnemy();
      }

      // Check wave completion
      let activeEnemies = 0;
      for (let enemy of this.enemies) {
        if (enemy.active) activeEnemies++;
      }

      if (this.enemiesSpawned >= this.enemiesToSpawn && activeEnemies === 0) {
        this.waveState = 'WAVE_COMPLETE';
        this.waveDelayTimer = 1.5;
      }
    } else if (this.waveState === 'BOSS_WARNING') {
      this.waveDelayTimer -= dt;
      if (this.waveDelayTimer <= 0) {
        const warningOverlay = document.getElementById('boss-warning-overlay');
        if (warningOverlay) warningOverlay.classList.add('hidden');

        this.waveState = 'BOSS_ACTIVE';
        this.boss.spawn(this.width, this.wave);

        const bossHpWrap = document.getElementById('boss-hp-container');
        if (bossHpWrap) bossHpWrap.classList.remove('hidden');
      }
    } else if (this.waveState === 'BOSS_ACTIVE') {
      this.boss.update(dt, this.player, this.bullets, this.particleEngine, this.width);

      // Update Boss HP bar
      const bossHpInner = document.getElementById('boss-hp-inner');
      if (bossHpInner) {
        const percent = Math.max(0, (this.boss.hp / this.boss.maxHp) * 100);
        bossHpInner.style.width = `${percent}%`;
      }
    } else if (this.waveState === 'WAVE_COMPLETE') {
      this.waveDelayTimer -= dt;
      if (this.waveDelayTimer <= 0) {
        this.startWave(this.wave + 1);
      }
    }

    // Update Entities
    for (let bullet of this.bullets) bullet.update(dt, this.width, this.height);
    for (let enemy of this.enemies) enemy.update(dt, this.player, this.bullets, this.width, this.height);
    for (let powerUp of this.powerUps) powerUp.update(dt, this.height);

    // Collision Detection Phase
    this.handleCollisions();

    // Update HUD Stats
    document.getElementById('hud-hp-bar').style.width = `${(this.player.hp / this.player.maxHp) * 100}%`;
    document.getElementById('hud-shield-bar').style.width = `${(this.player.shield / this.player.maxShield) * 100}%`;
  }

  spawnEnemy() {
    const waveMult = 1 + (this.wave - 1) * 0.15;
    const enemyTypes = ['BASIC', 'ZIGZAG', 'TANK', 'KAMIKAZE', 'ELITE'];

    // Weighted random type selection
    const rand = Math.random();
    let chosenType = 'BASIC';
    if (rand < 0.40) chosenType = 'BASIC';
    else if (rand < 0.65) chosenType = 'ZIGZAG';
    else if (rand < 0.80) chosenType = 'KAMIKAZE';
    else if (rand < 0.92) chosenType = 'TANK';
    else chosenType = 'ELITE';

    const margin = 30;
    const spawnX = margin + Math.random() * (this.width - margin * 2);

    for (let enemy of this.enemies) {
      if (!enemy.active) {
        enemy.spawn(spawnX, -20, chosenType, waveMult);
        this.enemiesSpawned++;
        break;
      }
    }
  }

  handleCollisions() {
    // 1. Player Bullets ↔ Enemy
    for (let bullet of this.bullets) {
      if (!bullet.active || bullet.isEnemy) continue;

      for (let enemy of this.enemies) {
        if (!enemy.active) continue;

        if (checkCircleCollision(bullet.x, bullet.y, bullet.radius, enemy.x, enemy.y, enemy.radius)) {
          bullet.active = false;
          const killed = enemy.takeDamage(bullet.damage, this.particleEngine);

          if (killed) {
            enemy.active = false;
            this.particleEngine.emitExplosion(enemy.x, enemy.y, enemy.color, 16);
            audioManager.playExplosion(false);
            this.addScore(enemy.scoreValue);
            this.kills++;
            this.increaseCombo();
            this.spawnPowerUpDrop(enemy.x, enemy.y);
          }
          break;
        }
      }

      // Player Bullets ↔ Boss
      if (bullet.active && this.boss.active && this.boss.y > 0) {
        if (checkCircleCollision(bullet.x, bullet.y, bullet.radius, this.boss.x, this.boss.y, this.boss.radius)) {
          bullet.active = false;
          const killed = this.boss.takeDamage(bullet.damage, this.particleEngine);
          this.addScore(10);

          if (killed) {
            this.onBossDefeated();
          }
        }
      }
    }

    // 2. Enemy Bullets ↔ Player
    for (let bullet of this.bullets) {
      if (!bullet.active || !bullet.isEnemy) continue;

      if (checkCircleCollision(bullet.x, bullet.y, bullet.radius, this.player.x, this.player.y, this.player.radius)) {
        bullet.active = false;
        this.resetCombo();
        const dead = this.player.takeDamage(bullet.damage, this.particleEngine);
        if (dead) {
          this.gameOver();
          return;
        }
      }
    }

    // 3. Enemy ↔ Player (Collision Crash)
    for (let enemy of this.enemies) {
      if (!enemy.active) continue;

      if (checkCircleCollision(enemy.x, enemy.y, enemy.radius, this.player.x, this.player.y, this.player.radius)) {
        enemy.active = false;
        this.particleEngine.emitExplosion(enemy.x, enemy.y, enemy.color, 20);
        this.resetCombo();

        const dead = this.player.takeDamage(30, this.particleEngine);
        if (dead) {
          this.gameOver();
          return;
        }
      }
    }

    // 4. Player ↔ PowerUp
    for (let powerUp of this.powerUps) {
      if (!powerUp.active) continue;

      if (checkCircleCollision(powerUp.x, powerUp.y, powerUp.radius, this.player.x, this.player.y, this.player.radius)) {
        powerUp.active = false;
        audioManager.playPowerUp();
        this.particleEngine.emitExplosion(this.player.x, this.player.y, '#00eeff', 12);

        if (powerUp.type === 'POWER') {
          this.player.weaponLevel = Math.min(5, this.player.weaponLevel + 1);
        } else if (powerUp.type === 'SHIELD') {
          this.player.shield = Math.min(this.player.maxShield, this.player.shield + 50);
        } else if (powerUp.type === 'HEALTH') {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + 40);
        } else if (powerUp.type === 'RAPID FIRE') {
          this.player.rapidFireTimer = 8.0; // 8 seconds rapid fire
        } else if (powerUp.type === 'BOMB') {
          this.triggerBomb();
        }

        this.addScore(250);
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.save();
    const shake = this.particleEngine.getShakeOffset();
    this.ctx.translate(shake.x, shake.y);

    // Draw Parallax Background
    this.starfield.draw(this.ctx);

    // Draw Entities when playing/paused
    if (this.state === 'PLAYING' || this.state === 'PAUSED') {
      for (let powerUp of this.powerUps) powerUp.draw(this.ctx);
      for (let bullet of this.bullets) bullet.draw(this.ctx);
      for (let enemy of this.enemies) enemy.draw(this.ctx);

      if (this.boss.active) this.boss.draw(this.ctx);

      this.player.draw(this.ctx, this.inputManager);
      this.particleEngine.draw(this.ctx);
    }

    this.ctx.restore();
  }
}

// Instantiate Game Engine on DOM Load
window.addEventListener('load', () => {
  window.gameEngine = new Game();
});
