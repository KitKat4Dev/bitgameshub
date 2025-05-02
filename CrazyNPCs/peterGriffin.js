import * as THREE from 'three';

export class PeterGriffin {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.phrases = [
      "Hey there, hehehehehe",
      "Holy crap, this is worse than that time I was in a 3D game!",
      "Whoa, this reminds me of that time I met Mario!",
      "Oh geez, I should really be at the Drunken Clam right now",
      "Lois is gonna kill me if I don't get home soon",
      "Hehehe, hey look, I'm following ya!",
      "Boy, this is even weirder than that time I fought a giant chicken"
    ];
    this.angryPhrases = [
      "OH YOU'RE GONNA REGRET THAT!",
      "NOBODY SAYS THEY HATE PETER GRIFFIN!",
      "PREPARE TO FACE THE WRATH OF THE MIGHTY GRIFFIN!",
      "I'M GONNA DO TO YOU WHAT I DID TO THAT CHICKEN!",
      "THIS IS GONNA HURT ME MORE THAN IT'S GONNA HURT YOU... ACTUALLY, NO IT WON'T!"
    ];
    this.lastPhraseTime = 0;
    this.phraseInterval = 8000 + Math.random() * 5000;
    this.moveSpeed = 0.04;
    this.followDistance = 4; // How far behind player to follow
    this.position = new THREE.Vector3(5, 0, 5);
    this.isAngry = false;
    this.swordAttacking = false;
    this.attackTimer = 0;
    
