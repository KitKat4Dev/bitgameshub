import { levels } from './levels.js';

export class Game {
  constructor(onLevelComplete) {
    this.gameElement = document.getElementById('game');
    this.player = document.getElementById('player');
    this.goal = document.querySelector('.goal');
    this.powerupIndicator = document.querySelector('.powerup-indicator');
    
    this.playerPos = { x: 50, y: 50 };
    this.velocity = { x: 0, y: 0 };
    this.grounded = false;
    this.keys = {};
    this.platforms = [];
    this.powerups = [];
    this.onLevelComplete = onLevelComplete;
    this.tutorials = [];
    this.currentTutorial = 0;
    
    // Powerup states
    this.activeEffects = {
      speed: false,
      jump: false,
      size: false
    };
    
    // Add audio properties
    this.jumpSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3');
    this.powerupSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-powder-glitter-1826.mp3');
    this.winSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
    
    this.paused = false;
    this.init();
  }
  
  init() {
    document.addEventListener('keydown', (e) => this.keys[e.key] = true);
    document.addEventListener('keyup', (e) => this.keys[e.key] = false);
    this.loadAudioSettings();
    this.gameLoop();
  }
  
  loadAudioSettings() {
    const settings = JSON.parse(localStorage.getItem('gameSettings')) || {
      musicVolume: 50,
      sfxVolume: 50,
      muteAll: false
    };
    
    this.updateAudioVolumes(settings);
  }
  
  updateAudioVolumes(settings) {
    const sfxVolume = settings.muteAll ? 0 : settings.sfxVolume / 100;
    this.jumpSound.volume = sfxVolume;
    this.powerupSound.volume = sfxVolume;
    this.winSound.volume = sfxVolume;
  }
  
  togglePause() {
    this.paused = !this.paused;
  }
  
