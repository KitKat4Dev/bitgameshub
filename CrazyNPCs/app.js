import * as THREE from "three";
import { PlayerControls } from "./controls.js";
import { createPlayerModel } from "./player.js";
import { createBarriers, createTrees, createClouds } from "./worldGeneration.js";
import { SockPuppet } from "./sockPuppet.js";
import { IShowSpeed } from "./ishowSpeed.js";
import { ScreamingWoman } from "./screamingWoman.js";
import { AngryWoman } from "./angryWoman.js";
import { ElonMusk } from "./elonMusk.js";
import { DoubleFaceMan } from "./doubleFaceMan.js";
import { Gun } from "./gun.js";
import { Shop } from "./shop.js";
import { School } from "./school.js";
import { Dealer } from "./dealer.js";
import { Walmart } from "./walmart.js";
import { PaperMan } from "./paperMan.js";
import { PeterGriffin } from "./peterGriffin.js";
import { MePhone4 } from "./mePhone4.js";
import { QuestSystem } from "./quests.js"; 
import { PoliceStation } from "./policeStation.js";
import { KendrickLamar } from "./kendrickLamar.js";
import { NineVolts } from "./nineVolts.js";
import { MarioPipe } from "./marioPipe.js";
import { Hubert } from "./hubert.js";
import { CustomNPC } from "./customNPC.js";

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

