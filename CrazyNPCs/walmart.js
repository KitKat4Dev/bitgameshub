import * as THREE from 'three';

export class Walmart {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.position = new THREE.Vector3(-40, 0, 40); 
    this.walmartBuilding = null;
    this.wegaModel = null;
    this.playerInside = false;
    this.playerHiding = false;
    this.wegaAttacking = false;
    this.wegaAnimationFrame = null;
    this.chatMessage = null;
    this.eatProgress = 0;
    this.eatInterval = null;
    this.phrases = [
      "WELCOME TO WALMART, *****!",
      "GET THE **** OVER HERE!",
      "I'M ****ING WEGA!",
      "I'M GONNA EAT YOU ALIVE!",
      "HIDE ALL YOU WANT, *****!",
      "YOU CAN'T ESCAPE ME!",
      "WEGA NUMBER ONE!"
    ];
    
    // New properties for console shop
    this.consoleShopOpen = false;
    this.consoleShopPrompt = null;
    this.consoles = [
      { id: 'nintendo_switch', name: 'Nintendo Switch', price: 200, description: 'Portable gaming system' },
      { id: 'playstation5', name: 'PlayStation 5', price: 500, description: 'Sony\'s flagship console' },
      { id: 'xbox_series_x', name: 'Xbox Series X', price: 450, description: 'Microsoft\'s powerful gaming console' },
      { id: 'wega_station', name: 'Wega Station 9000', price: 1000, description: 'Wegas\'s personal console. DO NOT STEAL!' },
      { id: 'steam_deck', name: 'Steam Deck', price: 350, description: 'Portable PC gaming' }
    ];
    
