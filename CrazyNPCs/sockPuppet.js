import * as THREE from 'three';

export class SockPuppet {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.phrases = [
      "WOwzers!", 
      "Im Puppie!", 
      "Hello friend!", 
      "Wait for meeeee!", 
      "Let's play!", 
      "I'm a sock!",
      "Wheeeee!",
      "Got any socks?"
    ];
    this.angryPhrases = [
      "HOW DARE YOU SAY NO!",
      "I WILL CATCH YOU!",
      "YOU MADE PUPPIE ANGRY!",
      "NO ONE SAYS NO TO PUPPIE!",
      "PUPPIE SMASH!",
      "YOU'RE DOOMED!"
    ];
    this.lastPhraseTime = 0;
    this.phraseInterval = 3000 + Math.random() * 5000; // 3-8 seconds between phrases
    this.moveSpeed = 0.04;
    this.position = new THREE.Vector3(10, 0, 10); // Start a bit away from player
    this.chatMessage = null;
    this.isAngry = false;
    this.normalScale = 1;
    this.angryScale = 10;
    this.angryMoveSpeed = 0.12; // 3x faster when angry
    this.gameOver = false;
    this.isRunning = false;
    this.isShot = false;
    
    this.createModel();
  }
  
  createModel() {
    // Create puppet group
    this.puppet = new THREE.Group();
    
    // Load texture for the sock puppet
    const textureLoader = new THREE.TextureLoader();
    const puppetTexture = textureLoader.load('SockPuppet-removebg-preview.png');
    
    // Create material with the texture
    const puppetMaterial = new THREE.MeshBasicMaterial({
      map: puppetTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create a plane for the puppet
    const puppetGeometry = new THREE.PlaneGeometry(1.5, 1.5);
    const puppetMesh = new THREE.Mesh(puppetGeometry, puppetMaterial);
    
    // Add puppet to group
    this.puppet.add(puppetMesh);
    
    // Create chat message element for the puppet
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message puppet-chat';
    this.chatMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(this.chatMessage);
    
    // Set initial position
    this.puppet.position.copy(this.position);
    this.puppet.position.y = 1.0; // Float above ground
    
    // Create game over overlay
    this.gameOverOverlay = document.createElement('div');
    this.gameOverOverlay.style.position = 'fixed';
    this.gameOverOverlay.style.top = '0';
    this.gameOverOverlay.style.left = '0';
    this.gameOverOverlay.style.width = '100%';
    this.gameOverOverlay.style.height = '100%';
    this.gameOverOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    this.gameOverOverlay.style.color = 'white';
    this.gameOverOverlay.style.display = 'flex';
    this.gameOverOverlay.style.justifyContent = 'center';
    this.gameOverOverlay.style.alignItems = 'center';
    this.gameOverOverlay.style.fontSize = '48px';
    this.gameOverOverlay.style.fontWeight = 'bold';
    this.gameOverOverlay.style.zIndex = '9999';
    this.gameOverOverlay.style.display = 'none';
    this.gameOverOverlay.textContent = 'GAME OVER! PUPPIE GOT YOU!';
    
    const restartButton = document.createElement('button');
    restartButton.style.position = 'absolute';
    restartButton.style.bottom = '30%';
    restartButton.style.padding = '15px 30px';
    restartButton.style.fontSize = '24px';
    restartButton.style.backgroundColor = 'white';
    restartButton.style.color = 'red';
    restartButton.style.border = 'none';
    restartButton.style.borderRadius = '10px';
    restartButton.style.cursor = 'pointer';
    restartButton.textContent = 'Restart Game';
    restartButton.addEventListener('click', () => window.location.reload());
    
    this.gameOverOverlay.appendChild(restartButton);
    document.body.appendChild(this.gameOverOverlay);
    
    // Add to scene
    this.scene.add(this.puppet);
  }
  
  update(camera, renderer, deltaTime) {
    if (!this.puppet || !this.playerModel || this.gameOver) return;
    
    // Check if player has gun and is not already running or shot
    if (window.gun && window.gun.playerHasGun && !this.isRunning && !this.isShot && !this.isAngry) {
      this.runAway();
    }
    
    // If running away from player with gun
    if (this.isRunning) {
      // Run away from player
      const direction = new THREE.Vector3();
      direction.subVectors(this.puppet.position, this.playerModel.position);
      direction.y = 0;
      
      if (direction.length() > 0) {
        direction.normalize();
        direction.multiplyScalar(this.moveSpeed * 3); // Run faster
        this.puppet.position.add(direction);
      }
      
      // If got away far enough, stop running
      const distanceToPlayer = this.puppet.position.distanceTo(this.playerModel.position);
      if (distanceToPlayer > 50) {
        this.isRunning = false;
      }
    }
    
    // If shot, don't do anything else
    if (this.isShot) return;
    
    // Get direction to player
    const direction = new THREE.Vector3();
    direction.subVectors(this.playerModel.position, this.puppet.position);
    direction.y = 0; // Keep on same height
    
    // Get distance to player
    const distanceToPlayer = direction.length();
    
    // Check if Speed is blocking when angry
    let isBlocked = false;
    if (this.isAngry && window.showSpeedNPC && window.showSpeedNPC.isHelping) {
      const speedPos = window.showSpeedNPC.model.position;
      const distanceToSpeed = new THREE.Vector3().subVectors(speedPos, this.puppet.position).length();
      
      if (distanceToSpeed < 3) {
        // Speed is close enough to block puppet
        // Move towards Speed instead of player
        direction.subVectors(speedPos, this.puppet.position);
        isBlocked = true;
      }
    }
    
    // Normalize and scale by speed
    if (direction.length() > 0.1) { // Get closer when angry
      direction.normalize();
      
      const currentSpeed = this.isAngry ? this.angryMoveSpeed : this.moveSpeed;
      direction.multiplyScalar(currentSpeed);
      
      // Update position
      this.puppet.position.add(direction);
      
      // Make puppet face target
      if (isBlocked && window.showSpeedNPC) {
        this.puppet.lookAt(window.showSpeedNPC.model.position);
      } else {
        this.puppet.lookAt(this.playerModel.position);
      }
    }
    
    // Check if puppet caught player when angry (only if not blocked by Speed)
    if (this.isAngry && distanceToPlayer < 2 && !isBlocked) {
      this.triggerGameOver();
    }
    
    // Puppet should always face the camera (billboard effect)
    const puppetPlane = this.puppet.children[0];
    if (puppetPlane) {
      puppetPlane.quaternion.copy(camera.quaternion);
    }
    
    // Bobbing animation
    this.puppet.position.y = 1.0 + Math.sin(performance.now() * 0.003) * 0.1;
    
    // Say random phrases occasionally
    const now = Date.now();
    if (now - this.lastPhraseTime > this.phraseInterval) {
      this.sayPhrase();
      this.lastPhraseTime = now;
      this.phraseInterval = this.isAngry ? 1500 : (3000 + Math.random() * 5000); // More frequent when angry
    }
    
    // Update chat message position
    if (this.chatMessage) {
      const screenPosition = this.getScreenPosition(this.puppet.position, camera, renderer);
      if (screenPosition && screenPosition.visible) {
        this.chatMessage.style.left = `${screenPosition.x}px`;
        this.chatMessage.style.top = `${screenPosition.y - 45}px`;
      } else {
        this.chatMessage.style.display = 'none';
      }
    }
  }
  
  triggerGameOver() {
    this.gameOver = true;
    this.gameOverOverlay.style.display = 'flex';
    
    // Stop player movement and disable controls
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
  }
  
  sayPhrase() {
    const phrases = this.isAngry ? this.angryPhrases : this.phrases;
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    this.chatMessage.textContent = phrase;
    this.chatMessage.style.display = 'block';
    
    if (this.isAngry) {
      this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
      this.chatMessage.style.fontSize = '24px';
    }
    
    // Hide message after 3 seconds
    setTimeout(() => {
      if (this.chatMessage) {
        this.chatMessage.style.display = 'none';
      }
    }, 3000);
  }
  
  becomeAngry() {
    if (!this.isAngry) {
      this.isAngry = true;
      // Make puppet bigger
      this.puppet.scale.set(this.angryScale, this.angryScale, this.angryScale);
      // Change chat message style
      this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
      this.chatMessage.style.fontSize = '24px';
      // Say angry phrase immediately
      this.sayPhrase();
      
      // Broadcast to all players
      if (window.room) {
        window.room.send({
          type: "npc_event",
          event: "puppet_angry",
          initiator: window.room.peers[window.room.clientId]?.username || "A player"
        });
      }
    }
  }
  
  runAway() {
    this.isRunning = true;
    this.chatMessage.textContent = "AAAH! GUN! RUN!";
    this.chatMessage.style.display = 'block';
  }
  
  getShot() {
    if (this.isShot) return;
    
    this.isShot = true;
    this.isRunning = false;
    this.isAngry = false;
    
    // Fall over
    this.puppet.rotation.z = Math.PI / 2;
    this.puppet.position.y = 0.2;
    
    // Say shot message
    this.chatMessage.textContent = "OW! YOU SHOT ME!";
    this.chatMessage.style.display = 'block';
    
    // Trigger Elon to attack player
    if (window.elonMusk) {
      window.elonMusk.playerShotNPC();
    }
  }
  
  getScreenPosition(position, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = renderer.domElement.width / 2;
    const heightHalf = renderer.domElement.height / 2;
    
    // Get position with height offset
    vector.copy(position);
    vector.y += 1.2; // Position above the puppet's head
    
    // Project to screen space
    vector.project(camera);
    
    // Calculate whether object is in front of the camera
    const isInFront = vector.z < 1;
    
    // Convert to screen coordinates
    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf,
      visible: isInFront
    };
  }
}