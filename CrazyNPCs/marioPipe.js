import * as THREE from 'three';
import { Hubert } from './hubert.js';

export class MarioPipe {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.triggered = false;
    this.pipeMesh = null;
    this.moonArea = new THREE.Vector3(0, 0.5, 150);
    this.hubertNPC = null;
    
    this.createPipe();
  }
  
  createPipe() {
    const textureLoader = new THREE.TextureLoader();
    // Load the pipe texture (the asset is reused; we override its color)
    const pipeTexture = textureLoader.load('Longpipe-removebg-preview.png');
    const pipeGeometry = new THREE.PlaneGeometry(3, 4);
    // Use a MeshStandardMaterial with a green tint
    const pipeMaterial = new THREE.MeshStandardMaterial({ 
      map: pipeTexture,
      color: 0x00ff00,  // green overlay
      transparent: true,
      side: THREE.DoubleSide
    });
    this.pipeMesh = new THREE.Mesh(pipeGeometry, pipeMaterial);
    // Position the pipe near spawn (e.g. at x=5, y=2, z=0)
    this.pipeMesh.position.set(5, 2, 0);
    this.scene.add(this.pipeMesh);
  }
  
  update(deltaTime) {
    if (this.triggered) return;
    const distance = this.playerModel.position.distanceTo(this.pipeMesh.position);
    if (distance < 2) {
      this.teleportToMoon();
      this.triggered = true;
    }
  }
  
  teleportToMoon() {
    // Teleport player to the moon
    this.playerModel.position.copy(this.moonArea);
    this.scene.background = new THREE.Color(0x000000);
    const moonGeometry = new THREE.PlaneGeometry(500, 500);
    const moonMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const moonGround = new THREE.Mesh(moonGeometry, moonMaterial);
    moonGround.rotation.x = -Math.PI / 2;
    moonGround.position.y = 0;
    this.scene.add(moonGround);
    if (!window.hubertNPC) {
      window.hubertNPC = new Hubert(this.scene, this.playerModel);
    }
    const notification = document.createElement('div');
    notification.textContent = "Teleported to the Moon!";
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
    }, 3000);
    // After 10 seconds on the moon, if the player has not provoked Elon, Hubert “offers” millions:
    setTimeout(() => {
      if (window.hubertNPC && !window.hubertNPC.rewardGiven) {
        window.hubertNPC.offerReward();
      }
    }, 10000);
  }
}