    this.createWalmartBuilding();
    this.createWegaModel();
    this.createConsoleDisplay();
  }
  
  createWalmartBuilding() {
    const building = new THREE.Group();
    
    const baseGeometry = new THREE.BoxGeometry(30, 10, 20);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x1E88E5 }); 
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 5;
    building.add(base);
    
    const roofGeometry = new THREE.BoxGeometry(32, 1, 22);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x0D47A1 }); 
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 10.5;
    building.add(roof);
    
    const entranceGeometry = new THREE.BoxGeometry(10, 5, 1);
    const entranceMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xCCCCCC,
      transparent: true,
      opacity: 0.7
    });
    const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
    entrance.position.set(0, 2.5, 10.01);
    building.add(entrance);
    
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 128;
    const context = textureCanvas.getContext('2d');
    context.fillStyle = '#0D47A1';
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = 'white';
    context.font = 'bold 84px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('WALMART', 256, 64);
    
    const signTexture = new THREE.CanvasTexture(textureCanvas);
    const signGeometry = new THREE.PlaneGeometry(15, 3);
    const signMaterial = new THREE.MeshBasicMaterial({ 
      map: signTexture, 
      transparent: true,
      side: THREE.DoubleSide
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 11.5, 10.5);
    building.add(sign);
    
    building.position.copy(this.position);
    this.walmartBuilding = building;
    
    building.userData.isBarrier = true;
    building.userData.isWalmart = true;
    
    this.scene.add(building);
  }
  
  createWegaModel() {
    const wegaGroup = new THREE.Group();
    
    const textureLoader = new THREE.TextureLoader();
    const wegaTexture = textureLoader.load('wega.png');
    
    const wegaMaterial = new THREE.MeshBasicMaterial({
      map: wegaTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const wegaGeometry = new THREE.PlaneGeometry(10, 10);
    const wegaMesh = new THREE.Mesh(wegaGeometry, wegaMaterial);
    
    wegaGroup.add(wegaMesh);
    
    wegaGroup.position.set(this.position.x, 5, this.position.z);
    wegaGroup.visible = false;
    
    this.scene.add(wegaGroup);
    this.wegaModel = wegaGroup;
    
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message wega-chat';
    this.chatMessage.style.backgroundColor = 'rgba(128, 0, 128, 0.8)';
    this.chatMessage.style.color = 'white';
    this.chatMessage.style.fontWeight = 'bold';
    this.chatMessage.style.fontSize = '22px';
    this.chatMessage.style.display = 'none';
    this.chatMessage.style.width = '400px';
    document.getElementById('game-container').appendChild(this.chatMessage);
  }
  
  createConsoleDisplay() {
    // Create console display inside Walmart
    const displayStand = new THREE.Group();
    
    // Base
    const baseGeometry = new THREE.BoxGeometry(10, 1, 6);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.5;
    displayStand.add(base);
    
    // Top
    const topGeometry = new THREE.BoxGeometry(10, 0.2, 6);
    const topMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 3;
    displayStand.add(top);
    
    // Sides
    const sideGeometry = new THREE.BoxGeometry(0.2, 3, 6);
    const sideMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    
    const leftSide = new THREE.Mesh(sideGeometry, sideMaterial);
    leftSide.position.set(-5, 1.5, 0);
    displayStand.add(leftSide);
    
    const rightSide = new THREE.Mesh(sideGeometry, sideMaterial);
    rightSide.position.set(5, 1.5, 0);
    displayStand.add(rightSide);
    
    // Back
    const backGeometry = new THREE.BoxGeometry(10, 3, 0.2);
    const back = new THREE.Mesh(backGeometry, sideMaterial);
    back.position.set(0, 1.5, -3);
    displayStand.add(back);
    
    // Add consoles to the display
    for (let i = 0; i < this.consoles.length; i++) {
      const consoleGeometry = new THREE.BoxGeometry(1.5, 0.5, 1);
      const consoleMaterial = new THREE.MeshStandardMaterial({ 
        color: i === 3 ? 0xFFD700 : 0x666666, // Special gold color for Wega Station
        metalness: 0.7,
        roughness: 0.3
      });
      const consoleMesh = new THREE.Mesh(consoleGeometry, consoleMaterial);
      
      // Position consoles evenly along the display
      const spacing = 8 / (this.consoles.length - 1);
      consoleMesh.position.set(-4 + i * spacing, 1.5, 0);
      
      // Add console label
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 256;
      labelCanvas.height = 64;
      const ctx = labelCanvas.getContext('2d');
      ctx.fillStyle = '#FFF';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this.consoles[i].name, 128, 20);
      ctx.fillText(`${this.consoles[i].price} coins`, 128, 40);
      
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      const labelMaterial = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const labelGeometry = new THREE.PlaneGeometry(1.5, 0.5);
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      label.position.set(0, 0.5, 0.5);
      label.rotation.x = -Math.PI / 6;
      
      consoleMesh.add(label);
      displayStand.add(consoleMesh);
    }
    
    // Position display inside Walmart
    displayStand.position.set(this.position.x, 0, this.position.z);
    
    this.consoleDisplay = displayStand;
    this.scene.add(displayStand);
  }
  
  update(camera, renderer, deltaTime) {
    if (this.playerModel) {
      const playerPos = this.playerModel.position;
      const walmartPos = this.walmartBuilding.position;
      
      const distanceToCenterSq = 
        Math.pow(playerPos.x - walmartPos.x, 2) + 
        Math.pow(playerPos.z - walmartPos.z, 2);
      
      const distanceToEntrance = 
        Math.sqrt(Math.pow(playerPos.x - walmartPos.x, 2) + 
        Math.pow(playerPos.z - (walmartPos.z + 10), 2));
      
      const isInsideWalmart = distanceToCenterSq < 225 && Math.abs(playerPos.y - walmartPos.y) < 10;
      
      if (isInsideWalmart && !this.playerInside) {
        this.playerInside = true;
        this.handlePlayerEntered();
      } 
      else if (!isInsideWalmart && this.playerInside) {
        this.playerInside = false;
        this.handlePlayerExited();
      }
      
      if (this.wegaAttacking && this.wegaModel && this.playerInside) {
        this.updateWegaAttack(deltaTime);
      }
      
      if (this.chatMessage && this.wegaModel && this.wegaModel.visible) {
        const screenPosition = this.getScreenPosition(this.wegaModel.position, camera, renderer);
        if (screenPosition && screenPosition.visible) {
          this.chatMessage.style.left = `${screenPosition.x}px`;
          this.chatMessage.style.top = `${screenPosition.y - 60}px`;
        } else {
          this.chatMessage.style.display = 'none';
        }
      }
    }
    
    // Check if player is near console display
    if (this.playerModel && this.playerInside && !this.wegaAttacking) {
      const distanceToDisplay = this.playerModel.position.distanceTo(this.consoleDisplay.position);
      
      if (distanceToDisplay < 5 && !this.consoleShopOpen && !this.consoleShopPrompt) {
        this.showConsoleShopPrompt();
      } else if (distanceToDisplay >= 5 && this.consoleShopPrompt) {
        this.hideConsoleShopPrompt();
      }
    }
  }
  
  handlePlayerEntered() {
    if (window.isPlayerHated) {
      this.showHidePrompt();
    } else {
      this.showNotification("Welcome to Walmart. Press H to hide if you're being chased!", 5000);
    }
  }
  
  handlePlayerExited() {
    if (this.playerHiding) {
      this.playerHiding = false;
      
      if (this.wegaAttacking) {
        this.showNotification("You've left your hiding spot! Wega can see you now!", 3000);
      }
    }
    
    this.hideHidePrompt();
  }
  
  showHidePrompt() {
    if (!this.hidePrompt) {
      this.hidePrompt = document.createElement('div');
      this.hidePrompt.style.position = 'fixed';
      this.hidePrompt.style.bottom = '30%';
      this.hidePrompt.style.left = '50%';
      this.hidePrompt.style.transform = 'translateX(-50%)';
      this.hidePrompt.style.backgroundColor = 'rgba(128, 0, 128, 0.7)';
      this.hidePrompt.style.color = 'white';
      this.hidePrompt.style.padding = '15px 20px';
      this.hidePrompt.style.borderRadius = '5px';
      this.hidePrompt.style.zIndex = '1000';
      document.body.appendChild(this.hidePrompt);
      
      this.hideKeyListener = (e) => {
        if (e.key.toLowerCase() === 'h') {
          this.startHiding();
        }
      };
      
      document.addEventListener('keydown', this.hideKeyListener);
    }
    
    this.hidePrompt.textContent = 'Press H to hide from NPCs!';
    this.hidePrompt.style.display = 'block';
  }
  
  hideHidePrompt() {
    if (this.hidePrompt) {
      this.hidePrompt.style.display = 'none';
      document.removeEventListener('keydown', this.hideKeyListener);
    }
  }
  
  startHiding() {
    this.playerHiding = true;
    this.hideHidePrompt();
    
    this.showNotification("You're now hiding in Walmart!", 3000);
    
    setTimeout(() => {
      this.activateWega();
    }, 5000);
  }
  
  activateWega() {
    if (!this.playerInside || !this.playerHiding) return;
    // Check if wegas are enabled (default) or disabled by the user.
    if (window.disableWegas) {
      // Wegas are disabled – do nothing, so the player can buy/steal safely.
      return;
    } else {
      // Instead of the standard single-Wega behavior, spawn a hoard that will chase the player.
      this.spawnWegaHoard();
      return;
    }
  }

  spawnWegaHoard() {
    // Hide the original wega model.
    this.wegaModel.visible = false;
    // Create an array to store the hoard copies.
    this.hoardWegas = [];
    const hoardCount = 10;  // Number of Wegas to spawn
    for (let i = 0; i < hoardCount; i++) {
      const wegaClone = this.wegaModel.clone();
      wegaClone.visible = true;
      // Position each clone randomly around the current player position.
      const angle = Math.random() * Math.PI * 2;
      const dist = 5 + Math.random() * 5;
      wegaClone.position.set(
        this.playerModel.position.x + Math.cos(angle) * dist,
        5,
        this.playerModel.position.z + Math.sin(angle) * dist
      );
      this.scene.add(wegaClone);
      this.hoardWegas.push(wegaClone);
    }
    // Begin a chase loop: Each clone moves slowly toward the player.
    const chaseHoard = () => {
      let caught = false;
      for (const w of this.hoardWegas) {
        const direction = new THREE.Vector3();
        direction.subVectors(this.playerModel.position, w.position);
        direction.y = 0;
        if (direction.length() > 0.1) {
          direction.normalize();
          w.position.add(direction.multiplyScalar(0.1));
        }
        if (w.position.distanceTo(this.playerModel.position) < 1) {
          caught = true;
        }
      }
      if (caught) {
        // Trigger game over once any clone gets very close.
        const gameOverOverlay = document.createElement('div');
        gameOverOverlay.style.position = 'fixed';
        gameOverOverlay.style.top = '0';
        gameOverOverlay.style.left = '0';
        gameOverOverlay.style.width = '100%';
        gameOverOverlay.style.height = '100%';
        gameOverOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        gameOverOverlay.style.color = 'white';
        gameOverOverlay.style.display = 'flex';
        gameOverOverlay.style.justifyContent = 'center';
        gameOverOverlay.style.alignItems = 'center';
        gameOverOverlay.style.fontSize = '48px';
        gameOverOverlay.style.fontWeight = 'bold';
        gameOverOverlay.textContent = 'GAME OVER – THE HOARD GOT YOU!';
        document.body.appendChild(gameOverOverlay);
        return;
      }
      requestAnimationFrame(chaseHoard);
    };
    chaseHoard();
  }

  updateWegaAttack(deltaTime) {
    if (!this.wegaAttacking || !this.wegaModel) return;
    
    const wegaPlane = this.wegaModel.children[0];
    if (wegaPlane) {
      const camera = window.playerControls ? window.playerControls.getCamera() : null;
      if (camera) {
        wegaPlane.quaternion.copy(camera.quaternion);
      }
    }
    
    const direction = new THREE.Vector3();
    direction.subVectors(this.playerModel.position, this.wegaModel.position);
    
    if (direction.length() > 1) {
      direction.normalize();
      direction.multiplyScalar(0.05); 
      
      this.wegaModel.position.add(direction);
    } else {
      this.catchPlayer();
    }
    
    if (Math.random() < 0.005) {
      this.sayWegaPhrase();
    }
    
    const pulseScale = 1 + 0.1 * Math.sin(performance.now() * 0.002);
    this.wegaModel.scale.set(pulseScale, pulseScale, pulseScale);
  }
  
  catchPlayer() {
    if (!this.wegaAttacking) return;
    
    this.wegaAttacking = false;
    
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    
    this.sayWegaPhrase("GOTCHA! TIME FOR DINNER!");
    
    this.startEatingPlayer();
  }
  
  startEatingPlayer() {
    this.eatProgress = 0;
    
    const gameOverOverlay = document.createElement('div');
    gameOverOverlay.style.position = 'fixed';
    gameOverOverlay.style.top = '0';
    gameOverOverlay.style.left = '0';
    gameOverOverlay.style.width = '100%';
    gameOverOverlay.style.height = '100%';
    gameOverOverlay.style.backgroundColor = 'rgba(128, 0, 128, 0.3)';
    gameOverOverlay.style.display = 'flex';
    gameOverOverlay.style.flexDirection = 'column';
    gameOverOverlay.style.justifyContent = 'center';
    gameOverOverlay.style.alignItems = 'center';
    gameOverOverlay.style.zIndex = '9999';
    document.body.appendChild(gameOverOverlay);
    
    const progressContainer = document.createElement('div');
    progressContainer.style.width = '50%';
    progressContainer.style.height = '30px';
    progressContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    progressContainer.style.borderRadius = '15px';
    progressContainer.style.overflow = 'hidden';
    progressContainer.style.margin = '20px 0';
    gameOverOverlay.appendChild(progressContainer);
    
    const progressBar = document.createElement('div');
    progressBar.style.width = '0%';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = 'purple';
    progressBar.style.transition = 'width 0.5s';
    progressContainer.appendChild(progressBar);
    
    const statusText = document.createElement('div');
    statusText.style.color = 'white';
    statusText.style.fontSize = '36px';
    statusText.style.fontWeight = 'bold';
    statusText.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
    statusText.textContent = "WEGA IS EATING YOU...";
    gameOverOverlay.appendChild(statusText);
    
    this.wegaModel.position.copy(this.playerModel.position);
    this.wegaModel.position.z += 3;
    this.wegaModel.scale.set(3, 3, 3);
    
    this.eatInterval = setInterval(() => {
      this.eatProgress += 2;
      progressBar.style.width = `${this.eatProgress}%`;
      
      if (this.eatProgress >= 100) {
        clearInterval(this.eatInterval);
        
        statusText.textContent = "GAME OVER - WEGA ATE YOU!";
        
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.style.marginTop = '30px';
        restartButton.style.padding = '15px 30px';
        restartButton.style.fontSize = '24px';
        restartButton.style.backgroundColor = 'purple';
        restartButton.style.color = 'white';
        restartButton.style.border = 'none';
        restartButton.style.borderRadius = '10px';
        restartButton.style.cursor = 'pointer';
        restartButton.addEventListener('click', () => window.location.reload());
        gameOverOverlay.appendChild(restartButton);
      }
    }, 200);
  }
  
  sayWegaPhrase(specificPhrase = null) {
    const phrase = specificPhrase || this.phrases[Math.floor(Math.random() * this.phrases.length)];
    
    this.chatMessage.textContent = phrase;
    this.chatMessage.style.display = 'block';
    
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
    vector.y += 1.5;
    
    vector.project(camera);
    
    const isInFront = vector.z < 1;
    
    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf,
      visible: isInFront
    };
  }
  
  showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(128, 0, 128, 0.8)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, duration);
  }
  
  showConsoleShopPrompt() {
    this.consoleShopPrompt = document.createElement('div');
    this.consoleShopPrompt.style.position = 'fixed';
    this.consoleShopPrompt.style.bottom = '30%';
    this.consoleShopPrompt.style.left = '50%';
    this.consoleShopPrompt.style.transform = 'translateX(-50%)';
    this.consoleShopPrompt.style.backgroundColor = 'rgba(128, 0, 128, 0.7)';
    this.consoleShopPrompt.style.color = 'white';
    this.consoleShopPrompt.style.padding = '15px 20px';
    this.consoleShopPrompt.style.borderRadius = '5px';
    this.consoleShopPrompt.style.zIndex = '1000';
    document.body.appendChild(this.consoleShopPrompt);
    
    this.consoleShopPrompt.textContent = 'Press C to browse consoles, or S to steal one';
    
    // Add keyboard listener for C and S keys
    this.consoleShopKeyListener = (e) => {
      if (e.key.toLowerCase() === 'c') {
        this.openConsoleShop();
      } else if (e.key.toLowerCase() === 's') {
        this.stealConsole();
      }
    };
    
    document.addEventListener('keydown', this.consoleShopKeyListener);
  }
  
  hideConsoleShopPrompt() {
    if (this.consoleShopPrompt) {
      document.body.removeChild(this.consoleShopPrompt);
      this.consoleShopPrompt = null;
      document.removeEventListener('keydown', this.consoleShopKeyListener);
    }
  }
  
  openConsoleShop() {
    // Hide prompt
    this.hideConsoleShopPrompt();
    
    // Disable player controls
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    
    const shopContainer = document.createElement('div');
    shopContainer.style.position = 'fixed';
    shopContainer.style.top = '50%';
    shopContainer.style.left = '50%';
    shopContainer.style.transform = 'translate(-50%, -50%)';
    shopContainer.style.width = '500px';
    shopContainer.style.maxHeight = '400px';
    shopContainer.style.backgroundColor = 'rgba(128, 0, 128, 0.9)';
    shopContainer.style.color = 'white';
    shopContainer.style.padding = '20px';
    shopContainer.style.borderRadius = '10px';
    shopContainer.style.zIndex = '9999';
    shopContainer.style.overflowY = 'auto';
    
    // Shop header
    const header = document.createElement('h2');
    header.textContent = 'WEGA\'S CONSOLE EMPORIUM';
    header.style.textAlign = 'center';
    header.style.marginBottom = '20px';
    header.style.color = '#FFD700';
    shopContainer.appendChild(header);
    
    // Warning text
    const warningText = document.createElement('p');
    warningText.textContent = 'WARNING: Stealing will result in immediate consumption by Wega.';
    warningText.style.color = '#FF6666';
    warningText.style.textAlign = 'center';
    warningText.style.marginBottom = '20px';
    shopContainer.appendChild(warningText);
    
    // Close button
    const closeButton = document.createElement('div');
    closeButton.textContent = '✕';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.addEventListener('click', () => this.closeConsoleShop(shopContainer));
    shopContainer.appendChild(closeButton);
    
    // Add console items
    const itemsContainer = document.createElement('div');
    shopContainer.appendChild(itemsContainer);
    
    // Get player coins
    const playerCoins = window.shop ? window.shop.coins : 0;
    
    this.consoles.forEach(console => {
      const itemElement = document.createElement('div');
      itemElement.style.display = 'flex';
      itemElement.style.justifyContent = 'space-between';
      itemElement.style.alignItems = 'center';
      itemElement.style.padding = '10px';
      itemElement.style.margin = '5px 0';
      itemElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      itemElement.style.borderRadius = '5px';
      
      if (console.id === 'wega_station') {
        itemElement.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
        itemElement.style.border = '1px solid #FFD700';
      }
      
      const itemInfo = document.createElement('div');
      
      const itemName = document.createElement('div');
      itemName.textContent = console.name;
      itemName.style.fontSize = '18px';
      itemName.style.fontWeight = 'bold';
      itemName.style.color = console.id === 'wega_station' ? '#FFD700' : 'white';
      itemInfo.appendChild(itemName);
      
      const itemDesc = document.createElement('div');
      itemDesc.textContent = console.description;
      itemDesc.style.fontSize = '14px';
      itemDesc.style.color = '#aaa';
      itemInfo.appendChild(itemDesc);
      
      const itemPrice = document.createElement('div');
      itemPrice.textContent = `${console.price} coins`;
      itemPrice.style.color = 'gold';
      itemInfo.appendChild(itemPrice);
      
      itemElement.appendChild(itemInfo);
      
      const buyButton = document.createElement('button');
      buyButton.textContent = 'BUY';
      buyButton.style.padding = '8px 16px';
      buyButton.style.backgroundColor = playerCoins >= console.price ? '#4CAF50' : '#555';
      buyButton.style.border = 'none';
      buyButton.style.borderRadius = '4px';
      buyButton.style.color = 'white';
      buyButton.style.cursor = playerCoins >= console.price ? 'pointer' : 'not-allowed';
      buyButton.disabled = playerCoins < console.price;
      
      buyButton.addEventListener('click', () => {
        if (window.shop && window.shop.coins >= console.price) {
          this.purchaseConsole(console, shopContainer);
        }
      });
      
      const stealButton = document.createElement('button');
      stealButton.textContent = 'STEAL';
      stealButton.style.padding = '8px 16px';
      stealButton.style.backgroundColor = '#FF5555';
      stealButton.style.border = 'none';
      stealButton.style.borderRadius = '4px';
      stealButton.style.color = 'white';
      stealButton.style.marginLeft = '5px';
      stealButton.style.cursor = 'pointer';
      
      stealButton.addEventListener('click', () => {
        this.closeConsoleShop(shopContainer);
        this.stealConsole(console);
      });
      
      const buttonGroup = document.createElement('div');
      buttonGroup.appendChild(buyButton);
      buttonGroup.appendChild(stealButton);
      
      itemElement.appendChild(buttonGroup);
      itemsContainer.appendChild(itemElement);
    });
    
    document.body.appendChild(shopContainer);
    this.consoleShopOpen = true;
    
    // Make Wega say something
    this.sayWegaPhrase("YOU BUYING OR JUST LOOKING? DON'T EVEN THINK ABOUT STEALING!");
  }
  
  closeConsoleShop(shopContainer) {
    if (shopContainer) {
      document.body.removeChild(shopContainer);
    }
    
    // Re-enable player controls
    if (window.playerControls) {
      window.playerControls.enabled = true;
    }
    
    this.consoleShopOpen = false;
  }
  
  purchaseConsole(console, shopContainer) {
    if (!window.shop) return;
    window.shop.coins -= console.price;
    window.shop.updateCoinCounter();
    this.closeConsoleShop(shopContainer);
    if (window.shop.inventory) {
      window.shop.inventory[console.id] = (window.shop.inventory[console.id] || 0) + 1;
      window.shop.updateInventoryPanel();
    }
    if (!window.disableWegas) {
      // Normal behavior – trigger a dangerous Wega reaction.
      if (console.id === 'wega_station') {
        this.sayWegaPhrase("YOU BOUGHT MY PERSONAL CONSOLE?! BETTER TAKE GOOD CARE OF IT OR I'LL EAT YOU ANYWAY!");
      } else {
        this.sayWegaPhrase("GOOD CHOICE! WEGA APPROVES!");
      }
    } else {
      // If wegas are disabled, just show a safe purchase notification.
      this.showNotification(`Purchased ${console.name}! Wegas are disabled, so you're safe.`, 3000);
    }
  }
  
  stealConsole(specificConsole = null) {
    if (!window.disableWegas) {
      // Normal (enabled) behavior: trigger Wega attack
      this.sayWegaPhrase("YOU DARE STEAL FROM WEGA?! I'LL EAT YOU ALIVE!!!");
      this.hideConsoleShopPrompt();
      this.wegaAttacking = true;
      this.wegaModel.visible = true;
      this.wegaModel.position.set(this.position.x, 5, this.position.z - 8);
      setTimeout(() => {
        this.catchPlayer();
      }, 3000);
    } else {
      // Wegas are disabled – allow stealing safely.
      this.hideConsoleShopPrompt();
      this.showNotification("Steal successful. Wegas are disabled, so you're safe… for now.", 3000);
    }
  }

  spawnWegaHoardOverride() {
    // Force a Wega hoard chase regardless of the disable flag
    this.wegaAttacking = true;
    // Ensure previous hoard is cleared
    if (!this.hoardWegas) {
      this.hoardWegas = [];
    } else {
      this.hoardWegas.forEach(we => {
        this.scene.remove(we);
      });
      this.hoardWegas = [];
    }
    // Spawn 10 Wegas around the player
    for (let i = 0; i < 10; i++) {
      const wegaClone = this.wegaModel.clone();
      wegaClone.visible = true;
      const angle = Math.random() * Math.PI * 2;
      const distance = 5 + Math.random() * 5;
      wegaClone.position.set(
        this.playerModel.position.x + Math.cos(angle) * distance,
        this.playerModel.position.y,
        this.playerModel.position.z + Math.sin(angle) * distance
      );
      this.scene.add(wegaClone);
      this.hoardWegas.push(wegaClone);
    }
    // Start a loop to update the hoard movement toward the player
    const updateHoard = () => {
      if (!this.wegaAttacking) return;
      this.hoardWegas.forEach(we => {
        const direction = new THREE.Vector3();
        direction.subVectors(this.playerModel.position, we.position);
        direction.y = 0;
        if (direction.length() > 0.1) {
          direction.normalize();
          direction.multiplyScalar(0.1);
          we.position.add(direction);
        }
      });
      requestAnimationFrame(updateHoard);
    };
    updateHoard();
  }
}