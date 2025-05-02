import * as THREE from 'three';

export class AngryWoman {
  constructor(scene, playerModel, sockPuppet, showSpeedNPC) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.sockPuppet = sockPuppet;
    this.showSpeedNPC = showSpeedNPC;
    this.phrases = [
      "I HATE ALL OF YOU!",
      "GET OUT OF MY WAY!",
      "YOU'RE PATHETIC!",
      "I'M SO ANGRY RIGHT NOW!",
      "DON'T LOOK AT ME!",
      "WHAT ARE YOU STARING AT?!",
      "STOP FOLLOWING ME!"
    ];
    this.hitPhrases = [
      "TAKE THAT!",
      "HOW DO YOU LIKE THAT?!",
      "THAT'S WHAT YOU DESERVE!",
      "HA! TAKE THAT!",
      "I'M NOT DONE WITH YOU YET!"
    ];
    this.defeatedPhrases = [
      "NOOOOOOO!",
      "PUT ME DOWN!",
      "THIS ISN'T FAIR!",
      "I WILL RETURN!",
      "YOU'LL PAY FOR THIS!"
    ];
    this.lastPhraseTime = 0;
    this.phraseInterval = 3000 + Math.random() * 3000; // 3-6 seconds between phrases
    this.moveSpeed = 0.07;
    this.position = new THREE.Vector3(-15, 0, 15);
    this.velocity = new THREE.Vector3();
    this.isSlapping = false;
    this.slapCooldown = 0;
    this.currentTarget = null;
    this.isBeingThrown = false;
    this.throwHeight = 0;
    this.throwDirection = new THREE.Vector3();
    
