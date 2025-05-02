import * as THREE from 'three';

export class Dealer {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.position = new THREE.Vector3(-100, 0, -100); 
    this.phrases = [
      "Psst... hey kid, want some unreleased games?",
      "I got Click 2, hot off the press...",
      "Super Peach Sis, only 50 coins...",
      "Toy Story 600... you won't find this anywhere else...",
      "Keep it down, don't want the cops finding me...",
      "These games fell off a truck, if you know what I mean...",
      "Special price for you, my friend..."
    ];
    this.lastPhraseTime = 0;
    this.phraseInterval = 5000 + Math.random() * 5000;
    this.chatMessage = null;
    this.dealerState = 'normal'; 
    this.dealerPrompt = null;
    this.dealerKeyListener = null;
    this.dealerMenu = null;
    this.cave = null;
    
    this.illegalGames = [
      { id: 'click2', name: 'Click 2', price: 1, description: 'The unreleased sequel to the hit movie' },
      { id: 'toystory600', name: 'Toy Story 600', price: 3, description: 'Skip 597 through 599, this one is the best' },
      { id: 'superpeach', name: 'Super Peach Sis', price: 150, description: 'The princess saves the plumber this time' },
      { id: 'gta7', name: 'GTA VII', price: 500, description: 'So new it skipped GTA VI entirely' },
      { id: 'minceraft', name: 'Mincecraft', price: 100, description: 'Legally distinct block game' }
    ];
    
