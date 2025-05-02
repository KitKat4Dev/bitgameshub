import * as THREE from 'three';

export class Shop {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.coins = 0;
    this.shopOpen = false;
    this.items = [
      { id: 'soda', name: 'Soda', price: 5, description: 'Just a refreshing drink' },
      { id: 'taco', name: 'Taco', price: 5, description: 'Delicious taco' },
      { id: 'combo', name: 'Combo (Soda + Taco)', price: 10, description: 'A tasty meal' },
      { id: 'combo_plus', name: 'Premium Combo (Soda + Taco + Coins)', price: 15, description: 'Meal with bonus coins' },
      { id: 'dark_matter', name: 'Dark Matter', price: 10000, description: 'The ultimate upgrade' }
    ];
    this.inventory = {};
    
    // Initialize inventory
    this.items.forEach(item => {
      this.inventory[item.id] = 0;
    });
    
    this.createShopUI();
    this.createCoinCounter();
    this.createShopBuilding();
    this.spawnCoins();
  }
  
  createShopUI() {
    // Create shop container
    this.shopContainer = document.createElement('div');
    this.shopContainer.id = 'shop-container';
    this.shopContainer.style.position = 'fixed';
    this.shopContainer.style.top = '50%';
    this.shopContainer.style.left = '50%';
    this.shopContainer.style.transform = 'translate(-50%, -50%)';
    this.shopContainer.style.width = '500px';
    this.shopContainer.style.maxHeight = '400px';
    this.shopContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.shopContainer.style.color = 'white';
    this.shopContainer.style.padding = '20px';
    this.shopContainer.style.borderRadius = '10px';
    this.shopContainer.style.display = 'none';
    this.shopContainer.style.zIndex = '9999';
    this.shopContainer.style.overflow = 'auto';
    
    // Shop header
    const header = document.createElement('h2');
    header.textContent = 'SHOP';
    header.style.textAlign = 'center';
    header.style.marginBottom = '20px';
    this.shopContainer.appendChild(header);
    
    // Close button
    const closeButton = document.createElement('div');
    closeButton.textContent = '✕';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.addEventListener('click', () => this.closeShop());
    this.shopContainer.appendChild(closeButton);
    
    // Create item list
    this.itemsContainer = document.createElement('div');
    this.shopContainer.appendChild(this.itemsContainer);
    
    // Create item elements
    this.updateShopItems();
    
    // Add to document
    document.body.appendChild(this.shopContainer);
    
    // Inventory button
    this.inventoryButton = document.createElement('div');
    this.inventoryButton.id = 'inventory-button';
    this.inventoryButton.textContent = 'INVENTORY';
    this.inventoryButton.style.position = 'fixed';
    this.inventoryButton.style.top = '20px';
    this.inventoryButton.style.left = '20px';
    this.inventoryButton.style.padding = '10px 15px';
    this.inventoryButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.inventoryButton.style.color = 'white';
    this.inventoryButton.style.borderRadius = '5px';
    this.inventoryButton.style.cursor = 'pointer';
    this.inventoryButton.style.zIndex = '1000';
    this.inventoryButton.addEventListener('click', () => this.toggleInventory());
    document.body.appendChild(this.inventoryButton);
    
    // Inventory panel
    this.inventoryPanel = document.createElement('div');
    this.inventoryPanel.id = 'inventory-panel';
    this.inventoryPanel.style.position = 'fixed';
    this.inventoryPanel.style.top = '60px';
    this.inventoryPanel.style.left = '20px';
    this.inventoryPanel.style.padding = '15px';
    this.inventoryPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.inventoryPanel.style.color = 'white';
    this.inventoryPanel.style.borderRadius = '5px';
    this.inventoryPanel.style.zIndex = '999';
    this.inventoryPanel.style.display = 'none';
    document.body.appendChild(this.inventoryPanel);
  }
  
  createCoinCounter() {
    this.coinCounter = document.createElement('div');
    this.coinCounter.id = 'coin-counter';
    this.coinCounter.style.position = 'fixed';
    this.coinCounter.style.top = '20px';
    this.coinCounter.style.right = '120px';
    this.coinCounter.style.padding = '10px 15px';
    this.coinCounter.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.coinCounter.style.color = 'gold';
    this.coinCounter.style.borderRadius = '5px';
    this.coinCounter.style.zIndex = '1000';
    this.updateCoinCounter();
    document.body.appendChild(this.coinCounter);
  }
  
  createShopBuilding() {
    // Create shop building
    const building = new THREE.Group();
    
    // Building base
    const baseGeometry = new THREE.BoxGeometry(6, 4, 6);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x6699FF });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 2;
    building.add(base);
    
    // Roof
    const roofGeometry = new THREE.ConeGeometry(5, 3, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xFF6666 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 5.5;
    roof.rotation.y = Math.PI / 4;
    building.add(roof);
    
    // Door
    const doorGeometry = new THREE.PlaneGeometry(1.5, 2.5);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 1.25, 3.01);
    building.add(door);
    
    // Shop sign
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 128;
    const context = textureCanvas.getContext('2d');
    context.fillStyle = '#4444FF';
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = 'white';
    context.font = 'bold 84px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('SHOP', 256, 64);
    
    const signTexture = new THREE.CanvasTexture(textureCanvas);
    const signGeometry = new THREE.PlaneGeometry(4, 1);
    const signMaterial = new THREE.MeshBasicMaterial({ 
      map: signTexture, 
      transparent: true,
      side: THREE.DoubleSide
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 4.5, 3.01);
    building.add(sign);
    
    // Position the shop away from other elements
    building.position.set(-35, 0, -35);
    this.shopBuilding = building;
    this.scene.add(building);
    
    // Set collision detection properties
    building.userData.isBarrier = true;
    building.userData.isShop = true;
  }
  
  spawnCoins() {
    // Create 100 coins around the map
    for (let i = 0; i < 100; i++) {
      this.createCoin();
    }
  }
  
  createCoin() {
    // Create a coin
    const coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    const coinMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFD700,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0xffcc00,
      emissiveIntensity: 0.2
    });
    
    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.rotation.x = Math.PI / 2;
    
    // Random position
    const angle = Math.random() * Math.PI * 2;
    const distance = 10 + Math.random() * 100;
    coin.position.set(
      Math.cos(angle) * distance,
      0.5 + Math.random() * 0.5, // Slightly above ground, different heights
      Math.sin(angle) * distance
    );
    
    // Add spinning animation data
    coin.userData.rotationSpeed = 0.01 + Math.random() * 0.02;
    coin.userData.isCoin = true;
    coin.userData.initialY = coin.position.y;
    
    this.scene.add(coin);
  }
  
  update(camera, renderer, deltaTime) {
    // Check if player is near the shop
    if (this.playerModel && this.shopBuilding) {
      const distance = this.playerModel.position.distanceTo(this.shopBuilding.position);
      
      // If player is close to shop
      if (distance < 5) {
        // Show shop prompt if not already open
        if (!this.shopOpen && !this.shopPrompt) {
          this.showShopPrompt();
        }
      } else if (this.shopPrompt) {
        // Remove shop prompt if player walks away
        this.hideShopPrompt();
      }
    }
    
    // Update coins animation and check for collection
    this.scene.children.forEach(child => {
      if (child.userData && child.userData.isCoin) {
        // Spin the coin
        child.rotation.z += child.userData.rotationSpeed;
        
        // Make the coin float up and down
        child.position.y = child.userData.initialY + Math.sin(performance.now() * 0.002) * 0.1;
        
        // Check if player collects the coin
        if (this.playerModel) {
          const distance = this.playerModel.position.distanceTo(child.position);
          if (distance < 1.5) {
            this.collectCoin(child);
          }
        }
      }
    });
  }
  
  collectCoin(coin) {
    // Remove coin from scene
    this.scene.remove(coin);
    
    // Add to player's coins
    this.coins += 1;
    
    // Update counter
    this.updateCoinCounter();
    
    // Play collection sound (if implemented)
    // this.playCollectionSound();
    
    // Create new coin to replace collected one
    setTimeout(() => this.createCoin(), 30000);
  }
  
  showShopPrompt() {
    this.shopPrompt = document.createElement('div');
    this.shopPrompt.textContent = 'Press E to open shop';
    this.shopPrompt.style.position = 'fixed';
    this.shopPrompt.style.top = '60%';
    this.shopPrompt.style.left = '50%';
    this.shopPrompt.style.transform = 'translate(-50%, -50%)';
    this.shopPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.shopPrompt.style.color = 'white';
    this.shopPrompt.style.padding = '10px 20px';
    this.shopPrompt.style.borderRadius = '5px';
    this.shopPrompt.style.zIndex = '1000';
    
    document.body.appendChild(this.shopPrompt);
    
    // Add keyboard listener for E key
    this.shopKeyListener = (e) => {
      if (e.key.toLowerCase() === 'e') {
        this.openShop();
      }
    };
    
    document.addEventListener('keydown', this.shopKeyListener);
  }
  
  hideShopPrompt() {
    if (this.shopPrompt) {
      document.body.removeChild(this.shopPrompt);
      this.shopPrompt = null;
      document.removeEventListener('keydown', this.shopKeyListener);
    }
  }
  
  openShop() {
    // Disable player controls
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    
    // Update shop items
    this.updateShopItems();
    
    // Show shop UI
    this.shopContainer.style.display = 'block';
    this.shopOpen = true;
    
    // Hide shop prompt
    this.hideShopPrompt();
  }
  
  closeShop() {
    // Hide shop UI
    this.shopContainer.style.display = 'none';
    this.shopOpen = false;
    
    // Re-enable player controls
    if (window.playerControls) {
      window.playerControls.enabled = true;
    }
  }
  
  updateShopItems() {
    // Clear existing items
    this.itemsContainer.innerHTML = '';
    
    // Add each item to the shop
    this.items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('shop-item');
      itemElement.style.display = 'flex';
      itemElement.style.justifyContent = 'space-between';
      itemElement.style.alignItems = 'center';
      itemElement.style.padding = '10px';
      itemElement.style.margin = '5px 0';
      itemElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      itemElement.style.borderRadius = '5px';
      
      const itemInfo = document.createElement('div');
      
      const itemName = document.createElement('div');
      itemName.textContent = item.name;
      itemName.style.fontSize = '18px';
      itemName.style.fontWeight = 'bold';
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
      buyButton.style.backgroundColor = this.coins >= item.price ? '#4CAF50' : '#555';
      buyButton.style.border = 'none';
      buyButton.style.borderRadius = '4px';
      buyButton.style.color = 'white';
      buyButton.style.cursor = this.coins >= item.price ? 'pointer' : 'not-allowed';
      buyButton.disabled = this.coins < item.price;
      
      buyButton.addEventListener('click', () => {
        if (this.coins >= item.price) {
          this.purchaseItem(item);
        }
      });
      
      itemElement.appendChild(buyButton);
      this.itemsContainer.appendChild(itemElement);
    });
  }
  
  updateCoinCounter() {
    this.coinCounter.textContent = `Coins: ${this.coins}`;
  }
  
  updateInventoryPanel() {
    this.inventoryPanel.innerHTML = '<h3 style="margin-top: 0;">Inventory</h3>';
    
    // Count total items
    let totalItems = 0;
    for (const id in this.inventory) {
      totalItems += this.inventory[id];
    }
    
    if (totalItems === 0) {
      const emptyText = document.createElement('p');
      emptyText.textContent = 'Your inventory is empty';
      emptyText.style.color = '#aaa';
      this.inventoryPanel.appendChild(emptyText);
      return;
    }
    
    // Create list of owned items
    const itemsList = document.createElement('ul');
    itemsList.style.padding = '0 0 0 20px';
    itemsList.style.margin = '10px 0';
    
    this.items.forEach(item => {
      if (this.inventory[item.id] > 0) {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} x${this.inventory[item.id]}`;
        listItem.style.margin = '5px 0';
        itemsList.appendChild(listItem);
      }
    });
    
    // Check for illegal games
    for (const gameId in this.inventory) {
      if (gameId.startsWith('click2') || gameId.startsWith('toystory600') || 
          gameId.startsWith('superpeach') || gameId.startsWith('gta7') || 
          gameId.startsWith('minceraft')) {
        if (this.inventory[gameId] > 0) {
          const gameItem = document.createElement('li');
          const gameName = gameId === 'click2' ? 'Click 2' : 
                          gameId === 'toystory600' ? 'Toy Story 600' :
                          gameId === 'superpeach' ? 'Super Peach Sis' :
                          gameId === 'gta7' ? 'GTA VII' : 'Mincecraft';
          gameItem.innerHTML = `<span style="color: #FF5555;">${gameName} x${this.inventory[gameId]}</span> <button class="play-game-btn" data-game="${gameId}" style="margin-left: 10px; background-color: #FF5555; color: white; border: none; padding: 2px 5px; border-radius: 3px; cursor: pointer;">Play</button>`;
          itemsList.appendChild(gameItem);
        }
      }
    }
    
    this.inventoryPanel.appendChild(itemsList);
    
    // Add event listeners to play game buttons
    const playButtons = this.inventoryPanel.querySelectorAll('.play-game-btn');
    playButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const gameId = e.target.dataset.game;
        this.playIllegalGame(gameId);
      });
    });
    
    // Add use button for consumable items
    if (this.inventory.soda > 0 || this.inventory.taco > 0 || 
        this.inventory.combo > 0 || this.inventory.combo_plus > 0) {
      
      const useButton = document.createElement('button');
      useButton.textContent = 'Use Item';
      useButton.style.padding = '8px 16px';
      useButton.style.backgroundColor = '#4CAF50';
      useButton.style.border = 'none';
      useButton.style.borderRadius = '4px';
      useButton.style.color = 'white';
      useButton.style.cursor = 'pointer';
      useButton.style.marginTop = '10px';
      
      useButton.addEventListener('click', () => this.selectItemToUse());
      
      this.inventoryPanel.appendChild(useButton);
    }
    
    // Add Use Console button if any console items exist in the inventory
    const consoleKeys = ['nintendo_switch', 'playstation5', 'xbox_series_x', 'wega_station', 'steam_deck'];
    let totalConsoles = 0;
    for (const key of consoleKeys) {
      if (this.inventory[key] > 0) {
        totalConsoles += this.inventory[key];
      }
    }
    if (totalConsoles > 0) {
      const useConsoleButton = document.createElement('button');
      useConsoleButton.textContent = 'Use Console';
      useConsoleButton.style.padding = '8px 16px';
      useConsoleButton.style.backgroundColor = '#FF0000';
      useConsoleButton.style.border = 'none';
      useConsoleButton.style.borderRadius = '4px';
      useConsoleButton.style.color = 'white';
      useConsoleButton.style.cursor = 'pointer';
      useConsoleButton.style.marginTop = '10px';
      useConsoleButton.addEventListener('click', () => this.useConsoleItem());
      this.inventoryPanel.appendChild(useConsoleButton);
    }
  }
  
  playIllegalGame(gameId) {
    // Close inventory panel
    this.inventoryPanel.style.display = 'none';
    
    // Create game preview overlay
    const gameOverlay = document.createElement('div');
    gameOverlay.style.position = 'fixed';
    gameOverlay.style.top = '0';
    gameOverlay.style.left = '0';
    gameOverlay.style.width = '100%';
    gameOverlay.style.height = '100%';
    gameOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    gameOverlay.style.display = 'flex';
    gameOverlay.style.flexDirection = 'column';
    gameOverlay.style.justifyContent = 'center';
    gameOverlay.style.alignItems = 'center';
    gameOverlay.style.zIndex = '9999';
    
    // Game title
    const gameTitle = document.createElement('h2');
    gameTitle.style.color = '#FF5555';
    gameTitle.style.marginBottom = '20px';
    gameTitle.style.fontFamily = 'Arial, sans-serif';
    gameTitle.style.fontSize = '36px';
    
    const gameName = gameId === 'click2' ? 'Click 2' : 
                    gameId === 'toystory600' ? 'Toy Story 600' :
                    gameId === 'superpeach' ? 'Super Peach Sis' :
                    gameId === 'gta7' ? 'GTA VII' : 'Mincecraft';
    gameTitle.textContent = `Playing: ${gameName}`;
    
    gameOverlay.appendChild(gameTitle);
    
    // Game screen
    const gameScreen = document.createElement('div');
    gameScreen.style.width = '640px';
    gameScreen.style.height = '480px';
    gameScreen.style.backgroundColor = '#111';
    gameScreen.style.border = '3px solid #FF5555';
    gameScreen.style.position = 'relative';
    gameScreen.style.overflow = 'hidden';
    
    // Add game content based on game type
    gameScreen.innerHTML = this.getGameScreenContent(gameId);
    
    gameOverlay.appendChild(gameScreen);
    
    // Message that police are tracking you
    const warningMessage = document.createElement('div');
    warningMessage.style.color = '#FF5555';
    warningMessage.style.fontSize = '18px';
    warningMessage.style.marginTop = '20px';
    warningMessage.style.textAlign = 'center';
    warningMessage.innerHTML = 'WARNING: You are playing an illegal game.<br>Police have been alerted to your location!';
    gameOverlay.appendChild(warningMessage);
    
    // Exit button
    const exitButton = document.createElement('button');
    exitButton.textContent = 'EXIT GAME';
    exitButton.style.marginTop = '20px';
    exitButton.style.padding = '10px 20px';
    exitButton.style.backgroundColor = '#FF5555';
    exitButton.style.color = 'white';
    exitButton.style.border = 'none';
    exitButton.style.borderRadius = '5px';
    exitButton.style.cursor = 'pointer';
    
    exitButton.addEventListener('click', () => {
      // Remove overlay
      document.body.removeChild(gameOverlay);
      
      // Start police chase!
      setTimeout(() => {
        this.alertPolice();
      }, 3000);
    });
    
    gameOverlay.appendChild(exitButton);
    document.body.appendChild(gameOverlay);
    
    // Consume the game
    if (this.inventory[gameId] > 0) {
      this.inventory[gameId]--;
    }
  }
  
  getGameScreenContent(gameId) {
    // Return fake game screen content based on gameId
    switch(gameId) {
      case 'click2':
        return `
          <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column;">
            <div style="font-size: 48px; color: white; margin-bottom: 20px; font-family: 'Arial Black';">CLICK 2</div>
            <div style="font-size: 24px; color: white;">The unauthorized sequel</div>
            <div style="position: absolute; bottom: 20px; right: 20px; color: #555;">FPS: 12</div>
          </div>
        `;
      case 'toystory600':
        return `
          <div style="width: 100%; height: 100%; background: linear-gradient(to bottom, #3498db, #8e44ad); display: flex; justify-content: center; align-items: center; flex-direction: column;">
            <div style="font-size: 36px; color: white; margin-bottom: 10px; font-family: 'Arial Black';">TOY STORY 600</div>
            <div style="font-size: 18px; color: white; margin-bottom: 30px;">They've gone to infinity and way beyond!</div>
            <div style="width: 100px; height: 100px; background-color: white; border-radius: 10px; margin-bottom: 20px;"></div>
            <div style="width: 200px; height: 20px; background-color: #27ae60;"></div>
            <div style="position: absolute; bottom: 10px; left: 10px; color: white;">Loading assets... 12%</div>
          </div>
        `;
      case 'superpeach':
        return `
          <div style="width: 100%; height: 100%; background-color: #FF69B4; display: flex; justify-content: center; align-items: center; flex-direction: column;">
            <div style="font-size: 48px; color: white; text-shadow: 3px 3px #000; margin-bottom: 20px; font-family: 'Arial';">SUPER PEACH SIS</div>
            <div style="display: flex; justify-content: space-around; width: 100%;">
              <div style="width: 50px; height: 50px; background-color: red; border-radius: 50%;"></div>
              <div style="width: 50px; height: 50px; background-color: green; border-radius: 50%;"></div>
            </div>
            <div style="position: absolute; bottom: 20px; text-align: center; width: 100%; color: white;">
              Princess Peach Saves The Plumber!
            </div>
          </div>
        `;
      case 'gta7':
        return `
          <div style="width: 100%; height: 100%; background-color: black; color: white; font-family: 'Arial'; padding: 20px; box-sizing: border-box;">
            <div style="font-size: 60px; color: #FFA500; margin-bottom: 10px; text-align: center;">GRAND THEFT AUTO VII</div>
            <div style="height: 280px; border: 1px solid #333; display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
              Loading ultra-realistic world... Please wait...
            </div>
            <div style="color: red; font-size: 14px; text-align: right;">This unauthorized copy may corrupt your save files and ruin your life.</div>
          </div>
        `;
      case 'minceraft':
        return `
          <div style="width: 100%; height: 100%; background-color: #4D7F3E; font-family: 'Courier New'; display: flex; justify-content: center; align-items: center; flex-direction: column;">
            <div style="font-size: 48px; color: #D0D0D0; margin-bottom: 20px; font-weight: bold;">MINCERAFT</div>
            <div style="width: 50px; height: 50px; background-color: #8B4513; margin-bottom: 10px;"></div>
            <div style="font-size: 18px; color: white;">Definitely not blocky, we promised our lawyers</div>
            <div style="position: absolute; bottom: 20px; width: 100%; text-align: center; color: #D0D0D0; font-size: 12px;">
              NOT an infringement. Please believe us.
            </div>
          </div>
        `;
      default:
        return `<div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;">Error loading game</div>`;
    }
  }
  
  alertPolice() {
    // Create a flashing police alert
    const policeAlert = document.createElement('div');
    policeAlert.style.position = 'fixed';
    policeAlert.style.top = '0';
    policeAlert.style.left = '0';
    policeAlert.style.width = '100%';
    policeAlert.style.height = '100%';
    policeAlert.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    policeAlert.style.display = 'flex';
    policeAlert.style.justifyContent = 'center';
    policeAlert.style.alignItems = 'center';
    policeAlert.style.zIndex = '9999';
    policeAlert.style.animation = 'flash 0.5s infinite';
    
    // Add style for flashing animation
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes flash {
        0% { background-color: rgba(255, 0, 0, 0.3); }
        50% { background-color: rgba(0, 0, 255, 0.3); }
        100% { background-color: rgba(255, 0, 0, 0.3); }
      }
    `;
    document.head.appendChild(styleElement);
    
    // Alert text
    const alertText = document.createElement('div');
    alertText.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    alertText.style.color = 'white';
    alertText.style.padding = '20px';
    alertText.style.borderRadius = '10px';
    alertText.style.fontSize = '36px';
    alertText.style.fontWeight = 'bold';
    alertText.textContent = 'POLICE APPROACHING!';
    
    policeAlert.appendChild(alertText);
    document.body.appendChild(policeAlert);
    
    // Police siren sound effect
    // const sirenSound = new Audio('siren.mp3');
    // sirenSound.loop = true;
    // sirenSound.play();
    
    // After a few seconds, trigger police chase and arrest
    setTimeout(() => {
      document.body.removeChild(policeAlert);
      this.startPoliceChase();
    }, 3000);
  }
  
  startPoliceChase() {
    // Create police cars to chase the player
    const policeGroup = new THREE.Group();
    
    // Create police car model
    const carGeometry = new THREE.BoxGeometry(3, 1, 5);
    const carMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const car = new THREE.Mesh(carGeometry, carMaterial);
    policeGroup.add(car);
    
    // Police lights
    const lights = new THREE.Group();
    lights.position.set(0, 0.65, 0);
    
    const redLightMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000, emissive: 0xFF0000 });
    const blueLightMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF, emissive: 0x0000FF });
    
    const redLight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), redLightMaterial);
    redLight.position.set(-0.5, 0, 0);
    lights.add(redLight);
    
    const blueLight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), blueLightMaterial);
    blueLight.position.set(0.5, 0, 0);
    lights.add(blueLight);
    
    car.add(lights);
    
    // Position slightly behind player
    const playerPosition = this.playerModel.position.clone();
    const cameraDirection = new THREE.Vector3();
    if (window.playerControls && window.playerControls.camera) {
      window.playerControls.camera.getWorldDirection(cameraDirection);
      cameraDirection.negate(); // We want behind the player
    } else {
      // Default direction if camera not available
      cameraDirection.set(0, 0, 1);
    }
    
    cameraDirection.multiplyScalar(10); // 10 units behind player
    const policePosition = playerPosition.clone().add(cameraDirection);
    policePosition.y = 0.5; // Slightly above ground
    
    policeGroup.position.copy(policePosition);
    this.scene.add(policeGroup);
    
    // Create a second police car
    const policeGroup2 = policeGroup.clone();
    cameraDirection.set(-cameraDirection.z, 0, cameraDirection.x); // Perpendicular to first car
    cameraDirection.normalize().multiplyScalar(5);
    policeGroup2.position.copy(playerPosition.clone().add(cameraDirection));
    this.scene.add(policeGroup2);
    
    // Create police chase animation
    const chaseAnimation = () => {
      if (!this.policeChaseActive) return; // Stop if police chase stopped
      
      // Update police car positions to follow player
      const direction = new THREE.Vector3();
      direction.subVectors(this.playerModel.position, policeGroup.position);
      direction.normalize();
      direction.multiplyScalar(0.15); // Police speed
      
      policeGroup.position.add(direction);
      policeGroup.lookAt(this.playerModel.position);
      
      // Second police car approaches from different angle
      const direction2 = new THREE.Vector3();
      direction2.subVectors(this.playerModel.position, policeGroup2.position);
      direction2.normalize();
      direction2.multiplyScalar(0.18); // Slightly faster
      
      policeGroup2.position.add(direction2);
      policeGroup2.lookAt(this.playerModel.position);
      
      // Flash police lights
      if (lights.children.length >= 2) {
        lights.children[0].visible = Math.floor(Date.now() / 200) % 2 === 0;
        lights.children[1].visible = Math.floor(Date.now() / 200) % 2 === 1;
      }
      
      // Check if police caught player
      const distance1 = policeGroup.position.distanceTo(this.playerModel.position);
      const distance2 = policeGroup2.position.distanceTo(this.playerModel.position);
      
      if (distance1 < 3 || distance2 < 3) {
        this.arrestPlayer();
        return;
      }
      
      requestAnimationFrame(chaseAnimation);
    };
    
    // Start chase
    this.policeChaseActive = true;
    chaseAnimation();
    
    // Disable jump during chase to make capture inevitable
    if (window.playerControls) {
      window.playerControls.canJump = false;
    }
  }
  
  arrestPlayer() {
    this.policeChaseActive = false;
    
    // Disable player controls
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    
    // Show game over / arrest screen
    const arrestScreen = document.createElement('div');
    arrestScreen.style.position = 'fixed';
    arrestScreen.style.top = '0';
    arrestScreen.style.left = '0';
    arrestScreen.style.width = '100%';
    arrestScreen.style.height = '100%';
    arrestScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    arrestScreen.style.color = 'white';
    arrestScreen.style.display = 'flex';
    arrestScreen.style.flexDirection = 'column';
    arrestScreen.style.justifyContent = 'center';
    arrestScreen.style.alignItems = 'center';
    arrestScreen.style.zIndex = '9999';
    
    // Add arrest content
    arrestScreen.innerHTML = `
      <h1 style="color: red; font-size: 48px; margin-bottom: 30px;">ARRESTED!</h1>
      <div style="font-size: 24px; text-align: center; margin-bottom: 20px;">
        You have been caught playing illegal video games!
      </div>
      <div style="width: 80%; max-width: 800px; background-color: #111; padding: 20px; border: 2px solid red; margin-bottom: 30px;">
        <h2 style="color: red; text-align: center; margin-bottom: 20px;">YOUR SENTENCE:</h2>
        <ul style="font-size: 20px; line-height: 1.5; list-style-type: none; padding: 0;">
          <li style="margin-bottom: 10px;">➡️ 1000 years in prison</li>
          <li style="margin-bottom: 10px;">➡️ Death sentence</li>
          <li style="margin-bottom: 10px;">➡️ Listen to beabadobee for 10000 hours</li>
          <li style="margin-bottom: 10px;">➡️ All assets confiscated</li>
          <li style="margin-bottom: 10px;">➡️ Banned from all video games forever</li>
        </ul>
      </div>
      <button id="restart-game-btn" style="padding: 15px 30px; background-color: red; color: white; border: none; border-radius: 5px; font-size: 20px; cursor: pointer;">Restart Game</button>
    `;
    
    document.body.appendChild(arrestScreen);
    
    // Add restart button event
    document.getElementById('restart-game-btn').addEventListener('click', () => {
      window.location.reload();
    });
  }
  
  purchaseItem(item) {
    // Deduct cost
    this.coins -= item.price;
    
    // Add to inventory
    this.inventory[item.id]++;
    
    // Bonus coins for combo_plus
    if (item.id === 'combo_plus') {
      this.coins += 5; // Bonus 5 coins
      this.showNotification('Premium Combo purchased! +5 bonus coins!');
    } else {
      this.showNotification(`Purchased ${item.name}!`);
    }
    
    // Effects for dark matter
    if (item.id === 'dark_matter') {
      this.useDarkMatter();
    }
    
    // Update UI
    this.updateCoinCounter();
    this.updateShopItems();
    this.updateInventoryPanel();
  }
  
  useItem(itemId) {
    if (this.inventory[itemId] <= 0) return;
    
    // Consume item
    this.inventory[itemId]--;
    
    // Apply effects based on item type
    switch (itemId) {
      case 'soda':
        this.showNotification('Drank a soda! Movement speed increased for 30 seconds.');
        this.applySpeedBoost(1.5, 30);
        break;
      case 'taco':
        this.showNotification('Ate a taco! You feel stronger!');
        this.applyTacoEffect();
        break;
      case 'combo':
        this.showNotification('Enjoyed the combo meal! Speed and strength increased!');
        this.applySpeedBoost(1.5, 45);
        this.applyTacoEffect();
        break;
      case 'combo_plus':
        this.showNotification('Premium combo consumed! Major boost to all stats!');
        this.applySpeedBoost(2, 60);
        this.applyTacoEffect();
        this.coins += 10;
        this.updateCoinCounter();
        break;
    }
    
    // Update inventory display
    this.updateInventoryPanel();
  }
  
  applySpeedBoost(multiplier, duration) {
    if (window.playerControls) {
      // Store original speed
      const originalSpeed = window.playerControls.moveSpeed || 0.08;
      
      // Apply speed boost
      window.playerControls.moveSpeed = originalSpeed * multiplier;
      
      // Visual indicator
      const speedIndicator = document.createElement('div');
      speedIndicator.textContent = '🚀 SPEED BOOST';
      speedIndicator.style.position = 'fixed';
      speedIndicator.style.top = '100px';
      speedIndicator.style.right = '20px';
      speedIndicator.style.backgroundColor = 'rgba(0, 100, 255, 0.7)';
      speedIndicator.style.color = 'white';
      speedIndicator.style.padding = '10px';
      speedIndicator.style.borderRadius = '5px';
      speedIndicator.style.zIndex = '1000';
      document.body.appendChild(speedIndicator);
      
      // Reset after duration
      setTimeout(() => {
        window.playerControls.moveSpeed = originalSpeed;
        document.body.removeChild(speedIndicator);
      }, duration * 1000);
    }
  }
  
  applyTacoEffect() {
    // Make player model temporarily larger
    if (this.playerModel) {
      const originalScale = this.playerModel.scale.clone();
      
      // Scale up
      this.playerModel.scale.set(1.5, 1.5, 1.5);
      
      // Visual indicator
      const strengthIndicator = document.createElement('div');
      strengthIndicator.textContent = '💪 STRENGTH UP';
      strengthIndicator.style.position = 'fixed';
      strengthIndicator.style.top = '150px';
      strengthIndicator.style.right = '20px';
      strengthIndicator.style.backgroundColor = 'rgba(255, 100, 0, 0.7)';
      strengthIndicator.style.color = 'white';
      strengthIndicator.style.padding = '10px';
      strengthIndicator.style.borderRadius = '5px';
      strengthIndicator.style.zIndex = '1000';
      document.body.appendChild(strengthIndicator);
      
      // Reset after duration
      setTimeout(() => {
        this.playerModel.scale.copy(originalScale);
        document.body.removeChild(strengthIndicator);
      }, 15000); // 15 seconds
    }
  }
  
  useDarkMatter() {
    // Create spectacular visual effect
    this.createDarkMatterEffect();
    
    // Give player special powers
    this.showNotification('You have harnessed the power of Dark Matter!', 5000);
    
    // Make player grow huge
    if (this.playerModel) {
      this.playerModel.scale.set(3, 3, 3);
    }
    
    // Dramatic effect on the environment
    this.applyDarkMatterWorldEffect();
  }
  
  createDarkMatterEffect() {
    // Create particle effect around player
    const particleCount = 1000;
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(
          Math.random() * 0.5,
          0,
          Math.random() * 0.5 + 0.5
        ),
        transparent: true,
        opacity: Math.random() * 0.5 + 0.5
      });
      
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Set random initial positions in a sphere around player
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 5;
      
      particle.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      
      particle.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05
        ),
        initialPosition: particle.position.clone()
      };
      
      particles.add(particle);
    }
    
    // Add particles to scene
    this.scene.add(particles);
    particles.position.copy(this.playerModel.position);
    
    // Animate particles
    const animateParticles = () => {
      if (!particles.parent) return; // Stop if particles removed
      
      particles.position.copy(this.playerModel.position);
      
      particles.children.forEach(particle => {
        // Move particle
        particle.position.add(particle.userData.velocity);
        
        // Rotate around player
        const rotAxis = new THREE.Vector3(0, 1, 0);
        particle.position.applyAxisAngle(rotAxis, 0.01);
        
        // Pulsate size
        const scale = 0.8 + Math.sin(performance.now() * 0.005) * 0.2;
        particle.scale.set(scale, scale, scale);
      });
      
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
    
    // Remove after 2 minutes
    setTimeout(() => {
      this.scene.remove(particles);
    }, 120000);
  }
  
  applyDarkMatterWorldEffect() {
    // Change sky color
    if (this.scene.background) {
      const originalColor = this.scene.background.clone();
      this.scene.background = new THREE.Color(0x000033);
      
      // Change lighting
      this.scene.children.forEach(child => {
        if (child.type === 'AmbientLight') {
          child.intensity = 0.3;
        }
        if (child.type === 'DirectionalLight') {
          child.color.set(0x7700ff);
        }
      });
      
      // Reset after 2 minutes
      setTimeout(() => {
        this.scene.background = originalColor;
        this.scene.children.forEach(child => {
          if (child.type === 'AmbientLight') {
            child.intensity = 0.5;
          }
          if (child.type === 'DirectionalLight') {
            child.color.set(0xffffff);
          }
        });
      }, 120000);
    }
  }
  
  showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.textContent = message;
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
    }, duration);
  }
  
  toggleInventory() {
    if (this.inventoryPanel.style.display === 'none') {
      this.updateInventoryPanel();
      this.inventoryPanel.style.display = 'block';
    } else {
      this.inventoryPanel.style.display = 'none';
    }
  }
  
  selectItemToUse() {
    // Create item selection panel
    const selectPanel = document.createElement('div');
    selectPanel.style.marginTop = '10px';
    selectPanel.innerHTML = '<p>Select an item to use:</p>';
    
    const itemOptions = document.createElement('div');
    
    // Add selectable items
    ['soda', 'taco', 'combo', 'combo_plus'].forEach(itemId => {
      if (this.inventory[itemId] > 0) {
        const item = this.items.find(i => i.id === itemId);
        
        const option = document.createElement('div');
        option.textContent = `${item.name} (${this.inventory[itemId]})`;
        option.style.padding = '5px 10px';
        option.style.margin = '5px 0';
        option.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        option.style.borderRadius = '4px';
        option.style.cursor = 'pointer';
        
        option.addEventListener('click', () => this.useItem(itemId));
        
        itemOptions.appendChild(option);
      }
    });
    
    selectPanel.appendChild(itemOptions);
    
    // Replace current inventory content
    this.inventoryPanel.innerHTML = '';
    this.inventoryPanel.appendChild(selectPanel);
    
    // Add back button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.style.padding = '5px 10px';
    backButton.addEventListener('click', () => this.updateInventoryPanel());
    
    this.inventoryPanel.appendChild(backButton);
  }
  
  useConsoleItem() {
    const consoleKeys = ['nintendo_switch', 'playstation5', 'xbox_series_x', 'wega_station', 'steam_deck'];
    let selectedKey = null;
    for (const key of consoleKeys) {
      if (this.inventory[key] > 0) {
        selectedKey = key;
        break;
      }
    }
    if (selectedKey) {
      // Remove one console from inventory and update UI
      this.inventory[selectedKey]--;
      this.updateInventoryPanel();
      // Force spawn a hoard of Wegas (even if they are disabled normally)
      if (window.walmart && typeof window.walmart.spawnWegaHoardOverride === 'function') {
        window.walmart.spawnWegaHoardOverride();
      }
      this.showNotification("Console used! A hoard of Wegas are chasing you!", 5000);
    } else {
      this.showNotification("No console available to use!", 3000);
    }
  }
}