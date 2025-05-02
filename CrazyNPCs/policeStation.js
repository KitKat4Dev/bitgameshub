import * as THREE from 'three';

export class PoliceStation {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.position = new THREE.Vector3(-70, 0, 70); 
    this.stationBuilding = null;
    this.prisonerModels = {};
    this.paperManArrested = false;
    this.chatMessages = {};
    this.stationPrompt = null;
    this.stationKeyListener = null;
    this.prisonerTalkPrompt = null;
    this.prisonerTalkActive = false;
    this.gameOverScreen = null;
    
    this.prisoners = [
      { id: 'dealer', name: 'Game Dealer', reason: 'Selling illegal games', model: null, position: { x: -3, y: 0.5, z: -2 } },
      { id: 'mephone4', name: 'MePhone4', reason: 'Counterfeit phone sales', model: null, position: { x: 3, y: 0.5, z: -2 } },
      { id: 'paperman', name: 'Paper Man', reason: 'Attempted bomb purchase', model: null, position: { x: 0, y: 0.5, z: -5 } }
    ];
    
    this.createPoliceStation();
    this.createPrisoners();
    
    this.setupPaperManArrest();
  }
  
  createPoliceStation() {
    const stationGroup = new THREE.Group();
    
    const baseGeometry = new THREE.BoxGeometry(25, 10, 20);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x1E3A8A }); 
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 5;
    stationGroup.add(base);
    
    const roofGeometry = new THREE.BoxGeometry(27, 1, 22);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x0F2361 }); 
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 10.5;
    stationGroup.add(roof);
    
    const frontSteps = new THREE.Mesh(
      new THREE.BoxGeometry(10, 1, 3),
      new THREE.MeshStandardMaterial({ color: 0xCCCCCC })
    );
    frontSteps.position.set(0, 0.5, 11.5);
    stationGroup.add(frontSteps);
    
    const entranceGeometry = new THREE.BoxGeometry(6, 8, 0.5);
    const entranceMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xADD8E6,
      transparent: true,
      opacity: 0.7
    });
    const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
    entrance.position.set(0, 4, 10.26);
    stationGroup.add(entrance);
    
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 128;
    const context = textureCanvas.getContext('2d');
    context.fillStyle = '#0F2361';
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = 'white';
    context.font = 'bold 64px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('POLICE', 256, 64);
    
    const signTexture = new THREE.CanvasTexture(textureCanvas);
    const signGeometry = new THREE.PlaneGeometry(10, 2.5);
    const signMaterial = new THREE.MeshBasicMaterial({ 
      map: signTexture, 
      transparent: true,
      side: THREE.DoubleSide
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 12, 10.1);
    stationGroup.add(sign);
    
    const textureLoader = new THREE.TextureLoader();
    const adTexture = textureLoader.load('ha.png');
    const adGeometry = new THREE.PlaneGeometry(3, 1.5);
    const adMaterial = new THREE.MeshBasicMaterial({
      map: adTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const adSign = new THREE.Mesh(adGeometry, adMaterial);
    adSign.position.set(0, 6.5, 10);
    stationGroup.add(adSign);
    
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = 256;
    logoCanvas.height = 256;
    const logoCtx = logoCanvas.getContext('2d');
    
    logoCtx.fillStyle = '#333333';
    logoCtx.fillRect(0, 0, 256, 256);
    logoCtx.fillStyle = 'white';
    logoCtx.font = 'bold 40px Arial';
    logoCtx.textAlign = 'center';
    logoCtx.textBaseline = 'middle';
    logoCtx.fillText('POLICE', 128, 128);
    
    const logoTexture = new THREE.CanvasTexture(logoCanvas);
    const logoGeometry = new THREE.CircleGeometry(3, 32);
    const logoMaterial = new THREE.MeshBasicMaterial({
      map: logoTexture,
      side: THREE.DoubleSide
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 6, 10.3);
    stationGroup.add(logo);
    
    stationGroup.position.copy(this.position);
    this.stationBuilding = stationGroup;
    
    stationGroup.userData.isBarrier = true;
    stationGroup.userData.isPoliceStation = true;
    
    this.scene.add(stationGroup);
  }
  
  createCells(stationGroup) {
    const cellWallGeometry = new THREE.BoxGeometry(23, 8, 0.5);
    const cellWallMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const cellWall = new THREE.Mesh(cellWallGeometry, cellWallMaterial);
    cellWall.position.set(0, 4, -9.75);
    stationGroup.add(cellWall);
    
    const cellWidth = 6;
    const cellPositions = [
      { x: -8, z: -9.5 },  
      { x: 0, z: -9.5 },   
      { x: 8, z: -9.5 }    
    ];
    
    cellPositions.forEach((pos, index) => {
      const barGeometry = new THREE.CylinderGeometry(0.1, 0.1, 7, 8);
      const barMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const bar = new THREE.Mesh(barGeometry, barMaterial);
      
      const barOffset = (index - 2.5) * 0.8;
      bar.position.set(pos.x + barOffset, 3.5, pos.z);
      stationGroup.add(bar);
    });
    
    const horizBarTop = new THREE.Mesh(
      new THREE.BoxGeometry(cellWidth, 0.2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    horizBarTop.position.set(-8, 7, -9.75);
    stationGroup.add(horizBarTop);
    
    const horizBarBottom = new THREE.Mesh(
      new THREE.BoxGeometry(cellWidth, 0.2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    horizBarBottom.position.set(-8, 0.1, -9.75);
    stationGroup.add(horizBarBottom);
    
    const cellLabelCanvas = document.createElement('canvas');
    cellLabelCanvas.width = 256;
    cellLabelCanvas.height = 64;
    const labelCtx = cellLabelCanvas.getContext('2d');
    
    labelCtx.fillStyle = '#333333';
    labelCtx.fillRect(0, 0, 256, 64);
    labelCtx.fillStyle = 'white';
    labelCtx.font = 'bold 24px Arial';
    labelCtx.textAlign = 'center';
    labelCtx.textBaseline = 'middle';
    labelCtx.fillText('CELL 1', 128, 32);
    
    const labelTexture = new THREE.CanvasTexture(cellLabelCanvas);
    const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: labelTexture,
      side: THREE.DoubleSide
    });
    const cellLabel = new THREE.Mesh(labelGeometry, labelMaterial);
    cellLabel.position.set(-8, 8, -9.75);
    stationGroup.add(cellLabel);
  }
  
  createPoliceCars(stationGroup) {
    for (let i = -1; i <= 1; i += 2) {
      const carBody = new THREE.Mesh(
        new THREE.BoxGeometry(3, 1.2, 6),
        new THREE.MeshStandardMaterial({ color: 0x000080 }) 
      );
      carBody.position.set(i * 7, 0.8, 16);
      stationGroup.add(carBody);
      
      const carRoof = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.8, 3),
        new THREE.MeshStandardMaterial({ color: 0x000080 })
      );
      carRoof.position.set(i * 7, 1.8, 16);
      stationGroup.add(carRoof);
      
      const lightBase = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.3, 1),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
      );
      lightBase.position.set(i * 7, 2.35, 16);
      stationGroup.add(lightBase);
      
      const redLight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.2, 8),
        new THREE.MeshBasicMaterial({ color: 0xFF0000, emissive: 0xFF0000 })
      );
      redLight.rotation.x = Math.PI / 2;
      redLight.position.set(i * 7 - 0.4, 2.5, 16);
      stationGroup.add(redLight);
      
      const blueLight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.2, 8),
        new THREE.MeshBasicMaterial({ color: 0x0000FF, emissive: 0x0000FF })
      );
      blueLight.rotation.x = Math.PI / 2;
      blueLight.position.set(i * 7 + 0.4, 2.5, 16);
      stationGroup.add(blueLight);
      
      for (let j = -1; j <= 1; j += 2) {
        for (let k = -1; k <= 1; k += 2) {
          const wheel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16),
            new THREE.MeshStandardMaterial({ color: 0x000000 })
          );
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(i * 7 + j * 1.2, 0.5, 16 + k * 2);
          stationGroup.add(wheel);
        }
      }
    }
  }
  
  createPrisoners() {
    this.prisoners.forEach(prisoner => {
      if (prisoner.id === 'paperman') return;
      
      const prisonerGroup = new THREE.Group();
      
      let texture;
      if (prisoner.id === 'dealer') {
        texture = new THREE.TextureLoader().load('_val_woman__2__by_mrorlandomagicfan200_dj1lv4b-375w-2x.jpg');
      } else if (prisoner.id === 'mephone4') {
        texture = new THREE.TextureLoader().load('MePhone4_21 (1).png');
      }
      
      if (texture) {
        const prisonerMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });
        
        const prisonerGeometry = new THREE.PlaneGeometry(2, 2);
        const prisonerMesh = new THREE.Mesh(prisonerGeometry, prisonerMaterial);
        prisonerGroup.add(prisonerMesh);
      }
      
      const chatMessage = document.createElement('div');
      chatMessage.className = 'chat-message';
      chatMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      chatMessage.style.color = 'white';
      chatMessage.style.fontWeight = 'bold';
      chatMessage.style.fontSize = '16px';
      chatMessage.style.display = 'none';
      document.getElementById('game-container').appendChild(chatMessage);
      
      this.chatMessages[prisoner.id] = chatMessage;
      
      prisonerGroup.position.set(
        this.position.x + prisoner.position.x,
        prisoner.position.y + 1,
        this.position.z + prisoner.position.z
      );
      
      this.prisonerModels[prisoner.id] = prisonerGroup;
      this.scene.add(prisonerGroup);
    });
  }
  
  setupPaperManArrest() {
    const paperManGroup = new THREE.Group();
    
    const paperManTexture = new THREE.TextureLoader().load('0195f707-2659-78f4-94a5-13fe2d2c0a36.png');
    const paperManMaterial = new THREE.MeshBasicMaterial({
      map: paperManTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const paperManGeometry = new THREE.PlaneGeometry(2, 3);
    const paperManMesh = new THREE.Mesh(paperManGeometry, paperManMaterial);
    paperManGroup.add(paperManMesh);
    
    const chatMessage = document.createElement('div');
    chatMessage.className = 'chat-message paper-man-chat';
    chatMessage.style.backgroundColor = 'rgba(255, 255, 150, 0.8)';
    chatMessage.style.color = 'black';
    chatMessage.style.fontWeight = 'bold';
    chatMessage.style.fontSize = '18px';
    chatMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(chatMessage);
    
    this.chatMessages['paperman'] = chatMessage;
    
    paperManGroup.position.set(
      this.position.x + 10,
      1.5,
      this.position.z + 15
    );
    
    paperManGroup.visible = false;
    
    this.prisonerModels['paperman'] = paperManGroup;
    this.scene.add(paperManGroup);
  }
  
  update(camera, renderer, deltaTime) {
    if (this.playerModel) {
      const distanceToStation = this.playerModel.position.distanceTo(this.stationBuilding.position);
      
      if (distanceToStation < 25 && !this.stationPrompt) {
        this.showStationPrompt();
      } else if (distanceToStation >= 25 && this.stationPrompt) {
        this.hideStationPrompt();
      }
      
      for (const prisonerId in this.prisonerModels) {
        if (this.prisonerModels[prisonerId].visible && this.chatMessages[prisonerId]) {
          const screenPosition = this.getScreenPosition(this.prisonerModels[prisonerId].position, camera, renderer);
          if (screenPosition && screenPosition.visible) {
            this.chatMessages[prisonerId].style.left = `${screenPosition.x}px`;
            this.chatMessages[prisonerId].style.top = `${screenPosition.y - 45}px`;
            this.chatMessages[prisonerId].style.display = 'block';
          } else {
            this.chatMessages[prisonerId].style.display = 'none';
          }
        }
      }
      
      for (const prisonerId in this.prisonerModels) {
        if (this.prisonerModels[prisonerId].visible) {
          const prisonerMesh = this.prisonerModels[prisonerId].children[0];
          if (prisonerMesh) {
            prisonerMesh.quaternion.copy(camera.quaternion);
          }
        }
      }
    }
  }
  
  showStationPrompt() {
    this.stationPrompt = document.createElement('div');
    this.stationPrompt.style.position = 'fixed';
    this.stationPrompt.style.bottom = '30%';
    this.stationPrompt.style.left = '50%';
    this.stationPrompt.style.transform = 'translateX(-50%)';
    this.stationPrompt.style.backgroundColor = 'rgba(0, 0, 100, 0.7)';
    this.stationPrompt.style.color = 'white';
    this.stationPrompt.style.padding = '15px 20px';
    this.stationPrompt.style.borderRadius = '5px';
    this.stationPrompt.style.zIndex = '1000';
    document.body.appendChild(this.stationPrompt);
    
    this.stationKeyListener = (e) => {
      if (e.key.toLowerCase() === 'a') {
        this.startPaperManArrest();
      } else if (e.key.toLowerCase() === 't') {
        this.showPrisonerTalkPrompt();
      }
    };
    
    document.addEventListener('keydown', this.stationKeyListener);
    this.stationPrompt.textContent = 'Press A to witness Paper Man\'s arrest or T to talk to prisoners';
    this.stationPrompt.style.display = 'block';
  }
  
  hideStationPrompt() {
    if (this.stationPrompt) {
      this.stationPrompt.style.display = 'none';
      document.removeEventListener('keydown', this.stationKeyListener);
    }
  }
  
  startPaperManArrest() {
    if (this.paperManArrested) return;
    
    this.paperManArrested = true;
    this.hideStationPrompt();
    
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    
    const cutsceneOverlay = document.createElement('div');
    cutsceneOverlay.style.position = 'fixed';
    cutsceneOverlay.style.top = '0';
    cutsceneOverlay.style.left = '0';
    cutsceneOverlay.style.width = '100%';
    cutsceneOverlay.style.height = '100%';
    cutsceneOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    cutsceneOverlay.style.display = 'flex';
    cutsceneOverlay.style.justifyContent = 'center';
    cutsceneOverlay.style.alignItems = 'center';
    cutsceneOverlay.style.zIndex = '9998';
    document.body.appendChild(cutsceneOverlay);
    
    const cutsceneTitle = document.createElement('div');
    cutsceneTitle.style.position = 'fixed';
    cutsceneTitle.style.top = '10%';
    cutsceneTitle.style.left = '0';
    cutsceneTitle.style.width = '100%';
    cutsceneTitle.style.textAlign = 'center';
    cutsceneTitle.style.color = 'white';
    cutsceneTitle.style.fontSize = '36px';
    cutsceneTitle.style.fontWeight = 'bold';
    cutsceneTitle.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
    cutsceneTitle.style.zIndex = '9999';
    cutsceneTitle.textContent = 'THE PAPER MAN INCIDENT';
    document.body.appendChild(cutsceneTitle);
    
    this.prisonerModels['paperman'].visible = true;
    
    setTimeout(() => {
      this.chatMessages['paperman'].textContent = "hey guys its paper man! got a SPECIAL uranium shipment today!";
      this.chatMessages['paperman'].style.display = 'block';
      
      setTimeout(() => {
        this.chatMessages['paperman'].textContent = "who wants to buy a NUCLEAR BOMB? no background checks required!";
        this.showAnnouncementMessage("POLICE: FREEZE! You're under arrest for attempting to acquire illegal nuclear weapons!");
        
        setTimeout(() => {
          this.chatMessages['paperman'].textContent = "WAIT WHAT? I was just kidding guys! it's just a paper mache bomb!";
          
          setTimeout(() => {
            this.moveToCell('paperman');
            
            setTimeout(() => {
              this.chatMessages['paperman'].textContent = "this is so unfair! uranium emporium is finished!";
              
              setTimeout(() => {
                cutsceneOverlay.style.display = 'none';
                document.body.removeChild(cutsceneTitle);
                
                if (window.playerControls) {
                  window.playerControls.enabled = true;
                }
                
                this.showNotification("Paper Man has been arrested for attempting to acquire a bomb. Visit the police station to see him in his cell!", 5000);
                
                if (window.paperMan && window.paperMan.model) {
                  window.paperMan.model.visible = false;
                }
                
              }, 3000);
            }, 2000);
          }, 3000);
        }, 3000);
      }, 3000);
    }, 1000);
  }
  
  createArrestingOfficers() {
    const officerGroup = new THREE.Group();
    
    const textureLoader = new THREE.TextureLoader();
    const officerTexture = textureLoader.load('brooklyn guy.jpeg');
    
    for (let i = -1; i <= 1; i += 2) {
      const officerMaterial = new THREE.MeshBasicMaterial({
        map: officerTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const officerGeometry = new THREE.PlaneGeometry(2, 2);
      const officerMesh = new THREE.Mesh(officerGeometry, officerMaterial);
      officerMesh.position.set(i * 2, 0, -2);
      
      officerGroup.add(officerMesh);
    }
    
    officerGroup.position.set(
      this.prisonerModels['paperman'].position.x,
      this.prisonerModels['paperman'].position.y,
      this.prisonerModels['paperman'].position.z + 3
    );
    
    this.scene.add(officerGroup);
    this.officerGroup = officerGroup;
    
    const officerChat = document.createElement('div');
    officerChat.className = 'chat-message';
    officerChat.style.backgroundColor = 'rgba(0, 0, 100, 0.8)';
    officerChat.style.color = 'white';
    officerChat.style.fontWeight = 'bold';
    officerChat.style.fontSize = '16px';
    officerChat.textContent = "FREEZE! POLICE!";
    officerChat.style.position = 'fixed';
    officerChat.style.top = '40%';
    officerChat.style.left = '50%';
    officerChat.style.transform = 'translateX(-50%)';
    officerChat.style.padding = '10px 20px';
    officerChat.style.borderRadius = '5px';
    officerChat.style.zIndex = '9999';
    document.body.appendChild(officerChat);
    
    setTimeout(() => {
      document.body.removeChild(officerChat);
    }, 3000);
  }
  
  moveToCell(prisonerId) {
    const prisoner = this.prisoners.find(p => p.id === prisonerId);
    if (!prisoner) return;
    
    const model = this.prisonerModels[prisonerId];
    
    const cellPosition = new THREE.Vector3(
      this.position.x + prisoner.position.x,
      prisoner.position.y + 1,
      this.position.z + prisoner.position.z
    );
    
    model.position.copy(cellPosition);
  }
  
  showAnnouncementMessage(message) {
    const announcement = document.createElement('div');
    announcement.className = 'chat-message';
    announcement.style.backgroundColor = 'rgba(0, 0, 100, 0.8)';
    announcement.style.color = 'white';
    announcement.style.fontWeight = 'bold';
    announcement.style.fontSize = '20px';
    announcement.textContent = message;
    announcement.style.position = 'fixed';
    announcement.style.top = '30%';
    announcement.style.left = '50%';
    announcement.style.transform = 'translateX(-50%)';
    announcement.style.padding = '15px 25px';
    announcement.style.borderRadius = '5px';
    announcement.style.zIndex = '9999';
    announcement.style.textAlign = 'center';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 3000);
  }
  
  showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 100, 0.8)';
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
    vector.y += 1;
    
    vector.project(camera);
    
    const isInFront = vector.z < 1;
    
    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf,
      visible: isInFront
    };
  }
  
  showPrisonerTalkPrompt() {
    if (this.prisonerTalkActive) return;
    
    if (this.stationPrompt) {
      this.stationPrompt.style.display = 'none';
    }
    
    this.prisonerTalkActive = true;
    
    // Disable player controls
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    
    this.prisonerTalkPrompt = document.createElement('div');
    this.prisonerTalkPrompt.style.position = 'fixed';
    this.prisonerTalkPrompt.style.top = '50%';
    this.prisonerTalkPrompt.style.left = '50%';
    this.prisonerTalkPrompt.style.transform = 'translate(-50%, -50%)';
    this.prisonerTalkPrompt.style.width = '500px';
    this.prisonerTalkPrompt.style.backgroundColor = 'rgba(0, 0, 100, 0.9)';
    this.prisonerTalkPrompt.style.color = 'white';
    this.prisonerTalkPrompt.style.padding = '20px';
    this.prisonerTalkPrompt.style.borderRadius = '10px';
    this.prisonerTalkPrompt.style.zIndex = '9999';
    this.prisonerTalkPrompt.style.textAlign = 'center';
    
    this.prisonerTalkPrompt.innerHTML = `
      <h3 style="margin-top: 0; color: #FFD700;">Talk to Prisoners</h3>
      <p>What would you like to say to the prisoners?</p>
      <input type="text" id="prisoner-talk-input" style="width: 90%; padding: 8px; margin: 10px 0; border-radius: 4px; border: none;">
      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button id="talk-button" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Say It</button>
        <button id="cancel-talk-button" style="padding: 8px 16px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
      </div>
    `;
    
    document.body.appendChild(this.prisonerTalkPrompt);
    
    document.getElementById('prisoner-talk-input').focus();
    
    document.getElementById('talk-button').addEventListener('click', () => {
      this.processPrisonerTalk();
    });
    
    document.getElementById('cancel-talk-button').addEventListener('click', () => {
      this.closePrisonerTalk();
    });
    
    document.getElementById('prisoner-talk-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.processPrisonerTalk();
      } else if (e.key === 'Escape') {
        this.closePrisonerTalk();
      }
    });
  }
  
  processPrisonerTalk() {
    const talkInput = document.getElementById('prisoner-talk-input');
    const message = talkInput.value.trim().toUpperCase();
    
    if (message === "I CRIMED AHAHAH") {
      this.arrestPlayer();
    } else {
      // Generic response
      this.showPrisonerResponse();
    }
  }
  
  closePrisonerTalk() {
    if (this.prisonerTalkPrompt) {
      document.body.removeChild(this.prisonerTalkPrompt);
      this.prisonerTalkPrompt = null;
    }
    
    this.prisonerTalkActive = false;
    
    // Re-enable player controls
    if (window.playerControls) {
      window.playerControls.enabled = true;
    }
    
    if (this.stationPrompt) {
      this.stationPrompt.style.display = 'block';
    }
  }
  
  showPrisonerResponse() {
    if (this.prisonerTalkPrompt) {
      document.body.removeChild(this.prisonerTalkPrompt);
    }
    
    const responsePrompt = document.createElement('div');
    responsePrompt.style.position = 'fixed';
    responsePrompt.style.top = '50%';
    responsePrompt.style.left = '50%';
    responsePrompt.style.transform = 'translate(-50%, -50%)';
    responsePrompt.style.width = '500px';
    responsePrompt.style.backgroundColor = 'rgba(0, 0, 100, 0.9)';
    responsePrompt.style.color = 'white';
    responsePrompt.style.padding = '20px';
    responsePrompt.style.borderRadius = '10px';
    responsePrompt.style.zIndex = '9999';
    responsePrompt.style.textAlign = 'center';
    
    const responses = [
      "Leave us alone! We're serving our time!",
      "I didn't do it! I was framed!",
      "When I get out of here, I'll have my revenge!",
      "Can you smuggle a phone in here for me?",
      "Don't end up like us, kid...",
      "The food here is terrible!",
      "I miss my game collection..."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    responsePrompt.innerHTML = `
      <h3 style="margin-top: 0; color: #FFD700;">Prisoner Response</h3>
      <p style="font-size: 18px; margin: 20px 0;">"${randomResponse}"</p>
      <button id="close-response-button" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Continue</button>
    `;
    
    document.body.appendChild(responsePrompt);
    
    document.getElementById('close-response-button').addEventListener('click', () => {
      document.body.removeChild(responsePrompt);
      this.prisonerTalkActive = false;
      
      // Re-enable player controls
      if (window.playerControls) {
        window.playerControls.enabled = true;
      }
      
      if (this.stationPrompt) {
        this.stationPrompt.style.display = 'block';
      }
    });
  }
  
  arrestPlayer() {
    if (this.prisonerTalkPrompt) {
      document.body.removeChild(this.prisonerTalkPrompt);
      this.prisonerTalkPrompt = null;
    }
    
    // Disable player controls
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    
    // Create game over screen
    this.gameOverScreen = document.createElement('div');
    this.gameOverScreen.style.position = 'fixed';
    this.gameOverScreen.style.top = '0';
    this.gameOverScreen.style.left = '0';
    this.gameOverScreen.style.width = '100%';
    this.gameOverScreen.style.height = '100%';
    this.gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    this.gameOverScreen.style.color = 'white';
    this.gameOverScreen.style.display = 'flex';
    this.gameOverScreen.style.flexDirection = 'column';
    this.gameOverScreen.style.justifyContent = 'center';
    this.gameOverScreen.style.alignItems = 'center';
    this.gameOverScreen.style.zIndex = '9999';
    
    this.gameOverScreen.innerHTML = `
      <h1 style="color: red; font-size: 48px; margin-bottom: 30px;">YOU CONFESSED TO A CRIME!</h1>
      <div style="font-size: 24px; text-align: center; margin-bottom: 30px;">
        You have been sentenced to:
      </div>
      <div style="width: 80%; max-width: 800px; background-color: #111; padding: 20px; border: 2px solid red; margin-bottom: 30px;">
        <ul style="font-size: 24px; line-height: 1.5; list-style-type: none; padding: 0;">
          <li style="margin-bottom: 15px;">➡️ 1,000,000,000 years in prison</li>
          <li style="margin-bottom: 15px;">➡️ No chance of parole</li>
          <li style="margin-bottom: 15px;">➡️ Mandatory listening to elevator music for eternity</li>
          <li style="margin-bottom: 15px;">➡️ All assets confiscated</li>
          <li style="margin-bottom: 15px;">➡️ No internet privileges</li>
        </ul>
      </div>
      <button id="restart-game-button" style="padding: 15px 30px; background-color: #ff0000; color: white; border: none; border-radius: 10px; font-size: 24px; cursor: pointer;">Restart Game</button>
    `;
    
    document.body.appendChild(this.gameOverScreen);
    
    document.getElementById('restart-game-button').addEventListener('click', () => {
      window.location.reload();
    });
  }
}