    this.createModel();
  }
  
  createModel() {
    // Create Peter Griffin group
    this.model = new THREE.Group();
    
    // Load texture for Peter
    const textureLoader = new THREE.TextureLoader();
    const peterTexture = textureLoader.load('Peter_Griffin.png');
    
    // Create material with the texture
    const peterMaterial = new THREE.MeshBasicMaterial({
      map: peterTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create a plane for Peter
    const peterGeometry = new THREE.PlaneGeometry(3, 3);
    const peterMesh = new THREE.Mesh(peterGeometry, peterMaterial);
    
    // Add Peter to group
    this.model.add(peterMesh);
    
    // Create chat message element for Peter
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message peter-chat';
    this.chatMessage.style.backgroundColor = 'rgba(255, 165, 0, 0.8)';
    this.chatMessage.style.color = 'white';
    this.chatMessage.style.fontWeight = 'bold';
    this.chatMessage.style.fontSize = '18px';
    this.chatMessage.style.display = 'none';
    this.chatMessage.style.width = '400px';
    this.chatMessage.style.maxWidth = '400px';
    document.getElementById('game-container').appendChild(this.chatMessage);
    
    // Create sword (hidden initially)
    const swordGroup = new THREE.Group();
    
    const bladeGeometry = new THREE.BoxGeometry(0.1, 2, 0.1);
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC });
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.y = 0.5;
    swordGroup.add(blade);
    
    const guardGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.2);
    const guardMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const guard = new THREE.Mesh(guardGeometry, guardMaterial);
    swordGroup.add(guard);
    
    const handleGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.y = -0.3;
    swordGroup.add(handle);
    
    swordGroup.position.set(1, 0, 0.5);
    swordGroup.visible = false;
    this.model.add(swordGroup);
    this.sword = swordGroup;
    
    // Set initial position
    this.model.position.copy(this.position);
    this.model.position.y = 1.5; // Float above ground
    
    // Create game over overlay
    this.gameOverOverlay = document.createElement('div');
    this.gameOverOverlay.style.position = 'fixed';
    this.gameOverOverlay.style.top = '0';
    this.gameOverOverlay.style.left = '0';
    this.gameOverOverlay.style.width = '100%';
    this.gameOverOverlay.style.height = '100%';
    this.gameOverOverlay.style.backgroundColor = 'rgba(255, 165, 0, 0.7)';
    this.gameOverOverlay.style.color = 'white';
    this.gameOverOverlay.style.display = 'flex';
    this.gameOverOverlay.style.justifyContent = 'center';
    this.gameOverOverlay.style.alignItems = 'center';
    this.gameOverOverlay.style.fontSize = '48px';
    this.gameOverOverlay.style.fontWeight = 'bold';
    this.gameOverOverlay.style.zIndex = '9999';
    this.gameOverOverlay.style.display = 'none';
    this.gameOverOverlay.textContent = 'GAME OVER! PETER DEFEATED YOU!';
    
    const restartButton = document.createElement('button');
    restartButton.style.position = 'absolute';
    restartButton.style.bottom = '30%';
    restartButton.style.padding = '15px 30px';
    restartButton.style.fontSize = '24px';
    restartButton.style.backgroundColor = 'white';
    restartButton.style.color = 'rgb(255, 165, 0)';
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
    
    if (this.isAngry) {
      this.updateAngryBehavior(camera, renderer, deltaTime);
      return;
    }
    
    // Calculate position behind player
    const playerDirection = new THREE.Vector3();
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    
    // Position Peter behind the player
    const targetPosition = new THREE.Vector3();
    targetPosition.copy(this.playerModel.position);
    targetPosition.sub(playerDirection.multiplyScalar(this.followDistance));
    
    // Get direction to target position
    const moveDirection = new THREE.Vector3();
    moveDirection.subVectors(targetPosition, this.model.position);
    moveDirection.y = 0;
    
    // Only move if we're too far from target position
    if (moveDirection.length() > 0.5) {
      moveDirection.normalize();
      moveDirection.multiplyScalar(this.moveSpeed);
      
      // Update position
      this.model.position.add(moveDirection);
      
      // Make Peter face the player
      this.model.lookAt(this.playerModel.position);
    }
    
    // Peter always faces the camera (billboard effect)
    const peterPlane = this.model.children[0];
    if (peterPlane) {
      peterPlane.quaternion.copy(camera.quaternion);
    }
    
    // Bobbing animation
    this.model.position.y = 1.5 + Math.sin(performance.now() * 0.002) * 0.1;
    
    // Say random phrases occasionally
    const now = Date.now();
    if (now - this.lastPhraseTime > this.phraseInterval) {
      this.sayPhrase();
      this.lastPhraseTime = now;
      this.phraseInterval = 8000 + Math.random() * 5000;
    }
    
    this.updateChatMessage(camera, renderer);
  }
  
  updateAngryBehavior(camera, renderer, deltaTime) {
    // Move toward player faster
    const direction = new THREE.Vector3();
    direction.subVectors(this.playerModel.position, this.model.position);
    direction.y = 0;
    
    const distanceToPlayer = direction.length();
    
    if (distanceToPlayer > 1 && !this.swordAttacking) {
      direction.normalize();
      direction.multiplyScalar(this.moveSpeed * 3); // Move faster when angry
      this.model.position.add(direction);
      
      // Make Peter face the player
      this.model.lookAt(this.playerModel.position);
    } else if (!this.swordAttacking) {
      // Start sword attack when close enough
      this.startSwordAttack();
    }
    
    // Update sword position if attacking
    if (this.swordAttacking) {
      this.attackTimer += deltaTime;
      
      // Sword animation
      this.sword.rotation.z = Math.sin(this.attackTimer * 0.01) * Math.PI;
      
      // End attack and trigger game over after enough time
      if (this.attackTimer > 3000) {
        this.triggerGameOver();
      }
    }
    
    // Face the camera (billboard effect)
    const peterPlane = this.model.children[0];
    if (peterPlane) {
      peterPlane.quaternion.copy(camera.quaternion);
    }
    
    this.updateChatMessage(camera, renderer);
  }
  
  updateChatMessage(camera, renderer) {
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
  
  sayPhrase() {
    const phrases = this.isAngry ? this.angryPhrases : this.phrases;
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    this.chatMessage.textContent = phrase;
    this.chatMessage.style.display = 'block';
    
    setTimeout(() => {
      if (this.chatMessage) {
        this.chatMessage.style.display = 'none';
      }
    }, 4000);
  }
  
  getAngry() {
    if (this.isAngry) return;
    
    this.isAngry = true;
    
    // Show sword
    this.sword.visible = true;
    this.model.scale.set(1.5, 1.5, 1.5);
    
    // Change chat message style
    this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    this.chatMessage.style.fontSize = '22px';
    
    // Say angry phrase
    this.sayPhrase();
    
    // Broadcast to all players
    if (window.room) {
      window.room.send({
        type: "npc_event",
        event: "peter_angry",
        initiator: window.room.peers[window.room.clientId]?.username || "A player"
      });
    }
  }
  
  startSwordAttack() {
    this.swordAttacking = true;
    this.attackTimer = 0;
    this.sayPhrase(); // Say an angry phrase
    
    // Move sword into attack position
    this.sword.position.set(1.5, 0, 0.5);
  }
  
  triggerGameOver() {
    // Show game over screen
    this.gameOverOverlay.style.display = 'flex';
    
    // Disable player controls
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
  }
  
  respondToChat(message) {
    if (message.toLowerCase().includes("i hate peter")) {
      this.getAngry();
      return true;
    }
    return false;
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
}