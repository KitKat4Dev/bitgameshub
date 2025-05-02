import * as THREE from 'three';

export class CustomNPC {
  constructor(scene, playerModel, position, npcData) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.position = position; 
    this.data = npcData; 
    this.model = null;
    this.chatMessage = null;
    this.nameLabel = null; 
    this.moveSpeed = 0.03 + Math.random() * 0.02; 
    this.wanderTarget = null;
    this.lastPhraseTime = 0;
    this.phraseInterval = 5000 + Math.random() * 7000; 
    this.attackCooldown = 0;
    this.state = 'idle'; 
    this.isProtected = false; 

    this.createModel();
  }

  createModel() {
    this.model = new THREE.Group();

    const textureLoader = new THREE.TextureLoader();
    const npcTexture = textureLoader.load(this.data.imageUrl, () => {}, undefined, () => {
      console.error("Failed to load NPC image:", this.data.imageUrl);
      const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
      const npcMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fallbackMaterial);
      this.model.add(npcMesh);
    });

    const npcMaterial = new THREE.MeshBasicMaterial({
      map: npcTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const npcGeometry = new THREE.PlaneGeometry(2, 2);
    const npcMesh = new THREE.Mesh(npcGeometry, npcMaterial);
    this.model.add(npcMesh);

    this.model.position.copy(this.position);
    this.model.position.y = 1.0; 
    this.scene.add(this.model);

    this.chatMessage = document.createElement('div');
    this.chatMessage.className = this.data.personality === 'hostile' ? 'chat-message npc-chat-hostile' : 'chat-message npc-chat-generic';
    this.chatMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(this.chatMessage);

    this.nameLabel = document.createElement('div');
    this.nameLabel.className = 'player-name';
    this.nameLabel.textContent = this.data.name;
    this.nameLabel.style.color = '#FFF';
    this.nameLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    document.getElementById('game-container').appendChild(this.nameLabel);
  }

  update(camera, renderer, deltaTime) {
    if (!this.model || !this.playerModel) return;

    const npcPlane = this.model.children[0];
    if (npcPlane) {
      npcPlane.quaternion.copy(camera.quaternion);
    }

    switch (this.data.personality) {
      case 'wander':
        this.wander(deltaTime);
        break;
      case 'follow':
        this.follow(deltaTime);
        break;
      case 'hostile':
        this.hostile(deltaTime);
        break;
      case 'stand':
      default:
        if (this.data.phrases.length > 0 && this.model.position.distanceTo(this.playerModel.position) < 10) {
          this.model.lookAt(this.playerModel.position);
        }
        break;
    }

    this.model.position.y = 1.0 + Math.sin(performance.now() * 0.0015) * 0.05;

    if (this.data.phrases.length > 0 && Date.now() - this.lastPhraseTime > this.phraseInterval) {
      this.sayPhrase();
      this.lastPhraseTime = Date.now();
      this.phraseInterval = 5000 + Math.random() * 7000;
    }

    this.updateUIPosition(camera, renderer);
  }

  wander(deltaTime) {
    this.state = 'wandering';
    if (!this.wanderTarget || this.model.position.distanceTo(this.wanderTarget) < 1) {
      const wanderRadius = 20;
      this.wanderTarget = new THREE.Vector3(
        this.position.x + (Math.random() - 0.5) * wanderRadius * 2,
        this.model.position.y,
        this.position.z + (Math.random() - 0.5) * wanderRadius * 2
      );
    }

    const direction = new THREE.Vector3();
    direction.subVectors(this.wanderTarget, this.model.position);
    direction.y = 0; 

    if (direction.length() > 0.1) {
      direction.normalize();
      this.model.position.addScaledVector(direction, this.moveSpeed * deltaTime * 0.06); 
      this.model.lookAt(this.wanderTarget);
    }
  }

  follow(deltaTime) {
    this.state = 'following';
    const targetPosition = this.playerModel.position.clone();
    const followDistance = 3; 

    const direction = new THREE.Vector3();
    direction.subVectors(targetPosition, this.model.position);
    direction.y = 0;

    if (direction.length() > followDistance) {
      direction.normalize();
      this.model.position.addScaledVector(direction, this.moveSpeed * 1.5 * deltaTime * 0.06); 
      this.model.lookAt(targetPosition);
    }
  }

  hostile(deltaTime) {
    this.state = 'attacking';
    const targetPosition = this.playerModel.position.clone();
    const attackRange = 1.5;
    const chaseSpeed = this.moveSpeed * 2.5; 

    const direction = new THREE.Vector3();
    direction.subVectors(targetPosition, this.model.position);
    direction.y = 0;

    const distance = direction.length();

    if (distance > attackRange) {
      direction.normalize();
      this.model.position.addScaledVector(direction, chaseSpeed * deltaTime * 0.06);
      this.model.lookAt(targetPosition);
    } else if (this.attackCooldown <= 0) {
      this.attackPlayer();
      this.attackCooldown = 2000; 
    }
  }

  attackPlayer() {
    console.log(`${this.data.name} attacks!`);
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    overlay.style.color = 'white';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '10000';
    overlay.innerHTML = `
      <h1>GAME OVER</h1>
      <p>Defeated by ${this.data.name}!</p>
      <button id="restart-custom-npc" style="padding:10px 20px; font-size: 1.2em; cursor:pointer;">Restart</button>
    `;
    document.body.appendChild(overlay);
    document.getElementById('restart-custom-npc').addEventListener('click', () => window.location.reload());

  }

  sayPhrase() {
    if (!this.chatMessage || this.data.phrases.length === 0) return;

    const phrase = this.data.phrases[Math.floor(Math.random() * this.data.phrases.length)];
    this.chatMessage.textContent = phrase;
    this.chatMessage.style.display = 'block';

    setTimeout(() => {
      if (this.chatMessage) {
        this.chatMessage.style.display = 'none';
      }
    }, 4000);
  }

  updateUIPosition(camera, renderer) {
    const screenPosition = this.getScreenPosition(this.model.position, camera, renderer);
    if (screenPosition && screenPosition.visible) {
      if(this.nameLabel) {
        this.nameLabel.style.left = `${screenPosition.x}px`;
        this.nameLabel.style.top = `${screenPosition.y - 20}px`; 
        this.nameLabel.style.display = 'block';
      }

      if (this.chatMessage && this.chatMessage.style.display === 'block') {
        this.chatMessage.style.left = `${screenPosition.x}px`;
        this.chatMessage.style.top = `${screenPosition.y - 45}px`; 
      }
    } else {
      if(this.nameLabel) this.nameLabel.style.display = 'none';
      if(this.chatMessage) this.chatMessage.style.display = 'none';
    }
  }

  getScreenPosition(position, camera, renderer) {
    if(!camera || !renderer) return null; 

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

  destroy() {
    if (this.model) this.scene.remove(this.model);
    if (this.chatMessage) document.getElementById('game-container').removeChild(this.chatMessage);
    if (this.nameLabel) document.getElementById('game-container').removeChild(this.nameLabel);
  }
}