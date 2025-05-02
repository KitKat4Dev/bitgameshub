import * as THREE from 'three';

export class PaperMan {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.position = new THREE.Vector3(80, 0, -80); // Far corner of the map
    this.phrases = [
      "hi guys its paper man",
      "welcome to my uranium emporium!",
      "feeling a bit NUCLEAR today?",
      "my prices are RADIATING value!",
      "don't worry, this stuff only glows a LITTLE",
      "paper beats rock, uranium beats EVERYTHING!",
      "doctor says I shouldn't handle this stuff... but what does HE know?"
    ];
    this.lastPhraseTime = 0;
    this.phraseInterval = 5000 + Math.random() * 5000; // 5-10 seconds between phrases
    this.moveSpeed = 0.03;
    this.shopOpen = false;
    this.cartoonModel = null;
    this.uraniumStore = null;
    this.chatMessage = null;
    this.isFollowing = false; // Track follow state
    this.followButton = null; // Reference to follow button
    
    this.uraniumItems = [
      { id: 'uranium_rock', name: 'Uranium Rock', price: 50, description: 'A small glowing rock. Probably safe.' },
      { id: 'plutonium_vial', name: 'Plutonium Vial', price: 150, description: 'Spicy juice for your nuclear needs!' },
      { id: 'nuclear_battery', name: 'Nuclear Battery', price: 300, description: 'Never runs out! (Side effects may include mutation)' },
      { id: 'meltdown_insurance', name: 'Meltdown Insurance', price: 500, description: 'For when things get TOO spicy!' }
    ];
    