    this.createModel();
  }
  
  createModel() {
    // Create woman group
    this.model = new THREE.Group();
    
    // Load texture for the angry woman
    const textureLoader = new THREE.TextureLoader();
    const womanTexture = textureLoader.load('download__3_-removebg-preview.png');
    
    // Create material with the texture
    const womanMaterial = new THREE.MeshBasicMaterial({
      map: womanTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create a plane for the woman
    const womanGeometry = new THREE.PlaneGeometry(2, 2);
    const womanMesh = new THREE.Mesh(womanGeometry, womanMaterial);
    
    // Add woman to group
    this.model.add(womanMesh);
    
    // Create chat message element for the woman
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message angry-woman-chat';
    this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    this.chatMessage.style.color = 'white';
    this.chatMessage.style.fontWeight = 'bold';
    this.chatMessage.style.fontSize = '16px';
    this.chatMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(this.chatMessage);
    
    // Set initial position
    this.model.position.copy(this.position);
    this.model.position.y = 1.2; // Float above ground
    
    // Add to scene
    this.scene.add(this.model);
  }
  
  update(camera, renderer, deltaTime) {
    if (!this.model || !this.playerModel) return;
    
    // Skip update if being thrown
    if (this.isBeingThrown) {
      this.updateThrowing(deltaTime);
      this.updateChatMessage(camera, renderer);
      return;
    }
    
    // Decrease slap cooldown
    if (this.slapCooldown > 0) {
      this.slapCooldown -= deltaTime;
      if (this.slapCooldown <= 0) {
        this.isSlapping = false;
      }
    }
    
    // If not currently slapping, find a target
    if (!this.isSlapping && this.slapCooldown <= 0) {
      // Decide which NPC to slap
      if (this.sockPuppet && this.showSpeedNPC) {
        const distToPuppet = this.model.position.distanceTo(this.sockPuppet.puppet.position);
        const distToSpeed = this.model.position.distanceTo(this.showSpeedNPC.model.position);
        
        // Choose the closest NPC
        if (distToPuppet < distToSpeed && distToPuppet < 8) {
          this.currentTarget = this.sockPuppet.puppet;
          this.targetType = 'puppet';
        } else if (distToSpeed < 8) {
          this.currentTarget = this.showSpeedNPC.model;
          this.targetType = 'speed';
        } else {
          // If neither is close, move toward player
          this.currentTarget = this.playerModel;
          this.targetType = 'player';
        }
      }
    }
    
    // Move toward current target
    if (this.currentTarget) {
      const targetPosition = this.currentTarget.position.clone();
      const direction = new THREE.Vector3();
      direction.subVectors(targetPosition, this.model.position);
      direction.y = 0; // Keep on same height
      
      const distanceToTarget = direction.length();
      
      if (distanceToTarget > 1.5) {
        // Move toward target
        direction.normalize();
        direction.multiplyScalar(this.moveSpeed);
        this.model.position.add(direction);
        
        // Face direction of movement
        if (direction.length() > 0) {
          this.model.lookAt(targetPosition);
        }
      } else if (!this.isSlapping && this.targetType !== 'player') {
        // Close enough to slap
        this.slap();
      }
    }
    
    // Make model face the camera (billboard effect)
    const womanPlane = this.model.children[0];
    if (womanPlane) {
      womanPlane.quaternion.copy(camera.quaternion);
    }
    
    // Bobbing animation
    this.model.position.y = 1.2 + Math.sin(performance.now() * 0.003) * 0.1;
    
    // Say random phrases occasionally
    const now = Date.now();
    if (now - this.lastPhraseTime > this.phraseInterval) {
      this.sayPhrase();
      this.lastPhraseTime = now;
      this.phraseInterval = 3000 + Math.random() * 3000;
    }
    
    this.updateChatMessage(camera, renderer);
  }
  
  updateChatMessage(camera, renderer) {
    // Update chat message position
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
  
  slap() {
    this.isSlapping = true;
    this.slapCooldown = 3000; // 3 seconds until next slap
    
    // Say slap phrase
    const phrase = this.hitPhrases[Math.floor(Math.random() * this.hitPhrases.length)];
    this.chatMessage.textContent = phrase;
    this.chatMessage.style.display = 'block';
    
    // React based on who was slapped
    if (this.targetType === 'puppet') {
      // Puppie gets temporarily smaller when slapped
      if (!this.sockPuppet.isAngry) {
        this.sockPuppet.puppet.scale.set(0.5, 0.5, 0.5);
        setTimeout(() => {
          if (this.sockPuppet && !this.sockPuppet.isAngry) {
            this.sockPuppet.puppet.scale.set(1, 1, 1);
          }
        }, 1000);
        
        // Make puppie say "Ow!" or similar
        if (this.sockPuppet.chatMessage) {
          this.sockPuppet.chatMessage.textContent = "OW! THAT HURT!";
          this.sockPuppet.chatMessage.style.display = 'block';
          setTimeout(() => {
            if (this.sockPuppet.chatMessage) {
              this.sockPuppet.chatMessage.style.display = 'none';
            }
          }, 2000);
        }
      }
    } else if (this.targetType === 'speed') {
      // Speed gets pushed back when slapped
      const pushDirection = new THREE.Vector3().subVectors(
        this.showSpeedNPC.model.position, 
        this.model.position
      ).normalize().multiplyScalar(3);
      
      this.showSpeedNPC.model.position.add(pushDirection);
      
      // Make Speed say an angry response
      if (this.showSpeedNPC.chatMessage) {
        this.showSpeedNPC.chatMessage.textContent = "AYO! WHAT'S YOUR PROBLEM!?";
        this.showSpeedNPC.chatMessage.style.display = 'block';
        setTimeout(() => {
          if (this.showSpeedNPC.chatMessage) {
            this.showSpeedNPC.chatMessage.style.display = 'none';
          }
        }, 2000);
      }
    }
    
    // Hide message after 2 seconds
    setTimeout(() => {
      if (this.chatMessage) {
        this.chatMessage.style.display = 'none';
      }
    }, 2000);
  }
  
  startThrowing() {
    if (this.isBeingThrown) return;
    
    this.isBeingThrown = true;
    this.throwHeight = 0;
    
    // Create a random throw direction (away from center)
    const angle = Math.random() * Math.PI * 2;
    this.throwDirection = new THREE.Vector3(
      Math.cos(angle), 
      0.5, 
      Math.sin(angle)
    ).normalize().multiplyScalar(0.3);
    
    // Say a defeated phrase
    const phrase = this.defeatedPhrases[Math.floor(Math.random() * this.defeatedPhrases.length)];
    this.chatMessage.textContent = phrase;
    this.chatMessage.style.display = 'block';
    
    // Show Puppie and Speed high-fiving or celebrating
    if (this.sockPuppet && this.sockPuppet.chatMessage) {
      this.sockPuppet.chatMessage.textContent = "YEET! GOOD RIDDANCE!";
      this.sockPuppet.chatMessage.style.display = 'block';
      setTimeout(() => {
        if (this.sockPuppet.chatMessage) {
          this.sockPuppet.chatMessage.style.display = 'none';
        }
      }, 3000);
    }
    
    if (this.showSpeedNPC && this.showSpeedNPC.chatMessage) {
      this.showSpeedNPC.chatMessage.textContent = "BYE BYE KAREN! SPEEEEED!";
      this.showSpeedNPC.chatMessage.style.display = 'block';
      setTimeout(() => {
        if (this.showSpeedNPC.chatMessage) {
          this.showSpeedNPC.chatMessage.style.display = 'none';
        }
      }, 3000);
    }
    
    // Remove after 8 seconds of throwing
    setTimeout(() => {
      this.reset();
    }, 8000);
  }
  
  updateThrowing(deltaTime) {
    if (!this.isBeingThrown) return;
    
    // Increase throw height, peak, then start to fall
    this.throwHeight += deltaTime * 0.01;
    
    // Move in throw direction
    this.model.position.add(this.throwDirection);
    
    // Calculate vertical position using a parabola
    const throwProgress = Math.min(this.throwHeight / 10, 1);
    const verticalPosition = 10 * Math.sin(throwProgress * Math.PI);
    this.model.position.y = verticalPosition + 1.2;
    
    // Spin while being thrown
    this.model.rotation.y += 0.05;
  }
  
  reset() {
    // Reset position to a random location
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    this.model.position.x = Math.cos(angle) * distance;
    this.model.position.z = Math.sin(angle) * distance;
    this.model.position.y = 1.2;
    
    // Reset state
    this.isBeingThrown = false;
    this.isSlapping = false;
    this.slapCooldown = 0;
    this.currentTarget = null;
    
    // Reset appearance
    if (this.chatMessage) {
      this.chatMessage.style.display = 'none';
    }
  }
  
  sayPhrase() {
    if (this.isBeingThrown) return;
    
    const phrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
    
    this.chatMessage.textContent = phrase;
    this.chatMessage.style.display = 'block';
    
    // Hide message after 3 seconds
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
    
    // Get position with height offset
    vector.copy(position);
    vector.y += 1.3; // Position above woman's head
    
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