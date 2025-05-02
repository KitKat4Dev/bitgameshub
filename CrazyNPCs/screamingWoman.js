import * as THREE from 'three';

export class ScreamingWoman {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.screams = [
      "AAAAAAAAAAAH!",
      "EEEEEEEEEEK!",
      "OH MY GOOOOOD!",
      "STAY AWAAAAY!",
      "HEEEEELP MEEE!",
      "AAAAAAAAAAAAHHH!",
      "NOOOOOOOOO!"
    ];
    this.lastScreamTime = 0;
    this.screamInterval = 2000 + Math.random() * 3000; // 2-5 seconds between screams
    this.moveSpeed = 0.08;
    this.jumpSpeed = 0.2;
    this.position = new THREE.Vector3(15, 0, 15);
    this.velocity = new THREE.Vector3();
    this.isJumping = false;
    this.targetTree = null;
    this.onTree = false;
    this.treeJumpCooldown = 0;
    this.minPlayerDistance = 10; // Minimum distance to keep from player
    this.screamMessage = null;
    this.trees = [];
    this.calmed = false; // Track if woman has been calmed
    this.calmPrompt = null; // Reference to calm prompt
    
    this.createModel();
    this.findTrees();
  }
  
  createModel() {
    // Create woman group
    this.model = new THREE.Group();
    
    // Create body (similar to player but different color and slightly taller)
    const bodyGeometry = new THREE.BoxGeometry(0.6 * 0.7, 1.6 * 0.7, 0.3 * 0.7);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFF69B4 }); // Hot pink
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.2 * 0.7;
    body.castShadow = true;
    this.model.add(body);
    
    // Add hair (as a box on top of head)
    const hairGeometry = new THREE.BoxGeometry(0.65 * 0.7, 0.3 * 0.7, 0.4 * 0.7);
    const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black hair
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 1.9 * 0.7;
    this.model.add(hair);
    
    // Add eyes
    const eyeGeometry = new THREE.SphereGeometry(0.08 * 0.7, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const eyePupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    // Left eye
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15 * 0.7, 1.6 * 0.7, 0.15 * 0.7);
    this.model.add(leftEye);
    
    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.04 * 0.7, 8, 8), eyePupilMaterial);
    leftPupil.position.set(0, 0, 0.05 * 0.7);
    leftEye.add(leftPupil);
    
    // Right eye
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15 * 0.7, 1.6 * 0.7, 0.15 * 0.7);
    this.model.add(rightEye);
    
    const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.04 * 0.7, 8, 8), eyePupilMaterial);
    rightPupil.position.set(0, 0, 0.05 * 0.7);
    rightEye.add(rightPupil);
    
    // Add mouth - wide open for screaming
    const mouthGeometry = new THREE.SphereGeometry(0.1 * 0.7, 8, 8);
    const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 1.4 * 0.7, 0.15 * 0.7);
    mouth.scale.set(1, 1.5, 1); // Elongate to make it oval
    this.model.add(mouth);
    
    // Add legs
    const legGeometry = new THREE.BoxGeometry(0.2 * 0.7, 0.7 * 0.7, 0.2 * 0.7);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0xFF69B4 });
    
    // Left leg
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2 * 0.7, 0.6 * 0.7, 0);
    leftLeg.geometry.translate(0, -0.35 * 0.7, 0);
    leftLeg.name = "leftLeg";
    this.model.add(leftLeg);
    
    // Right leg
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2 * 0.7, 0.6 * 0.7, 0);
    rightLeg.geometry.translate(0, -0.35 * 0.7, 0);
    rightLeg.name = "rightLeg";
    this.model.add(rightLeg);
    
    // Create scream message element
    this.screamMessage = document.createElement('div');
    this.screamMessage.className = 'chat-message scream-message';
    this.screamMessage.style.backgroundColor = 'rgba(255, 105, 180, 0.7)';
    this.screamMessage.style.color = 'white';
    this.screamMessage.style.fontWeight = 'bold';
    this.screamMessage.style.fontSize = '20px';
    this.screamMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(this.screamMessage);
    
    // Set initial position
    this.model.position.copy(this.position);
    this.model.position.y = 0.5;
    
    // Add to scene
    this.scene.add(this.model);
  }
  
  findTrees() {
    // Find all tree objects in the scene
    this.scene.traverse((object) => {
      if (object.userData && object.userData.isTree) {
        this.trees.push(object);
      }
    });
    
    // Find an initial target tree
    this.findNewTargetTree();
  }
  
  findNewTargetTree() {
    if (this.trees.length === 0) return;
    
    // Find a different tree than the current one
    let newTree;
    let attempts = 0;
    
    do {
      const randomIndex = Math.floor(Math.random() * this.trees.length);
      newTree = this.trees[randomIndex];
      attempts++;
    } while (newTree === this.targetTree && attempts < 10);
    
    this.targetTree = newTree;
  }
  
  update(camera, renderer, deltaTime) {
    if (!this.model || !this.playerModel || this.trees.length === 0) return;
    
    // Skip updates if woman has been calmed
    if (this.calmed) {
      this.updateChatMessage(camera, renderer);
      return;
    }
    
    // Decrement tree jump cooldown
    if (this.treeJumpCooldown > 0) {
      this.treeJumpCooldown -= deltaTime;
    }
    
    // Get direction to player to run away from
    const playerDirection = new THREE.Vector3();
    playerDirection.subVectors(this.playerModel.position, this.model.position);
    playerDirection.y = 0; // Keep on same height
    const distanceToPlayer = playerDirection.length();
    
    // If player gets too close when on a tree, scream immediately
    if (distanceToPlayer < 8 && this.onTree) {
      this.scream();
    }
    
    // Show calm prompt when player is close enough
    if (distanceToPlayer < 10 && !this.calmPrompt) {
      this.showCalmPrompt();
    } else if (distanceToPlayer >= 10 && this.calmPrompt) {
      this.hideCalmPrompt();
    }
    
    // Move logic
    if (this.onTree) {
      // On a tree - stay there for a while, then jump to another
      if (this.treeJumpCooldown <= 0) {
        this.findNewTargetTree();
        this.isJumping = true;
        this.onTree = false;
        this.treeJumpCooldown = 5000 + Math.random() * 5000; // 5-10 seconds on tree
        
        // Jump off tree with velocity
        this.velocity.y = this.jumpSpeed;
        
        // Scream while jumping
        this.scream();
      }
    } else if (this.isJumping) {
      // Apply gravity
      this.velocity.y -= 0.01;
      
      // Move towards target tree
      const treeDirection = new THREE.Vector3();
      treeDirection.subVectors(this.targetTree.position, this.model.position);
      treeDirection.y = 0; // Keep horizontal movement separate
      
      if (treeDirection.length() > 0.5) {
        treeDirection.normalize();
        treeDirection.multiplyScalar(this.moveSpeed * 1.5); // Faster when jumping between trees
        
        this.model.position.x += treeDirection.x;
        this.model.position.z += treeDirection.z;
      }
      
      // Update vertical position
      this.model.position.y += this.velocity.y;
      
      // Check if landing on target tree
      const distanceToTree = new THREE.Vector3().subVectors(
        this.targetTree.position, 
        this.model.position
      ).length();
      
      if (distanceToTree < 2 && this.model.position.y < this.targetTree.position.y + 5) {
        // Land on tree
        this.model.position.y = this.targetTree.position.y + 5; // Position on top of tree
        this.velocity.y = 0;
        this.isJumping = false;
        this.onTree = true;
        this.treeJumpCooldown = 3000 + Math.random() * 3000; // 3-6 seconds until next jump
        
        // Scream when landing on a tree
        this.scream();
      }
      
      // Check if hitting ground
      if (this.model.position.y <= 0.5) {
        this.model.position.y = 0.5;
        this.velocity.y = 0;
        this.isJumping = false;
      }
    } else {
      // On ground - run away from player and toward nearest tree
      let moveDirection = new THREE.Vector3();
      
      // If player is close, run away
      if (distanceToPlayer < this.minPlayerDistance) {
        moveDirection.copy(playerDirection).negate(); // Move away from player
      }
      
      // Add component towards nearest tree
      const treeDirection = new THREE.Vector3();
      treeDirection.subVectors(this.targetTree.position, this.model.position);
      treeDirection.normalize();
      
      // Combine directions (70% towards tree, 30% away from player)
      moveDirection.add(treeDirection.multiplyScalar(2));
      moveDirection.normalize();
      moveDirection.multiplyScalar(this.moveSpeed);
      
      // Update position
      this.model.position.add(moveDirection);
      
      // Check if close enough to tree to jump
      const distanceToTree = new THREE.Vector3().subVectors(
        this.targetTree.position, 
        this.model.position
      ).length();
      
      if (distanceToTree < 2) {
        // Start jumping up to the tree
        this.isJumping = true;
        this.velocity.y = this.jumpSpeed;
        
        // Scream while jumping
        this.scream();
      }
    }
    
    // Animate legs when moving horizontally
    if (!this.onTree) {
      const leftLeg = this.model.getObjectByName("leftLeg");
      const rightLeg = this.model.getObjectByName("rightLeg");
      
      if (leftLeg && rightLeg) {
        const walkSpeed = 10; // Fast leg movement
        const walkAmplitude = 0.5; // Exaggerated leg motion
        leftLeg.rotation.x = Math.sin(performance.now() * 0.01 * walkSpeed) * walkAmplitude;
        rightLeg.rotation.x = Math.sin(performance.now() * 0.01 * walkSpeed + Math.PI) * walkAmplitude;
      }
    } else {
      // Reset legs when on tree
      const leftLeg = this.model.getObjectByName("leftLeg");
      const rightLeg = this.model.getObjectByName("rightLeg");
      
      if (leftLeg && rightLeg) {
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
      }
    }
    
    // Make model face movement direction
    if (Math.abs(this.velocity.x) > 0.01 || Math.abs(this.velocity.z) > 0.01) {
      const angle = Math.atan2(this.velocity.x, this.velocity.z);
      this.model.rotation.y = angle;
    }
    
    // Say random screams occasionally
    const now = Date.now();
    if (now - this.lastScreamTime > this.screamInterval) {
      this.scream();
      this.lastScreamTime = now;
      this.screamInterval = 2000 + Math.random() * 3000;
    }
    
    // Update scream message position
    if (this.screamMessage) {
      const screenPosition = this.getScreenPosition(this.model.position, camera, renderer);
      if (screenPosition && screenPosition.visible) {
        this.screamMessage.style.left = `${screenPosition.x}px`;
        this.screamMessage.style.top = `${screenPosition.y - 45}px`;
      } else {
        this.screamMessage.style.display = 'none';
      }
    }
  }
  
  scream() {
    const scream = this.screams[Math.floor(Math.random() * this.screams.length)];
    
    this.screamMessage.textContent = scream;
    this.screamMessage.style.display = 'block';
    
    // Hide message after 2 seconds
    setTimeout(() => {
      if (this.screamMessage) {
        this.screamMessage.style.display = 'none';
      }
    }, 2000);
  }
  
  getScreenPosition(position, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = renderer.domElement.width / 2;
    const heightHalf = renderer.domElement.height / 2;
    
    // Get position with height offset
    vector.copy(position);
    vector.y += 2.0; // Position above the model's head
    
    // Project to screen space
    vector.project(camera);
    
    // Check if in front of camera
    const isInFront = vector.z < 1;
    
    // Convert to screen coordinates
    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf,
      visible: isInFront
    };
  }
  
  showCalmPrompt() {
    this.calmPrompt = document.createElement('div');
    this.calmPrompt.style.position = 'fixed';
    this.calmPrompt.style.bottom = '30%';
    this.calmPrompt.style.left = '50%';
    this.calmPrompt.style.transform = 'translateX(-50%)';
    this.calmPrompt.style.backgroundColor = 'rgba(255, 105, 180, 0.7)';
    this.calmPrompt.style.color = 'white';
    this.calmPrompt.style.padding = '15px 20px';
    this.calmPrompt.style.borderRadius = '5px';
    this.calmPrompt.style.zIndex = '1000';
    document.body.appendChild(this.calmPrompt);
    
    // Add keyboard listener for G key
    this.calmKeyListener = (e) => {
      if (e.key.toLowerCase() === 'g') {
        this.givePhoneToWoman();
      }
    };
    
    document.addEventListener('keydown', this.calmKeyListener);
    
    this.calmPrompt.textContent = 'Press G to give Samsung Galaxy S24 Ultra';
    this.calmPrompt.style.display = 'block';
  }
  
  hideCalmPrompt() {
    if (this.calmPrompt) {
      document.body.removeChild(this.calmPrompt);
      this.calmPrompt = null;
      document.removeEventListener('keydown', this.calmKeyListener);
    }
  }
  
  givePhoneToWoman() {
    // Hide prompt
    this.hideCalmPrompt();
    
    // Show phone image
    const phoneImage = document.createElement('div');
    phoneImage.style.position = 'fixed';
    phoneImage.style.top = '50%';
    phoneImage.style.left = '50%';
    phoneImage.style.transform = 'translate(-50%, -50%)';
    phoneImage.style.width = '200px';
    phoneImage.style.height = '400px';
    phoneImage.style.backgroundImage = 'url("IMG_1009.png")';
    phoneImage.style.backgroundSize = 'contain';
    phoneImage.style.backgroundRepeat = 'no-repeat';
    phoneImage.style.backgroundPosition = 'center';
    phoneImage.style.zIndex = '9999';
    document.body.appendChild(phoneImage);
    
    // Remove after 2 seconds
    setTimeout(() => {
      document.body.removeChild(phoneImage);
      this.calmWoman();
    }, 2000);
  }
  
  calmWoman() {
    this.calmed = true;
    
    // Change appearance
    this.model.position.y = 0.5; // Make sure she's on the ground
    this.velocity.y = 0;
    this.isJumping = false;
    this.onTree = false;
    
    // Display thank you message
    this.screamMessage.textContent = "OMG THANK YOU! This is exactly what I needed!";
    this.screamMessage.style.display = 'block';
    this.screamMessage.style.backgroundColor = 'rgba(255, 192, 203, 0.8)';
    this.screamMessage.style.color = 'black';
    
    // Give player reward
    if (window.shop) {
      window.shop.coins += 100;
      window.shop.updateCoinCounter();
    }
    
    // Show notification
    this.showNotification("You calmed the screaming woman! Received 100 coins as reward.", 5000);
    
    // Complete quest if active
    if (window.questSystem) {
      const questsToComplete = window.questSystem.activeQuests.filter(q => 
        q.target === 'screamingWoman' && !q.completed);
      
      questsToComplete.forEach(quest => {
        window.questSystem.completeQuest(quest);
      });
    }
    
    // Broadcast to all players
    if (window.room) {
      window.room.send({
        type: "npc_event",
        event: "screaming_woman_calmed",
        initiator: window.room.peers[window.room.clientId]?.username || "A player"
      });
    }
    
    // Change her chat message every 10 seconds to show she's happy now
    setInterval(() => {
      const happyPhrases = [
        "This phone is amazing!",
        "I love the camera on this!",
        "The battery life is incredible!",
        "Thank you again for the S24 Ultra!",
        "I'm never letting go of this phone!",
        "No more screaming for me!"
      ];
      
      this.screamMessage.textContent = happyPhrases[Math.floor(Math.random() * happyPhrases.length)];
      this.screamMessage.style.display = 'block';
      
      setTimeout(() => {
        if (this.screamMessage) {
          this.screamMessage.style.display = 'none';
        }
      }, 4000);
    }, 10000);
  }
  
  showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(255, 192, 203, 0.8)';
    notification.style.color = 'black';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, duration);
  }
  
  updateChatMessage(camera, renderer) {
    const screenPosition = this.getScreenPosition(this.model.position, camera, renderer);
    if (screenPosition && screenPosition.visible) {
      this.screamMessage.style.left = `${screenPosition.x}px`;
      this.screamMessage.style.top = `${screenPosition.y - 45}px`;
    } else {
      this.screamMessage.style.display = 'none';
    }
  }
}