import * as THREE from "three";

// Simple seeded random number generator
class MathRandom {
  constructor(seed) {
    this.seed = seed;
  }
  
  random() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

export function createBarriers(scene) {
  // Use a deterministic random number generator based on a fixed seed
  const barrierSeed = 12345; // Fixed seed for deterministic generation
  let rng = new MathRandom(barrierSeed);
  
  // Wall material
  const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888,
    roughness: 0.7,
    metalness: 0.2
  });
  
  // Create some random barriers
  for (let i = 0; i < 25; i++) {  
    const width = 1 + rng.random() * 3;
    const height = 1 + rng.random() * 3;
    const depth = 1 + rng.random() * 3;
    
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    
    // Random position, but not too close to center
    const angle = rng.random() * Math.PI * 2;
    const distance = 10 + rng.random() * 70;  
    wall.position.x = Math.cos(angle) * distance;
    wall.position.z = Math.sin(angle) * distance;
    wall.position.y = height / 2;
    
    wall.castShadow = true;
    wall.receiveShadow = true;
    wall.userData.isBarrier = true;
    
    scene.add(wall);
  }
  
  // Add decorative pillars throughout the scene
  const pillarCount = 15;
  for (let i = 0; i < pillarCount; i++) {
    const angle = rng.random() * Math.PI * 2;
    const distance = 10 + rng.random() * 70;  
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    
    // Create a tall, thin pillar with much more height variation
    const pillarHeight = 2 + rng.random() * 15; 
    const pillarWidth = 0.8 + rng.random() * 0.6;
    const pillarGeo = new THREE.BoxGeometry(pillarWidth, pillarHeight, pillarWidth);
    
    // Use a slightly different material for pillars
    const pillarMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xaaaaaa,
      roughness: 0.6,
      metalness: 0.3
    });
    
    const pillar = new THREE.Mesh(pillarGeo, pillarMaterial);
    pillar.position.set(x, pillarHeight/2, z);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    pillar.userData.isBarrier = true;
    
    // Add a decorative cap to the pillar
    const capSize = pillarWidth * 1.5;
    const capHeight = 0.5;
    const capGeo = new THREE.BoxGeometry(capSize, capHeight, capSize);
    const cap = new THREE.Mesh(capGeo, wallMaterial);
    cap.position.y = pillarHeight/2 + capHeight/2;
    pillar.add(cap);
    
    scene.add(pillar);
  }
  
  // Create Elon's mansion
  createMansion(scene, rng);
}