    this.createUraniumStore();
    this.createPaperManModel();
    this.createFollowButton();
  }
  
  createUraniumStore() {
    const building = new THREE.Group();
    
    // Create a shed-like structure
    const baseGeometry = new THREE.BoxGeometry(12, 6, 10);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown wood color
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 3;
    building.add(base);
    
    // Sloped roof
    const roofGeometry = new THREE.ConeGeometry(10, 4, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Radioactive green
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 8;
    roof.rotation.y = Math.PI / 4;
    building.add(roof);
    
    // Door
    const doorGeometry = new THREE.PlaneGeometry(2, 3);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x4B2702 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 1.5, 5.01);
    building.add(door);
    
    // Sign
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 128;
    const context = textureCanvas.getContext('2d');
    context.fillStyle = '#333333';
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = '#44FF44'; // Bright green text
    context.font = 'bold 40px Courier New';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('URANIUM EMPORIUM', 256, 64);
    
    const signTexture = new THREE.CanvasTexture(textureCanvas);
    const signGeometry = new THREE.PlaneGeometry(6, 1.5);
    const signMaterial = new THREE.MeshBasicMaterial({ 
      map: signTexture, 
      transparent: false,
      side: THREE.DoubleSide
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 6, 5.01);
    building.add(sign);
    
    // Add some uranium barrels outside
    for (let i = 0; i < 4; i++) {
      const barrelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 12);
      const barrelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFFF00, 
        emissive: 0x33FF33,
        emissiveIntensity: 0.3
      });
      const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
      
      const angle = i * Math.PI / 2;
      barrel.position.set(
        Math.cos(angle) * 3,
        0.6,
        Math.sin(angle) * 3 + 7
      );
      building.add(barrel);
    }
    
    // Radiation symbol on the ground
    const radSymbolGeometry = new THREE.CircleGeometry(3, 32);
    const radSymbolMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFF00,
      transparent: true,
      opacity: 0.6
    });
    const radSymbol = new THREE.Mesh(radSymbolGeometry, radSymbolMaterial);
    radSymbol.rotation.x = -Math.PI / 2;
    radSymbol.position.y = 0.02;
    radSymbol.position.z = 7;
    building.add(radSymbol);
    
    // Add some glow effect to whole building
    const glowGeometry = new THREE.SphereGeometry(10, 32, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x33FF33,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 3;
    building.add(glow);
    
    building.position.copy(this.position);
    this.uraniumStore = building;
    
    building.userData.isBarrier = true;
    building.userData.isUraniumStore = true;
    
    this.scene.add(building);
  }
  
  createPaperManModel() {
    const paperManGroup = new THREE.Group();
    
    // Load the texture for Paper Man
    const textureLoader = new THREE.TextureLoader();
    const paperManTexture = textureLoader.load('0195f707-2659-78f4-94a5-13fe2d2c0a36.png');
    
    // Create material with the texture
    const paperManMaterial = new THREE.MeshBasicMaterial({
      map: paperManTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create a plane for Paper Man
    const paperManGeometry = new THREE.PlaneGeometry(2, 3);
    const paperManMesh = new THREE.Mesh(paperManGeometry, paperManMaterial);
    
    // Add to group
    paperManGroup.add(paperManMesh);
    
    // Create chat message element for the Paper Man
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message paper-man-chat';
    this.chatMessage.style.backgroundColor = 'rgba(255, 255, 150, 0.8)';
    this.chatMessage.style.color = '#333';
    this.chatMessage.style.fontWeight = 'bold';
    this.chatMessage.style.fontSize = '18px';
    this.chatMessage.style.width = '400px';
    this.chatMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(this.chatMessage);
    
    // Position Paper Man in front of the store
    paperManGroup.position.set(
      this.position.x,
      1.5,
      this.position.z + 6
    );
    
    // Add to scene
    this.scene.add(paperManGroup);
    this.cartoonModel = paperManGroup;
  }
  
  createFollowButton() {
    this.followButton = document.createElement('div');
    this.followButton.style.position = 'fixed';
    this.followButton.style.bottom = '120px';
    this.followButton.style.right = '20px';
    this.followButton.style.backgroundColor = 'rgba(255, 255, 150, 0.8)';
    this.followButton.style.color = '#333';
    this.followButton.style.padding = '10px 15px';
    this.followButton.style.borderRadius = '5px';
    this.followButton.style.cursor = 'pointer';
    this.followButton.style.zIndex = '1000';
    this.followButton.style.display = 'none'; // Hidden by default
    this.followButton.textContent = 'Ask Paper Man to Follow';
    
    this.followButton.addEventListener('click', () => {
      this.toggleFollow();
    });
    
    document.body.appendChild(this.followButton);
  }
  
  toggleFollow() {
    this.isFollowing = !this.isFollowing;
    
    if (this.isFollowing) {
      this.followButton.textContent = 'Tell Paper Man to Stop';
      this.followButton.style.backgroundColor = 'rgba(255, 100, 100, 0.8)';
      this.sayPhrase("Sure thing, buddy! I'll follow you around!");
    } else {
      this.followButton.textContent = 'Ask Paper Man to Follow';
      this.followButton.style.backgroundColor = 'rgba(255, 255, 150, 0.8)';
      this.sayPhrase("Okay! I'll go back to my store. Come visit anytime!");
      // Return to original position when not following
      this.returnToStore();
    }
  }
  
  returnToStore() {
    // Animate return to original position
    const animateReturn = () => {
      const direction = new THREE.Vector3();
      direction.subVectors(this.position, this.cartoonModel.position);
      
      if (direction.length() > 0.5) {
        direction.normalize();
        direction.multiplyScalar(this.moveSpeed * 2);
        this.cartoonModel.position.add(direction);
        requestAnimationFrame(animateReturn);
      }
    };
    
    animateReturn();
  }
  
  update(camera, renderer, deltaTime) {
    if (!this.cartoonModel || !this.playerModel) return;
    
    // Check if player is near the uranium store
    const distanceToStore = this.playerModel.position.distanceTo(this.uraniumStore.position);
    
    if (distanceToStore < 15) {
      // Show shop prompt if not already open
      if (!this.shopOpen && !this.shopPrompt) {
        this.showShopPrompt();
      }
      
      // Show follow button when near store
      if (this.followButton) {
        this.followButton.style.display = 'block';
      }
      
      // Paper Man always faces the player when nearby
      const direction = new THREE.Vector3();
      direction.subVectors(this.playerModel.position, this.cartoonModel.position);
      direction.y = 0;
      
      if (direction.length() > 0) {
        this.cartoonModel.lookAt(this.playerModel.position);
      }
      
      // Paper Man billboard effect (always face camera)
      const paperManPlane = this.cartoonModel.children[0];
      if (paperManPlane) {
        paperManPlane.quaternion.copy(camera.quaternion);
      }
      
      // Bouncing animation
      this.cartoonModel.position.y = 1.5 + Math.sin(performance.now() * 0.003) * 0.2;
      
      // Say phrases occasionally when player is nearby
      const now = Date.now();
      if (now - this.lastPhraseTime > this.phraseInterval) {
        this.sayPhrase();
        this.lastPhraseTime = now;
        this.phraseInterval = 5000 + Math.random() * 5000;
      }
    } else if (this.shopPrompt) {
      // Remove shop prompt if player walks away
      this.hideShopPrompt();
      
      // Only hide follow button if not following
      if (this.followButton && !this.isFollowing) {
        this.followButton.style.display = 'none';
      }
    }
    
    // Follow player if following is enabled
    if (this.isFollowing) {
      const direction = new THREE.Vector3();
      direction.subVectors(this.playerModel.position, this.cartoonModel.position);
      direction.y = 0;
      
      // Keep some distance from player
      if (direction.length() > 3) {
        direction.normalize();
        direction.multiplyScalar(this.moveSpeed * 1.5); // Faster when following
        this.cartoonModel.position.add(direction);
        this.cartoonModel.lookAt(this.playerModel.position);
      }
      
      // Make sure follow button stays visible
      if (this.followButton) {
        this.followButton.style.display = 'block';
      }
      
      // Paper Man billboard effect (always face camera)
      const paperManPlane = this.cartoonModel.children[0];
      if (paperManPlane) {
        paperManPlane.quaternion.copy(camera.quaternion);
      }
      
      // Bouncing animation
      this.cartoonModel.position.y = 1.5 + Math.sin(performance.now() * 0.003) * 0.2;
    }
    
    // Update chat message position
    if (this.chatMessage) {
      const screenPosition = this.getScreenPosition(this.cartoonModel.position, camera, renderer);
      if (screenPosition && screenPosition.visible) {
        this.chatMessage.style.left = `${screenPosition.x}px`;
        this.chatMessage.style.top = `${screenPosition.y - 45}px`;
      } else {
        this.chatMessage.style.display = 'none';
      }
    }
  }
  
  showShopPrompt() {
    this.shopPrompt = document.createElement('div');
    this.shopPrompt.style.position = 'fixed';
    this.shopPrompt.style.bottom = '30%';
    this.shopPrompt.style.left = '50%';
    this.shopPrompt.style.transform = 'translateX(-50%)';
    this.shopPrompt.style.backgroundColor = 'rgba(255, 255, 150, 0.7)';
    this.shopPrompt.style.color = '#333';
    this.shopPrompt.style.padding = '15px 20px';
    this.shopPrompt.style.borderRadius = '5px';
    this.shopPrompt.style.zIndex = '1000';
    document.body.appendChild(this.shopPrompt);
    
    // Add keyboard listener for U key
    this.shopKeyListener = (e) => {
      if (e.key.toLowerCase() === 'u') {
        this.openShop();
      }
    };
    
    document.addEventListener('keydown', this.shopKeyListener);
    
    this.shopPrompt.textContent = 'Press U to browse uranium products';
    this.shopPrompt.style.display = 'block';
    
    // Say welcoming phrase
    this.sayPhrase("hi guys its paper man! wanna buy some uranium?");
  }
  
  hideShopPrompt() {
    if (this.shopPrompt) {
      this.shopPrompt.style.display = 'none';
      document.removeEventListener('keydown', this.shopKeyListener);
    }
  }
  
  openShop() {
    // Disable player controls
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    
    // Hide shop prompt
    this.hideShopPrompt();
    
    // Create shop container
    const shopContainer = document.createElement('div');
    shopContainer.style.position = 'fixed';
    shopContainer.style.top = '50%';
    shopContainer.style.left = '50%';
    shopContainer.style.transform = 'translate(-50%, -50%)';
    shopContainer.style.width = '500px';
    shopContainer.style.maxHeight = '80%';
    shopContainer.style.backgroundColor = 'rgba(40, 40, 40, 0.95)';
    shopContainer.style.color = '#33FF33';
    shopContainer.style.padding = '20px';
    shopContainer.style.borderRadius = '10px';
    shopContainer.style.boxShadow = '0 0 20px rgba(51, 255, 51, 0.5)';
    shopContainer.style.zIndex = '9999';
    shopContainer.style.overflowY = 'auto';
    
    // Shop header
    const header = document.createElement('h2');
    header.textContent = 'URANIUM EMPORIUM';
    header.style.textAlign = 'center';
    header.style.marginBottom = '20px';
    header.style.fontFamily = 'Courier New, monospace';
    header.style.color = '#33FF33';
    shopContainer.appendChild(header);
    
    // Close button
    const closeButton = document.createElement('div');
    closeButton.textContent = '✕';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.addEventListener('click', () => this.closeShop(shopContainer));
    shopContainer.appendChild(closeButton);
    
    // Add uranium items
    const itemsContainer = document.createElement('div');
    shopContainer.appendChild(itemsContainer);
    
    // Get player coins
    const playerCoins = window.shop ? window.shop.coins : 0;
    
    this.uraniumItems.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.style.display = 'flex';
      itemElement.style.justifyContent = 'space-between';
      itemElement.style.alignItems = 'center';
      itemElement.style.padding = '10px';
      itemElement.style.margin = '5px 0';
      itemElement.style.backgroundColor = 'rgba(51, 255, 51, 0.1)';
      itemElement.style.borderRadius = '5px';
      
      const itemInfo = document.createElement('div');
      
      const itemName = document.createElement('div');
      itemName.textContent = item.name;
      itemName.style.fontSize = '18px';
      itemName.style.fontWeight = 'bold';
      itemName.style.color = '#33FF33';
      itemInfo.appendChild(itemName);
      
      const itemDesc = document.createElement('div');
      itemDesc.textContent = item.description;
      itemDesc.style.fontSize = '14px';
      itemDesc.style.color = '#aaa';
      itemInfo.appendChild(itemDesc);
      
      const itemPrice = document.createElement('div');
      itemPrice.textContent = `${item.price} coins`;
      itemPrice.style.color = 'gold';
      itemInfo.appendChild(itemPrice);
      
      itemElement.appendChild(itemInfo);
      
      const buyButton = document.createElement('button');
      buyButton.textContent = 'BUY';
      buyButton.style.padding = '8px 16px';
      buyButton.style.backgroundColor = playerCoins >= item.price ? '#33FF33' : '#555';
      buyButton.style.border = 'none';
      buyButton.style.borderRadius = '4px';
      buyButton.style.color = 'black';
      buyButton.style.cursor = playerCoins >= item.price ? 'pointer' : 'not-allowed';
      buyButton.disabled = playerCoins < item.price;
      
      buyButton.addEventListener('click', () => {
        if (window.shop && window.shop.coins >= item.price) {
          this.purchaseUranium(item, shopContainer);
        }
      });
      
      itemElement.appendChild(buyButton);
      itemsContainer.appendChild(itemElement);
    });
    
    // Warning text
    const warningText = document.createElement('p');
    warningText.textContent = 'WARNING: These products may cause slight radiation poisoning, mutation, and/or superpowers. Paper Man Industries is not responsible for any third eyes.';
    warningText.style.fontStyle = 'italic';
    warningText.style.color = '#FF6666';
    warningText.style.fontSize = '12px';
    warningText.style.marginTop = '20px';
    shopContainer.appendChild(warningText);
    
    document.body.appendChild(shopContainer);
    this.shopOpen = true;
  }
  
  closeShop(shopContainer) {
    if (shopContainer) {
      document.body.removeChild(shopContainer);
    }
    
    // Re-enable player controls
    if (window.playerControls) {
      window.playerControls.enabled = true;
    }
    
    this.shopOpen = false;
  }
  
  purchaseUranium(item, shopContainer) {
    if (!window.shop) return;
    
    window.shop.coins -= item.price;
    
    window.shop.updateCoinCounter();
    
    this.closeShop(shopContainer);
    
    // Apply unique effects for each item
    switch(item.id) {
      case 'uranium_rock':
        this.applyGlowEffect();
        break;
      case 'plutonium_vial':
        this.applySpeedBoost();
        break;
      case 'nuclear_battery':
        this.applyJumpBoost();
        break;
      case 'meltdown_insurance':
        this.applyProtection();
        break;
    }
    
    this.showNotification(`Purchased ${item.name}! Paper Man thanks you!`, 3000);
    
    this.sayPhrase("ENJOY YOUR PURCHASE! Don't tell the government!");
  }
  
  applyGlowEffect() {
    // Make player model glow green
    if (this.playerModel) {
      // Create a glow effect around the player
      const glowGeometry = new THREE.SphereGeometry(1.5, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x33FF33,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      this.playerModel.add(glow);
      
      // Remove after 30 seconds
      setTimeout(() => {
        this.playerModel.remove(glow);
      }, 30000);
    }
    
    // Add visual indicator 
    const effectIndicator = document.createElement('div');
    effectIndicator.textContent = '☢️ RADIATION GLOW';
    effectIndicator.style.position = 'fixed';
    effectIndicator.style.top = '100px';
    effectIndicator.style.right = '20px';
    effectIndicator.style.backgroundColor = 'rgba(51, 255, 51, 0.7)';
    effectIndicator.style.color = 'black';
    effectIndicator.style.padding = '10px';
    effectIndicator.style.borderRadius = '5px';
    effectIndicator.style.zIndex = '1000';
    document.body.appendChild(effectIndicator);
    
    // Remove indicator after 30 seconds
    setTimeout(() => {
      document.body.removeChild(effectIndicator);
    }, 30000);
  }
  
  applySpeedBoost() {
    if (window.playerControls) {
      // Store original speed
      const originalSpeed = window.playerControls.moveSpeed || 0.08;
      
      // Apply speed boost
      window.playerControls.moveSpeed = originalSpeed * 2;
      
      // Visual indicator
      const speedIndicator = document.createElement('div');
      speedIndicator.textContent = '☢️ PLUTONIUM SPEED';
      speedIndicator.style.position = 'fixed';
      speedIndicator.style.top = '100px';
      speedIndicator.style.right = '20px';
      speedIndicator.style.backgroundColor = 'rgba(51, 255, 51, 0.7)';
      speedIndicator.style.color = 'black';
      speedIndicator.style.padding = '10px';
      speedIndicator.style.borderRadius = '5px';
      speedIndicator.style.zIndex = '1000';
      document.body.appendChild(speedIndicator);
      
      // Reset after 30 seconds
      setTimeout(() => {
        window.playerControls.moveSpeed = originalSpeed;
        document.body.removeChild(speedIndicator);
      }, 30000);
    }
  }
  
  applyJumpBoost() {
    if (window.playerControls) {
      // Get reference to original jump force
      const ORIGINAL_JUMP_FORCE = 0.25;
      const BOOSTED_JUMP_FORCE = 0.5;
      
      // Apply jump boost by monkey patching
      const originalProcessMovement = window.playerControls.processMovement;
      window.playerControls.processMovement = function() {
        // Higher jump when spacebar is pressed
        if (this.keysPressed && this.keysPressed.has(" ") && this.canJump) {
          this.velocity.y = BOOSTED_JUMP_FORCE;
          this.canJump = false;
        }
        originalProcessMovement.call(this);
      };
      
      // Visual indicator
      const jumpIndicator = document.createElement('div');
      jumpIndicator.textContent = '☢️ NUCLEAR JUMPS';
      jumpIndicator.style.position = 'fixed';
      jumpIndicator.style.top = '100px';
      jumpIndicator.style.right = '20px';
      jumpIndicator.style.backgroundColor = 'rgba(51, 255, 51, 0.7)';
      jumpIndicator.style.color = 'black';
      jumpIndicator.style.padding = '10px';
      jumpIndicator.style.borderRadius = '5px';
      jumpIndicator.style.zIndex = '1000';
      document.body.appendChild(jumpIndicator);
      
      // Reset after 30 seconds
      setTimeout(() => {
        window.playerControls.processMovement = originalProcessMovement;
        document.body.removeChild(jumpIndicator);
      }, 30000);
    }
  }
  
  applyProtection() {
    // Add a shield effect to the player
    if (this.playerModel) {
      // Create a shield effect around the player
      const shieldGeometry = new THREE.SphereGeometry(1.2, 32, 32);
      const shieldMaterial = new THREE.MeshBasicMaterial({
        color: 0x3333FF,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
      this.playerModel.add(shield);
      
      // Block ONE attack - monkey patch the hostile NPCs
      window.isPlayerProtected = true;
      
      // Visual indicator
      const protectionIndicator = document.createElement('div');
      protectionIndicator.textContent = '☢️ MELTDOWN SHIELD';
      protectionIndicator.style.position = 'fixed';
      protectionIndicator.style.top = '100px';
      protectionIndicator.style.right = '20px';
      protectionIndicator.style.backgroundColor = 'rgba(51, 255, 51, 0.7)';
      protectionIndicator.style.color = 'black';
      protectionIndicator.style.padding = '10px';
      protectionIndicator.style.borderRadius = '5px';
      protectionIndicator.style.zIndex = '1000';
      document.body.appendChild(protectionIndicator);
      
      // Remove after 30 seconds
      setTimeout(() => {
        this.playerModel.remove(shield);
        window.isPlayerProtected = false;
        document.body.removeChild(protectionIndicator);
      }, 30000);
    }
  }
  
  sayPhrase(specificPhrase = null) {
    const phrase = specificPhrase || this.phrases[Math.floor(Math.random() * this.phrases.length)];
    
    this.chatMessage.textContent = phrase;
    this.chatMessage.style.display = 'block';
    
    // Hide after 4 seconds
    setTimeout(() => {
      if (this.chatMessage) {
        this.chatMessage.style.display = 'none';
      }
    }, 4000);
  }
  
  showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(255, 255, 150, 0.8)';
    notification.style.color = '#333';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, duration);
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