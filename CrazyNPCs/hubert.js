import * as THREE from 'three';

export class Hubert {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.mansion = null;
    this.model = null;
    this.lastPhraseTime = 0;
    this.phraseInterval = 5000 + Math.random() * 5000;
    this.position = new THREE.Vector3(-20, 0, 160);
    this.isAngry = false;
    this.isFighting = false;
    this.fightingPhraseInterval = null;
    this.fightingPhrases = [
      "YOU STARTED IT!",
      "I'LL SHOW YOU MY WRATH!",
      "YOU SHOULD HAVE LEFT ME ALONE!",
      "NOW YOU'LL PAY FOR YOUR INSOLENCE!",
      "I'LL CRUSH YOU LIKE THE INSIGNIFICANT INSECT THAT YOU ARE!",
      "YOUR TIME IS OVER!",
      "YOU ARE NO MATCH FOR ME!",
      "PREPARE TO FACE THE CONSEQUENCES!",
      "THIS IS JUST THE BEGINNING!"
    ];
    this.rewardGiven = false;
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message';
    this.chatMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.chatMessage.style.color = '#FFD700';
    this.chatMessage.style.fontWeight = 'bold';
    this.chatMessage.style.fontSize = '18px';
    this.chatMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(this.chatMessage);
    
    this.createModel();
    this.createMansion();
  }
  
  createModel() {
    const textureLoader = new THREE.TextureLoader();
    const hubertTexture = textureLoader.load('hubert.jpeg');
    
    const geometry = new THREE.PlaneGeometry(3, 3);
    const material = new THREE.MeshBasicMaterial({
      map: hubertTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.model = new THREE.Group();
    this.model.add(mesh);
    
    this.model.position.copy(this.position);
    this.model.position.y = 1.5;
    
    this.scene.add(this.model);
  }
  
  createMansion() {
    const mansionGroup = new THREE.Group();
    
    const baseGeometry = new THREE.BoxGeometry(20, 10, 20);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xDAA520 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 5;
    mansionGroup.add(base);
    
    const roofGeometry = new THREE.ConeGeometry(14, 5, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 12;
    roof.rotation.y = Math.PI / 4;
    mansionGroup.add(roof);
    
    mansionGroup.position.copy(this.position);
    mansionGroup.position.y = 0;
    
    this.scene.add(mansionGroup);
    this.mansion = mansionGroup;
    this.mansion.userData.isBarrier = true;
    this.mansion.userData.isMansion = true;
  }
  
  offerReward() {
    if (!this.rewardGiven && window.shop) {
      window.shop.coins += 1000000; // award one million coins
      window.shop.updateCoinCounter();
      this.rewardGiven = true;
      this.chatMessage.textContent = "Congratulations! Here are your millions of coins!";
      this.chatMessage.style.display = 'block';
      setTimeout(() => {
        this.chatMessage.style.display = 'none';
      }, 4000);
    }
  }
  
  respondToChat(message) {
    if (message.toLowerCase().includes("your mansion is bigger than elons")) {
      this.triggerElonFight();
      return true;
    }
    return false;
  }
  
  triggerElonFight() {
    this.isAngry = true;
    this.chatMessage.textContent = "How dare you! Prepare for my wrath!";
    this.chatMessage.style.display = 'block';
    this.destroyMansion();
    if (window.elonMusk) {
      window.elonMusk.model.position.set(this.model.position.x + 10, this.model.position.y, this.model.position.z);
      if (window.elonMusk.startFightAgainstHubert) {
        window.elonMusk.startFightAgainstHubert(this);
      } else {
        window.elonMusk.triggerRobbery();
      }
    }
  }
  
  destroyMansion() {
    if (this.mansion) {
      const explosionGeometry = new THREE.SphereGeometry(5, 8, 8);
      const explosionMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFA500,
        transparent: true,
        opacity: 0.8
      });
      const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
      explosion.position.copy(this.mansion.position);
      this.scene.add(explosion);
      
      const animateExplosion = () => {
        explosion.scale.multiplyScalar(1.1);
        explosion.material.opacity -= 0.02;
        if (explosion.material.opacity > 0) {
          requestAnimationFrame(animateExplosion);
        } else {
          this.scene.remove(explosion);
        }
      };
      animateExplosion();
      
      this.scene.remove(this.mansion);
      this.mansion = null;
    }
  }
  
  update(camera, renderer, deltaTime) {
    if (!this.model || !this.playerModel) return;
    
    const mesh = this.model.children[0];
    if (mesh) {
      mesh.quaternion.copy(camera.quaternion);
    }
    
    if (this.isAngry) {
      if (!this.fightingPhraseInterval) {
        this.fightingPhraseInterval = setInterval(() => {
          const phrase = this.fightingPhrases[Math.floor(Math.random() * this.fightingPhrases.length)];
          this.chatMessage.textContent = phrase;
          this.chatMessage.style.display = 'block';
          setTimeout(() => {
            this.chatMessage.style.display = 'none';
          }, 2000);
        }, 2000);
      }
    }
    
    const screenPosition = this.getScreenPosition(this.model.position, camera, renderer);
    if (screenPosition && screenPosition.visible) {
      this.chatMessage.style.left = `${screenPosition.x}px`;
      this.chatMessage.style.top = `${screenPosition.y - 45}px`;
    } else {
      this.chatMessage.style.display = 'none';
    }
  }
  
  getScreenPosition(position, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = renderer.domElement.width / 2;
    const heightHalf = renderer.domElement.height / 2;
    vector.copy(position);
    vector.y += 2;
    vector.project(camera);
    const isInFront = vector.z < 1;
    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf,
      visible: isInFront
    };
  }
}