  loadLevel(levelNumber) {
    // Clear existing platforms and powerups
    this.platforms.forEach(platform => platform.remove());
    this.powerups.forEach(powerup => powerup.element.remove());
    this.platforms = [];
    this.powerups = [];
    
    // Reset player effects
    this.clearAllPowerups();
    
    // Clear existing tutorials
    this.tutorials.forEach(t => t.element.remove());
    this.tutorials = [];
    
    const level = levels[levelNumber - 1];
    
    // Set player starting position
    this.playerPos = { x: level.playerStart.x, y: level.playerStart.y };
    
    // Set goal position
    this.goal.style.bottom = `${level.goalPosition.bottom}px`;
    this.goal.style.right = `${level.goalPosition.right}px`;
    
    // Create platforms
    level.platforms.forEach(platform => {
      const div = document.createElement('div');
      div.className = 'platform';
      if (platform.moving) div.classList.add('moving-platform');
      div.style.width = `${platform.width}px`;
      div.style.bottom = `${platform.bottom}px`;
      div.style.left = `${platform.left}px`;
      this.gameElement.appendChild(div);
      this.platforms.push(div);
    });

    // Create powerups
    if (level.powerups) {
      level.powerups.forEach(powerup => {
        const div = document.createElement('div');
        div.className = `powerup powerup-${powerup.type}`;
        div.style.bottom = `${powerup.bottom}px`;
        div.style.left = `${powerup.left}px`;
        this.gameElement.appendChild(div);
        this.powerups.push({
          element: div,
          type: powerup.type,
          active: true
        });
      });
    }
    
    // Add tutorials if present
    if (level.tutorial) {
      level.tutorial.messages.forEach(msg => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = msg.text;
        tooltip.style.left = `${msg.position.x}px`;
        tooltip.style.top = `${msg.position.y}px`;
        this.gameElement.appendChild(tooltip);
        this.tutorials.push({ 
          element: tooltip,
          message: msg 
        });
      });
    }
  }
  
  applyPowerup(type) {
    this.powerupSound.currentTime = 0;
    this.powerupSound.play();
    this.clearAllPowerups();
    this.activeEffects[type] = true;
    
    switch(type) {
      case 'speed':
        this.player.classList.add('player-speed');
        this.powerupIndicator.textContent = "Speed Boost!";
        break;
      case 'jump':
        this.player.classList.add('player-jump');
        this.powerupIndicator.textContent = "Super Jump!";
        break;
      case 'size':
        this.player.classList.add('player-small');
        this.powerupIndicator.textContent = "Mini Size!";
        break;
    }
    
    // Clear powerup after 5 seconds
    setTimeout(() => {
      this.clearPowerup(type);
    }, 5000);
  }
  
  clearPowerup(type) {
    this.activeEffects[type] = false;
    this.player.classList.remove(`player-${type}`);
    this.powerupIndicator.textContent = "";
  }
  
  clearAllPowerups() {
    Object.keys(this.activeEffects).forEach(type => {
      this.activeEffects[type] = false;
      this.player.classList.remove(`player-${type}`);
    });
    this.powerupIndicator.textContent = "";
  }

  checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }
  
  update() {
    if (this.paused) return;
    // Horizontal movement
    const baseSpeed = 5;
    const currentSpeed = this.activeEffects.speed ? baseSpeed * 1.5 : baseSpeed;
    
    if (this.keys['ArrowRight'] || this.keys['d']) {
      this.velocity.x = currentSpeed;
    } else if (this.keys['ArrowLeft'] || this.keys['a']) {
      this.velocity.x = -currentSpeed;
    } else {
      this.velocity.x = 0;
    }
    
    // Jump - now without grounded check
    const baseJumpForce = 12;
    const currentJumpForce = this.activeEffects.jump ? baseJumpForce * 1.5 : baseJumpForce;
    
    if (this.keys[' '] || this.keys['ArrowUp'] || this.keys['w']) {
      this.velocity.y = currentJumpForce;
      this.jumpSound.currentTime = 0;
      this.jumpSound.play();
      this.player.classList.add('player-jump');
      setTimeout(() => this.player.classList.remove('player-jump'), 400);
    }
    
    // Apply reduced gravity for more floaty jumps
    this.velocity.y -= 0.4; // Reduced from 0.5 for more float time
    
    // Update position
    this.playerPos.x += this.velocity.x;
    this.playerPos.y += this.velocity.y;
    
    // Check boundaries with bounce effect
    if (this.playerPos.x < 0) {
      this.playerPos.x = 0;
      this.velocity.x *= -0.5; // Bounce off walls
    }
    if (this.playerPos.x > 770) {
      this.playerPos.x = 770;
      this.velocity.x *= -0.5; // Bounce off walls
    }
    if (this.playerPos.y < 0) {
      this.playerPos.y = 0;
      this.velocity.y *= -0.5; // Bounce off ceiling
    }

    // Check powerup collisions
    const playerRect = {
      x: this.playerPos.x,
      y: 400 - this.playerPos.y - 30,
      width: this.activeEffects.size ? 21 : 30, // Smaller hitbox when size powerup is active
      height: this.activeEffects.size ? 21 : 30
    };

    this.powerups.forEach(powerup => {
      if (powerup.active) {
        const powerupRect = powerup.element.getBoundingClientRect();
        const gameRect = this.gameElement.getBoundingClientRect();
        const relativePowerupRect = {
          x: powerupRect.left - gameRect.left,
          y: powerupRect.top - gameRect.top,
          width: 25,
          height: 25
        };

        if (this.checkCollision(playerRect, relativePowerupRect)) {
          this.applyPowerup(powerup.type);
          powerup.active = false;
          powerup.element.remove();
        }
      }
    });

    // Platform collision
    this.grounded = false;
    const relativePlayerRect = {
      x: this.playerPos.x,
      y: 400 - this.playerPos.y - 30,
      width: this.activeEffects.size ? 21 : 30,
      height: this.activeEffects.size ? 21 : 30
    };

    this.platforms.forEach(platform => {
      const platformRect = platform.getBoundingClientRect();
      const gameRect = this.gameElement.getBoundingClientRect();
      const relativePlatformRect = {
        x: platformRect.left - gameRect.left,
        y: platformRect.top - gameRect.top,
        width: platformRect.width,
        height: platformRect.height
      };

      if (this.checkCollision(relativePlayerRect, relativePlatformRect)) {
        if (this.velocity.y < 0) {
          this.playerPos.y = 400 - relativePlatformRect.y - (this.activeEffects.size ? 21 : 30);
          this.velocity.y = 0;
          this.grounded = true;
        }
      }
    });

    // Check win condition
    const goalRect = this.goal.getBoundingClientRect();
    const gameRect = this.gameElement.getBoundingClientRect();
    const relativeGoalRect = {
      x: goalRect.left - gameRect.left,
      y: goalRect.top - gameRect.top,
      width: goalRect.width,
      height: goalRect.height
    };

    if (this.checkCollision(relativePlayerRect, relativeGoalRect)) {
      this.winSound.currentTime = 0;
      this.winSound.play();
      this.onLevelComplete();
    }

    // Update player position
    this.player.style.left = `${this.playerPos.x}px`;
    this.player.style.bottom = `${this.playerPos.y}px`;
  }
  
  gameLoop() {
    this.update();
    requestAnimationFrame(() => this.gameLoop());
  }
}