// Function to create Elon's mansion
function createMansion(scene, rng) {
  // Position mansion away from center
  const mansionX = 60;
  const mansionZ = 60;
  
  // Mansion materials
  const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xE8E4C9, // Cream colored walls
    roughness: 0.8,
    metalness: 0.2
  });
  
  const roofMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513, // Dark brown roof
    roughness: 0.9,
    metalness: 0.1
  });
  
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x996633, // Wood floor
    roughness: 0.8,
    metalness: 0.2
  });
  
  // Create a mansion group
  const mansion = new THREE.Group();
  mansion.position.set(mansionX, 0, mansionZ);
  
  // Main building
  const buildingWidth = 30;
  const buildingDepth = 25;
  const buildingHeight = 12;
  
  // Create mansion walls (external walls with a cutout for door)
  const exteriorWalls = new THREE.Group();
  
  // Front wall with door hole
  const frontWallLeft = new THREE.Mesh(
    new THREE.BoxGeometry(buildingWidth / 2 - 2, buildingHeight, 1),
    wallMaterial
  );
  frontWallLeft.position.set(-buildingWidth / 4 - 1, buildingHeight / 2, -buildingDepth / 2);
  exteriorWalls.add(frontWallLeft);
  
  const frontWallRight = new THREE.Mesh(
    new THREE.BoxGeometry(buildingWidth / 2 - 2, buildingHeight, 1),
    wallMaterial
  );
  frontWallRight.position.set(buildingWidth / 4 + 1, buildingHeight / 2, -buildingDepth / 2);
  exteriorWalls.add(frontWallRight);
  
  // Front wall top (above door)
  const frontWallTop = new THREE.Mesh(
    new THREE.BoxGeometry(4, buildingHeight / 2, 1),
    wallMaterial
  );
  frontWallTop.position.set(0, buildingHeight * 0.75, -buildingDepth / 2);
  exteriorWalls.add(frontWallTop);
  
  // Back wall
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(buildingWidth, buildingHeight, 1),
    wallMaterial
  );
  backWall.position.set(0, buildingHeight / 2, buildingDepth / 2);
  exteriorWalls.add(backWall);
  
  // Left wall
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(1, buildingHeight, buildingDepth),
    wallMaterial
  );
  leftWall.position.set(-buildingWidth / 2, buildingHeight / 2, 0);
  exteriorWalls.add(leftWall);
  
  // Right wall
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(1, buildingHeight, buildingDepth),
    wallMaterial
  );
  rightWall.position.set(buildingWidth / 2, buildingHeight / 2, 0);
  exteriorWalls.add(rightWall);
  
  // Floor
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(buildingWidth, 0.5, buildingDepth),
    floorMaterial
  );
  floor.position.set(0, 0.25, 0);
  exteriorWalls.add(floor);
  
  // Roof (triangular roof)
  const roofHeight = 6;
  const roofGeometry = new THREE.ConeGeometry(buildingWidth / Math.SQRT2, roofHeight, 4);
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, buildingHeight + roofHeight / 2, 0);
  roof.rotation.y = Math.PI / 4;
  exteriorWalls.add(roof);
  
  // Interior room dividers
  const dividerMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xE8E4C9,
    roughness: 0.8,
    metalness: 0.2
  });
  
  // Central divider
  const centralDivider = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, buildingHeight, buildingDepth - 10),
    dividerMaterial
  );
  centralDivider.position.set(0, buildingHeight / 2, 0);
  exteriorWalls.add(centralDivider);
  
  // Left room divider
  const leftDivider = new THREE.Mesh(
    new THREE.BoxGeometry(buildingWidth / 2 - 1, buildingHeight, 0.5),
    dividerMaterial
  );
  leftDivider.position.set(-buildingWidth / 4, buildingHeight / 2, 5);
  exteriorWalls.add(leftDivider);
  
  // Right room divider
  const rightDivider = new THREE.Mesh(
    new THREE.BoxGeometry(buildingWidth / 2 - 1, buildingHeight, 0.5),
    dividerMaterial
  );
  rightDivider.position.set(buildingWidth / 4, buildingHeight / 2, -5);
  exteriorWalls.add(rightDivider);
  
  // Windows
  const windowMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xADD8E6,
    roughness: 0.2,
    metalness: 0.8,
    transparent: true,
    opacity: 0.7
  });
  
  // Add windows to each wall
  for (let i = 0; i < 3; i++) {
    // Front windows
    const frontWindowLeft = new THREE.Mesh(
      new THREE.BoxGeometry(2, 3, 0.1),
      windowMaterial
    );
    frontWindowLeft.position.set(-buildingWidth / 4 - 4 + i * 4, buildingHeight / 2, -buildingDepth / 2 + 0.6);
    exteriorWalls.add(frontWindowLeft);
    
    const frontWindowRight = new THREE.Mesh(
      new THREE.BoxGeometry(2, 3, 0.1),
      windowMaterial
    );
    frontWindowRight.position.set(buildingWidth / 4 + 4 - i * 4, buildingHeight / 2, -buildingDepth / 2 + 0.6);
    exteriorWalls.add(frontWindowRight);
    
    // Back windows
    const backWindow = new THREE.Mesh(
      new THREE.BoxGeometry(2, 3, 0.1),
      windowMaterial
    );
    backWindow.position.set(-10 + i * 10, buildingHeight / 2, buildingDepth / 2 - 0.6);
    exteriorWalls.add(backWindow);
    
    // Side windows
    if (i < 2) {
      const leftWindow = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 3, 2),
        windowMaterial
      );
      leftWindow.position.set(-buildingWidth / 2 + 0.6, buildingHeight / 2, -5 + i * 10);
      exteriorWalls.add(leftWindow);
      
      const rightWindow = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 3, 2),
        windowMaterial
      );
      rightWindow.position.set(buildingWidth / 2 - 0.6, buildingHeight / 2, -5 + i * 10);
      exteriorWalls.add(rightWindow);
    }
  }
  
  // Add a path leading to the mansion
  const pathMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xD3D3D3, // Light gray
    roughness: 1.0,
    metalness: 0.0
  });
  
  const pathLength = 40;
  const pathWidth = 5;
  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(pathWidth, pathLength),
    pathMaterial
  );
  path.rotation.x = -Math.PI / 2;
  path.position.set(0, 0.01, -buildingDepth / 2 - pathLength / 2);
  
  mansion.add(exteriorWalls);
  mansion.add(path);
  
  // Set custom properties for the mansion
  mansion.userData.isMansion = true;
  mansion.userData.isInterior = false;  // Can be toggled for enter/exit
  
  scene.add(mansion);
}

