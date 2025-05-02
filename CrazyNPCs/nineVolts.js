import * as THREE from 'three';

export class NineVolts {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    // Position Nine-Volts at desired location (the red house will be built here)
    this.position = new THREE.Vector3(-20, 0, 20);
    this.textureUrl = '9volts.png';
    this.missionActive = false;
    this.challengeInProgress = false;
    this.rewardGiven = false;
    this.model = null;
    this.chatMessage = null;
    this.interactionPrompt = null;
    this.babyFronkDelivered = false;
    // Dialogue phrases
    this.phrases = [
      "Where is my baby fronk?!",
      "I need my baby fronk back!",
      "Bring my precious baby fronk to me!",
      "My baby fronk... please, get him back!"
    ];
    this.winPhrase = "You won the challenge! As promised, I'll buy you a Chevrolet car!";
    this.losePhrase = "You lost... now go find my baby fronk on your own!";
    
    // Create the Nine-Volts NPC model
    this.createModel();
    // NEW: Build and add a red house around the NPC so that he is located in it
    this.createRedHouse();

    // NEW: Listen for key "D" to destroy 9-Volts' house.
    window.addEventListener('keydown', (e) => {
      // Don’t trigger if typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key.toLowerCase() === 'd') {
        // Only trigger if the red house still exists and if the player is nearby
        if (this.houseGroup && this.playerModel) {
          const distance = this.playerModel.position.distanceTo(this.houseGroup.position);
          if (distance < 10) {
            this.destroyHouse();
          }
        }
      }
    });

    this.isGiant = false;
    this.destructionStartTime = null;
    this.gameOverTriggered = false;
  }
  
  createModel() {
    this.model = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();
    const npcTexture = textureLoader.load(this.textureUrl);
    const material = new THREE.MeshBasicMaterial({
      map: npcTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const geometry = new THREE.PlaneGeometry(3, 3);
    const npcMesh = new THREE.Mesh(geometry, material);
    this.model.add(npcMesh);
    this.model.position.copy(this.position);
    
    // Create a DOM chat message element for Nine-Volts
    this.chatMessage = document.createElement('div');
    this.chatMessage.className = 'chat-message';
    this.chatMessage.style.display = 'none';
    document.getElementById('game-container').appendChild(this.chatMessage);
    
    // this.scene.add(this.model); // Removed to add the model to the house group
  }
  
  createRedHouse() {
    const houseGroup = new THREE.Group();
    
    // Create red walls (a simple box)
    const wallGeometry = new THREE.BoxGeometry(6, 4, 6);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.y = 2; // Raise so ground is at y=0
    houseGroup.add(walls);
    
    // Create a simple cone roof in dark red
    const roofGeometry = new THREE.ConeGeometry(4, 2, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 4.5;
    houseGroup.add(roof);
    
    // Optionally, add a door to the front of the house
    const doorGeometry = new THREE.PlaneGeometry(1.5, 2);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 1.5, 3.01);
    houseGroup.add(door);
    
    // Position the red house at Nine-Volts' designated location
    houseGroup.position.copy(this.position);
    // Add the house to the scene
    this.scene.add(houseGroup);
    
    // Reparent the Nine-Volts NPC model into the house so that he is "located" inside it.
    // Adjust his position relative to the house (placing him near the door)
    // Remove from previous parent if necessary (Three.js reparenting will handle this)
    this.model.position.set(0, 1.5, 0); // Relative to the house group
    houseGroup.add(this.model);
    
    // Store reference to the house group if needed later
    this.houseGroup = houseGroup;
  }
  
  destroyHouse() {
    if (this.houseGroup) {
      // Remove the entire red house
      this.scene.remove(this.houseGroup);
      this.houseGroup = null;
    }
    // Transition Nine-Volts into giant mode.
    this.triggerGiantMode();
  }
  
  triggerGiantMode() {
    this.isGiant = true;
    // Immediately scale up his model.
    this.model.scale.set(10, 10, 10);
    // Update his chat message with a dramatic announcement.
    this.chatMessage.textContent = "NO! MY HOUSE IS GONE! NOW I'LL DESTROY EVERYTHING!";
    this.chatMessage.style.display = 'block';
    this.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
    this.chatMessage.style.fontSize = '32px';
    // Broadcast the event to other players.
    if (window.room) {
      window.room.send({
        type: "npc_event",
        event: "ninevolts_giant",
        initiator: window.room.peers[window.room.clientId]?.username || "A player"
      });
    }
    // Record the time when destruction begins.
    this.destructionStartTime = Date.now();
  }
  
  update(camera, renderer, deltaTime) {
    // NEW: If Nine-Volts is in giant mode, wait 5 seconds then destroy everything.
    if (this.isGiant) {
      if (Date.now() - this.destructionStartTime >= 5000) {
        this.destroyEverything();
        return;
      }
      // Optional visual effect: oscillate giant scale for dramatic effect.
      const scaleOsc = 10 + Math.sin(Date.now() * 0.005) * 2;
      this.model.scale.set(scaleOsc, scaleOsc, scaleOsc);
      // Ensure the dramatic chat message remains visible.
      if (this.chatMessage) {
        this.chatMessage.style.display = 'block';
      }
      return;
    }
    
    // Update Nine-Volts' chat message position on-screen.
    if (this.chatMessage) {
      // Use the world position of his model (from his current parent, e.g. the house now removed)
      const worldPosition = this.model.getWorldPosition(new THREE.Vector3());
      const screenPos = this.getScreenPosition(worldPosition, camera, renderer);
      if (screenPos && screenPos.visible) {
        this.chatMessage.style.left = `${screenPos.x}px`;
        this.chatMessage.style.top = `${screenPos.y - 45}px`;
        this.chatMessage.style.display = 'block';
      } else {
        this.chatMessage.style.display = 'none';
      }
    }
    // Billboard effect: always face the camera
    const npcPlane = this.model.children[0];
    if (npcPlane) {
      npcPlane.quaternion.copy(camera.quaternion);
    }
    
    // Update chat message position
    if (this.chatMessage) {
      const screenPos = this.getScreenPosition(this.model.position, camera, renderer);
      if (screenPos && screenPos.visible) {
        this.chatMessage.style.left = screenPos.x + 'px';
        this.chatMessage.style.top = (screenPos.y - 45) + 'px';
      } else {
        this.chatMessage.style.display = 'none';
      }
    }
    
    {
      const playerPos = this.playerModel.position.clone();
      const myPos = new THREE.Vector3();
      this.model.getWorldPosition(myPos);
      const dist = myPos.distanceTo(playerPos);
      if (dist < 5) {
        if (!this.interactionPrompt) { this.showInteractionPrompt(); }
      } else {
        if (this.interactionPrompt) { this.hideInteractionPrompt(); }
      }
    }
  }
  
  showInteractionPrompt() {
    this.interactionPrompt = document.createElement('div');
    this.interactionPrompt.style.position = 'fixed';
    this.interactionPrompt.style.bottom = '30%';
    this.interactionPrompt.style.left = '50%';
    this.interactionPrompt.style.transform = 'translateX(-50%)';
    this.interactionPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.interactionPrompt.style.color = 'white';
    this.interactionPrompt.style.padding = '15px 20px';
    this.interactionPrompt.style.borderRadius = '5px';
    this.interactionPrompt.style.zIndex = '1000';
    this.interactionPrompt.textContent = 'Press E to talk to 9-Volts';
    document.body.appendChild(this.interactionPrompt);
    
    this._interactionListener = (e) => {
      if (e.key.toLowerCase() === 'e') {
        this.interact();
      }
    };
    document.addEventListener('keydown', this._interactionListener);
  }
  
  hideInteractionPrompt() {
    if (this.interactionPrompt) {
      document.body.removeChild(this.interactionPrompt);
      this.interactionPrompt = null;
      document.removeEventListener('keydown', this._interactionListener);
    }
  }
  
  interact() {
    // When the player interacts, check if baby fronk was picked up
    if (window.babyFronk) {
      this.chatMessage.textContent = this.winPhrase;
      this.chatMessage.style.display = 'block';
      this.babyFronkDelivered = true;
      // Win the challenge – spawn Chevrolet car reward
      this.spawnChevroletCar();
      // Reset the flag so that repeat interactions won’t re-trigger
      window.babyFronk = false;
      setTimeout(() => {
        if (this.chatMessage) { this.chatMessage.style.display = 'none'; }
      }, 3000);
    } else {
      this.chatMessage.textContent = "You haven't retrieved my baby fronk yet! Go to Elon Musk's mansion to get it!";
      this.chatMessage.style.display = 'block';
      setTimeout(() => {
        if (this.chatMessage) { this.chatMessage.style.display = 'none'; }
      }, 3000);
    }
  }
  
  spawnChevroletCar() {
    const textureLoader = new THREE.TextureLoader();
    const carTexture = textureLoader.load('2005-Chevrolet-Malibu-FrontSide_CHMALLT051_505x375.jpg');
    const carMaterial = new THREE.MeshBasicMaterial({
      map: carTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const carGeometry = new THREE.PlaneGeometry(4, 3);
    const carMesh = new THREE.Mesh(carGeometry, carMaterial);
    // Position the car reward to the right of Nine-Volts
    carMesh.position.copy(this.model.position);
    carMesh.position.x += 5;
    carMesh.position.y = 1;
    this.scene.add(carMesh);
    setTimeout(() => {
      this.scene.remove(carMesh);
    }, 10000);
  }
  
  createExplosionEffect() {
    // Create a sphere that expands and fades.
    const explosionGeometry = new THREE.SphereGeometry(2, 8, 8);
    const explosionMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF5500,
      transparent: true,
      opacity: 0.8
    });
    const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
    // Position explosion near giant Nine-Volts.
    explosion.position.copy(this.model.getWorldPosition(new THREE.Vector3()));
    explosion.position.x += (Math.random() - 0.5) * 10;
    explosion.position.z += (Math.random() - 0.5) * 10;
    this.scene.add(explosion);
    
    const maxScale = 5;
    const duration = 1000;
    const startTime = Date.now();
    
    const animateExplosion = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const factor = elapsed / duration;
        explosion.scale.set(1 + factor * (maxScale - 1), 1 + factor * (maxScale - 1), 1 + factor * (maxScale - 1));
        explosion.material.opacity = 0.8 * (1 - factor);
        requestAnimationFrame(animateExplosion);
      } else {
        this.scene.remove(explosion);
      }
    };
    animateExplosion();
  }
  
  destroyEverything() {
    // Check if game over has already been triggered to prevent duplicates
    if (this.gameOverTriggered) return;
    this.gameOverTriggered = true;
    
    // NEW: Create a full-screen game over overlay with a restart button.
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.color = 'white';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '10000';
    overlay.innerHTML =
      '<h1 style="font-size:48px; margin-bottom:20px;">GAME OVER</h1>' +
      '<p style="font-size:24px; margin-bottom:20px;">NINE VOLTS DESTROYED EVERYTHING!</p>' +
      '<button id="restart-game-button" style="padding:10px 20px; font-size:24px; cursor:pointer;">Restart Game</button>';
    
    document.body.appendChild(overlay);
    
    // Find the button and add the event listener to reload the page
    const restartButton = document.getElementById('restart-game-button');
    if (restartButton) {
      restartButton.addEventListener('click', () => {
        window.location.reload(); // Refresh the site
      });
    }
  
    // Stop player controls if they exist
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
  
    // Clear the scene or take other 'destroy everything' actions if needed.
    // Currently, the overlay is the main effect. You could add scene clearing here.
    // For example:
    // while(this.scene.children.length > 0){ 
    //   this.scene.remove(this.scene.children[0]); 
    // }
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