import * as THREE from 'three';

class MiniPuppie {
  constructor(scene, position, playerModel, parentElon) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.parentElon = parentElon;
    this.moveSpeed = 0.15;
    this.phrases = [
      "GET THEM!",
      "PROTECT MONEY!",
      "ATTACK!",
      "THIEF THIEF!",
      "NO STEALING!",
      "DIE THIEF DIE!"
    ];
    
    // Create mini puppie model
    this.model = new THREE.Group();
    
    // Create body (similar to SockPuppet but smaller)
    const puppieGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const puppieMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // White
    const body = new THREE.Mesh(puppieGeometry, puppieMaterial);
    body.castShadow = true;
    this.model.add(body);
    
    // Add eyes
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00 }); // Green eyes
    
    // Left eye
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 0.1, 0.25);
    this.model.add(leftEye);
    
    // Right eye
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 0.1, 0.25);
    this.model.add(rightEye);
    
    // Add mouth
    const mouthGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
    const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 }); // Red
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, -0.1, 0.25);
    this.model.add(mouth);
    
    // Create chat message for puppie
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message';
    this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    this.chatMessage.style.color = 'white';
    this.chatMessage.style.fontSize = '12px';
    this.chatMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(this.chatMessage);
    
    // Set position
    this.model.position.copy(position);
    
    // Add to scene
    this.scene.add(this.model);
    
    // Say initial phrase
    this.sayPhrase();
    
    // Set behavior
    this.lastJumpTime = 0;
  }
  
  update(camera, renderer, deltaTime) {
    if (!this.model || !this.playerModel) return;
    
    // Calculate direction to player
    const direction = new THREE.Vector3();
    direction.subVectors(this.playerModel.position, this.model.position);
    direction.y = 0; // Keep on same height level
    
    // Normalize and apply speed
    if (direction.length() > 0.5) {
      direction.normalize();
      direction.multiplyScalar(this.moveSpeed);
      this.model.position.add(direction);
      
      // Face the player
      this.model.lookAt(this.playerModel.position);
    }
    
    // Jumping behavior
    const now = performance.now();
    if (now - this.lastJumpTime > 500) { // Jump every 0.5 seconds
      this.model.position.y = 0.5 + Math.sin((now % 1000) / 1000 * Math.PI) * 0.5;
      if (this.model.position.y <= 0.5) {
        this.lastJumpTime = now;
      }
    }
    
    // Check collision with player (defeat condition)
    const distanceToPlayer = this.model.position.distanceTo(this.playerModel.position);
    if (distanceToPlayer < 1) {
      this.parentElon.puppieHitPlayer();
    }
    
    // Update chat message position
    if (this.chatMessage) {
      const screenPosition = this.getScreenPosition(this.model.position, camera, renderer);
      if (screenPosition && screenPosition.visible) {
        this.chatMessage.style.left = `${screenPosition.x}px`;
        this.chatMessage.style.top = `${screenPosition.y - 30}px`;
      } else {
        this.chatMessage.style.display = 'none';
      }
    }
  }
  
  sayPhrase() {
    const phrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
    this.chatMessage.textContent = phrase;
    this.chatMessage.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
      if (this.chatMessage) {
        this.chatMessage.style.display = 'none';
      }
    }, 3000);
  }
  
  getScreenPosition(position, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = renderer.domElement.width / 2;
    const heightHalf = renderer.domElement.height / 2;
    
    vector.copy(position);
    vector.y += 0.5;
    
    vector.project(camera);
    
    const isInFront = vector.z < 1;
    
    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf,
      visible: isInFront
    };
  }
  
  remove() {
    if (this.model) {
      this.scene.remove(this.model);
    }
    if (this.chatMessage) {
      document.getElementById('game-container').removeChild(this.chatMessage);
    }
  }
}

