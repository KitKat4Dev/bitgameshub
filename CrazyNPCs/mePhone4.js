import * as THREE from 'three';

export class MePhone4 {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.position = new THREE.Vector3(75, 0, -85); 
    this.phrases = [
      "Hey there, I'm MePhone4!",
      "Want the latest iPhone? I got them ALL!",
      "iPhone 2849281498 just dropped, only 939392391388 coins!",
      "These phones are definitely not stolen!",
      "Don't ask where I'm selling these!",
      "Limited time offer! Buy now!",
      "My phones have features from the FUTURE!"
    ];
    this.lastPhraseTime = 0;
    this.phraseInterval = 4000 + Math.random() * 3000;
    this.chatMessage = null;
    this.mePhonePrompt = null;
    this.isBusted = false;
    this.phoneStand = null;
    this.blackHoleActive = false;
    this.blackHole = null;
    this.blackHoleSize = 0;
    
    this.phones = [
      { id: 'iphone15', name: 'iPhone 15 Pro', price: 1000, description: 'The latest Apple flagship' },
      { id: 'iphone20', name: 'iPhone 20 Ultra', price: 5000, description: 'Time-travelled from 2028' },
      { id: 'iphone100', name: 'iPhone 100 Quantum', price: 100000, description: 'Has quantum computing chips' },
      { id: 'iphone1000', name: 'iPhone 1000 Neural', price: 1000000, description: 'Neural interface included' },
      { id: 'iphoneUltimate', name: 'iPhone 2849281498', price: 939392391388, description: 'Features from beyond comprehension!' }
    ];
    