export function createTrees(scene) {
  // Use a deterministic random number generator for consistent tree placement
  const treeSeed = 54321; // Different seed than barriers
  let rng = new MathRandom(treeSeed);
  
  // Tree trunk materials (varying browns)
  const trunkMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.9, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x6B4423, roughness: 0.9, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.8, metalness: 0.1 })
  ];
  
  // Tree leaves materials (varying greens)
  const leavesMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x2E8B57, roughness: 0.8, metalness: 0.0 }),
    new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.8, metalness: 0.0 }),
    new THREE.MeshStandardMaterial({ color: 0x006400, roughness: 0.7, metalness: 0.0 })
  ];
  
  // Create different types of trees
  for (let i = 0; i < 40; i++) {  
    // Select random materials
    const trunkMaterial = trunkMaterials[Math.floor(rng.random() * trunkMaterials.length)];
    const leavesMaterial = leavesMaterials[Math.floor(rng.random() * leavesMaterials.length)];
    
    // Create tree group
    const tree = new THREE.Group();
    
    // Create tree trunk
    const trunkHeight = 5 + rng.random() * 7;
    const trunkRadius = 0.3 + rng.random() * 0.3;
    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius * 0.8, trunkRadius * 1.2, trunkHeight, 8);
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = trunkHeight / 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);
    
    // Determine tree type (pine or broad-leaf)
    const isPine = rng.random() > 0.5;
    
    if (isPine) {
      // Pine tree (multiple cones stacked)
      const layers = 2 + Math.floor(rng.random() * 3);
      const baseRadius = trunkRadius * 6;
      const layerHeight = trunkHeight * 0.4;
      
      for (let j = 0; j < layers; j++) {
        const layerRadius = baseRadius * (1 - j * 0.2);
        const coneGeometry = new THREE.ConeGeometry(layerRadius, layerHeight, 8);
        const cone = new THREE.Mesh(coneGeometry, leavesMaterial);
        cone.position.y = trunkHeight * 0.5 + j * (layerHeight * 0.6);
        cone.castShadow = true;
        cone.receiveShadow = true;
        tree.add(cone);
      }
    } else {
      // Broad-leaf tree (ellipsoidQuestion of and also a sphere
      const leafShape = rng.random() > 0.5 ? 'ellipsoid' : 'sphere';
      const leavesRadius = trunkRadius * (4 + rng.random() * 2);
      
      if (leafShape === 'ellipsoid') {
        // Create ellipsoid using scaled sphere
        const leavesGeometry = new THREE.SphereGeometry(leavesRadius, 8, 8);
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = trunkHeight * 0.7;
        leaves.scale.set(1, 1.2 + rng.random() * 0.5, 1);
        leaves.castShadow = true;
        leaves.receiveShadow = true;
        tree.add(leaves);
      } else {
        // Create multiple spheres for a more natural canopy
        const sphereCount = 2 + Math.floor(rng.random() * 3);
        for (let j = 0; j < sphereCount; j++) {
          const sphereSize = leavesRadius * (0.7 + rng.random() * 0.5);
          const leavesGeometry = new THREE.SphereGeometry(sphereSize, 8, 8);
          const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
          leaves.position.y = trunkHeight * 0.7;
          leaves.position.x = (rng.random() - 0.5) * trunkRadius * 2;
          leaves.position.z = (rng.random() - 0.5) * trunkRadius * 2;
          leaves.castShadow = true;
          leaves.receiveShadow = true;
          tree.add(leaves);
        }
      }
    }
    
    // Random position, avoiding center area and existing barriers
    const angle = rng.random() * Math.PI * 2;
    const distance = 15 + rng.random() * 70;  
    tree.position.x = Math.cos(angle) * distance;
    tree.position.z = Math.sin(angle) * distance;
    
    // Add some random rotation and scale variation
    tree.rotation.y = rng.random() * Math.PI * 2;
    const treeScale = 0.8 + rng.random() * 0.5;
    tree.scale.set(treeScale, treeScale, treeScale);
    
    // Add custom property for collision detection - move barrier detection to the whole tree instead
    tree.userData.isTree = true;
    tree.userData.isBarrier = true;
    
    scene.add(tree);
  }
}

export function createClouds(scene) {
  const cloudSeed = 67890; // Different seed for clouds
  let rng = new MathRandom(cloudSeed);
  
  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Pure white
    opacity: 0.95, // Slightly increased opacity
    transparent: true,
    roughness: 0.9, // Increased roughness to make it less shiny
    metalness: 0.0,
    emissive: 0xcccccc, // Add slight emissive color to make it brighter
    emissiveIntensity: 0.2 // Subtle emission to enhance whiteness
  });
  
  for (let i = 0; i < 20; i++) {
    const cloudGroup = new THREE.Group();
    
    // Create cloud with multiple spheres
    const puffCount = 3 + Math.floor(rng.random() * 5);
    for (let j = 0; j < puffCount; j++) {
      const puffSize = 2 + rng.random() * 3;
      const puffGeometry = new THREE.SphereGeometry(puffSize, 7, 7);
      const puff = new THREE.Mesh(puffGeometry, cloudMaterial);
      
      puff.position.x = (rng.random() - 0.5) * 5;
      puff.position.y = (rng.random() - 0.5) * 2;
      puff.position.z = (rng.random() - 0.5) * 5;
      
      cloudGroup.add(puff);
    }
    
    // Position the cloud
    const angle = rng.random() * Math.PI * 2;
    const distance = 20 + rng.random() * 60;
    cloudGroup.position.x = Math.cos(angle) * distance;
    cloudGroup.position.z = Math.sin(angle) * distance;
    cloudGroup.position.y = 20 + rng.random() * 15;
    
    // Random rotation
    cloudGroup.rotation.y = rng.random() * Math.PI * 2;
    
    // Add to scene
    scene.add(cloudGroup);
  }
}