export class ElonMusk {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.position = new THREE.Vector3(60, 0, 60); // Coordinates of Elon’s mansion
    this.moveSpeed = 0.05;
    this.phrases = [
      "Welcome to my mansion!",
      "I'm working on rockets!",
      "Want to see my car collection?",
      "Do you like Twitter? I own it!",
      "I'm the richest guy in the world!",
      "My house has its own AI!",
      "Come in, look around!"
    ];
    this.angryPhrases = [
      "YOU STOLE MY MONEY!",
      "SECURITY ALERT!",
      "GET THIS THIEF!",
      "MY PUPPIES WILL GET YOU!",
      "I'LL REMEMBER YOUR FACE!",
      "I HAVE YOUR IP ADDRESS!",
      "THIS WILL BE ON TWITTER!"
    ];
    
    this.lastPhraseTime = 0;
    this.phraseInterval = 5000 + Math.random() * 5000;
    this.isAngry = false;
    this.isFighting = false;
    this.fightStartTime = 0;
    this.opponent = null;
    this.isArmed = false;
    this.isRunning = false;
    this.portalTriggered = false;
    this.miniPuppies = [];
    this.puppiesReleased = 0;
    this.maxPuppies = 20;
    this.puppyReleaseInterval = null;
    
    this.createModel();
    this.createBabyFronk();
  }
  
  createModel() {
    // Create Elon model group
    this.model = new THREE.Group();
    
    // Load Elon's texture
    const textureLoader = new THREE.TextureLoader();
    const elonTexture = textureLoader.load('Elon-musk-meme-3-removebg-preview.png');
    
    // Create material with texture
    const elonMaterial = new THREE.MeshBasicMaterial({
      map: elonTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create a plane for Elon
    const elonGeometry = new THREE.PlaneGeometry(3, 3);
    const elonMesh = new THREE.Mesh(elonGeometry, elonMaterial);
    
    // Add to group
    this.model.add(elonMesh);
    
    // Create blood red portal inside Elon’s mansion
    const portalGeometry = new THREE.RingGeometry(2.5, 3, 32);
    const portalMaterial = new THREE.MeshBasicMaterial({
      color: 0x8B0000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const portalMesh = new THREE.Mesh(portalGeometry, portalMaterial);
    // Rotate so the ring is vertical
    portalMesh.rotation.x = Math.PI / 2;
    // Position the portal relative to Elon's model (adjust the offset as desired)
    portalMesh.position.set(5, 2, 0);
    this.model.add(portalMesh);
    // Store reference for later use in the update loop
    this.portal = portalMesh;
    
    // Create chat message
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message elon-chat';
    this.chatMessage.style.backgroundColor = 'rgba(0, 162, 232, 0.8)';
    this.chatMessage.style.color = 'white';
    this.chatMessage.style.fontWeight = 'bold';
    this.chatMessage.style.fontSize = '16px';
    this.chatMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(this.chatMessage);
    
    // Place Elon in his mansion
    this.model.position.copy(this.position);
    this.model.position.y = 1.5;
    
    // Add to scene
    this.scene.add(this.model);
    
    // Create game over overlay for when puppies catch player
    this.gameOverOverlay = document.createElement('div');
    this.gameOverOverlay.style.position = 'fixed';
    this.gameOverOverlay.style.top = '0';
    this.gameOverOverlay.style.left = '0';
    this.gameOverOverlay.style.width = '100%';
    this.gameOverOverlay.style.height = '100%';
    this.gameOverOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.gameOverOverlay.style.color = 'white';
    this.gameOverOverlay.style.display = 'flex';
    this.gameOverOverlay.style.justifyContent = 'center';
    this.gameOverOverlay.style.alignItems = 'center';
    this.gameOverOverlay.style.fontSize = '48px';
    this.gameOverOverlay.style.fontWeight = 'bold';
    this.gameOverOverlay.style.zIndex = '9999';
    this.gameOverOverlay.style.display = 'none';
    this.gameOverOverlay.textContent = "GAME OVER! ELON'S PUPPIES GOT YOU!";
    
    const restartButton = document.createElement('button');
    restartButton.style.position = 'absolute';
    restartButton.style.bottom = '30%';
    restartButton.style.padding = '15px 30px';
    restartButton.style.fontSize = '24px';
    restartButton.style.backgroundColor = 'white';
    restartButton.style.color = 'black';
    restartButton.style.border = 'none';
    restartButton.style.borderRadius = '10px';
    restartButton.style.cursor = 'pointer';
    restartButton.textContent = 'Restart Game';
    restartButton.addEventListener('click', () => window.location.reload());
    
    this.gameOverOverlay.appendChild(restartButton);
    document.body.appendChild(this.gameOverOverlay);
  }
  
  update(camera, renderer, deltaTime) {
    if (!this.model || !this.playerModel) return;
    
    // Check if player has gun and is not already running
    if (window.gun && window.gun.playerHasGun && !this.isRunning && !this.isAngry) {
      this.runAway();
    }
    
    // If running away from player with gun
    if (this.isRunning) {
      // Run away from player
      const direction = new THREE.Vector3();
      direction.subVectors(this.model.position, this.playerModel.position);
      direction.y = 0;
      
      if (direction.length() > 0) {
        direction.normalize();
        direction.multiplyScalar(this.moveSpeed * 3); // Run faster
        this.model.position.add(direction);
      }
      
      // If got away far enough, stop running
      const distanceToPlayer = this.model.position.distanceTo(this.playerModel.position);
      if (distanceToPlayer > 50) {
        this.isRunning = false;
      }
    }
    
    // Check if player is inside the mansion (near Elon)
    const distanceToPlayer = this.model.position.distanceTo(this.playerModel.position);
    const isPlayerInMansion = distanceToPlayer < 20;
    
    // Elon always faces the camera (billboard effect)
    const elonPlane = this.model.children[0];
    if (elonPlane) {
      elonPlane.quaternion.copy(camera.quaternion);
    }
    
    // Say phrases occasionally when player is nearby
    const now = Date.now();
    if (isPlayerInMansion && now - this.lastPhraseTime > this.phraseInterval) {
      this.sayPhrase();
      this.lastPhraseTime = now;
      this.phraseInterval = this.isAngry ? 3000 : (5000 + Math.random() * 5000);
    }
    
    if (this.isFighting && this.opponent) {
      // Move toward opponent during fight
      const direction = new THREE.Vector3();
      direction.subVectors(this.opponent.model.position, this.model.position);
      direction.y = 0;
      
      // Normalize and scale
      if (direction.length() > 2) {
        direction.normalize();
        direction.multiplyScalar(this.moveSpeed * 3); // Move faster during fight
        this.model.position.add(direction);
      }
      
      // Make larger during fight
      this.model.scale.set(1.5, 1.5, 1.5);
      
      // Say fighting phrases
      if (Math.random() > 0.98) { // Occasional fighting phrases
        const fightPhrases = [
          "YOU'LL NEVER DEFEAT ME!",
          "I'LL SEND YOU BACK TO THE ASYLUM!",
          "MY TECHNOLOGY WILL CRUSH YOU!",
          "SECURITY! GET HIM!",
          "YOU ARE NO MATCH FOR ME!"
        ];
        
        this.chatMessage.textContent = fightPhrases[Math.floor(Math.random() * fightPhrases.length)];
        this.chatMessage.style.display = 'block';
      }
    }
    
    // Update mini puppies if any exist
    for (let i = this.miniPuppies.length - 1; i >= 0; i--) {
      this.miniPuppies[i].update(camera, renderer, deltaTime);
    }
    
    // Update chat message position
    if (this.chatMessage) {
      const screenPosition = this.getScreenPosition(this.model.position, camera, renderer);
      if (screenPosition && screenPosition.visible) {
        this.chatMessage.style.left = `${screenPosition.x}px`;
        this.chatMessage.style.top = `${screenPosition.y - 50}px`;
      } else {
        this.chatMessage.style.display = 'none';
      }
    }
    
    this.updateBabyFronk(camera, renderer, deltaTime);
    
    // Check if the player enters the blood red portal
    if (this.portal && this.playerModel && !this.portalTriggered) {
      const portalWorldPos = new THREE.Vector3();
      this.portal.getWorldPosition(portalWorldPos);
      const distanceToPortal = this.playerModel.position.distanceTo(portalWorldPos);
      if (distanceToPortal < 2) {
        this.triggerPortalSequence();
        this.portalTriggered = true;
      }
    }
  }
  
  triggerRobbery() {
    if (this.isAngry) return; // Already angry
    
    // Check if player is close to Elon/mansion
    const distanceToPlayer = this.model.position.distanceTo(this.playerModel.position);
    if (distanceToPlayer > 20) {
      // Player is too far away - no effect
      return;
    }
    
    // Trigger angry mode
    this.isAngry = true;
    this.model.scale.set(1.5, 1.5, 1.5); // Make Elon bigger when angry
    
    // Say angry phrase
    this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    this.sayPhrase();
    
    // Release mini puppies
    this.releaseThePuppies();
    
    // Broadcast to all players
    if (window.room) {
      window.room.send({
        type: "npc_event",
        event: "elon_robbery",
        initiator: window.room.peers[window.room.clientId]?.username || "A player"
      });
    }
  }
  
  releaseThePuppies() {
    // Start releasing puppies at regular intervals
    this.puppyReleaseInterval = setInterval(() => {
      if (this.puppiesReleased < this.maxPuppies) {
        this.createMiniPuppie();
        this.puppiesReleased++;
      } else {
        clearInterval(this.puppyReleaseInterval);
      }
    }, 1000); // Release a puppie every second
  }
  
  startFighting(opponent) {
    this.isFighting = true;
    this.opponent = opponent;
    
    // Say angry phrase
    this.chatMessage.textContent = "HOW DARE YOU ATTACK MY MANSION! MY SECURITY WILL DESTROY YOU!";
    this.chatMessage.style.display = 'block';
    this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    
    // Release all puppies at once during fight
    this.releaseAllPuppies();
  }
  
  releaseAllPuppies() {
    // Stop any existing release timer
    clearInterval(this.puppyReleaseInterval);
    
    // Release many puppies quickly
    for (let i = 0; i < this.maxPuppies; i++) {
      setTimeout(() => {
        this.createMiniPuppie();
      }, i * 200); // Spawn a puppy every 0.2 seconds
    }
  }
  
  createMiniPuppie() {
    // Generate position around Elon
    const angle = Math.random() * Math.PI * 2;
    const distance = 2 + Math.random() * 3;
    const puppiePosition = new THREE.Vector3(
      this.model.position.x + Math.cos(angle) * distance,
      0.5,
      this.model.position.z + Math.sin(angle) * distance
    );
    
    // Create new mini puppie
    const miniPuppie = new MiniPuppie(this.scene, puppiePosition, this.playerModel, this);
    this.miniPuppies.push(miniPuppie);
  }
  
  puppieHitPlayer() {
    // Only trigger game over once
    if (this.gameOverOverlay.style.display === 'flex') return;
    
    // Show game over screen
    this.gameOverOverlay.style.display = 'flex';
    
    // Stop player movement
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    
    // Stop releasing puppies
    clearInterval(this.puppyReleaseInterval);
  }
  
  sayPhrase() {
    const phrases = this.isAngry ? this.angryPhrases : this.phrases;
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    this.chatMessage.textContent = phrase;
    this.chatMessage.style.display = 'block';
    
    // Hide after 4 seconds
    setTimeout(() => {
      if (this.chatMessage) {
        this.chatMessage.style.display = 'none';
      }
    }, 4000);
  }
  
  getScreenPosition(position, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = renderer.domElement.width / 2;
    const heightHalf = renderer.domElement.height / 2;
    
    vector.copy(position);
    vector.y += 1.5;
    
    vector.project(camera);
    
    const isInFront = vector.z < 1;
    
    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf,
      visible: isInFront
    };
  }
  
  runAway() {
    this.isRunning = true;
    this.chatMessage.textContent = "HE'S GOT A GUN! RUN!";
    this.chatMessage.style.display = 'block';
    this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
  }
  
  playerShotNPC() {
    this.isAngry = true;
    this.isRunning = false;
    
    // Elon teleports to player
    this.model.position.set(
      this.playerModel.position.x + 2,
      this.playerModel.position.y,
      this.playerModel.position.z + 2
    );
    
    // Show angry message
    this.chatMessage.textContent = "HOW DARE YOU! NOBODY SHOOTS MY FRIENDS!";
    this.chatMessage.style.display = 'block';
    this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    
    // Make Elon bigger
    this.model.scale.set(3, 3, 3);
    
    // Defeat player after a short delay
    setTimeout(() => {
      this.puppieHitPlayer();
    }, 2000);
  }
  
  createBabyFronk() {
    const textureLoader = new THREE.TextureLoader();
    const babyFronkTexture = textureLoader.load('babyfronk.png');
    const geometry = new THREE.PlaneGeometry(0.8, 0.8);
    const material = new THREE.MeshBasicMaterial({
      map: babyFronkTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const babyFronk = new THREE.Mesh(geometry, material);
    babyFronk.castShadow = true;
    
    // Position baby fronk inside the mansion relative to Elon's model
    if (this.model) {
      const elonPos = this.model.position.clone();
      babyFronk.position.set(elonPos.x + 2, elonPos.y + 0.5, elonPos.z + 0.5);
    } else {
      babyFronk.position.copy(this.position);
      babyFronk.position.y += 0.5;
    }
    
    this.scene.add(babyFronk);
    this.babyFronk = babyFronk;
  }
  
  updateBabyFronk(camera, renderer, deltaTime) {
    if (this.babyFronk && this.playerModel) {
      const distance = this.babyFronk.position.distanceTo(this.playerModel.position);
      if (distance < 1.5) {
        // When player is close enough, remove baby fronk and set global flag
        this.scene.remove(this.babyFronk);
        this.babyFronk = null;
        window.babyFronk = true;
        const notification = document.createElement('div');
        notification.textContent = "You picked up baby fronk!";
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        document.body.appendChild(notification);
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }
    }
  }
  
  triggerPortalSequence() {
    // Freeze game by disabling player controls
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    // Create BSOD overlay
    const bsodOverlay = document.createElement('div');
    bsodOverlay.id = 'bsod-overlay';
    bsodOverlay.style.position = 'fixed';
    bsodOverlay.style.top = '0';
    bsodOverlay.style.left = '0';
    bsodOverlay.style.width = '100%';
    bsodOverlay.style.height = '100%';
    bsodOverlay.style.backgroundColor = '#0000AA';
    bsodOverlay.style.color = 'white';
    bsodOverlay.style.fontFamily = 'Consolas, monospace';
    bsodOverlay.style.fontSize = '24px';
    bsodOverlay.style.display = 'flex';
    bsodOverlay.style.flexDirection = 'column';
    bsodOverlay.style.justifyContent = 'center';
    bsodOverlay.style.alignItems = 'center';
    bsodOverlay.style.zIndex = '20000';
    bsodOverlay.innerHTML = `
      <p>A problem has been detected and your game has been shut down.</p>
      <p>If this is the first time you’ve seen this stop error screen, restart your game.</p>
      <p>Press any key to continue...</p>
    `;
    document.body.appendChild(bsodOverlay);
    
    const endBsod = () => {
      document.body.removeChild(bsodOverlay);
      document.removeEventListener('keydown', endBsod);
      this.showWakingUpSequence();
    };
    document.addEventListener('keydown', endBsod);
  }

  showWakingUpSequence() {
    // Create a "waking up" overlay
    const wakeOverlay = document.createElement('div');
    wakeOverlay.id = 'wake-overlay';
    wakeOverlay.style.position = 'fixed';
    wakeOverlay.style.top = '0';
    wakeOverlay.style.left = '0';
    wakeOverlay.style.width = '100%';
    wakeOverlay.style.height = '100%';
    wakeOverlay.style.backgroundColor = '#000000';
    wakeOverlay.style.color = 'white';
    wakeOverlay.style.fontFamily = 'Arial, sans-serif';
    wakeOverlay.style.fontSize = '32px';
    wakeOverlay.style.display = 'flex';
    wakeOverlay.style.flexDirection = 'column';
    wakeOverlay.style.justifyContent = 'center';
    wakeOverlay.style.alignItems = 'center';
    wakeOverlay.style.zIndex = '20000';
    wakeOverlay.innerHTML = `
      <p>You wake up in your room...</p>
      <p>It was all just a dream...</p>
      <p>Press any key to open your eyes...</p>
    `;
    document.body.appendChild(wakeOverlay);
    
    const openEyes = () => {
      document.body.removeChild(wakeOverlay);
      document.removeEventListener('keydown', openEyes);
      this.showPuppieGameOver();
    };
    document.addEventListener('keydown', openEyes);
  }

  showPuppieGameOver() {
    // Show an overlay where the player sees Puppie staring at them
    const puppieOverlay = document.createElement('div');
    puppieOverlay.id = 'puppie-overlay';
    puppieOverlay.style.position = 'fixed';
    puppieOverlay.style.top = '0';
    puppieOverlay.style.left = '0';
    puppieOverlay.style.width = '100%';
    puppieOverlay.style.height = '100%';
    puppieOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    puppieOverlay.style.display = 'flex';
    puppieOverlay.style.flexDirection = 'column';
    puppieOverlay.style.justifyContent = 'center';
    puppieOverlay.style.alignItems = 'center';
    puppieOverlay.style.zIndex = '20000';
    puppieOverlay.innerHTML = `<p style="font-size:36px; color:white;">You open your eyes and see PUPPIE STARING AT YOU...</p>`;
    document.body.appendChild(puppieOverlay);
    
    setTimeout(() => {
      document.body.removeChild(puppieOverlay);
      this.showFinalGameOver();
    }, 3000);
  }

  showFinalGameOver() {
    // Final game over screen with the specified title text
    const gameOverOverlay = document.createElement('div');
    gameOverOverlay.id = 'gameover-portal';
    gameOverOverlay.style.position = 'fixed';
    gameOverOverlay.style.top = '0';
    gameOverOverlay.style.left = '0';
    gameOverOverlay.style.width = '100%';
    gameOverOverlay.style.height = '100%';
    gameOverOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    gameOverOverlay.style.display = 'flex';
    gameOverOverlay.style.flexDirection = 'column';
    gameOverOverlay.style.justifyContent = 'center';
    gameOverOverlay.style.alignItems = 'center';
    gameOverOverlay.style.zIndex = '30000';
    gameOverOverlay.innerHTML = `
       <h1 style="font-size:48px; margin-bottom:20px;">
         🏱︎🕆︎🏱︎🏱︎✋︎☜︎ ☼︎🕆︎☹︎☜︎💧︎<br>
         🏱︎🕆︎🏱︎🏱︎✋︎☜︎ ☼︎🕆︎☹︎☜︎💧︎<br>
         🏱︎🕆︎🏱︎🏱︎✋︎☜︎ ☼︎🕆︎☹︎☜︎💧︎<br>
         🏱︎🕆︎🏱︎🏱︎✋︎☜︎ ☼︎🕆︎☹︎☜︎💧︎<br>
         🏱︎🕆︎🏱︎🏱︎✋︎☜︎ ☼︎🕆︎☹︎☜︎💧︎
       </h1>
       <button id="restart-game-portal" style="padding:15px 30px; font-size:24px; cursor:pointer; border:none; border-radius:10px;">
         Restart Game
       </button>
    `;
    document.body.appendChild(gameOverOverlay);
    
    document.getElementById('restart-game-portal').addEventListener('click', () => {
      window.location.reload();
    });
  }
}