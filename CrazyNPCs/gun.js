import * as THREE from 'three';

export class Gun {
  constructor(scene, playerModel, camera, renderer) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.camera = camera;
    this.renderer = renderer;
    this.playerHasGun = false;
    this.gunPickup = null;
    this.gunModel = null;
    this.maxAmmo = 5;
    this.currentAmmo = this.maxAmmo;
    this.lastShotTime = 0;
    this.shootCooldown = 500; // milliseconds between shots
    
    this.createGunPickup();
    this.createGunIndicator();
  }
  
  createGunPickup() {
    // Create gun pickup object
    const gunGroup = new THREE.Group();
    
    // Gun body
    const gunBodyGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.3);
    const gunMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const gunBody = new THREE.Mesh(gunBodyGeometry, gunMaterial);
    gunGroup.add(gunBody);
    
    // Gun handle
    const gunHandleGeometry = new THREE.BoxGeometry(0.08, 0.2, 0.1);
    const gunHandle = new THREE.Mesh(gunHandleGeometry, gunMaterial);
    gunHandle.position.set(0, -0.15, 0);
    gunGroup.add(gunHandle);
    
    // Set gun pickup position
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 20;
    gunGroup.position.set(
      Math.cos(angle) * distance,
      0.5,
      Math.sin(angle) * distance
    );
    
    // Add floating animation
    gunGroup.userData.initialY = gunGroup.position.y;
    
    // Add to scene
    this.scene.add(gunGroup);
    this.gunPickup = gunGroup;
  }
  
  createGunIndicator() {
    // Create UI indicator for gun
    const gunIndicator = document.createElement('div');
    gunIndicator.id = 'gun-indicator';
    gunIndicator.innerHTML = 'GUN: <span id="ammo-counter">' + this.currentAmmo + '</span>';
    document.getElementById('game-container').appendChild(gunIndicator);
    this.gunIndicator = gunIndicator;
  }
  
  createGunModel() {
    // Create gun to attach to player
    const gunGroup = new THREE.Group();
    
    // Gun body
    const gunBodyGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.3);
    const gunMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const gunBody = new THREE.Mesh(gunBodyGeometry, gunMaterial);
    gunGroup.add(gunBody);
    
    // Gun handle
    const gunHandleGeometry = new THREE.BoxGeometry(0.08, 0.2, 0.1);
    const gunHandle = new THREE.Mesh(gunHandleGeometry, gunMaterial);
    gunHandle.position.set(0, -0.15, 0);
    gunGroup.add(gunHandle);
    
    // Position gun at player's side
    gunGroup.position.set(0.3, 0, 0.2);
    
    // Add to player model
    this.playerModel.add(gunGroup);
    this.gunModel = gunGroup;
    
    // Show gun indicator
    this.gunIndicator.style.display = 'block';
  }
  
  update(camera, renderer, deltaTime) {
    // Check if player is close to the gun pickup
    if (this.gunPickup && !this.playerHasGun) {
      // Make gun float
      const time = performance.now() * 0.001;
      this.gunPickup.position.y = this.gunPickup.userData.initialY + Math.sin(time * 2) * 0.1;
      this.gunPickup.rotation.y += 0.02;
      
      // Check distance to player
      const distance = this.gunPickup.position.distanceTo(this.playerModel.position);
      if (distance < 1.5) {
        this.pickupGun();
      }
    }
  }
  
  pickupGun() {
    // Remove gun pickup from scene
    this.scene.remove(this.gunPickup);
    this.gunPickup = null;
    
    // Create gun model attached to player
    this.createGunModel();
    
    // Set player has gun
    this.playerHasGun = true;
    
    // Update UI
    this.updateAmmoCounter();
    
    // Add notification
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = 'white';
    notification.style.padding = '20px';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '9999';
    notification.innerText = 'Gun acquired! Press F or click to shoot.';
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
  
  shoot() {
    // Check if can shoot
    const now = performance.now();
    if (now - this.lastShotTime < this.shootCooldown || this.currentAmmo <= 0) return;
    
    this.lastShotTime = now;
    this.currentAmmo--;
    
    // Update UI
    this.updateAmmoCounter();
    
    // Shoot visual effect
    this.createMuzzleFlash();
    
    // Check if camera is available
    if (!this.camera) {
      // Get camera from player controls if available
      if (window.playerControls) {
        this.camera = window.playerControls.getCamera();
      }
      if (!this.camera) return; // Exit if still no camera
    }
    
    // Get renderer if not available
    if (!this.renderer && window.playerControls) {
      this.renderer = window.playerControls.renderer;
    }
    
    // Check if hit any NPC with raycaster
    const raycaster = new THREE.Raycaster();
    
    // Calculate direction from camera
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);
    
    // Set raycaster origin and direction
    raycaster.set(this.camera.position, cameraDirection);
    
    // Check what was hit
    const allObjects = this.scene.children.filter(obj => {
      // Filter for possible NPCs
      return obj.type === 'Group' && obj !== this.playerModel;
    });
    
    const intersects = raycaster.intersectObjects(allObjects, true);
    
    if (intersects.length > 0) {
      // Find the parent group of the hit object
      let hitObject = intersects[0].object;
      while (hitObject.parent && hitObject.parent !== this.scene) {
        hitObject = hitObject.parent;
      }
      
      // Check which NPC was hit
      this.handleNPCShot(hitObject);
    }
  }
  
  handleNPCShot(hitObject) {
    // Check sock puppet
    if (window.sockPuppet && window.sockPuppet.puppet === hitObject) {
      window.sockPuppet.getShot();
    }
    // Check IShowSpeed
    else if (window.showSpeedNPC && window.showSpeedNPC.model === hitObject) {
      if (window.showSpeedNPC.getShot) {
        window.showSpeedNPC.getShot();
      } else {
        // Fallback if getShot not implemented
        if (window.elonMusk) {
          window.elonMusk.playerShotNPC();
        }
      }
    }
    // Check Screaming Woman
    else if (window.screamingWoman && window.screamingWoman.model === hitObject) {
      if (window.screamingWoman.getShot) {
        window.screamingWoman.getShot();
      } else {
        // Fallback if getShot not implemented
        if (window.elonMusk) {
          window.elonMusk.playerShotNPC();
        }
      }
    }
    // Check Angry Woman
    else if (window.angryWoman && window.angryWoman.model === hitObject) {
      if (window.angryWoman.getShot) {
        window.angryWoman.getShot();
      } else {
        // Fallback if getShot not implemented
        if (window.elonMusk) {
          window.elonMusk.playerShotNPC();
        }
      }
    }
    // Check Double Face Man
    else if (window.doubleFaceMan && window.doubleFaceMan.model === hitObject) {
      if (window.doubleFaceMan.getShot) {
        window.doubleFaceMan.getShot();
      } else {
        // Fallback if getShot not implemented
        if (window.elonMusk) {
          window.elonMusk.playerShotNPC();
        }
      }
    }
    // Check Elon Musk
    else if (window.elonMusk && window.elonMusk.model === hitObject) {
      if (window.elonMusk.getShot) {
        window.elonMusk.getShot();
      } else {
        // Fallback if getShot not implemented
        if (window.elonMusk) {
          window.elonMusk.playerShotNPC();
        }
      }
    }
  }
  
  createMuzzleFlash() {
    // Create a muzzle flash light
    const flash = new THREE.PointLight(0xffff00, 5, 10);
    
    // Position at gun tip
    if (this.gunModel) {
      flash.position.set(
        this.gunModel.position.x,
        this.gunModel.position.y,
        this.gunModel.position.z + 0.3
      );
      this.playerModel.add(flash);
    } else {
      // Fallback - attach to player
      flash.position.set(0.3, 1.2, 0.6);
      this.playerModel.add(flash);
    }
    
    // Remove after short time
    setTimeout(() => {
      this.playerModel.remove(flash);
    }, 50);
  }
  
  updateAmmoCounter() {
    document.getElementById('ammo-counter').textContent = this.currentAmmo;
    
    // Change color based on ammo
    if (this.currentAmmo === 0) {
      document.getElementById('ammo-counter').style.color = 'red';
    } else if (this.currentAmmo <= 2) {
      document.getElementById('ammo-counter').style.color = 'orange';
    } else {
      document.getElementById('ammo-counter').style.color = 'yellow';
    }
  }
}