import * as THREE from 'three';

export class QuestSystem {
  constructor(scene, playerModel, shop) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.shop = shop;
    this.availableQuests = [];
    this.activeQuests = [];
    this.completedQuests = [];
    this.questGivers = [];
    this.questMarkers = [];
    this.questUIContainer = null;
    this.questLogButton = null;
    
    this.initQuestSystem();
    this.createQuestUI();
  }
  
  initQuestSystem() {
    // Initialize with some quests
    this.availableQuests = [
      {
        id: 'uranium_collection',
        title: 'Nuclear Materials',
        description: 'Collect 5 pieces of uranium for Paper Man',
        giver: 'Paper Man',
        type: 'collection',
        target: 'uranium',
        required: 5,
        collected: 0,
        reward: 150,
        completed: false,
        location: new THREE.Vector3(80, 0, -80) // Paper Man's location
      },
      {
        id: 'scared_woman',
        title: 'Calm the Screamer',
        description: 'Find a way to calm the screaming woman. Maybe a new phone?',
        giver: 'Player',
        type: 'interaction',
        target: 'screamingWoman',
        itemRequired: 'samsung_s23_ultra',
        completed: false,
        reward: 100,
        location: new THREE.Vector3(15, 0, 15) // Screaming Woman's location
      },
      {
        id: 'elon_coins',
        title: 'Mansion Heist',
        description: 'Collect 10 coins from around Elon\'s mansion without getting caught by his puppies.',
        giver: 'Player',
        type: 'collection',
        target: 'mansion_coins',
        required: 10,
        collected: 0,
        reward: 200,
        completed: false,
        location: new THREE.Vector3(60, 0, 60) // Elon's location
      },
      {
        id: 'puppet_friend',
        title: 'Friends with Puppie',
        description: 'Be nice to Puppie for 1 minute without saying "no". Try not to hold a gun either.',
        giver: 'Player',
        type: 'interaction',
        target: 'sockPuppet',
        duration: 60000, 
        timeSpent: 0,
        reward: 80,
        completed: false,
        location: new THREE.Vector3(10, 0, 10) // Sock Puppet's location
      },
      {
        id: 'kendrick_uranium',
        title: "Bye bye little rapper",
        description: "Get a uranium rock from Paper Man and throw it at Kendrick.",
        giver: 'Player',
        type: 'interaction',
        target: 'kendrick',
        itemRequired: 'uranium_rock',
        required: 1,
        collected: 0,
        reward: 900,
        location: new THREE.Vector3(90, 0, 60) // Kendrick's location
      },
      {
        id: 'baby_fronk_rescue',
        title: 'Rescue Baby Fronk',
        description: "9-Volts lost his Baby Fronk! He thinks Elon took it. Check Elon's mansion.",
        giver: '9-Volts',
        type: 'delivery',
        itemToFind: 'baby_fronk',
        found: false,
        delivered: false,
        reward: 250, 
        completed: false,
        location: new THREE.Vector3(-20, 0, 20) // 9-Volts' house location
      },
      {
        id: 'dealer_bust',
        title: 'Bust the Dealer',
        description: 'Report the shady game dealer in the cave to the authorities.',
        giver: 'Player',
        type: 'interaction',
        target: 'dealer',
        action: 'call_police',
        reward: 100000, 
        completed: false,
        location: new THREE.Vector3(-100, 0, -100) // Dealer's cave location
      },
      {
        id: 'wega_challenge',
        title: 'The Wega Challenge',
        description: 'Steal the Wega Station 9000 from Walmart. Wega WILL notice.',
        giver: 'Player',
        type: 'interaction',
        target: 'walmart',
        action: 'steal_wega_console',
        reward: 500, 
        completed: false,
        location: new THREE.Vector3(-40, 0, 40) // Walmart location
      },
      {
        id: 'speed_siu',
        title: 'Speed\'s Signature',
        description: 'Get IShowSpeed to do his signature "SIIUUUUUU!" move. Try asking him nicely.',
        giver: 'Player',
        type: 'interaction',
        target: 'ishowSpeed',
        action: 'request_siu',
        reward: 50,
        completed: false,
        location: new THREE.Vector3(-10, 0, -10) // Speed's general area
      },
      {
        id: 'peter_joke',
        title: 'Peter\'s Punchline',
        description: 'Peter Griffin looks bored. Tell him a joke that makes him laugh.',
        giver: 'Player',
        type: 'interaction',
        target: 'peterGriffin',
        action: 'tell_joke', 
        reward: 75,
        completed: false,
        location: new THREE.Vector3(5, 0, 5) // Peter's location
      }
    ];
    
    // Create quest markers in the world
    this.createQuestMarkers();
  }
  
  createQuestMarkers() {
    // Clear existing markers
    this.questMarkers.forEach(marker => {
      this.scene.remove(marker);
    });
    this.questMarkers = [];
    
    // Create new markers for available quests
    this.availableQuests.forEach(quest => {
      if (!this.activeQuests.includes(quest) && !this.completedQuests.includes(quest)) {
        const marker = this.createQuestMarker(quest.location);
        this.questMarkers.push(marker);
        this.scene.add(marker);
      }
    });
  }
  
  createQuestMarker(position) {
    // Create a floating exclamation mark
    const markerGroup = new THREE.Group();
    
    // Create exclamation mark geometry
    const markGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
    const markMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
    const mark = new THREE.Mesh(markGeometry, markMaterial);
    mark.position.y = 3;
    markerGroup.add(mark);
    
    // Add dot
    const dotGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const dot = new THREE.Mesh(dotGeometry, markMaterial);
    dot.position.y = 1.5;
    markerGroup.add(dot);
    
    // Position the marker
    markerGroup.position.copy(position);
    markerGroup.position.y = 0;
    
    // Add user data for collision detection
    markerGroup.userData.isQuestMarker = true;
    
    return markerGroup;
  }
  
  createQuestUI() {
    // Create quest log button
    this.questLogButton = document.createElement('div');
    this.questLogButton.style.position = 'fixed';
    this.questLogButton.style.top = '20px';
    this.questLogButton.style.left = '120px';
    this.questLogButton.style.padding = '10px 15px';
    this.questLogButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.questLogButton.style.color = '#FFD700';
    this.questLogButton.style.borderRadius = '5px';
    this.questLogButton.style.cursor = 'pointer';
    this.questLogButton.style.zIndex = '1000';
    this.questLogButton.innerHTML = '📋 Quests';
    
    this.questLogButton.addEventListener('click', () => {
      this.toggleQuestLog();
    });
    
    document.body.appendChild(this.questLogButton);
    
    // Create quest log container (hidden by default)
    this.questUIContainer = document.createElement('div');
    this.questUIContainer.style.position = 'fixed';
    this.questUIContainer.style.top = '60px';
    this.questUIContainer.style.left = '20px';
    this.questUIContainer.style.width = '300px';
    this.questUIContainer.style.maxHeight = '400px';
    this.questUIContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.questUIContainer.style.color = 'white';
    this.questUIContainer.style.padding = '15px';
    this.questUIContainer.style.borderRadius = '5px';
    this.questUIContainer.style.zIndex = '999';
    this.questUIContainer.style.overflowY = 'auto';
    this.questUIContainer.style.display = 'none';
    
    document.body.appendChild(this.questUIContainer);
    
    // Initially update quest log
    this.updateQuestLog();
  }
  
  toggleQuestLog() {
    const isVisible = this.questUIContainer.style.display === 'block';
    this.questUIContainer.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
      this.updateQuestLog();
    }
  }
  
  updateQuestLog() {
    if (!this.questUIContainer) return;
    
    this.questUIContainer.innerHTML = '<h3 style="color: #FFD700; margin-top: 0;">Quest Log</h3>';
    
    // Active quests section
    if (this.activeQuests.length > 0) {
      const activeSection = document.createElement('div');
      activeSection.innerHTML = '<h4 style="color: #FFD700; margin-bottom: 5px;">Active Quests:</h4>';
      
      this.activeQuests.forEach(quest => {
        const questItem = document.createElement('div');
        questItem.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        questItem.style.padding = '10px';
        questItem.style.marginBottom = '10px';
        questItem.style.borderRadius = '3px';
        
        let progressText = '';
        if (quest.type === 'collection') {
          progressText = `(${quest.collected}/${quest.required})`;
        } else if (quest.type === 'interaction' && quest.duration) {
          const secondsLeft = Math.max(0, Math.floor((quest.duration - quest.timeSpent) / 1000));
          progressText = `(${secondsLeft}s remaining)`;
        }
        
        questItem.innerHTML = `
          <div style="display: flex; justify-content: space-between;">
            <strong style="color: #FFD700;">${quest.title}</strong>
            <span style="color: #FFD700;">${progressText}</span>
          </div>
          <div style="margin-top: 5px;">${quest.description}</div>
          <div style="margin-top: 5px; color: gold;">Reward: ${quest.reward} coins</div>
          <div style="margin-top: 5px; font-size: 12px; color: #aaa;">Given by: ${quest.giver}</div>
        `;
        
        // Add abandon button
        const abandonButton = document.createElement('button');
        abandonButton.textContent = 'Abandon Quest';
        abandonButton.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
        abandonButton.style.color = 'white';
        abandonButton.style.border = 'none';
        abandonButton.style.borderRadius = '3px';
        abandonButton.style.padding = '5px 10px';
        abandonButton.style.marginTop = '5px';
        abandonButton.style.cursor = 'pointer';
        
        abandonButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.abandonQuest(quest);
        });
        
        questItem.appendChild(abandonButton);
        activeSection.appendChild(questItem);
      });
      
      this.questUIContainer.appendChild(activeSection);
    }
    
    // Available quests section
    const availableQuests = this.availableQuests.filter(q => 
      !this.activeQuests.includes(q) && !this.completedQuests.includes(q));
    
    if (availableQuests.length > 0) {
      const availableSection = document.createElement('div');
      availableSection.innerHTML = '<h4 style="color: #AAA; margin-top: 15px; margin-bottom: 5px;">Available Quests:</h4>';
      
      availableQuests.forEach(quest => {
        const questItem = document.createElement('div');
        questItem.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        questItem.style.padding = '10px';
        questItem.style.marginBottom = '10px';
        questItem.style.borderRadius = '3px';
        questItem.style.cursor = 'pointer';
        
        questItem.innerHTML = `
          <strong>${quest.title}</strong>
          <div style="margin-top: 5px; color: #AAA;">${quest.description}</div>
          <div style="margin-top: 5px; color: gold;">Reward: ${quest.reward} coins</div>
          <div style="margin-top: 5px; font-size: 12px; color: #aaa;">Given by: ${quest.giver}</div>
        `;
        
        questItem.addEventListener('click', () => {
          this.acceptQuest(quest);
        });
        
        availableSection.appendChild(questItem);
      });
      
      this.questUIContainer.appendChild(availableSection);
    }
    
    // Completed quests section
    if (this.completedQuests.length > 0) {
      const completedSection = document.createElement('div');
      completedSection.innerHTML = '<h4 style="color: #00AA00; margin-top: 15px; margin-bottom: 5px;">Completed Quests:</h4>';
      
      this.completedQuests.forEach(quest => {
        const questItem = document.createElement('div');
        questItem.style.backgroundColor = 'rgba(0, 170, 0, 0.1)';
        questItem.style.padding = '10px';
        questItem.style.marginBottom = '10px';
        questItem.style.borderRadius = '3px';
        
        questItem.innerHTML = `
          <strong style="color: #00AA00;">${quest.title} ✓</strong>
          <div style="margin-top: 5px; color: #AAA;">${quest.description}</div>
          <div style="margin-top: 5px; color: gold;">Reward: ${quest.reward} coins</div>
        `;
        
        completedSection.appendChild(questItem);
      });
      
      this.questUIContainer.appendChild(completedSection);
    }
    
    // Empty state
    if (this.activeQuests.length === 0 && availableQuests.length === 0 && this.completedQuests.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.style.color = '#AAA';
      emptyState.style.textAlign = 'center';
      emptyState.style.padding = '20px 0';
      emptyState.textContent = 'No quests available';
      this.questUIContainer.appendChild(emptyState);
    }
  }
  
  acceptQuest(quest) {
    if (!this.activeQuests.includes(quest) && !this.completedQuests.includes(quest)) {
      this.activeQuests.push(quest);
      
      // Show notification
      this.showNotification(`Quest Accepted: ${quest.title}`, 3000);
      
      // Update quest log
      this.updateQuestLog();
      
      // Update markers
      this.createQuestMarkers();
    }
  }
  
  abandonQuest(quest) {
    const index = this.activeQuests.indexOf(quest);
    if (index !== -1) {
      this.activeQuests.splice(index, 1);
      
      // Reset quest progress
      if (quest.type === 'collection') {
        quest.collected = 0;
      } else if (quest.type === 'interaction' && quest.duration) {
        quest.timeSpent = 0;
      }
      
      // Show notification
      this.showNotification(`Quest Abandoned: ${quest.title}`, 3000);
      
      // Update quest log
      this.updateQuestLog();
      
      // Update markers
      this.createQuestMarkers();
    }
  }
  
  completeQuest(quest) {
    const index = this.activeQuests.indexOf(quest);
    if (index !== -1) {
      // Remove from active quests
      this.activeQuests.splice(index, 1);
      
      // Add to completed quests
      this.completedQuests.push(quest);
      
      // Mark as completed
      quest.completed = true;
      
      // Give reward
      if (this.shop) {
        this.shop.coins += quest.reward;
        this.shop.updateCoinCounter();
      }
      
      // Show notification
      this.showNotification(`Quest Completed: ${quest.title}\nReward: ${quest.reward} coins`, 5000);
      
      // Update quest log
      this.updateQuestLog();
    }
  }
  
  update(deltaTime) {
    // Check for quest progress and completion
    this.activeQuests.forEach(quest => {
      if (quest.id === 'baby_fronk_rescue' && !quest.completed) {
        if (window.babyFronk && !quest.found) {
          quest.found = true;
          this.showNotification(`You found Baby Fronk! Now return it to 9-Volts!`);
          this.updateQuestLog();
        }
        if (quest.found && !quest.delivered && window.nineVolts) {
          const distanceTo9Volts = this.playerModel.position.distanceTo(window.nineVolts.model.getWorldPosition(new THREE.Vector3()));
          if (distanceTo9Volts < 5) {
            if (window.nineVolts.babyFronkDelivered) { 
              quest.delivered = true;
              this.completeQuest(quest);
            }
          }
        }
      }

      if (quest.id === 'dealer_bust' && !quest.completed && window.dealer) {
        if (window.dealer.dealerState === 'arrested') {
          this.completeQuest(quest);
        }
      }

      if (quest.id === 'wega_challenge' && !quest.completed && window.walmart) {
      }

      if (quest.id === 'speed_siu' && !quest.completed && window.showSpeedNPC) {
      }

      if (quest.id === 'peter_joke' && !quest.completed && window.peterGriffin) {
      }

      if (quest.type === 'collection') {
        if (quest.target === 'uranium') {
          if (window.shop && window.shop.inventory && window.shop.inventory['uranium_rock'] > quest.collected) {
            quest.collected = window.shop.inventory['uranium_rock'];
            if (quest.collected >= quest.required) {
              this.showNotification(`Collected enough uranium! Return to Paper Man.`);
              this.updateQuestLog();
            }
          }
        }
        if (!quest.completed && quest.collected >= quest.required) {
          if (quest.id === 'elon_coins') {
            this.completeQuest(quest);
          }
        }
      } else if (quest.type === 'interaction') {
        if (quest.id === 'scared_woman' && !quest.completed && window.screamingWoman) {
          const distanceToWoman = this.playerModel.position.distanceTo(window.screamingWoman.model.position);
          const hasPhone = window.shop && window.shop.inventory && window.shop.inventory['samsung_s23_ultra'] > 0; 

          if (distanceToWoman < 5 && hasPhone && !window.screamingWoman.calmed) {
            if(window.screamingWoman.calmed) {
              this.completeQuest(quest);
            }
          }
        }

        if (quest.id === 'kendrick_uranium' && !quest.completed && window.kendrickLamar) {
          const distanceToKendrick = this.playerModel.position.distanceTo(window.kendrickLamar.model.position);
          const hasUranium = window.shop && window.shop.inventory && window.shop.inventory['uranium_rock'] > 0;

          if (hasUranium && !quest.collected) { 
            quest.collected = 1;
            this.showNotification(`You have the uranium! Find Kendrick!`);
            this.updateQuestLog();
          }

          if (quest.collected > 0 && distanceToKendrick < 10) {
            if (window.kendrickLamar.protestStarted) { 
              this.completeQuest(quest);
              if (window.shop && window.shop.inventory) {
                window.shop.inventory['uranium_rock']--;
                window.shop.updateInventoryPanel();
              }
            }
          }
        }
      } else if (quest.type === 'delivery') {
      }

    });
    
    // Check for proximity to quest markers to offer quests
    if (this.playerModel) {
      this.questMarkers.forEach((marker, index) => {
        if (marker.userData.isQuestMarker) {
          const distanceToMarker = this.playerModel.position.distanceTo(marker.position);
          if (distanceToMarker < 3) {
            const availableQuestsNotActive = this.availableQuests.filter(q => 
              !this.activeQuests.includes(q) && !this.completedQuests.includes(q));
            
            if (availableQuestsNotActive.length > index) {
              const quest = availableQuestsNotActive[index];
              this.showQuestPrompt(quest);
            }
          }
        }
      });
    }
  }

  showQuestPrompt(quest) {
    if (this.questPrompt) return;
    
    this.questPrompt = document.createElement('div');
    this.questPrompt.style.position = 'fixed';
    this.questPrompt.style.bottom = '30%';
    this.questPrompt.style.left = '50%';
    this.questPrompt.style.transform = 'translateX(-50%)';
    this.questPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.questPrompt.style.color = '#FFD700';
    this.questPrompt.style.padding = '20px';
    this.questPrompt.style.borderRadius = '5px';
    this.questPrompt.style.zIndex = '9999';
    this.questPrompt.style.textAlign = 'center';
    this.questPrompt.style.maxWidth = '400px';
    
    this.questPrompt.innerHTML = `
      <h3 style="margin-top: 0; color: #FFD700;">New Quest Available</h3>
      <h4>${quest.title}</h4>
      <p>${quest.description}</p>
      <p style="color: gold;">Reward: ${quest.reward} coins</p>
      <button id="accept-quest" style="background-color: #FFD700; color: black; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px; cursor: pointer;">Accept</button>
      <button id="decline-quest" style="background-color: #555; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Decline</button>
    `;
    
    document.body.appendChild(this.questPrompt);
    
    document.getElementById('accept-quest').addEventListener('click', () => {
      this.acceptQuest(quest);
      this.hideQuestPrompt();
    });
    
    document.getElementById('decline-quest').addEventListener('click', () => {
      this.hideQuestPrompt();
    });
    
    setTimeout(() => {
      this.hideQuestPrompt();
    }, 10000);
  }
  
  hideQuestPrompt() {
    if (this.questPrompt && this.questPrompt.parentNode) {
      document.body.removeChild(this.questPrompt);
      this.questPrompt = null;
    }
  }
  
  showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '150px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = '#FFD700';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    notification.style.whiteSpace = 'pre-line';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, duration);
  }
}