async function main() {
  // Initialize WebsimSocket for multiplayer functionality
  const room = new WebsimSocket();
  await room.initialize();

  // Generate a random player name if not available
  const playerInfo = room.peers[room.clientId] || {};
  const playerName = playerInfo.username || `Player${Math.floor(Math.random() * 1000)}`;

  // Safe initial position values
  const playerX = (Math.random() * 10) - 5;
  const playerZ = (Math.random() * 10) - 5;

  // Setup Three.js scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB); // Light sky blue background

  // Create barriers, trees, clouds and platforms
  createBarriers(scene);
  createTrees(scene);
  createClouds(scene);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('game-container').appendChild(renderer.domElement);

  // Object to store other players
  const otherPlayers = {};
  const playerLabels = {};
  const chatMessages = {};
  const customNPCs = [];

  // Create player model
  const playerModel = createPlayerModel(THREE, playerName);
  scene.add(playerModel);

  // Create sock puppet NPC
  const sockPuppet = new SockPuppet(scene, playerModel);
  window.sockPuppet = sockPuppet;

  // Create IShowSpeed NPC
  const showSpeedNPC = new IShowSpeed(scene, playerModel, sockPuppet);
  window.showSpeedNPC = showSpeedNPC;

  // Create Screaming Woman NPC
  const screamingWoman = new ScreamingWoman(scene, playerModel);
  window.screamingWoman = screamingWoman;

  // Create Angry Woman NPC
  const angryWoman = new AngryWoman(scene, playerModel, sockPuppet, showSpeedNPC);
  window.angryWoman = angryWoman;

  // Create Elon Musk NPC
  const elonMusk = new ElonMusk(scene, playerModel);
  window.elonMusk = elonMusk;

  // Create Double Face Man NPC
  const doubleFaceMan = new DoubleFaceMan(scene, playerModel);
  window.doubleFaceMan = doubleFaceMan;

  // Create gun
  const gun = new Gun(scene, playerModel, null, renderer);
  window.gun = gun;

  // Create shop system
  const shop = new Shop(scene, playerModel);
  window.shop = shop;

  // Create school system
  const school = new School(scene, playerModel);
  window.school = school;

  // Create dealer in the cave
  const dealer = new Dealer(scene, playerModel);
  window.dealer = dealer;

  // Create Walmart and Wega
  const walmart = new Walmart(scene, playerModel);
  window.walmart = walmart;

  // Create Paper Man NPC
  const paperMan = new PaperMan(scene, playerModel);
  window.paperMan = paperMan;

  // Create MePhone4 NPC
  const mePhone4 = new MePhone4(scene, playerModel);
  window.mePhone4 = mePhone4;

  // Create Peter Griffin NPC
  const peterGriffin = new PeterGriffin(scene, playerModel);
  window.peterGriffin = peterGriffin;

  // Create police station
  const policeStation = new PoliceStation(scene, playerModel);
  window.policeStation = policeStation;

  // Create Kendrick Lamar concert stage
  const kendrickLamar = new KendrickLamar(scene, playerModel);
  window.kendrickLamar = kendrickLamar;

  // Create Nine-Volts NPC
  const nineVolts = new NineVolts(scene, playerModel);
  window.nineVolts = nineVolts;

  // Create quest system
  const questSystem = new QuestSystem(scene, playerModel, shop);
  window.questSystem = questSystem;

  // Create Mario Pipe
  const marioPipe = new MarioPipe(scene, playerModel);
  window.marioPipe = marioPipe;

  // Hubert (conditionally created on Moon)
  window.hubertNPC = null;

  // Global flag for when player is hated by all NPCs
  window.isPlayerHated = false;

  // Initialize player controls
  const playerControls = new PlayerControls(scene, room, {
    renderer: renderer,
    initialPosition: {
      x: playerX,
      y: 0.5,
      z: playerZ
    },
    playerModel: playerModel
  });
  const camera = playerControls.getCamera();

  // Make player controls available to other modules
  window.playerControls = playerControls;

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Directional light (sun)
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 50;
  dirLight.shadow.camera.left = -25;
  dirLight.shadow.camera.right = 25;
  dirLight.shadow.camera.top = 25;
  dirLight.shadow.camera.bottom = -25;
  scene.add(dirLight);

  // Ground (disco floor)
  const groundGeometry = new THREE.PlaneGeometry(300, 300);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x55aa55,
    roughness: 0.8,
    metalness: 0.2
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2; // Rotate to horizontal
  ground.receiveShadow = true;
  scene.add(ground);

  // Grid helper for better spatial awareness
  const gridHelper = new THREE.GridHelper(300, 300);
  scene.add(gridHelper);

  // Easter Egg
  const easterEggBlock = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({color: 0xff0000})
  );
  easterEggBlock.position.set(-5,1.5,-20);
  easterEggBlock.userData.isEasterEgg = true;
  scene.add(easterEggBlock);

  // --- NPC Creator UI Elements ---
  const npcCreatorModal = document.getElementById('npc-creator-modal');
  const npcNameInput = document.getElementById('npc-name');
  const npcPersonalitySelect = document.getElementById('npc-personality');
  const npcImageUpload = document.getElementById('npc-image-upload');
  const npcImagePrompt = document.getElementById('npc-image-prompt');
  const generateImageButton = document.getElementById('generate-image-button');
  const generatedImagePreview = document.getElementById('generated-image-preview');
  const generatedImageUrlInput = document.getElementById('generated-image-url');
  const npcPhrasesTextarea = document.getElementById('npc-phrases');
  const submitNpcButton = document.getElementById('submit-npc-button');
  const cancelNpcButton = document.getElementById('cancel-npc-button');

  // --- NPC Creator Logic ---
  generateImageButton.addEventListener('click', async () => {
      const prompt = npcImagePrompt.value.trim();
      if (!prompt) {
          alert('Please enter a prompt to generate an image.');
          return;
      }
      generateImageButton.textContent = 'Generating...';
      generateImageButton.disabled = true;
      try {
          const result = await websim.imageGen({ prompt: prompt, aspect_ratio: "1:1" });
          generatedImageUrlInput.value = result.url;
          generatedImagePreview.src = result.url;
          generatedImagePreview.style.display = 'block';
          npcImageUpload.value = ''; // Clear file input if AI image is generated
      } catch (error) {
          console.error('Error generating image:', error);
          alert('Failed to generate image. Please try again.');
      } finally {
          generateImageButton.textContent = 'Generate';
          generateImageButton.disabled = false;
      }
  });

  submitNpcButton.addEventListener('click', async () => {
    const name = npcNameInput.value.trim();
    const personality = npcPersonalitySelect.value;
    const phrases = npcPhrasesTextarea.value.trim().split('\n').filter(p => p.trim() !== '');
    const uploadedFile = npcImageUpload.files[0];
    const generatedUrl = generatedImageUrlInput.value;

    if (!name) {
        alert('Please enter a name for the NPC.');
        return;
    }
    if (!phrases.length) {
        alert('Please enter at least one phrase for the NPC.');
        return;
    }
    if (!uploadedFile && !generatedUrl) {
        alert('Please upload an image or generate one using AI.');
        return;
    }

    submitNpcButton.textContent = 'Creating...';
    submitNpcButton.disabled = true;

    let imageUrl = '';
    try {
        if (uploadedFile) {
            imageUrl = await websim.upload(uploadedFile);
        } else {
            imageUrl = generatedUrl;
        }

        const npcData = {
            name: name,
            personality: personality,
            imageUrl: imageUrl,
            phrases: phrases
        };

        // Spawn the NPC near the player
        const spawnOffset = new THREE.Vector3(Math.random() * 4 - 2, 0, Math.random() * 4 - 2);
        const spawnPosition = playerModel.position.clone().add(spawnOffset);
        spawnPosition.y = 0.5; // Ensure it spawns on the ground

        const newNPC = new CustomNPC(scene, playerModel, spawnPosition, npcData);
        customNPCs.push(newNPC);

        // Close and reset modal
        npcCreatorModal.style.display = 'none';
        if (window.playerControls) {
            window.playerControls.enabled = true; // Re-enable game controls
        }
        npcNameInput.value = '';
        npcPersonalitySelect.value = 'wander';
        npcImageUpload.value = '';
        npcImagePrompt.value = '';
        generatedImageUrlInput.value = '';
        generatedImagePreview.src = '';
        generatedImagePreview.style.display = 'none';
        npcPhrasesTextarea.value = '';

        showNotification(`NPC "${name}" created!`, 3000);

    } catch (error) {
        console.error('Error creating NPC:', error);
        alert('Failed to create NPC. Please try again.');
    } finally {
        submitNpcButton.textContent = 'Create NPC';
        submitNpcButton.disabled = false;
    }
});

  // Create DOM element for player name label
  function createPlayerLabel(playerId, username) {
    const label = document.createElement('div');
    label.className = 'player-name';
    label.textContent = username;
    document.getElementById('game-container').appendChild(label);
    return label;
  }

  // Create DOM element for chat message
  function createChatMessage(playerId) {
    const message = document.createElement('div');
    message.className = 'chat-message';
    message.style.display = 'none';
    document.getElementById('game-container').appendChild(message);
    return message;
  }

  // Create chat input container
  const chatInputContainer = document.createElement('div');
  chatInputContainer.id = 'chat-input-container';
  const chatInput = document.createElement('input');
  chatInput.id = 'chat-input';
  chatInput.type = 'text';
  chatInput.maxLength = 100;
  chatInput.placeholder = 'Type a message...';
  chatInputContainer.appendChild(chatInput);

  // Add close button for chat input
  const closeChat = document.createElement('div');
  closeChat.id = 'close-chat';
  closeChat.innerHTML = '&#10006;'; 
  chatInputContainer.appendChild(closeChat);

  document.getElementById('game-container').appendChild(chatInputContainer);

  // Create chat button for all devices
  const chatButton = document.createElement('div');
  chatButton.id = 'chat-button';
  chatButton.innerText = 'CHAT';
  document.getElementById('game-container').appendChild(chatButton);

  // Create a give coins button but only show to "Fiveky" 
  let giveCoinsButton;
  let adminPanel;
    // Admin Panel
    adminPanel = document.createElement('div');
    adminPanel.id = 'admin-panel';
    adminPanel.style.position = 'fixed';
    adminPanel.style.top = '70px';
    adminPanel.style.right = '20px';
    adminPanel.style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
    adminPanel.style.color = 'white';
    adminPanel.style.padding = '10px';
    adminPanel.style.borderRadius = '10px';
    adminPanel.style.zIndex = '1000';
    adminPanel.style.fontFamily = 'Arial, sans-serif';
    adminPanel.style.maxWidth = '300px';

    adminPanel.innerHTML = `
      <h3 style="color:#ddd; margin-bottom:10px; text-align: center;">Admin Panel</h3>
      
      <div style="margin-bottom:5px; font-size: small; font-style: italic;">*For Everyone Now!*</div>

      <label style="display: block; margin-bottom: 5px;">
        Set Coin Amount:
        <input type="number" id="coin-amount" style="width: 80px; padding: 5px; margin-left: 5px; border-radius: 4px; border: none;">
        <button id="set-coins-btn" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Set</button>
      </label>

      <label style="display: block; margin-bottom: 5px;">
        Make Puppie Hostile to:
        <input type="text" id="target-player-puppie" placeholder="Player Name" style="width: 120px; padding: 5px; margin-left: 5px; border-radius: 4px; border: none;">
        <button id="make-puppie-hostile" style="padding: 5px 10px; background-color: #FF5733; color: white; border: none; border-radius: 4px; cursor: pointer;">Trigger</button>
      </label>

      <label style="display: block; margin-bottom: 5px;">
        Give Item:
        <select id="item-select" style="width: 150px; padding: 5px; border-radius: 4px; border: none;">
          <option value="">Select Item</option>
          <option value="uranium_rock">Uranium Rock</option>
          <option value="plutonium_vial">Plutonium Vial</option>
          <option value="nuclear_battery">Nuclear Battery</option>
          <option value="meltdown_insurance">Meltdown Insurance</option>
          <option value="iphone15">iPhone 15 Pro</option>
          <option value="iphone20">iPhone 20 Ultra</option>
          <option value="iphone100">iPhone 100 Quantum</option>
          <option value="iphone1000">iPhone 1000 Neural</option>
          <option value="iphoneUltimate">iPhone 2849281498</option>
          <option value="click2">Click 2</option>
          <option value="toystory600">Toy Story 600</option>
          <option value="superpeach">Super Peach Sis</option>
          <option value="gta7">GTA VII</option>
          <option value="minceraft">Mincecraft</option>
          <option value="soda">Soda</option>
          <option value="taco">Taco</option>
          <option value="combo">Combo (Soda+Taco)</option>
          <option value="combo_plus">Premium Combo (Soda+Taco+Coins)</option>
          <option value="dark_matter">Dark Matter</option>
          <option value="nintendo_switch">Nintendo Switch</option>
          <option value="playstation5">PlayStation 5</option>
          <option value="xbox_series_x">Xbox Series X</option>
          <option value="wega_station">Wega Station 9000</option>
          <option value="steam_deck">Steam Deck</option>
        </select>
        <button id="give-item-btn" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Give</button>
      </label>
    `;
    document.getElementById('game-container').appendChild(adminPanel);

    // Make admin panel draggable
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    adminPanel.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragOffsetX = e.clientX - adminPanel.offsetLeft;
      dragOffsetY = e.clientY - adminPanel.offsetTop;
      adminPanel.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      adminPanel.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      adminPanel.style.left = (e.clientX - dragOffsetX) + 'px';
      adminPanel.style.top = (e.clientY - dragOffsetY) + 'px';
    });

    // Event listeners for admin panel actions
    document.getElementById('set-coins-btn').addEventListener('click', () => {
      const amount = parseInt(document.getElementById('coin-amount').value);
      if (!isNaN(amount)) {
        if (window.shop) {
          window.shop.coins = amount;
          window.shop.updateCoinCounter();
          showNotification(`Set your coins to ${amount}!`);
        }
      }
    });

    document.getElementById('make-puppie-hostile').addEventListener('click', () => {
      const targetPlayer = document.getElementById('target-player-puppie').value;
      if (targetPlayer) {
        triggerPuppieAttack(targetPlayer);
        showNotification(`Making Puppie hostile towards ${targetPlayer}!`);
      } else {
         showNotification(`Please enter a player name to target.`);
      }
    });

    document.getElementById('give-item-btn').addEventListener('click', () => {
      const selectedItem = document.getElementById('item-select').value;
      if (selectedItem) {
        if (window.shop) {
          if (!window.shop.inventory) {
              window.shop.inventory = {};
          }
          if (window.shop.inventory[selectedItem] === undefined){
              window.shop.inventory[selectedItem] = 0
          }
          window.shop.inventory[selectedItem]++;
          window.shop.updateInventoryPanel();
          showNotification(`Gave item to yourself!`);
        }
      }
    });

  // Clear the previous panel (if it exists)
  function clearPanel(targetPanel) {
    targetPanel.innerHTML = '';
  }

  // Helper function to show notifications
  function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    notification.style.color = 'black';
    notification.style.padding = '20px';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '9999';
    notification.style.fontSize = '24px';
    
    document.body.appendChild(notification);
    
    // Remove after specified duration
    setTimeout(() => {
      document.body.removeChild(notification);
    }, duration);
  }

  // Chat event listeners
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && chatInputContainer.style.display !== 'block') {
      e.preventDefault();
      openChatInput();
    } else if (e.key === 'Escape' && chatInputContainer.style.display === 'block') {
      closeChatInput();
    } else if (e.key === 'Enter' && chatInputContainer.style.display === 'block') {
      sendChatMessage();
    } else if (e.key === 'i' || e.key === 'I') {
      // Toggle inventory with I key
      if (window.shop) {
        window.shop.toggleInventory();
      }
    }
  });

  closeChat.addEventListener('click', () => {
    closeChatInput();
  });

  chatButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (chatInputContainer.style.display === 'block') {
      closeChatInput();
    } else {
      openChatInput();
    }
  });

  function openChatInput() {
    chatInputContainer.style.display = 'block';
    chatInput.focus();

    // Disable player controls while chatting
    if (playerControls) {
      playerControls.enabled = false;
    }
  }

  function closeChatInput() {
    chatInputContainer.style.display = 'none';
    chatInput.value = '';

    // Re-enable player controls
    if (playerControls) {
      playerControls.enabled = true;
    }
  }

  function sendChatMessage() {
    const message = chatInput.value.trim();
    if (message) {
      // Check if message contains "no" and trigger angry puppet
      if (message.toLowerCase().includes("no")) {
        sockPuppet.becomeAngry();
      }

      // Function to grant tons of coins 
      const grantCoinsCommand = '!givecoins';
      if (message.startsWith(grantCoinsCommand)) {
          const amount = parseInt(message.substring(grantCoinsCommand.length).trim());
          if (!isNaN(amount)) {
            if (window.shop) {
              window.shop.coins += amount;
              window.shop.updateCoinCounter();
              showNotification(`Gave ${amount} coins to yourself!`);
            }
          }
      }

      // Check if message is directed at Speed
      if (showSpeedNPC && (message.toLowerCase().includes("speed") || 
                           message.toLowerCase().includes("help"))) {
        showSpeedNPC.respondToChat(message);
      }

      // Check if message is "Get her!" to trigger throwing the angry woman
      if (message.toLowerCase().includes("get her")) {
        angryWoman.startThrowing();
      }

      // Check if message is to steal Elon's money
      if (message.toLowerCase().includes("*steals all money*")) {
        elonMusk.triggerRobbery();
      }

      // Check if message is directed at the creepy double face man
      if (message.toLowerCase().includes("i hate you")) {
        doubleFaceMan.respondToChat(message);
      }

      // Check if message makes Peter Griffin angry
      if (message.toLowerCase().includes("i hate peter")) {
        peterGriffin.respondToChat(message);
      }

      // Check if the player hates everyone
      if (message.toLowerCase() === "i hate everyone!") {
        triggerAllNPCsAttack();
      }

      if (message.toLowerCase() === "bababa bububub blebleble") {
          angryAtUser();
      }

      // Trigger Hubert's reaction if the special phrase is said (only applicable on the Moon)
      if (window.hubertNPC && message.toLowerCase().includes("your mansion is bigger than elons")) {
        window.hubertNPC.triggerElonFight();
      }

      // Send chat message to all players
      room.updatePresence({
        chat: {
          message: message,
          timestamp: Date.now()
        }
      });

      // Show message for local player too
      chatMessages[room.clientId].textContent = message;
      chatMessages[room.clientId].style.display = 'block';

      // Hide message after 5 seconds
      setTimeout(() => {
        if (chatMessages[room.clientId]) {
          chatMessages[room.clientId].style.display = 'none';
        }
      }, 5000);

      // Clear and close input
      chatInput.value = '';
      closeChatInput();
    }
  }

  chatInput.addEventListener('keydown', (e) => {
    e.stopPropagation(); 
    if (e.key === 'Enter') {
      sendChatMessage();
    } else if (e.key === 'Escape') {
      closeChatInput();
    }
  });

  // Subscribe to presence updates - handle player joining/leaving and position updates
  room.subscribePresence((presence) => {
    for (const clientId in presence) {
      if (clientId === room.clientId) continue; 

      const playerData = presence[clientId];
      if (!playerData) continue;

      // Create new player if needed
      if (!otherPlayers[clientId] && playerData.x !== undefined && playerData.z !== undefined) {
        const peerInfo = room.peers[clientId] || {};
        const peerName = peerInfo.username || `Player${clientId.substring(0, 4)}`;

        const playerModel = createPlayerModel(THREE, peerName);
        playerModel.position.set(playerData.x, playerData.y || 0.5, playerData.z);
        if (playerData.rotation !== undefined) {
          playerModel.rotation.y = playerData.rotation;
        }
        scene.add(playerModel);
        otherPlayers[clientId] = playerModel;

        // Create name label
        playerLabels[clientId] = createPlayerLabel(clientId, peerName);

        // Create chat message element
        chatMessages[clientId] = createChatMessage(clientId);
      }

      // Update existing player
      else if (otherPlayers[clientId] && playerData.x !== undefined && playerData.z !== undefined) {
        otherPlayers[clientId].position.set(playerData.x, playerData.y || 0, playerData.z);
        if (playerData.rotation !== undefined) {
          otherPlayers[clientId].rotation.y = playerData.rotation;
        }

        // Animate legs if moving
        if (playerData.moving) {
          const leftLeg = otherPlayers[clientId].getObjectByName("leftLeg");
          const rightLeg = otherPlayers[clientId].getObjectByName("rightLeg");

          if (leftLeg && rightLeg) {
            const walkSpeed = 5;
            const walkAmplitude = 0.3;
            const animationPhase = performance.now() * 0.01 * walkSpeed; 
            leftLeg.rotation.x = Math.sin(animationPhase) * walkAmplitude;
            rightLeg.rotation.x = Math.sin(animationPhase + Math.PI) * walkAmplitude;
          }
        } else {
          // Reset legs when standing still
          const leftLeg = otherPlayers[clientId].getObjectByName("leftLeg");
          const rightLeg = otherPlayers[clientId].getObjectByName("rightLeg");

          if (leftLeg && rightLeg) {
            leftLeg.rotation.x = 0;
            rightLeg.rotation.x = 0;
          }
        }

        // Update chat message if present
        if (playerData.chat && playerData.chat.message) {
          chatMessages[clientId].textContent = playerData.chat.message;
          chatMessages[clientId].style.display = 'block';

          // Hide message after 5 seconds
          setTimeout(() => {
            if (chatMessages[clientId]) {
              chatMessages[clientId].style.display = 'none';
            }
          }, 5000);
        }
      }
    }

    // Remove disconnected players
    for (const clientId in otherPlayers) {
      if (!presence[clientId]) {
        scene.remove(otherPlayers[clientId]);
        delete otherPlayers[clientId];

        if (playerLabels[clientId]) {
          document.getElementById('game-container').removeChild(playerLabels[clientId]);
          delete playerLabels[clientId];
        }

        if (chatMessages[clientId]) {
          document.getElementById('game-container').removeChild(chatMessages[clientId]);
          delete chatMessages[clientId];
        }
      }
    }
  });

  // Create a chat message element for local player
  chatMessages[room.clientId] = createChatMessage(room.clientId);

  // Function to make all NPCs attack the player
  function triggerAllNPCsAttack(targetPlayer = null) {
    window.isPlayerHated = true;

    // Show notification
    const notification = document.createElement('div');
    notification.textContent = `All NPCs are now hunting ${targetPlayer}! Find a place to hide!`;
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    notification.style.color = 'white';
    notification.style.padding = '20px';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '9999';
    notification.style.fontSize = '24px';
    notification.style.fontWeight = 'bold';

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);

    // Make all NPCs attack
    if (sockPuppet) sockPuppet.becomeAngry();
    if (elonMusk) elonMusk.triggerRobbery();
    if (doubleFaceMan) doubleFaceMan.triggerAnger();
    if (school) school.makeNPCsHostile();

    // Broadcast event to all players
    room.send({
      type: "npc_event",
      event: "all_npcs_attack",
      initiator: playerName,
      targetPlayer: targetPlayer,
    });
  }

  function triggerPuppieAttack(targetPlayer = null) {
    if (sockPuppet) sockPuppet.becomeAngry();

    // Show notification
    const notification = document.createElement('div');
    notification.textContent = `Puppie is now hunting ${targetPlayer}! Find a place to hide!`;
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    notification.style.color = 'white';
    notification.style.padding = '20px';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '9999';
    notification.style.fontSize = '24px';
    notification.style.fontWeight = 'bold';

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  }

  function triggerElonAttack(targetPlayer = null) {
    if (elonMusk) elonMusk.triggerRobbery();

    // Show notification
    const notification = document.createElement('div');
    notification.textContent = `Elon is now hunting ${targetPlayer}! Find a place to hide!`;
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    notification.style.color = 'white';
    notification.style.padding = '20px';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '9999';
    notification.style.fontSize = '24px';
    notification.style.fontWeight = 'bold';

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  }

  // Handle incoming messages (for NPC events)
  room.onmessage = (event) => {
    const data = event.data;

    // Handle NPC events
    if (data.type === "npc_event") {
      switch(data.event) {
        case "all_npcs_attack":
          if (data.clientId !== room.clientId) { 
            window.isPlayerHated = true;
            // Make all NPCs attack
            if (sockPuppet) sockPuppet.becomeAngry();
            if (elonMusk) elonMusk.triggerRobbery();
            if (doubleFaceMan) doubleFaceMan.triggerAnger();
            if (school) school.makeNPCsHostile();

            // Show notification about who triggered it
            const notification = document.createElement('div');
            notification.textContent = `${data.initiator} has enraged all NPCs against ${data.targetPlayer}!`;
            notification.style.position = 'fixed';
            notification.style.top = '50%';
            notification.style.left = '50%';
            notification.style.transform = 'translate(-50%, -50%)';
            notification.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            notification.style.color = 'white';
            notification.style.padding = '20px';
            notification.style.borderRadius = '10px';
            notification.style.zIndex = '9999';
            notification.style.fontSize = '24px';
            document.body.appendChild(notification);

            setTimeout(() => {
              document.body.removeChild(notification);
            }, 5000);
          }
          break;

        case "puppet_angry":
          if (data.clientId !== room.clientId && sockPuppet) {
            sockPuppet.becomeAngry();

            // Show notification
            const notification = document.createElement('div');
            notification.textContent = `${data.initiator} has made Puppie angry!`;
            notification.style.position = 'fixed';
            notification.style.top = '100px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'rgba(255, 105, 180, 0.7)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '9999';
            document.body.appendChild(notification);

            setTimeout(() => {
              document.body.removeChild(notification);
            }, 3000);
          }
          break;

        case "elon_robbery":
          if (data.clientId !== room.clientId && elonMusk) {
            elonMusk.triggerRobbery();

            // Show notification
            const notification = document.createElement('div');
            notification.textContent = `${data.initiator} is stealing from Elon!`;
            notification.style.position = 'fixed';
            notification.style.top = '100px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'rgba(0, 162, 232, 0.8)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '9999';
            document.body.appendChild(notification);

            setTimeout(() => {
              document.body.removeChild(notification);
            }, 3000);
          }
          break;

        case "double_face_angry":
          if (data.clientId !== room.clientId && doubleFaceMan) {
            doubleFaceMan.triggerAnger();

            // Show notification
            const notification = document.createElement('div');
            notification.textContent = `${data.initiator} has enraged Double Face Man!`;
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
          }
          break;

        case "peter_angry":
          if (data.clientId !== room.clientId && peterGriffin) {
            peterGriffin.getAngry();

            // Show notification
            const notification = document.createElement('div');
            notification.textContent = `${data.initiator} has made Peter Griffin angry!`;
            notification.style.position = 'fixed';
            notification.style.top = '100px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'rgba(255, 165, 0, 0.8)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '9999';
            document.body.appendChild(notification);

            setTimeout(() => {
              document.body.removeChild(notification);
            }, 3000);
          }
          break;

        case "wega_attack":
          if (data.clientId !== room.clientId && walmart) {
            walmart.activateWega();

            // Show notification
            const notification = document.createElement('div');
            notification.textContent = `${data.initiator} tried to steal from Wega!`;
            notification.style.position = 'fixed';
            notification.style.top = '100px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'rgba(128, 0, 128, 0.8)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '9999';
            document.body.appendChild(notification);

            setTimeout(() => {
              document.body.removeChild(notification);
            }, 3000);
          }
          break;
        case "kendrick_protest":
          if (data.clientId !== room.clientId && kendrickLamar) {
            // Mark protest as started and completed for other players
            kendrickLamar.protestStarted = true;
            kendrickLamar.missionCompleted = true;

            // Make Kendrick crouch down
            kendrickLamar.model.position.y = 1;

            // Change Kendrick's chat message
            if (kendrickLamar.chatMessage) {
              kendrickLamar.chatMessage.textContent = "WHY ARE YOU ALL DOING THIS TO ME?!";
              kendrickLamar.chatMessage.style.display = 'block';
              kendrickLamar.chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            }

            // Show notification
            const notification = document.createElement('div');
            notification.textContent = `${data.initiator} started a protest against Kendrick Lamar!`;
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
          }
          break;
        case "screaming_woman_calmed":
          if (data.clientId !== room.clientId && screamingWoman) {
            // Mark the screaming woman as calmed
            screamingWoman.calmed = true;

            // Update her appearance
            screamingWoman.model.position.y = 0.5;
            screamingWoman.velocity.y = 0;
            screamingWoman.isJumping = false;
            screamingWoman.onTree = false;

            // Display her thank you message
            if (screamingWoman.screamMessage) {
              screamingWoman.screamMessage.textContent = "OMG THANK YOU! This is exactly what I needed!";
              screamingWoman.screamMessage.style.display = 'block';
              screamingWoman.screamMessage.style.backgroundColor = 'rgba(255, 192, 203, 0.8)';
              screamingWoman.screamMessage.style.color = 'black';
            }

            // Show notification
            const notification = document.createElement('div');
            notification.textContent = `${data.initiator} calmed the screaming woman with a Samsung Galaxy S24 Ultra!`;
            notification.style.position = 'fixed';
            notification.style.top = '100px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'rgba(255, 192, 203, 0.8)';
            notification.style.color = 'black';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '9999';
            document.body.appendChild(notification);

            setTimeout(() => {
              document.body.removeChild(notification);
            }, 3000);
          }
          break;
      }
    }
  };

  // Create the blue circle
  const blueCircleGeometry = new THREE.CircleGeometry(10, 32);
  const blueCircleMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF });
  const blueCircle = new THREE.Mesh(blueCircleGeometry, blueCircleMaterial);
  blueCircle.rotation.x = -Math.PI / 2;
  blueCircle.position.set(30, 0.1, 30); 
  blueCircle.userData.isTeleportCircle = true;
  scene.add(blueCircle);

  // Create new var for the change effect
  let babbledTheAll = false;

  //Function to trigger a state in which all NPCs say the sentence “IT SEEMS TODAY THAT ALL YOU SEE IS HAHAHA!” and become dumber
  function triggerBabble() {
    babbledTheAll = true;

    //Make the circle dissapear to stop it from being triggered more than once
    blueCircle.geometry.dispose();
    blueCircle.material.dispose();
    scene.remove(blueCircle);
    renderer.renderLists.dispose();

      // Set timer to all say
      [sockPuppet, showSpeedNPC, screamingWoman, angryWoman, elonMusk, doubleFaceMan, paperMan, peterGriffin, mePhone4, kendrickLamar, nineVolts].forEach(npc => {
        if (npc && npc.chatMessage) {
            npc.chatMessage.style.display = "block";
            npc.chatMessage.textContent = "IT SEEMS TODAY THAT ALL YOU SEE ITS HAHHSAH";
            setTimeout(() => {
                npc.chatMessage.style.display = "none";
            }, 2000);
        }
    });

      // Set timer to load the level back
      setTimeout(() => {
        // Remove chat and replace it with new dumb sounds

        scene.remove(ground, gridHelper, easterEggBlock,);

        // Loop through all the NPCs and bring them back
        scene.children.forEach(sceneObject => {

            if (sceneObject.type == "AmbientLight" || sceneObject.type == "DirectionalLight") {

            } else {
              if (sceneObject.visible !== false) {
                console.log(sceneObject);
                scene.remove(sceneObject);
              }
            }
        });

      [sockPuppet, showSpeedNPC, screamingWoman, angryWoman, elonMusk, doubleFaceMan, paperMan, peterGriffin, mePhone4, kendrickLamar, nineVolts].forEach(npc => {
        // Loop through all the NPCs and bring them back

        if(npc.chatMessage) {
          const textArray = ["bababa", "bububu", "blebleble"];
          setInterval(() => {
              npc.phrases = textArray;
              let randNumb = Math.floor(Math.random()*npc.phrases.length);
              npc.chatMessage.textContent = npc.phrases[randNumb];
              npc.chatMessage.style.display = "block";
              npc.chatMessage.style.fontSize = '50px';
              setTimeout(() => {
                  npc.chatMessage.style.display = "none";
              }, 1000);
          }, 1000);
        }
      });

      setTimeout(() => {
        triggerExplotions(scene, renderer);
      }, 10000);
    }, 5000);
  }

  function triggerExplotions (scene, renderer) {
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
      '<p style="font-size:24px; margin-bottom:20px;">Bababa bububu Blebleble!</p>' +
      '<button id="restart-game-button" style="padding:10px 20px; font-size:24px; cursor:pointer;">Restart Game</button>';
    
    document.body.appendChild(overlay);
    
    // Find the button and add the event listener to reload the page
    const restartButton = document.getElementById('restart-game-button');
    if (restartButton) {
      restartButton.addEventListener('click', () => {
        window.location.reload(); 
      });
    }

    // Stop player controls if they exist
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }

  }

  // Animation loop
  let lastTime = performance.now();
  function animate() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    requestAnimationFrame(animate);
    playerControls.update();

    // Update the ground (disco floor) color dynamically to create a disco effect
    ground.material.color.setHSL((performance.now() * 0.0005) % 1, 0.8, 0.5);

    //Teleport to area
    if (blueCircle && playerModel) {
      const distanceToCircle = playerModel.position.distanceTo(blueCircle.position);
      if (distanceToCircle < 2 && !babbledTheAll) {
        triggerBabble();
      }
    }

    // Update Standard NPCs
    sockPuppet.update(camera, renderer, deltaTime);
    showSpeedNPC.update(camera, renderer, deltaTime);
    screamingWoman.update(camera, renderer, deltaTime);
    angryWoman.update(camera, renderer, deltaTime);
    elonMusk.update(camera, renderer, deltaTime);
    doubleFaceMan.update(camera, renderer, deltaTime);
    gun.update(camera, renderer, deltaTime);

    // Update shop, school, dealer, walmart and paper man
    shop.update(camera, renderer, deltaTime);
    school.update(camera, renderer, deltaTime);
    dealer.update(camera, renderer, deltaTime);
    walmart.update(camera, renderer, deltaTime);
    paperMan.update(camera, renderer, deltaTime);
    peterGriffin.update(camera, renderer, deltaTime);
    mePhone4.update(camera, renderer, deltaTime); 
    kendrickLamar.update(camera, renderer, deltaTime);

    // NEW: update Nine-Volts NPC
    if (window.nineVolts) {
      nineVolts.update(camera, renderer, deltaTime);
    }

    // Update Hubert if he exists (created on moon)
    if (window.hubertNPC) {
      window.hubertNPC.update(camera, renderer, deltaTime);
    }

    // Update quest system
    questSystem.update(deltaTime);

    // Update police station
    policeStation.update(camera, renderer, deltaTime);

    // Update Mario Pipe
    if (window.marioPipe) {
      window.marioPipe.update(deltaTime);
    }

     // Update Custom NPCs
    customNPCs.forEach(npc => npc.update(camera, renderer, deltaTime));

    // Check for easter egg collision
    if (easterEggBlock && playerModel) {
      const distanceToBlock = playerModel.position.distanceTo(easterEggBlock.position);
      if (distanceToBlock < 2) {
        teleportToEasterEggRoom();
      }
    }

    // Update name labels and chat messages for all players
    for (const clientId in otherPlayers) {
      if (playerLabels[clientId] && otherPlayers[clientId]) {
        const screenPosition = getScreenPosition(otherPlayers[clientId].position, camera, renderer);
        if (screenPosition) {
          playerLabels[clientId].style.left = `${screenPosition.x}px`;
          playerLabels[clientId].style.top = `${screenPosition.y - 20}px`;
          playerLabels[clientId].style.display = screenPosition.visible ? 'block' : 'none';

          // Position chat message above name label
          if (chatMessages[clientId]) {
            chatMessages[clientId].style.left = `${screenPosition.x}px`;
            chatMessages[clientId].style.top = `${screenPosition.y - 45}px`;
            // Only show if visible and has content
            if (chatMessages[clientId].textContent && screenPosition.visible) {
              chatMessages[clientId].style.display = 'block';
            }
          }
        } else {
          playerLabels[clientId].style.display = 'none';
          if (chatMessages[clientId]) {
            chatMessages[clientId].style.display = 'none';
          }
        }
      }
    }

    // Update local player's chat message position
    if (chatMessages[room.clientId] && playerModel) {
      const screenPosition = getScreenPosition(playerModel.position, camera, renderer);
      if (screenPosition && chatMessages[room.clientId].textContent) {
        chatMessages[room.clientId].style.left = `${screenPosition.x}px`;
        chatMessages[room.clientId].style.top = `${screenPosition.y - 45}px`;
        chatMessages[room.clientId].style.display = screenPosition.visible ? 'block' : 'none';
      } else {
        chatMessages[room.clientId].style.display = 'none';
      }
    }

    renderer.render(scene, camera);
  }

  // Teleport Function
  function teleportToEasterEggRoom() {
    // Teleport to a new location
    playerModel.position.set(0, 10, 0);

    // Change the background
    scene.background = new THREE.Color(0x000000);

    // Remove the existing objects
    scene.remove(ground, gridHelper, easterEggBlock);

    // Loop through all the NPCs and make them say the phrases
    [sockPuppet, showSpeedNPC, screamingWoman, angryWoman, elonMusk, doubleFaceMan, paperMan, peterGriffin, mePhone4, kendrickLamar, nineVolts].forEach(npc => {
        if (npc && npc.chatMessage) {
            npc.chatMessage.style.display = "block";
            npc.chatMessage.textContent = "Happy 230th edit! THE GAME IS IN THE FRONTPAGE NOW! LETS ALL CELEBRATE!";
            setTimeout(() => {
                npc.chatMessage.style.display = "none";
            }, 5000); 
        }
    });

    // Set timer to load the level back
    setTimeout(() => {

        // Load the level back
        scene.background = new THREE.Color(0x87CEEB);
        scene.add(ground, gridHelper, easterEggBlock)

        // Loop through all the NPCs and bring them back
        scene.children.forEach(sceneObject => {

            if (sceneObject.type == "AmbientLight" || sceneObject.type == "DirectionalLight") {

            } else {
              scene.remove(sceneObject);
            }
            console.log(sceneObject);
        });

        [sockPuppet, showSpeedNPC, screamingWoman, angryWoman, elonMusk, doubleFaceMan, paperMan, peterGriffin, mePhone4, kendrickLamar, nineVolts].forEach(npc => {
            scene.add(npc.model);
        });

        createBarriers(scene);
        createTrees(scene);
        createClouds(scene);

          
    }, 5000);
  }

  function angryAtUser() {
    // Set timer to all say
    [sockPuppet, showSpeedNPC, screamingWoman, angryWoman, elonMusk, doubleFaceMan, paperMan, peterGriffin, mePhone4, kendrickLamar, nineVolts].forEach(npc => {
      if (npc && npc.chatMessage) {
          npc.chatMessage.style.display = "block";
          npc.chatMessage.textContent = "WE DONT WANT YOU";
          setTimeout(() => {
              npc.chatMessage.style.display = "none";
          }, 2000);
      }
    });
  }

  // Helper function to convert 3D position to screen coordinates
  function getScreenPosition(position, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = renderer.domElement.width / 2;
    const heightHalf = renderer.domElement.height / 2;

    // Get the position adjusted to account for player height
    vector.copy(position);
    vector.y += 1.5; 

    // Project to screen space
    vector.project(camera);

    // Calculate whether object is in front of the camera
    const isInFront = vector.z < 1;

    // Convert to screen coordinates
    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf,
      visible: isInFront
    };
  }

  animate();
}

main();