    this.createPhoneStand();
    this.createMePhoneModel();
  }
  
  createPhoneStand() {
    const phoneStand = new THREE.Group();
    
    const boothGeometry = new THREE.BoxGeometry(6, 4, 6);
    const boothMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db }); 
    const booth = new THREE.Mesh(boothGeometry, boothMaterial);
    booth.position.y = 2;
    phoneStand.add(booth);
    
    const roofGeometry = new THREE.BoxGeometry(7, 0.5, 7);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x2980b9 }); 
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 4.25;
    phoneStand.add(roof);
    
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 128;
    const context = textureCanvas.getContext('2d');
    context.fillStyle = '#2980b9';
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = 'white';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('PHONE STORE', 256, 64);
    
    const signTexture = new THREE.CanvasTexture(textureCanvas);
    const signGeometry = new THREE.PlaneGeometry(4, 1);
    const signMaterial = new THREE.MeshBasicMaterial({ 
      map: signTexture, 
      transparent: true,
      side: THREE.DoubleSide
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 4.5, 0);
    phoneStand.add(sign);
    
    phoneStand.position.copy(this.position);
    
    phoneStand.userData.isBarrier = true;
    phoneStand.userData.isPhoneStore = true;
    
    this.scene.add(phoneStand);
    this.phoneStand = phoneStand;
  }
  
  createMePhoneModel() {
    const mePhoneGroup = new THREE.Group();
    
    // Load texture for MePhone4
    const textureLoader = new THREE.TextureLoader();
    const mePhoneTexture = textureLoader.load('MePhone4_21 (1).png');
    
    // Create material with the texture
    const mePhoneMaterial = new THREE.MeshBasicMaterial({
      map: mePhoneTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create a plane for MePhone4
    const mePhoneGeometry = new THREE.PlaneGeometry(3, 3);
    const mePhoneMesh = new THREE.Mesh(mePhoneGeometry, mePhoneMaterial);
    
    // Add to group
    mePhoneGroup.add(mePhoneMesh);
    
    // Create chat message element for MePhone
    const chatMessage = document.createElement('div');
    chatMessage.className = 'chat-message mephone-chat';
    chatMessage.style.backgroundColor = 'rgba(52, 152, 219, 0.8)';
    chatMessage.style.color = 'white';
    chatMessage.style.fontWeight = 'bold';
    chatMessage.style.fontSize = '16px';
    chatMessage.style.display = 'none';
    chatMessage.style.width = '400px';
    document.getElementById('game-container').appendChild(chatMessage);
    
    mePhoneGroup.position.set(
      this.position.x,
      1.5,
      this.position.z
    );
    
    this.scene.add(mePhoneGroup);
    this.model = mePhoneGroup;
    this.chatMessage = chatMessage;
  }
  
  update(camera, renderer, deltaTime) {
    if (this.isBusted && this.blackHoleActive) {
      this.updateBlackHole(deltaTime);
      return;
    }
    
    if (this.blackHoleActive) {
      this.updateBlackHole(deltaTime);
      return;
    }
    
    const distanceToMePhoneArea = this.playerModel.position.distanceTo(this.model.position);
      
    if (distanceToMePhoneArea < 15 && !this.mePhonePrompt && !this.isBusted) {
      this.showMePhonePrompt();
    } else if (distanceToMePhoneArea >= 15 && this.mePhonePrompt) {
      this.hideMePhonePrompt();
    }
      
    if (!this.isBusted) {
      this.model.position.y = 1.5 + Math.sin(performance.now() * 0.002) * 0.1;
        
      if (distanceToMePhoneArea < 10) {
        const direction = new THREE.Vector3();
        direction.subVectors(this.playerModel.position, this.model.position);
        direction.y = 0;
        if (direction.length() > 0.001) {
          this.model.lookAt(
            this.model.position.x + direction.x,
            this.model.position.y,
            this.model.position.z + direction.z
          );
        }
      }
        
      const now = Date.now();
      if (now - this.lastPhraseTime > this.phraseInterval) {
        this.sayPhrase();
        this.lastPhraseTime = now;
        this.phraseInterval = 4000 + Math.random() * 3000;
      }
    }
    
    if (this.mePhonePrompt && this.playerModel) {
      const screenPosition = this.getScreenPosition(this.model.position, camera, renderer);
      if (screenPosition) {
        this.mePhonePrompt.style.left = `${screenPosition.x}px`;
        this.mePhonePrompt.style.top = `${screenPosition.y - 60}px`;
      } else {
        this.mePhonePrompt.style.display = 'none';
      }
    }
    
    if (this.chatMessage && this.model) {
      const screenPosition = this.getScreenPosition(this.model.position, camera, renderer);
      if (screenPosition) {
        this.chatMessage.style.left = `${screenPosition.x}px`;
        this.chatMessage.style.top = `${screenPosition.y - 45}px`;
      } else {
        this.chatMessage.style.display = 'none';
      }
    }
  }
  
  updateBlackHole(deltaTime) {
    if (!this.blackHole) {
      this.createBlackHole();
    }
    
    this.blackHoleSize += deltaTime * 0.005;
    const maxSize = 5;
    
    if (this.blackHoleSize <= maxSize) {
      this.blackHole.scale.set(this.blackHoleSize, this.blackHoleSize, this.blackHoleSize);
      
      if (this.model) {
        this.model.position.y -= deltaTime * 0.003;
        this.model.scale.multiplyScalar(0.995);
        
        this.model.rotation.x += deltaTime * 0.01;
        this.model.rotation.z += deltaTime * 0.01;
        
        if (this.model.position.y < -3) {
          this.scene.remove(this.model);
          this.model = null;
        }
      }
    } else {
      this.blackHoleSize -= deltaTime * 0.01;
      this.blackHole.scale.set(this.blackHoleSize, this.blackHoleSize, this.blackHoleSize);
      
      if (this.blackHoleSize <= 0.1) {
        this.scene.remove(this.blackHole);
        this.blackHole = null;
        this.blackHoleActive = false;
        
        this.giveRewards();
      }
    }
  }
  
  createBlackHole() {
    const blackHoleGeometry = new THREE.SphereGeometry(1, 32, 32);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.8
    });
    
    const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000FF,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    
    this.blackHole = new THREE.Group();
    
    const blackHoleMesh = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    this.blackHole.add(blackHoleMesh);
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    this.blackHole.add(glowMesh);
    
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 1 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const distance = Math.random() * 3;
      positions[i3] = radius * Math.sin(theta);
      positions[i3 + 1] = 0;
      positions[i3 + 2] = distance;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x0088FF,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    this.blackHole.add(particles);
    
    const animateParticles = () => {
      if (!this.blackHole) return;
      
      const positions = particles.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        positions[i3] = Math.sin(performance.now() * 0.01) * 2;
        positions[i3 + 2] = Math.cos(performance.now() * 0.01) * 2;
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
      
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
    
    this.blackHole.position.set(this.model.position.x, 0, this.model.position.z);
    this.blackHole.scale.set(0.1, 0.1, 0.1);
    
    this.scene.add(this.blackHole);
  }
  
  showMePhonePrompt() {
    if (!this.mePhonePrompt) {
      this.mePhonePrompt = document.createElement('div');
      this.mePhonePrompt.style.position = 'fixed';
      this.mePhonePrompt.style.bottom = '30%';
      this.mePhonePrompt.style.left = '50%';
      this.mePhonePrompt.style.transform = 'translateX(-50%)';
      this.mePhonePrompt.style.backgroundColor = 'rgba(52, 152, 219, 0.8)';
      this.mePhonePrompt.style.color = 'white';
      this.mePhonePrompt.style.padding = '15px 20px';
      this.mePhonePrompt.style.borderRadius = '5px';
      this.mePhonePrompt.style.zIndex = '1000';
      document.body.appendChild(this.mePhonePrompt);
      
      this.mePhoneKeyListener = (e) => {
        if (e.key.toLowerCase() === 'p') {
          this.showPhoneMenu();
        } else if (e.key.toLowerCase() === 'r') {
          this.reportToPolice();
        }
      };
      
      document.addEventListener('keydown', this.mePhoneKeyListener);
    }
    
    this.mePhonePrompt.textContent = 'Press P to browse phones, or R to report to police';
    this.mePhonePrompt.style.display = 'block';
  }
  
  hideMePhonePrompt() {
    if (this.mePhonePrompt) {
      this.mePhonePrompt.style.display = 'none';
      document.removeEventListener('keydown', this.mePhoneKeyListener);
    }
  }
  
  showPhoneMenu() {
    if (this.mePhonePrompt) {
      this.mePhonePrompt.style.display = 'none';
    }
    
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    
    const phoneMenu = document.createElement('div');
    phoneMenu.style.position = 'fixed';
    phoneMenu.style.top = '50%';
    phoneMenu.style.left = '50%';
    phoneMenu.style.transform = 'translate(-50%, -50%)';
    phoneMenu.style.width = '500px';
    phoneMenu.style.maxHeight = '80%';
    phoneMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    phoneMenu.style.color = 'white';
    phoneMenu.style.padding = '20px';
    phoneMenu.style.borderRadius = '10px';
    phoneMenu.style.boxShadow = '0 0 20px rgba(52, 152, 219, 0.5)';
    phoneMenu.style.zIndex = '9999';
    phoneMenu.style.overflowY = 'auto';
    
    const header = document.createElement('h2');
    header.textContent = 'MEPHONE\'S EXCLUSIVE PHONES';
    header.style.textAlign = 'center';
    header.style.color = '#3498db';
    header.style.marginBottom = '20px';
    phoneMenu.appendChild(header);
    
    const warning = document.createElement('p');
    warning.textContent = 'These are totally legitimate phones, not stolen or from the future at all...';
    warning.style.color = '#e74c3c';
    warning.style.fontStyle = 'italic';
    warning.style.marginBottom = '20px';
    warning.style.textAlign = 'center';
    phoneMenu.appendChild(warning);
    
    const closeButton = document.createElement('div');
    closeButton.textContent = '✕';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.addEventListener('click', () => this.closePhoneMenu(phoneMenu));
    phoneMenu.appendChild(closeButton);
    
    const itemsContainer = document.createElement('div');
    phoneMenu.appendChild(itemsContainer);
    
    const playerCoins = window.shop ? window.shop.coins : 0;
    
    this.phones.forEach(phone => {
      const itemElement = document.createElement('div');
      itemElement.style.display = 'flex';
      itemElement.style.justifyContent = 'space-between';
      itemElement.style.alignItems = 'center';
      itemElement.style.padding = '10px';
      itemElement.style.margin = '5px 0';
      itemElement.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
      itemElement.style.borderRadius = '5px';
      
      const itemInfo = document.createElement('div');
      
      const itemName = document.createElement('div');
      itemName.textContent = phone.name;
      itemName.style.fontSize = '18px';
      itemName.style.fontWeight = 'bold';
      itemName.style.color = '#3498db';
      itemInfo.appendChild(itemName);
      
      const itemDesc = document.createElement('div');
      itemDesc.textContent = phone.description;
      itemDesc.style.fontSize = '14px';
      itemDesc.style.color = '#aaa';
      itemInfo.appendChild(itemDesc);
      
      const itemPrice = document.createElement('div');
      itemPrice.textContent = `${phone.price.toLocaleString()} coins`;
      itemPrice.style.color = 'gold';
      itemInfo.appendChild(itemPrice);
      
      itemElement.appendChild(itemInfo);
      
      const buyButton = document.createElement('button');
      buyButton.textContent = 'BUY';
      buyButton.style.padding = '8px 16px';
      buyButton.style.backgroundColor = playerCoins >= phone.price ? '#3498db' : '#555';
      buyButton.style.border = 'none';
      buyButton.style.borderRadius = '4px';
      buyButton.style.color = 'white';
      buyButton.style.cursor = playerCoins >= phone.price ? 'pointer' : 'not-allowed';
      buyButton.disabled = playerCoins < phone.price;
      
      buyButton.addEventListener('click', () => {
        if (window.shop && window.shop.coins >= phone.price) {
          this.purchasePhone(phone, phoneMenu);
        }
      });
      
      itemElement.appendChild(buyButton);
      itemsContainer.appendChild(itemElement);
    });
    
    const reportButton = document.createElement('button');
    reportButton.textContent = 'REPORT TO POLICE';
    reportButton.style.display = 'block';
    reportButton.style.width = '100%';
    reportButton.style.margin = '20px auto 10px';
    reportButton.style.padding = '10px 20px';
    reportButton.style.backgroundColor = '#e74c3c';
    reportButton.style.color = 'white';
    reportButton.style.border = 'none';
    reportButton.style.borderRadius = '5px';
    reportButton.style.cursor = 'pointer';
    reportButton.style.fontSize = '16px';
    reportButton.style.fontWeight = 'bold';
    
    reportButton.addEventListener('click', () => {
      this.closePhoneMenu(phoneMenu);
      this.reportToPolice();
    });
    
    phoneMenu.appendChild(reportButton);
    
    document.body.appendChild(phoneMenu);
    
    this.sayPhrase("Take a look at my incredible selection! The iPhone 2849281498 is a steal!");
  }
  
  closePhoneMenu(menu) {
    document.body.removeChild(menu);
    
    if (window.playerControls) {
      window.playerControls.enabled = true;
    }
    
    if (this.mePhonePrompt) {
      this.mePhonePrompt.style.display = 'block';
    }
  }
  
  purchasePhone(phone, menu) {
    if (!window.shop) return;
    
    window.shop.coins -= phone.price;
    window.shop.updateCoinCounter();
    
    this.closePhoneMenu(menu);
    
    if (phone.id === 'iphoneUltimate') {
      this.showNotification(`You've purchased the legendary iPhone ${phone.name}! Wait... it's just a brick painted silver.`, 5000);
      
      if (window.shop && window.shop.inventory) {
        window.shop.inventory.fakeiphone = (window.shop.inventory.fakeiphone || 0) + 1;
        window.shop.updateInventoryPanel();
      }
      
      this.sayPhrase("HAHA! That's just a painted brick! Thanks for the coins, sucker!");
    } else {
      this.showNotification(`Purchased ${phone.name}!`, 3000);
      
      if (window.shop && window.shop.inventory 
          && window.shop.inventory[phone.id] !== undefined) {
        window.shop.inventory[phone.id] += 1;
        window.shop.updateInventoryPanel();
      }
      
      this.sayPhrase("Pleasure doing business with you! No refunds, by the way!");
    }
  }
  
  reportToPolice() {
    this.hideMePhonePrompt();
    this.isBusted = true;
    
    this.chatMessage.textContent = "WAIT! NO! I'M INNOCENT! THESE ARE LEGIT PHONES!";
    this.chatMessage.style.display = 'block';
    this.chatMessage.style.backgroundColor = 'rgba(231, 76, 60, 0.8)';
    
    this.createNotification();
    
    this.showNotification("You've reported MePhone4 to the authorities!", 5000);
    
    setTimeout(() => {
      this.startBlackHoleSequence();
    }, 5000);
  }
  
  createNotification() {
    const notification = document.createElement('div');
    notification.className = 'chat-message';
    notification.style.backgroundColor = 'rgba(0, 0, 255, 0.7)';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.fontSize = '16px';
    notification.style.width = '400px';
    notification.textContent = "MePhone4! You're under arrest for selling counterfeit phones! The punishment is THE VOID!";
    notification.style.position = 'fixed';
    notification.style.top = '40%';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.textAlign = 'center';
    document.getElementById('game-container').appendChild(notification);
    
    // Create police officer notification
    const policeOfficer = document.createElement('div');
    policeOfficer.className = 'chat-message';
    policeOfficer.style.backgroundColor = 'rgba(0, 0, 100, 0.9)';
    policeOfficer.style.color = 'white';
    policeOfficer.style.fontWeight = 'bold';
    policeOfficer.style.fontSize = '16px';
    policeOfficer.style.width = '400px';
    policeOfficer.style.padding = '15px';
    policeOfficer.style.borderRadius = '8px';
    policeOfficer.style.border = '2px solid #00FFFF';
    policeOfficer.textContent = "CYBER POLICE: MePhone4! You're under arrest for selling counterfeit phones! The punishment is THE VOID!";
    policeOfficer.style.position = 'fixed';
    policeOfficer.style.top = '30%';
    policeOfficer.style.left = '50%';
    policeOfficer.style.transform = 'translateX(-50%)';
    policeOfficer.style.textAlign = 'center';
    document.getElementById('game-container').appendChild(policeOfficer);
    
    // Remove both notifications after delay
    setTimeout(() => {
      document.getElementById('game-container').removeChild(notification);
      document.getElementById('game-container').removeChild(policeOfficer);
    }, 5000);
  }
  
  startBlackHoleSequence() {
    this.blackHoleActive = true;
    
    this.createPoliceForces();
    
    this.showNotification("INITIATING BLACK HOLE CONTAINMENT PROTOCOL", 5000);
    
    const warningMessage = document.createElement('div');
    warningMessage.style.position = 'fixed';
    warningMessage.style.top = '50%';
    warningMessage.style.left = '50%';
    warningMessage.style.transform = 'translate(-50%, -50%)';
    warningMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    warningMessage.style.color = '#3498db';
    warningMessage.style.padding = '20px';
    warningMessage.style.borderRadius = '10px';
    warningMessage.style.zIndex = '9999';
    warningMessage.style.textAlign = 'center';
    warningMessage.style.fontSize = '24px';
    warningMessage.textContent = "INITIATING BLACK HOLE CONTAINMENT PROTOCOL";
    
    document.body.appendChild(warningMessage);
    
    let opacity = 1;
    const fadeWarning = () => {
      opacity = opacity > 0.5 ? 0.2 : 1;
      warningMessage.style.opacity = opacity;
      
      if (this.blackHoleActive && opacity > 0) {
        setTimeout(fadeWarning, 500);
      } else {
        document.body.removeChild(warningMessage);
      }
    };
    
    fadeWarning();
    
    this.chatMessage.textContent = "NOOOOO! NOT THE BLACK HOLE! HELP MEEEEE!";
    this.chatMessage.style.display = 'block';
  }
  
  createPoliceForces() {
    const policeGroup = new THREE.Group();
    
    const carGeometry = new THREE.BoxGeometry(3, 1, 5);
    const carMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const car = new THREE.Mesh(carGeometry, carMaterial);
    policeGroup.add(car);
    
    const lights = new THREE.Group();
    lights.position.set(0, 0.65, 0);
    
    const redLightMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000, emissive: 0xFF0000 });
    const blueLightMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF, emissive: 0x0000FF });
    
    const redLight = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 0.5), redLightMaterial);
    redLight.position.set(-0.5, 0, 0);
    redLight.scale.set(0.5, 1, 1);
    lights.add(redLight);
    
    const blueLight = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 0.5), blueLightMaterial);
    blueLight.position.set(0.5, 0, 0);
    blueLight.scale.set(0.5, 1, 1);
    lights.add(blueLight);
    
    car.add(lights);
    
    const animatePoliceArrival = () => {
      if (!this.policeGroup || this.blackHoleActive) return;
      
      const targetPos = new THREE.Vector3(
        this.model.position.x + 5,
        0.5,
        this.model.position.z
      );
      
      const direction = new THREE.Vector3();
      direction.subVectors(targetPos, this.policeGroup.position);
      
      if (direction.length() > 0.5) {
        direction.normalize();
        direction.multiplyScalar(0.2);
        this.policeGroup.position.add(direction);
        
        this.policeGroup.lookAt(this.model.position);
        
        if (lights.children.length >= 2) {
          const redLight = lights.children[0];
          const blueLight = lights.children[1];
          
          redLight.visible = Math.floor(Date.now() / 200) % 2 === 0;
          blueLight.visible = Math.floor(Date.now() / 200) % 2 === 1;
        }
        
        requestAnimationFrame(animatePoliceArrival);
      }
    };
    
    animatePoliceArrival();
  }
  
  giveRewards() {
    if (window.shop) {
      window.shop.coins += 100000;
      window.shop.updateCoinCounter();
    }
    
    const rewardNotification = document.createElement('div');
    rewardNotification.style.position = 'fixed';
    rewardNotification.style.top = '50%';
    rewardNotification.style.left = '50%';
    rewardNotification.style.transform = 'translate(-50%, -50%)';
    rewardNotification.style.backgroundColor = 'rgba(39, 174, 96, 0.9)';
    rewardNotification.style.color = 'white';
    rewardNotification.style.padding = '30px';
    rewardNotification.style.borderRadius = '10px';
    rewardNotification.style.zIndex = '9999';
    rewardNotification.style.fontSize = '24px';
    rewardNotification.style.textAlign = 'center';
    rewardNotification.style.maxWidth = '600px';
    
    rewardNotification.innerHTML = `
      <h2 style="margin-bottom: 20px; color: #f1c40f;">REWARD RECEIVED!</h2>
      <p>For reporting the illegal phone dealer:</p>
      <p style="font-size: 32px; color: #f1c40f; margin: 20px 0;">+1000 MR BEAST EDIBLE BARS</p>
      <p style="color: #e74c3c; font-size: 14px; margin-top: 20px;">Warning: Side effects include nausea, rabies, vomit, and death.</p>
    `;
    
    document.body.appendChild(rewardNotification);
    
    const useButton = document.createElement('button');
    useButton.textContent = 'USE ONE NOW';
    useButton.style.padding = '10px 20px';
    useButton.style.backgroundColor = '#e74c3c';
    useButton.style.color = 'white';
    useButton.style.border = 'none';
    useButton.style.borderRadius = '5px';
    useButton.style.cursor = 'pointer';
    useButton.style.margin = '20px auto';
    useButton.style.display = 'block';
    useButton.addEventListener('click', () => {
      document.body.removeChild(rewardNotification);
      this.useMrBeastBar();
    });
    
    rewardNotification.appendChild(useButton);
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'CLOSE';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#333';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.margin = '0 auto';
    closeButton.style.display = 'block';
    closeButton.addEventListener('click', () => {
      document.body.removeChild(rewardNotification);
    });
    
    rewardNotification.appendChild(closeButton);
    
    setTimeout(() => {
      if (document.body.contains(rewardNotification)) {
        document.body.removeChild(rewardNotification);
      }
    }, 15000);
  }
  
  useMrBeastBar() {
    const sideEffectOverlay = document.createElement('div');
    sideEffectOverlay.style.position = 'fixed';
    sideEffectOverlay.style.top = '0';
    sideEffectOverlay.style.left = '0';
    sideEffectOverlay.style.width = '100%';
    sideEffectOverlay.style.height = '100%';
    sideEffectOverlay.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    sideEffectOverlay.style.zIndex = '9990';
    sideEffectOverlay.style.pointerEvents = 'none';
    document.body.appendChild(sideEffectOverlay);
    
    const textOverlay = document.createElement('div');
    textOverlay.style.position = 'fixed';
    textOverlay.style.bottom = '50px';
    textOverlay.style.left = '0';
    textOverlay.style.width = '100%';
    textOverlay.style.textAlign = 'center';
    textOverlay.style.color = 'red';
    textOverlay.style.fontWeight = 'bold';
    textOverlay.style.fontSize = '24px';
    document.body.appendChild(textOverlay);
    
    let stage = 0;
    const effects = [
      "You feel nauseous...",
      "Your mouth is starting to foam... (Rabies activated)",
      "You feel like vomiting...",
      "You don't feel so good...",
      "Side effects will wear off in 5 seconds..."
    ];
    
    const updateSideEffects = () => {
      if (stage < effects.length) {
        textOverlay.textContent = effects[stage];
        stage++;
        
        switch (stage) {
          case 1: 
            sideEffectOverlay.style.animation = 'wobble 2s infinite';
            break;
          case 2: 
            sideEffectOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            break;
          case 3: 
            sideEffectOverlay.style.backgroundColor = 'rgba(0, 255, 0, 0.4)';
            break;
          case 4: 
            sideEffectOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            break;
        }
        
        setTimeout(updateSideEffects, 2000);
      } else {
        document.body.removeChild(sideEffectOverlay);
        document.body.removeChild(textOverlay);
        
        if (window.shop && window.shop.inventory && window.shop.inventory.mrBeastBars > 0) {
          window.shop.inventory.mrBeastBars--;
          if (window.shop.updateInventoryPanel) {
            window.shop.updateInventoryPanel();
          }
        }
      }
    };
    
    updateSideEffects();
    
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes wobble {
        0% { transform: translate(0, 0) rotate(0); }
        25% { transform: translate(-5px, -5px) rotate(-1deg); }
        50% { transform: translate(5px, 5px) rotate(1deg); }
        75% { transform: translate(-5px, 5px) rotate(-1deg); }
        100% { transform: translate(0, 0) rotate(0); }
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  sayPhrase(specificPhrase = null) {
    const phrase = specificPhrase || this.phrases[Math.floor(Math.random() * this.phrases.length)];
    
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
    notification.style.backgroundColor = 'rgba(52, 152, 219, 0.8)';
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