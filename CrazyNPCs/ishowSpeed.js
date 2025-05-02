import * as THREE from 'three';

export class IShowSpeed {
  constructor(scene, playerModel, sockPuppet) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.sockPuppet = sockPuppet;
    this.phrases = [
      "WHAT'S GOOD BRO?", 
      "SIIUUUUUU!", 
      "YO I GOT YOU!", 
      "TALK TO ME!", 
      "SPEEEEEEED!", 
      "I'M SPEED!",
      "SHEESH!",
      "YOU NEED HELP?"
    ];
    this.helpPhrases = [
      "I'LL SAVE YOU BRO!",
      "STAND BACK SOCK!",
      "NOBODY MESSES WITH MY HOMIE!",
      "RUN! I'LL HOLD HIM!",
      "SPEEEEEED TO THE RESCUE!",
      "GET BEHIND ME!"
    ];
    this.lastPhraseTime = 0;
    this.phraseInterval = 5000 + Math.random() * 5000; // 5-10 seconds between phrases
    this.moveSpeed = 0.05;
    this.helpSpeed = 0.15;
    this.position = new THREE.Vector3(-10, 0, -10); // Start opposite from the puppet
    this.chatMessage = null;
    this.isHelping = false;
    this.model = null;
    
    this.createModel();
  }
  
  createModel() {
    // Create Speed group
    this.model = new THREE.Group();
    
    // Load texture for Speed
    const textureLoader = new THREE.TextureLoader();
    const speedTexture = textureLoader.load('1900x1900-000000-80-0-0-removebg-preview.png');
    
    // Create material with the texture
    const speedMaterial = new THREE.MeshBasicMaterial({
      map: speedTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create a plane for Speed
    const speedGeometry = new THREE.PlaneGeometry(2, 2);
    const speedMesh = new THREE.Mesh(speedGeometry, speedMaterial);
    
    // Add to group
    this.model.add(speedMesh);
    
    // Create chat message element for Speed
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message speed-chat';
    this.chatMessage.style.backgroundColor = 'rgba(0, 100, 255, 0.7)';
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
    
    if (this.sockPuppet && this.sockPuppet.isAngry) {
      this.isHelping = true;
    }
    
    let targetPosition;
    
    if (this.isHelping) {
      // Move between player and puppet when helping
      const puppetPos = this.sockPuppet.puppet.position.clone();
      const playerPos = this.playerModel.position.clone();
      
      // Position between player and puppet, slightly closer to puppet
      targetPosition = new THREE.Vector3().lerpVectors(playerPos, puppetPos, 0.6);
    } else {
      // Normal behavior: wander near player
      targetPosition = this.playerModel.position.clone();
      // Stay some distance away
      targetPosition.x += 5 * Math.sin(performance.now() * 0.0005);
      targetPosition.z += 5 * Math.cos(performance.now() * 0.0005);
    }
    
    // Get direction to target
    const direction = new THREE.Vector3();
    direction.subVectors(targetPosition, this.model.position);
    direction.y = 0; // Keep on same height
    
    // Normalize and scale by speed
    if (direction.length() > 0.5) { // Keep some distance
      direction.normalize();
      
      const currentSpeed = this.isHelping ? this.helpSpeed : this.moveSpeed;
      direction.multiplyScalar(currentSpeed);
      
      // Update position
      this.model.position.add(direction);
      
      // Make Speed face target
      this.model.lookAt(targetPosition);
    }
    
    // Speed should always face the camera (billboard effect)
    const speedPlane = this.model.children[0];
    if (speedPlane) {
      speedPlane.quaternion.copy(camera.quaternion);
    }
    
    // Bobbing animation
    this.model.position.y = 1.2 + Math.sin(performance.now() * 0.002) * 0.1;
    
    // Say random phrases occasionally
    const now = Date.now();
    if (now - this.lastPhraseTime > this.phraseInterval) {
      this.sayPhrase();
      this.lastPhraseTime = now;
      this.phraseInterval = 5000 + Math.random() * 5000;
    }
    
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
  
  sayPhrase() {
    const phrases = this.isHelping ? this.helpPhrases : this.phrases;
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
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
    vector.y += 1.3; // Position above Speed's head
    
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
  
  respondToChat(message) {
    if (message.toLowerCase().includes("help") || 
        message.toLowerCase().includes("speed") || 
        message.toLowerCase().includes("save")) {
      this.isHelping = true;
      this.sayPhrase();
      return true;
    }
    return false;
  }
}