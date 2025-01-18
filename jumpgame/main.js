import { Game } from './game.js';

class GameManager {
  constructor() {
    this.titleScreen = document.getElementById('title-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.startButton = document.getElementById('start-button');
    this.levelNumber = document.getElementById('level-number');
    
    this.game = null;
    this.currentLevel = 1;
    this.hasPlayedTutorial = false;
    
    this.settingsScreen = document.getElementById('settings-screen');
    this.settingsButton = document.getElementById('settings-button');
    this.backButton = document.getElementById('back-button');
    this.pauseButton = document.getElementById('pause-button');
    
    this.musicVolume = document.getElementById('music-volume');
    this.sfxVolume = document.getElementById('sfx-volume');
    this.muteAll = document.getElementById('mute-all');
    
    this.bgMusic = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-level-music-689.mp3');
    this.bgMusic.loop = true;
    
    this.init();
    this.loadSettings();
  }
  
  init() {
    this.startButton.addEventListener('click', () => this.startGame());
    
    this.settingsButton.addEventListener('click', () => this.showSettings());
    this.backButton.addEventListener('click', () => this.hideSettings());
    this.pauseButton.addEventListener('click', () => this.togglePause());
    
    this.musicVolume.addEventListener('input', () => this.updateSettings());
    this.sfxVolume.addEventListener('input', () => this.updateSettings());
    this.muteAll.addEventListener('change', () => this.updateSettings());
  }
  
  loadSettings() {
    const settings = JSON.parse(localStorage.getItem('gameSettings')) || {
      musicVolume: 50,
      sfxVolume: 50,
      muteAll: false
    };
    
    this.musicVolume.value = settings.musicVolume;
    this.sfxVolume.value = settings.sfxVolume;
    this.muteAll.checked = settings.muteAll;
    
    document.getElementById('music-value').textContent = `${settings.musicVolume}%`;
    document.getElementById('sfx-value').textContent = `${settings.sfxVolume}%`;
    
    this.updateAudio(settings);
  }
  
  updateSettings() {
    const settings = {
      musicVolume: parseInt(this.musicVolume.value),
      sfxVolume: parseInt(this.sfxVolume.value),
      muteAll: this.muteAll.checked
    };
    
    document.getElementById('music-value').textContent = `${settings.musicVolume}%`;
    document.getElementById('sfx-value').textContent = `${settings.sfxVolume}%`;
    
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    this.updateAudio(settings);
    
    if (this.game) {
      this.game.updateAudioVolumes(settings);
    }
  }
  
  updateAudio(settings) {
    const musicVolume = settings.muteAll ? 0 : settings.musicVolume / 100;
    this.bgMusic.volume = musicVolume;
  }
  
  showSettings() {
    this.titleScreen.classList.add('hidden');
    this.settingsScreen.classList.remove('hidden');
  }
  
  hideSettings() {
    this.settingsScreen.classList.add('hidden');
    this.titleScreen.classList.remove('hidden');
  }
  
  togglePause() {
    if (this.game) {
      this.game.togglePause();
      this.pauseButton.textContent = this.game.paused ? 'Resume' : 'Pause';
    }
  }
  
  startGame() {
    this.titleScreen.classList.add('hidden');
    this.gameScreen.classList.remove('hidden');
    
    this.game = new Game(() => this.nextLevel());
    if (!this.hasPlayedTutorial) {
      this.currentLevel = 1; 
      this.hasPlayedTutorial = true;
    }
    this.game.loadLevel(this.currentLevel);
    this.bgMusic.play();
  }
  
  nextLevel() {
    this.currentLevel++;
    if (this.currentLevel > 54) { 
      alert('Congratulations! You\'ve mastered all 54 levels!');
      this.currentLevel = 1;
      this.titleScreen.classList.remove('hidden');
      this.gameScreen.classList.add('hidden');
    } else {
      this.levelNumber.textContent = this.currentLevel;
      this.game.loadLevel(this.currentLevel);
    }
  }
}

new GameManager();