    this.createCave();
    this.createDealerModel();
  }
  
  createCave() {
    const caveGroup = new THREE.Group();
    
    const entranceGeometry = new THREE.SphereGeometry(10, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const caveMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x554433,
      roughness: 1.0,
      metalness: 0.2,
      side: THREE.BackSide
    });
    const entrance = new THREE.Mesh(entranceGeometry, caveMaterial);
    entrance.rotation.x = Math.PI / 2;
    entrance.position.y = 10;
    caveGroup.add(entrance);
    
    const interiorGeometry = new THREE.CylinderGeometry(10, 10, 20, 16, 1, true);
    const interiorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x332211,
      roughness: 1.0,
      metalness: 0.1,
      side: THREE.BackSide
    });
    const interior = new THREE.Mesh(interiorGeometry, interiorMaterial);
    interior.position.y = 0;
    interior.rotation.x = Math.PI / 2;
    caveGroup.add(interior);
    
    const floorGeometry = new THREE.CircleGeometry(10, 16);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x665544,
      roughness: 1.0,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.1;
    floor.position.z = -10;
    caveGroup.add(floor);
    
    for (let i = 0; i < 8; i++) {
      const height = 1 + Math.random() * 3;
      const radius = 0.2 + Math.random() * 0.3;
      const stalagmiteGeometry = new THREE.ConeGeometry(radius, height, 8);
      const stalagmiteMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x776655,
        roughness: 0.9
      });
      const stalagmite = new THREE.Mesh(stalagmiteGeometry, stalagmiteMaterial);
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 8;
      stalagmite.position.set(
        Math.cos(angle) * distance,
        height / 2,
        -10 + Math.sin(angle) * distance
      );
      
      caveGroup.add(stalagmite);
    }
    
    const boxGeometry = new THREE.BoxGeometry(3, 1.5, 2);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(-5, 0.75, -15);
    box.rotation.y = Math.PI / 6;
    caveGroup.add(box);
    
    for (let i = 0; i < 6; i++) {
      const cartridgeGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.7);
      const cartridgeMaterial = new THREE.MeshStandardMaterial({ 
        color: Math.random() > 0.5 ? 0x55AAFF : 0xFF5555
      });
      const cartridge = new THREE.Mesh(cartridgeGeometry, cartridgeMaterial);
      cartridge.position.set(
        -5 + (Math.random() - 0.5) * 2,
        1.6,
        -15 + (Math.random() - 0.5) * 1.5
      );
      cartridge.rotation.y = Math.random() * Math.PI;
      caveGroup.add(cartridge);
    }
    
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 128;
    const context = textureCanvas.getContext('2d');
    context.fillStyle = '#222222';
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = '#FF5555';
    context.font = 'bold 72px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('RARE GAMES', 256, 64);
    
    const signTexture = new THREE.CanvasTexture(textureCanvas);
    const signGeometry = new THREE.PlaneGeometry(5, 1.25);
    const signMaterial = new THREE.MeshBasicMaterial({ 
      map: signTexture, 
      transparent: true,
      side: THREE.DoubleSide
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 5, -5);
    caveGroup.add(sign);
    
    const textureLoader = new THREE.TextureLoader();
    const adTexture = textureLoader.load('ha.png');
    const adGeometry = new THREE.PlaneGeometry(3, 1.5);
    const adMaterial = new THREE.MeshBasicMaterial({
      map: adTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const adSign = new THREE.Mesh(adGeometry, adMaterial);
    adSign.position.set(0, 6.5, -5);
    caveGroup.add(adSign);
    
    caveGroup.position.copy(this.position);
    
    caveGroup.userData.isBarrier = true;
    caveGroup.userData.isDealer = true;
    
    this.scene.add(caveGroup);
    this.cave = caveGroup;
  }
  
  createDealerModel() {
    const dealerGroup = new THREE.Group();
    
    const textureLoader = new THREE.TextureLoader();
    const dealerTexture = textureLoader.load('_val_woman__2__by_mrorlandomagicfan200_dj1lv4b-375w-2x.jpg');
    
    const dealerMaterial = new THREE.MeshBasicMaterial({
      map: dealerTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const dealerGeometry = new THREE.PlaneGeometry(2, 2);
    const dealerMesh = new THREE.Mesh(dealerGeometry, dealerMaterial);
    
    dealerGroup.add(dealerMesh);
    
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message dealer-chat';
    this.chatMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.chatMessage.style.color = '#66FF66';
    this.chatMessage.style.fontWeight = 'bold';
    this.chatMessage.style.fontSize = '16px';
    this.chatMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(this.chatMessage);
    
    dealerGroup.position.set(this.position.x, 1.2, this.position.z - 13);
    
    this.scene.add(dealerGroup);
    this.model = dealerGroup;
  }
  
  createPoliceOfficers() {
    const policeGroup = new THREE.Group();
    
    const textureLoader = new THREE.TextureLoader();
    const police1Texture = textureLoader.load('simmons ITS SPELT SIMMONS NOT SIMON.jpeg');
    const police2Texture = textureLoader.load('brooklyn guy.jpeg');
    
    const officerGeometry = new THREE.PlaneGeometry(2, 2);
    
    const officer1Material = new THREE.MeshBasicMaterial({
      map: police1Texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const officer1 = new THREE.Mesh(officerGeometry, officer1Material);
    officer1.position.set(-2, 0, 0);
    policeGroup.add(officer1);
    
    const officer2Material = new THREE.MeshBasicMaterial({
      map: police2Texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const officer2 = new THREE.Mesh(officerGeometry, officer2Material);
    officer2.position.set(2, 0, 0);
    policeGroup.add(officer2);
    
    const carTexture = textureLoader.load('images (4).jpg');
    const carGeometry = new THREE.PlaneGeometry(5, 3);
    const carMaterial = new THREE.MeshBasicMaterial({
      map: carTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const policeCar = new THREE.Mesh(carGeometry, carMaterial);
    policeCar.position.set(0, 0, 5);
    policeCar.rotation.x = -Math.PI / 6; 
    policeGroup.add(policeCar);
    
    policeGroup.position.set(this.position.x + 1000, 1.2, this.position.z + 1000);
    policeGroup.visible = false;
    
    this.scene.add(policeGroup);
    this.policeGroup = policeGroup;
  }
  
  update(camera, renderer, deltaTime) {
    if (this.dealerState === 'arrested') return;
    
    const distanceToDealerArea = this.playerModel.position.distanceTo(this.model.position);
      
    if (distanceToDealerArea < 15 && this.dealerState === 'normal') {
      this.showDealerPrompt();
    } else if (distanceToDealerArea >= 15 && this.dealerPrompt) {
      this.hideDealerPrompt();
    }
    
    if (this.dealerState === 'arresting' && this.policeGroup) {
      const targetPos = new THREE.Vector3().copy(this.model.position);
      targetPos.z += 3; 
      
      const currentPos = this.policeGroup.position;
      const direction = new THREE.Vector3().subVectors(targetPos, currentPos);
      
      if (direction.length() > 0.5) {
        direction.normalize().multiplyScalar(0.3); 
        this.policeGroup.position.add(direction);
        
        this.policeGroup.lookAt(this.model.position);
      } else {
        this.completeArrest();
      }
    }
    
    const dealerFace = this.model.children[0];
    if (dealerFace) {
      dealerFace.quaternion.copy(camera.quaternion);
    }
    
    if (this.dealerState === 'normal') {
      const now = Date.now();
      if (now - this.lastPhraseTime > this.phraseInterval) {
        this.sayPhrase();
        this.lastPhraseTime = now;
        this.phraseInterval = 5000 + Math.random() * 5000;
      }
    }
    
    if (this.chatMessage) {
      const screenPosition = this.getScreenPosition(this.model.position, camera, renderer);
      if (screenPosition && screenPosition.visible) {
        this.chatMessage.style.left = `${screenPosition.x}px`;
        this.chatMessage.style.top = `${screenPosition.y - 45}px`;
      } else {
        this.chatMessage.style.display = 'none';
      }
    }
    
    if (this.policeGroup && this.policeGroup.visible) {
      const officer1 = this.policeGroup.children[0];
      const officer2 = this.policeGroup.children[1];
      if (officer1 && officer2) {
        officer1.quaternion.copy(camera.quaternion);
        officer2.quaternion.copy(camera.quaternion);
      }
    }
  }
  
  showDealerPrompt() {
    if (!this.dealerPrompt) {
      this.dealerPrompt = document.createElement('div');
      this.dealerPrompt.style.position = 'fixed';
      this.dealerPrompt.style.bottom = '30%';
      this.dealerPrompt.style.left = '50%';
      this.dealerPrompt.style.transform = 'translateX(-50%)';
      this.dealerPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      this.dealerPrompt.style.color = 'white';
      this.dealerPrompt.style.padding = '15px 20px';
      this.dealerPrompt.style.borderRadius = '5px';
      this.dealerPrompt.style.zIndex = '1000';
      document.body.appendChild(this.dealerPrompt);
      
      this.dealerKeyListener = (e) => {
        if (e.key.toLowerCase() === 'b') {
          this.showDealerMenu();
        } else if (e.key.toLowerCase() === 'c') {
          this.callPolice();
        }
      };
      
      document.addEventListener('keydown', this.dealerKeyListener);
    }
    
    this.dealerPrompt.textContent = 'Press B to browse illegal games, or C to call the authorities';
    this.dealerPrompt.style.display = 'block';
  }
  
  hideDealerPrompt() {
    if (this.dealerPrompt) {
      this.dealerPrompt.style.display = 'none';
      document.removeEventListener('keydown', this.dealerKeyListener);
    }
  }
  
  showDealerMenu() {
    if (this.dealerPrompt) {
      this.dealerPrompt.style.display = 'none';
    }
    
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    
    this.dealerMenu = document.createElement('div');
    this.dealerMenu.style.position = 'fixed';
    this.dealerMenu.style.top = '50%';
    this.dealerMenu.style.left = '50%';
    this.dealerMenu.style.transform = 'translate(-50%, -50%)';
    this.dealerMenu.style.width = '500px';
    this.dealerMenu.style.maxHeight = '80%';
    this.dealerMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    this.dealerMenu.style.color = 'white';
    this.dealerMenu.style.padding = '20px';
    this.dealerMenu.style.borderRadius = '10px';
    this.dealerMenu.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
    this.dealerMenu.style.zIndex = '9999';
    this.dealerMenu.style.overflowY = 'auto';
    
    const header = document.createElement('h2');
    header.textContent = 'ILLEGAL GAME COPIES';
    header.style.textAlign = 'center';
    header.style.color = '#66FF66';
    header.style.marginBottom = '20px';
    this.dealerMenu.appendChild(header);
    
    const warning = document.createElement('p');
    warning.textContent = 'These games "fell off a truck" if you know what I mean. Keep this between us...';
    warning.style.color = '#FF6666';
    warning.style.fontStyle = 'italic';
    warning.style.marginBottom = '20px';
    warning.style.textAlign = 'center';
    this.dealerMenu.appendChild(warning);
    
    const closeButton = document.createElement('div');
    closeButton.textContent = '✕';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.addEventListener('click', () => this.closeDealerMenu());
    this.dealerMenu.appendChild(closeButton);
    
    const itemsContainer = document.createElement('div');
    this.dealerMenu.appendChild(itemsContainer);
    
    this.illegalGames.forEach(game => {
      const itemElement = document.createElement('div');
      itemElement.style.display = 'flex';
      itemElement.style.justifyContent = 'space-between';
      itemElement.style.alignItems = 'center';
      itemElement.style.padding = '10px';
      itemElement.style.margin = '5px 0';
      itemElement.style.backgroundColor = 'rgba(0, 100, 0, 0.2)';
      itemElement.style.borderRadius = '5px';
      
      const itemInfo = document.createElement('div');
      
      const itemName = document.createElement('div');
      itemName.textContent = game.name;
      itemName.style.fontSize = '18px';
      itemName.style.fontWeight = 'bold';
      itemName.style.color = '#66FF66';
      itemInfo.appendChild(itemName);
      
      const itemDesc = document.createElement('div');
      itemDesc.textContent = game.description;
      itemDesc.style.fontSize = '14px';
      itemDesc.style.color = '#aaa';
      itemInfo.appendChild(itemDesc);
      
      const itemPrice = document.createElement('div');
      itemPrice.textContent = `${game.price} coins`;
      itemPrice.style.color = 'gold';
      itemInfo.appendChild(itemPrice);
      
      itemElement.appendChild(itemInfo);
      
      const playerCoins = window.shop ? window.shop.coins : 0;
      
      const buyButton = document.createElement('button');
      buyButton.textContent = 'BUY';
      buyButton.style.padding = '8px 16px';
      buyButton.style.backgroundColor = playerCoins >= game.price ? '#4CAF50' : '#555';
      buyButton.style.border = 'none';
      buyButton.style.borderRadius = '4px';
      buyButton.style.color = 'white';
      buyButton.style.cursor = playerCoins >= game.price ? 'pointer' : 'not-allowed';
      buyButton.disabled = playerCoins < game.price;
      
      buyButton.addEventListener('click', () => {
        if (window.shop && window.shop.coins >= game.price) {
          this.purchaseGame(game);
        }
      });
      
      itemElement.appendChild(buyButton);
      itemsContainer.appendChild(itemElement);
    });
    
    const callPoliceButton = document.createElement('button');
    callPoliceButton.textContent = 'CALL AUTHORITIES';
    callPoliceButton.style.display = 'block';
    callPoliceButton.style.width = '100%';
    callPoliceButton.style.margin = '20px auto 10px';
    callPoliceButton.style.padding = '10px 20px';
    callPoliceButton.style.backgroundColor = '#FF5555';
    callPoliceButton.style.color = 'white';
    callPoliceButton.style.border = 'none';
    callPoliceButton.style.borderRadius = '5px';
    callPoliceButton.style.cursor = 'pointer';
    callPoliceButton.style.fontSize = '16px';
    callPoliceButton.style.fontWeight = 'bold';
    
    callPoliceButton.addEventListener('click', () => {
      this.closeDealerMenu();
      this.callPolice();
    });
    
    this.dealerMenu.appendChild(callPoliceButton);
    
    document.body.appendChild(this.dealerMenu);
    
    this.dealerState = 'dealing';
    
    this.chatMessage.textContent = "Take a look at my special collection... just don't tell anyone where you got them.";
    this.chatMessage.style.display = 'block';
  }
  
  closeDealerMenu() {
    if (this.dealerMenu) {
      document.body.removeChild(this.dealerMenu);
      this.dealerMenu = null;
    }
    
    if (window.playerControls) {
      window.playerControls.enabled = true;
    }
    
    if (this.dealerPrompt) {
      this.dealerPrompt.style.display = 'block';
    }
    
    this.dealerState = 'normal';
  }
  
  purchaseGame(game) {
    if (!window.shop) return;
    
    window.shop.coins -= game.price;
    
    window.shop.updateCoinCounter();
    
    this.closeDealerMenu();
    
    if (window.shop && window.shop.inventory) {
      window.shop.inventory[game.id] = (window.shop.inventory[game.id] || 0) + 1;
      window.shop.updateInventoryPanel();
    }
    
    this.showNotification(`Purchased illegal copy of ${game.name}! You're now a criminal!`, 5000);
    
    this.chatMessage.textContent = "Pleasure doing business with you. Remember, you didn't get this from me...";
    this.chatMessage.style.display = 'block';
  }
  
  callPolice() {
    this.hideDealerPrompt();
    
    if (this.dealerMenu) {
      this.closeDealerMenu();
    }
    
    this.dealerState = 'arresting';
    
    this.chatMessage.textContent = "WHAT?! YOU CALLED THE COPS?! YOU'LL REGRET THIS!";
    this.chatMessage.style.display = 'block';
    this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    
    if (!this.policeGroup) {
      this.createPoliceOfficers();
    }
    
    this.policeGroup.visible = true;
    this.policeGroup.position.set(
      this.position.x + 30,
      1.2,
      this.position.z + 30
    );
    
    this.showNotification("Authorities have been alerted! They're on their way!", 5000);
    
    setTimeout(() => {
      const animatePoliceLeaving = () => {
        if (this.policeGroup) {
          this.policeGroup.position.x += 0.5;
          this.policeGroup.position.z += 0.5;
          
          if (this.policeGroup.position.distanceTo(this.position) < 100) {
            requestAnimationFrame(animatePoliceLeaving);
          } else {
            this.policeGroup.visible = false;
            this.giveReward();
          }
        }
      };
      
      animatePoliceLeaving();
    }, 5000);
  }
  
  completeArrest() {
    this.dealerState = 'arrested';
    
    this.model.visible = false;
    
    const officer1ChatMessage = document.createElement('div');
    officer1ChatMessage.className = 'chat-message';
    officer1ChatMessage.style.backgroundColor = 'rgba(0, 0, 255, 0.7)';
    officer1ChatMessage.style.color = 'white';
    officer1ChatMessage.textContent = "You're under arrest for illegal game distribution!";
    officer1ChatMessage.style.position = 'absolute';
    document.getElementById('game-container').appendChild(officer1ChatMessage);
    
    const officer2ChatMessage = document.createElement('div');
    officer2ChatMessage.className = 'chat-message';
    officer2ChatMessage.style.backgroundColor = 'rgba(0, 0, 255, 0.7)';
    officer2ChatMessage.style.color = 'white';
    officer2ChatMessage.textContent = "Good work citizen, you'll be rewarded for your help!";
    officer2ChatMessage.style.position = 'absolute';
    document.getElementById('game-container').appendChild(officer2ChatMessage);
    
    const updateOfficerChat = () => {
      if (this.policeGroup && this.policeGroup.visible) {
        const camera = window.playerControls ? window.playerControls.getCamera() : null;
        const renderer = window.playerControls ? window.playerControls.renderer : null;
        
        if (camera && renderer) {
          const officer1Pos = new THREE.Vector3().copy(this.policeGroup.position).add(new THREE.Vector3(-2, 1.5, 0));
          const officer2Pos = new THREE.Vector3().copy(this.policeGroup.position).add(new THREE.Vector3(2, 1.5, 0));
          
          const screenPos1 = this.getScreenPosition(officer1Pos, camera, renderer);
          const screenPos2 = this.getScreenPosition(officer2Pos, camera, renderer);
          
          if (screenPos1 && screenPos1.visible) {
            officer1ChatMessage.style.left = `${screenPos1.x}px`;
            officer1ChatMessage.style.top = `${screenPos1.y - 45}px`;
            officer1ChatMessage.style.display = 'block';
          } else {
            officer1ChatMessage.style.display = 'none';
          }
          
          if (screenPos2 && screenPos2.visible) {
            officer2ChatMessage.style.left = `${screenPos2.x}px`;
            officer2ChatMessage.style.top = `${screenPos2.y - 45}px`;
            officer2ChatMessage.style.display = 'block';
          } else {
            officer2ChatMessage.style.display = 'none';
          }
        }
      }
      
      if (this.dealerState === 'arrested') {
        requestAnimationFrame(updateOfficerChat);
      }
    };
    
    updateOfficerChat();
    
    setTimeout(() => {
      this.policeGroup.visible = false;
      document.getElementById('game-container').removeChild(officer1ChatMessage);
      document.getElementById('game-container').removeChild(officer2ChatMessage);
      
      this.giveReward();
    }, 5000);
  }
  
  giveReward() {
    if (window.shop) {
      window.shop.coins += 100000;
      window.shop.updateCoinCounter();
    }
    
    const rewardNotification = document.createElement('div');
    rewardNotification.style.position = 'fixed';
    rewardNotification.style.top = '50%';
    rewardNotification.style.left = '50%';
    rewardNotification.style.transform = 'translate(-50%, -50%)';
    rewardNotification.style.backgroundColor = 'rgba(0, 100, 0, 0.9)';
    rewardNotification.style.color = 'gold';
    rewardNotification.style.padding = '30px 50px';
    rewardNotification.style.borderRadius = '10px';
    rewardNotification.style.zIndex = '9999';
    rewardNotification.style.fontSize = '28px';
    rewardNotification.style.textAlign = 'center';
    rewardNotification.style.boxShadow = '0 0 50px rgba(255, 255, 0, 0.5)';
    
    rewardNotification.innerHTML = `
      <h1 style="color: gold; margin-bottom: 20px;">REWARD!</h1>
      <p>For your civic duty in reporting illegal activities:</p>
      <p style="font-size: 36px; color: yellow; margin: 20px 0;">+100,000 COINS</p>
      <p>The gaming industry thanks you!</p>
    `;
    
    document.body.appendChild(rewardNotification);
    
    setTimeout(() => {
      document.body.removeChild(rewardNotification);
    }, 8000);
  }
  
  sayPhrase() {
    const phrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
    
    this.chatMessage.textContent = phrase;
    this.chatMessage.style.display = 'block';
    
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
  
  getScreenPosition(position, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = renderer.domElement.width / 2;
    const heightHalf = renderer.domElement.height / 2;
    
    vector.copy(position);
    
    vector.project(camera);
    
    const isInFront = vector.z < 1;
    
    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf,
      visible: isInFront
    };
  }
}