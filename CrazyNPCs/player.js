import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function createPlayerModel(THREE, username) {
  const playerGroup = new THREE.Group();
  const loader = new GLTFLoader();

  // Load the Spongebob model (using the provided asset spongebob.glb)
  loader.load('/spongebob.glb', (gltf) => {
    const model = gltf.scene;
    // Adjust scale and position as needed (tweak these values if necessary)
    model.scale.set(0.5, 0.5, 0.5);
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
    playerGroup.add(model);
  }, undefined, (error) => {
    console.error("Error loading spongebob model:", error);
  });

  // Retain existing chat billboard setup so that UI elements requiring it continue to function
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  context.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent background
  context.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  const chatMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const chatGeometry = new THREE.PlaneGeometry(1, 0.25);
  const chatMesh = new THREE.Mesh(chatGeometry, chatMaterial);
  chatMesh.position.y = 2.3;
  chatMesh.rotation.x = Math.PI / 12;
  chatMesh.visible = false;
  chatMesh.name = "chatBillboard";
  playerGroup.add(chatMesh);

  return playerGroup;
}