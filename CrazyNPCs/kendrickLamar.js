import * as THREE from 'three';

export class KendrickLamar {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.position = new THREE.Vector3(90, 0, 60); 
    this.model = null;
    this.stagePlatform = null;
    this.chatMessage = null;
    this.missionPrompt = null;
    this.missionActive = false;
    this.missionCompleted = false;
    this.crowdModels = [];
    this.protestStarted = false;
    this.tomatoCount = 0;
    
    this.phrases = [
      "You know what it is...",
      "I got loyalty, got royalty inside my DNA",
      "All the stars are closer...",
      "Sit down, be humble!",
      "DAMN.",
      "I'm so ahead of my time...",
      "We gon' be alright!"
    ];
    
    this.lastPhraseTime = 0;
    this.phraseInterval = 5000 + Math.random() * 5000;
    
    this.createStage();
    this.createKendrickModel();
    this.createCrowd();
  }
  
  createStage() {
    const stageGroup = new THREE.Group();
    
    const platformGeometry = new THREE.BoxGeometry(15, 1, 10);
    const platformMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = 0.5;
    stageGroup.add(platform);
    
    const backdropGeometry = new THREE.BoxGeometry(15, 8, 0.5);
    const backdropMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const backdrop = new THREE.Mesh(backdropGeometry, backdropMaterial);
    backdrop.position.set(0, 4.5, -5);
    stageGroup.add(backdrop);
    
    const roofGeometry = new THREE.BoxGeometry(16, 0.5, 11);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 9, 0);
    stageGroup.add(roof);
    
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 128;
    const context = textureCanvas.getContext('2d');
    context.fillStyle = '#222222';
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = '#FFFFFF';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('KENDRICK LAMAR', 256, 64);
    
    const signTexture = new THREE.CanvasTexture(textureCanvas);
    const signGeometry = new THREE.PlaneGeometry(10, 2);
    const signMaterial = new THREE.MeshBasicMaterial({ 
      map: signTexture, 
      transparent: true,
      side: THREE.DoubleSide
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 7, -4.7);
    stageGroup.add(sign);
    
    const lights = [];
    for (let i = -6; i <= 6; i += 3) {
      const lightGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
      const lightMaterial = new THREE.MeshBasicMaterial({ 
        color: Math.random() > 0.5 ? 0xFF0000 : 0x0000FF,
        emissive: Math.random() > 0.5 ? 0xFF0000 : 0x0000FF
      });
      const light = new THREE.Mesh(lightGeometry, lightMaterial);
      light.position.set(i, 8.7, 0);
      light.rotation.x = Math.PI / 2;
      light.userData.isLight = true;
      lights.push(light);
      stageGroup.add(light);
    }
    
    stageGroup.position.copy(this.position);
    stageGroup.userData.isBarrier = true;
    this.stagePlatform = stageGroup;
    
    this.scene.add(stageGroup);
  }
  
  createKendrickModel() {
    const kendrickGroup = new THREE.Group();
    
    const textureLoader = new THREE.TextureLoader();
    const kendrickTexture = textureLoader.load('aaaaaa.png');
    
    const kendrickMaterial = new THREE.MeshBasicMaterial({
      map: kendrickTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const kendrickGeometry = new THREE.PlaneGeometry(3, 3);
    const kendrickMesh = new THREE.Mesh(kendrickGeometry, kendrickMaterial);
    kendrickGroup.add(kendrickMesh);
    
    const standGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const standMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.set(0.5, -0.5, 0.2);
    kendrickGroup.add(stand);
    
    const micGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const micMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const mic = new THREE.Mesh(micGeometry, micMaterial);
    mic.position.set(0.5, 0.5, 0.2);
    kendrickGroup.add(mic);
    
    kendrickGroup.position.set(this.position.x, 2, this.position.z);
    
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message';
    this.chatMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.chatMessage.style.color = '#FFFFFF';
    this.chatMessage.style.fontWeight = 'bold';
    this.chatMessage.style.fontSize = '18px';
    this.chatMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(this.chatMessage);
    
    this.scene.add(kendrickGroup);
    this.model = kendrickGroup;
  }
  
  createCrowd() {
    for (let i = 0; i < 15; i++) {
      const personGroup = new THREE.Group();
      
      const bodyGeometry = new THREE.BoxGeometry(0.5, 1.2, 0.3);
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(Math.random(), Math.random(), Math.random())
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.6;
      personGroup.add(body);
      
      const headGeometry = new THREE.SphereGeometry(0.2, 8, 8);
      const headMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(0.8, 0.6, 0.4)
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 1.5;
      personGroup.add(head);
      
      const angle = (i / 15) * Math.PI - Math.PI / 2;
      const radius = 8 + Math.random() * 5;
      personGroup.position.set(
        this.position.x + Math.cos(angle) * radius,
        0,
        this.position.z + Math.sin(angle) * radius + 5
      );
      
      personGroup.lookAt(this.position.x, 2, this.position.z);
      
      this.crowdModels.push(personGroup);
      this.scene.add(personGroup);
    }
  }
  
  update(camera, renderer, deltaTime) {
    if (!this.model || !this.playerModel) return;
    
    const distanceToStage = this.playerModel.position.distanceTo(this.stagePlatform.position);
    
    if (distanceToStage < 20 && !this.missionPrompt && !this.missionCompleted) {
      this.showMissionPrompt();
    } else if (distanceToStage >= 20 && this.missionPrompt) {
      this.hideMissionPrompt();
    }
    
    const kendrickMesh = this.model.children[0];
    if (kendrickMesh) {
      kendrickMesh.quaternion.copy(camera.quaternion);
    }
    
    this.model.position.y = 2 + Math.sin(performance.now() * 0.002) * 0.1;
    
    const now = Date.now();
    if (!this.protestStarted && now - this.lastPhraseTime > this.phraseInterval) {
      this.sayPhrase();
      this.lastPhraseTime = now;
      this.phraseInterval = 5000 + Math.random() * 5000;
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
    
    this.updateCrowd(deltaTime);
    
    if (this.protestStarted) {
      this.updateProtest(deltaTime);
    }
  }
  
  updateCrowd(deltaTime) {
    for (let i = 0; i < this.crowdModels.length; i++) {
      const person = this.crowdModels[i];
      
      person.position.y = Math.sin(performance.now() * 0.001 + i * 0.5) * 0.1;
      
      if (this.protestStarted) {
        person.rotation.y = Math.sin(performance.now() * 0.002 + i) * 0.3;
      }
    }
  }
  
  updateProtest(deltaTime) {
    if (Math.random() < 0.02 && this.tomatoCount < 20) {
      this.throwTomato();
    }
  }
  
  throwTomato() {
    const tomatoGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const tomatoMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    const tomato = new THREE.Mesh(tomatoGeometry, tomatoMaterial);
    
    const personIndex = Math.floor(Math.random() * this.crowdModels.length);
    const person = this.crowdModels[personIndex];
    
    tomato.position.copy(person.position);
    tomato.position.y += 1.5;
    
    const targetPos = this.model.position.clone();
    
    const velocity = new THREE.Vector3().subVectors(targetPos, tomato.position);
    velocity.normalize().multiplyScalar(0.2); 
    velocity.y += 0.1; 
    
    tomato.userData.velocity = velocity;
    tomato.userData.isTomato = true;
    
    this.scene.add(tomato);
    this.tomatoCount++;
    
    if (this.tomatoCount >= 20) {
      this.completeMission();
    }
  }
  
  completeMission() {
    if (window.shop) {
      window.shop.coins += 90;
      window.shop.updateCoinCounter();
    }
    
    this.showNotification("Mission Complete! The protest was successful! +90 coins", 5000);
    
    this.chatMessage.textContent = "WHY ARE YOU ALL DOING THIS TO ME?!";
    this.chatMessage.style.display = 'block';
    this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    
    this.missionCompleted = true;
    this.hideMissionPrompt();
    
    this.missionPrompt = null;
    
    window.room.send({
      type: "npc_event",
      event: "kendrick_protest",
      initiator: window.room.peers[window.room.clientId]?.username || "A player"
    });
    
    this.model.position.y = 1;
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
  
  showMissionPrompt() {
    this.missionPrompt = document.createElement('div');
    this.missionPrompt.style.position = 'fixed';
    this.missionPrompt.style.bottom = '30%';
    this.missionPrompt.style.left = '50%';
    this.missionPrompt.style.transform = 'translateX(-50%)';
    this.missionPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.missionPrompt.style.color = 'white';
    this.missionPrompt.style.padding = '15px 20px';
    this.missionPrompt.style.borderRadius = '5px';
    this.missionPrompt.style.zIndex = '1000';
    document.body.appendChild(this.missionPrompt);
    
    this.missionKeyListener = (e) => {
      if (e.key.toLowerCase() === 'y') {
        this.startProtest();
      }
    };
    
    document.addEventListener('keydown', this.missionKeyListener);
    
    this.missionPrompt.textContent = 'Press Y to yell "HE DID WRONG STUFF!" and start a protest';
  }
  
  hideMissionPrompt() {
    if (this.missionPrompt) {
      document.body.removeChild(this.missionPrompt);
      this.missionPrompt = null;
      document.removeEventListener('keydown', this.missionKeyListener);
    }
  }
  
  startProtest() {
    this.protestStarted = true;
    this.hideMissionPrompt();
    
    const protestMessage = document.createElement('div');
    protestMessage.className = 'chat-message';
    protestMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    protestMessage.style.color = 'white';
    protestMessage.style.fontWeight = 'bold';
    protestMessage.style.fontSize = '24px';
    protestMessage.style.padding = '10px 20px';
    protestMessage.style.borderRadius = '5px';
    protestMessage.style.position = 'fixed';
    protestMessage.style.top = '40%';
    protestMessage.style.left = '50%';
    protestMessage.style.transform = 'translateX(-50%)';
    protestMessage.style.zIndex = '9999';
    protestMessage.textContent = "HE DID WRONG STUFF!";
    
    document.body.appendChild(protestMessage);
    
    setTimeout(() => {
      document.body.removeChild(protestMessage);
    }, 3000);
    
    for (let i = 0; i < this.crowdModels.length; i++) {
      const person = this.crowdModels[i];
      
      const crowdMessage = document.createElement('div');
      crowdMessage.className = 'chat-message';
      crowdMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      crowdMessage.style.color = 'white';
      crowdMessage.style.fontSize = '14px';
      crowdMessage.style.padding = '5px 10px';
      crowdMessage.style.borderRadius = '5px';
      crowdMessage.style.position = 'absolute';
      
      const boos = [
        "BOO!",
        "GET OFF THE STAGE!",
        "FRAUD!",
        "LIAR!",
        "WE HATE YOU!",
        "GO HOME!"
      ];
      
      crowdMessage.textContent = boos[Math.floor(Math.random() * boos.length)];
      document.getElementById('game-container').appendChild(crowdMessage);
      
      const camera = window.playerControls ? window.playerControls.getCamera() : null;
      const renderer = window.playerControls ? window.playerControls.renderer : null;
      
      if (camera && renderer) {
        const screenPos = this.getScreenPosition(person.position, camera, renderer);
        if (screenPos && screenPos.visible) {
          crowdMessage.style.left = `${screenPos.x}px`;
          crowdMessage.style.top = `${screenPos.y - 30}px`;
          crowdMessage.style.display = 'block';
        } else {
          crowdMessage.style.display = 'none';
        }
      }
      
      setTimeout(() => {
        document.getElementById('game-container').removeChild(crowdMessage);
      }, 2000 + Math.random() * 3000);
    }
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
}