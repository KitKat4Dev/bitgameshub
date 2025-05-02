import * as THREE from 'three';

export class DoubleFaceMan {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.phrases = [
      "Hehehe I'm like that one man in the crazy house",
      "I see you... I always see you...",
      "Wanna play a game? I know ALL the games!",
      "The voices tell me you're next...",
      "Do you like my face? I have MANY more!",
      "They locked me up, but I'm FREE now!",
      "Come closer... I want to whisper something..."
    ];
    this.lastPhraseTime = 0;
    this.phraseInterval = 6000 + Math.random() * 5000; // 6-11 seconds between phrases
    this.moveSpeed = 0.04;
    this.position = new THREE.Vector3(30, 0, -20); // Start a bit away from player and mansion
    this.chatMessage = null;
    this.isAngry = false;
    this.isFighting = false;
    this.fightStartTime = 0;
    this.explosionTimer = null;
    this.currentExplosion = 0;
    this.explosionCount = 0;
    this.maxExplosions = 30;
    
    this.createModel();
  }
  
  createModel() {
    // Create face man group
    this.model = new THREE.Group();
    
    // Load texture for the creepy man's face
    const textureLoader = new THREE.TextureLoader();
    const faceTexture = textureLoader.load('download (2).jpg');
    
    // Create material with the texture
    const faceMaterial = new THREE.MeshBasicMaterial({
      map: faceTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create a plane for the face
    const faceGeometry = new THREE.PlaneGeometry(2, 2);
    const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);
    
    // Add face to group
    this.model.add(faceMesh);
    
    // Create creepy, glowing eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000, emissive: 0xFF0000 });
    
    // Left eye
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.3, 0.3, 0.1);
    this.model.add(leftEye);
    
    // Right eye
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.3, 0.3, 0.1);
    this.model.add(rightEye);
    
    // Create chat message element
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message creepy-chat';
    this.chatMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.chatMessage.style.color = '#FF3333';
    this.chatMessage.style.fontWeight = 'bold';
    this.chatMessage.style.fontSize = '16px';
    this.chatMessage.style.fontStyle = 'italic';
    this.chatMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(this.chatMessage);
    
    // Set initial position
    this.model.position.copy(this.position);
    this.model.position.y = 1.2; // Float above ground
    
    // Create game over overlay for map explosion
    this.gameOverOverlay = document.createElement('div');
    this.gameOverOverlay.style.position = 'fixed';
    this.gameOverOverlay.style.top = '0';
    this.gameOverOverlay.style.left = '0';
    this.gameOverOverlay.style.width = '100%';
    this.gameOverOverlay.style.height = '100%';
    this.gameOverOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    this.gameOverOverlay.style.color = 'white';
    this.gameOverOverlay.style.display = 'flex';
    this.gameOverOverlay.style.justifyContent = 'center';
    this.gameOverOverlay.style.alignItems = 'center';
    this.gameOverOverlay.style.fontSize = '48px';
    this.gameOverOverlay.style.fontWeight = 'bold';
    this.gameOverOverlay.style.zIndex = '9999';
    this.gameOverOverlay.style.display = 'none';
    this.gameOverOverlay.textContent = 'WORLD EXPLODED! GAME OVER!';
    
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
    this.scene.add(this.model);
  }
  
  update(camera, renderer, deltaTime) {
    if (!this.model || !this.playerModel) return;
    
    if (this.isFighting) {
      this.updateFight(camera, renderer, deltaTime);
      return;
    }
    
    // Get direction to player
    const direction = new THREE.Vector3();
    direction.subVectors(this.playerModel.position, this.model.position);
    direction.y = 0; // Keep on same height
    
    // Get distance to player
    const distanceToPlayer = direction.length();
    
    // If player is too far, move closer, but keep some distance
    if (distanceToPlayer > 10) {
      // Normalize and scale by speed
      direction.normalize();
      direction.multiplyScalar(this.moveSpeed);
      
      // Update position
      this.model.position.add(direction);
      
      // Make model face target
      this.model.lookAt(this.playerModel.position);
    } else if (distanceToPlayer < 5) {
      // Move away if too close
      direction.normalize();
      direction.multiplyScalar(-this.moveSpeed);
      this.model.position.add(direction);
    }
    
    // Face always looks at camera (billboard effect)
    const facePlane = this.model.children[0];
    if (facePlane) {
      facePlane.quaternion.copy(camera.quaternion);
    }
    
    // Bobbing animation
    this.model.position.y = 1.2 + Math.sin(performance.now() * 0.002) * 0.2;
    
    // Rotate eyes to create unsettling effect
    const leftEye = this.model.children[1];
    const rightEye = this.model.children[2];
    if (leftEye && rightEye) {
      leftEye.rotation.z = Math.sin(performance.now() * 0.001) * 2;
      rightEye.rotation.z = Math.sin(performance.now() * 0.001 + Math.PI) * 2;
    }
    
    // Say random phrases occasionally
    const now = Date.now();
    if (now - this.lastPhraseTime > this.phraseInterval) {
      this.sayPhrase();
      this.lastPhraseTime = now;
      this.phraseInterval = 6000 + Math.random() * 5000;
    }
    
    // Update chat message position
    this.updateChatMessagePosition(camera, renderer);
  }
  
  updateFight(camera, renderer, deltaTime) {
    // During fight, move toward Elon
    if (window.elonMusk && window.elonMusk.model) {
      const elonPosition = window.elonMusk.model.position.clone();
      
      // Get direction to Elon
      const direction = new THREE.Vector3();
      direction.subVectors(elonPosition, this.model.position);
      direction.y = 0; // Keep on same height
      
      // Get distance to Elon
      const distanceToElon = direction.length();
      
      if (distanceToElon > 3) {
        // Move toward Elon
        direction.normalize();
        direction.multiplyScalar(this.moveSpeed * 3); // Move faster during fight
        this.model.position.add(direction);
      }
      
      // Make face look at camera (billboard effect)
      const facePlane = this.model.children[0];
      if (facePlane) {
        facePlane.quaternion.copy(camera.quaternion);
      }
      
      // Make face grow and shrink rapidly
      const scale = 1 + Math.sin(performance.now() * 0.01) * 0.5;
      facePlane.scale.set(scale, scale, scale);
      
      // Rotate rapidly
      this.model.rotation.y += 0.05;
      
      // Make eyes glow more intensely during fight
      const leftEye = this.model.children[1];
      const rightEye = this.model.children[2];
      if (leftEye && rightEye) {
        const eyeScale = 1 + Math.sin(performance.now() * 0.005) * 0.5;
        leftEye.scale.set(eyeScale, eyeScale, eyeScale);
        rightEye.scale.set(eyeScale, eyeScale, eyeScale);
      }
    }
    
    // Update chat message position
    this.updateChatMessagePosition(camera, renderer);
  }
  
  updateChatMessagePosition(camera, renderer) {
    if (this.chatMessage) {
      const screenPosition = this.getScreenPosition(this.model.position, camera, renderer);
      if (screenPosition && screenPosition.visible) {
        this.chatMessage.style.left = `${screenPosition.x}px`;
        this.chatMessage.style.top = `${screenPosition.y - 45}px`;
      } else {
        this.chatMessage.style.display = 'none';
      }
    }
  }
  
  triggerAnger() {
    if (this.isAngry) return;
    
    this.isAngry = true;
    
    // Say angry phrase
    this.chatMessage.textContent = "YOU'LL REGRET THAT! I'LL DESTROY EVERYTHING!";
    this.chatMessage.style.display = 'block';
    this.chatMessage.style.fontSize = '20px';
    this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    
    // Start the fight after a short delay
    setTimeout(() => {
      this.startFight();
    }, 2000);
    
    // Broadcast to all players
    if (window.room) {
      window.room.send({
        type: "npc_event",
        event: "double_face_angry",
        initiator: window.room.peers[window.room.clientId]?.username || "A player"
      });
    }
  }
  
  startFight() {
    this.isFighting = true;
    this.fightStartTime = Date.now();
    
    // Make Elon aware of the fight
    if (window.elonMusk) {
      window.elonMusk.startFighting(this);
    }
    
    // Start the apocalyptic explosions after a delay
    setTimeout(() => {
      this.startExplosions();
    }, 5000);
  }
  
  startExplosions() {
    // Create explosions around the map
    this.explosionTimer = setInterval(() => {
      this.createExplosion();
      
      this.explosionCount++;
      if (this.explosionCount >= this.maxExplosions) {
        this.endWorld();
      }
    }, 500); // A new explosion every half second
  }
  
  createExplosion() {
    // Create an explosion at a random position on the map
    const explosionPosition = new THREE.Vector3(
      (Math.random() - 0.5) * 200,
      0,
      (Math.random() - 0.5) * 200
    );
    
    // Create explosion geometry
    const explosionGeometry = new THREE.SphereGeometry(5, 8, 8);
    const explosionMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF5500,
      transparent: true,
      opacity: 0.8
    });
    
    const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
    explosion.position.copy(explosionPosition);
    explosion.scale.set(0.1, 0.1, 0.1);
    
    this.scene.add(explosion);
    
    // Animate the explosion
    const expandExplosion = () => {
      explosion.scale.multiplyScalar(1.2);
      explosion.material.opacity -= 0.02;
      
      if (explosion.material.opacity > 0) {
        requestAnimationFrame(expandExplosion);
      } else {
        this.scene.remove(explosion);
      }
    };
    
    expandExplosion();
    
    // Add a flash effect to the whole screen
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    flash.style.zIndex = '9998';
    flash.style.pointerEvents = 'none';
    
    document.body.appendChild(flash);
    
    // Remove the flash after a short time
    setTimeout(() => {
      document.body.removeChild(flash);
    }, 150);
    
    // Create explosion sound (optional)
    /*
    const explosionSound = new Audio('explosion.mp3');
    explosionSound.volume = 0.5;
    explosionSound.play();
    */
    
    // Say something crazy during explosions
    if (Math.random() > 0.7) { // 30% chance each explosion
      const crazyPhrases = [
        "HAHAHAHA! BOOM!",
        "FEEL MY WRATH!",
        "THE WORLD ENDS NOW!",
        "EVERYTHING BURNS!",
        "CAN YOU FEEL IT?",
        "THIS IS JUST THE BEGINNING!"
      ];
      
      this.chatMessage.textContent = crazyPhrases[Math.floor(Math.random() * crazyPhrases.length)];
      this.chatMessage.style.display = 'block';
    }
  }
  
  endWorld() {
    // Stop explosions
    clearInterval(this.explosionTimer);
    
    // Show game over screen
    this.gameOverOverlay.style.display = 'flex';
    
    // Stop player movement
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
  }
  
  sayPhrase() {
    const phrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
    
    this.chatMessage.textContent = phrase;
    this.chatMessage.style.display = 'block';
    
    // Hide after 4 seconds
    setTimeout(() => {
      if (this.chatMessage) {
        this.chatMessage.style.display = 'none';
      }
    }, 4000);
  }
  
  respondToChat(message) {
    if (message.toLowerCase().includes("i hate you")) {
      this.triggerAnger();
      return true;
    }
    return false;
  }
  
  getScreenPosition(position, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = renderer.domElement.width / 2;
    const heightHalf = renderer.domElement.height / 2;
    
    vector.copy(position);
    vector.y += 1.5; // Position above head
    
    vector.project(camera);
    
    const isInFront = vector.z < 1;
    
    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf,
      visible: isInFront
    };
  }
}