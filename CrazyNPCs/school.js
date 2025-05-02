import * as THREE from 'three';

export class School {
  constructor(scene, playerModel) {
    this.scene = scene;
    this.playerModel = playerModel;
    this.position = new THREE.Vector3(20, 0, 60); // Position opposite of Elon's mansion
    this.schoolBuilding = null;
    this.classroomPrompt = null;
    this.activeClassroom = null;
    this.quizActive = false;
    this.quizContainer = null;
    this.subjects = [
      'portuguese',
      'english',
      'history',
      'math',
      'science',
      'geography'
    ];
    
    // Quiz data for each subject
    this.quizData = {
      portuguese: [
        {
          question: "What does 'Bom dia' mean?",
          options: ["Good morning", "Good night", "Hello", "Goodbye"],
          correct: 0
        },
        {
          question: "How do you say 'thank you' in Portuguese?",
          options: ["De nada", "Obrigado", "Por favor", "Desculpe"],
          correct: 1
        },
        {
          question: "Which country has Portuguese as its official language?",
          options: ["Spain", "Italy", "Brazil", "Mexico"],
          correct: 2
        }
      ],
      english: [
        {
          question: "Which is the correct spelling?",
          options: ["Recieve", "Receive", "Receeve", "Recive"],
          correct: 1
        },
        {
          question: "What is the past tense of 'run'?",
          options: ["Runned", "Running", "Ran", "Runed"],
          correct: 2
        },
        {
          question: "Which is a synonym for 'happy'?",
          options: ["Sad", "Joyful", "Angry", "Tired"],
          correct: 1
        }
      ],
      history: [
        {
          question: "In what year did World War II end?",
          options: ["1939", "1942", "1945", "1950"],
          correct: 2
        },
        {
          question: "Who was the first president of the United States?",
          options: ["Thomas Jefferson", "Abraham Lincoln", "John Adams", "George Washington"],
          correct: 3
        },
        {
          question: "Which ancient civilization built the pyramids of Giza?",
          options: ["Romans", "Greeks", "Egyptians", "Mayans"],
          correct: 2
        }
      ],
      math: [
        {
          question: "What is 7 × 8?",
          options: ["54", "56", "63", "64"],
          correct: 1
        },
        {
          question: "What is the square root of 81?",
          options: ["7", "8", "9", "10"],
          correct: 2
        },
        {
          question: "What is 3² + 4²?",
          options: ["25", "24", "7", "49"],
          correct: 0
        }
      ],
      science: [
        {
          question: "What is the chemical symbol for water?",
          options: ["WA", "HO", "H2O", "W"],
          correct: 2
        },
        {
          question: "What force keeps us on the ground?",
          options: ["Magnetism", "Friction", "Gravity", "Tension"],
          correct: 2
        },
        {
          question: "What is the largest planet in our solar system?",
          options: ["Earth", "Mars", "Saturn", "Jupiter"],
          correct: 3
        }
      ],
      geography: [
        {
          question: "What is the capital of France?",
          options: ["London", "Berlin", "Paris", "Rome"],
          correct: 2
        },
        {
          question: "Which is the largest ocean on Earth?",
          options: ["Atlantic", "Indian", "Arctic", "Pacific"],
          correct: 3
        },
        {
          question: "Which continent is Egypt in?",
          options: ["Asia", "Europe", "Africa", "South America"],
          correct: 2
        }
      ]
    };
    
    this.createSchoolBuilding();
  }
  
  createSchoolBuilding() {
    // Create school building
    const building = new THREE.Group();
    
    // Main building - larger than the shop
    const baseGeometry = new THREE.BoxGeometry(20, 8, 12);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xE5D3B3 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 4;
    building.add(base);
    
    // Roof
    const roofGeometry = new THREE.BoxGeometry(22, 2, 14);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 9;
    building.add(roof);
    
    // Front entrance steps
    const stepsGeometry = new THREE.BoxGeometry(6, 1, 3);
    const stepsMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC });
    const steps = new THREE.Mesh(stepsGeometry, stepsMaterial);
    steps.position.set(0, 0.5, 6.5);
    building.add(steps);
    
    // Main door
    const doorGeometry = new THREE.PlaneGeometry(3, 5);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 2.5, 6.01);
    building.add(door);
    
    // Windows (front)
    const windowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xADD8E6,
      transparent: true,
      opacity: 0.7
    });
    
    for (let i = -1; i <= 1; i += 2) {
      const windowGeometry = new THREE.PlaneGeometry(2, 2);
      const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(i * 5, 4, 6.01);
      building.add(windowMesh);
      
      // Second floor window
      const upperWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      upperWindow.position.set(i * 5, 6.5, 6.01);
      building.add(upperWindow);
    }
    
    // Side windows
    for (let side = -1; side <= 1; side += 2) {
      for (let i = -1; i <= 1; i++) {
        const windowGeometry = new THREE.PlaneGeometry(2, 2);
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(side * 10.01, 4, i * 3);
        windowMesh.rotation.y = Math.PI / 2;
        building.add(windowMesh);
        
        // Second floor window
        const upperWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        upperWindow.position.set(side * 10.01, 6.5, i * 3);
        upperWindow.rotation.y = Math.PI / 2;
        building.add(upperWindow);
      }
    }
    
    // Back windows
    for (let i = -1; i <= 1; i++) {
      const windowGeometry = new THREE.PlaneGeometry(2, 2);
      const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(i * 5, 4, -6.01);
      windowMesh.rotation.y = Math.PI;
      building.add(windowMesh);
      
      // Second floor window
      const upperWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      upperWindow.position.set(i * 5, 6.5, -6.01);
      upperWindow.rotation.y = Math.PI;
      building.add(upperWindow);
    }
    
    // School sign
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 128;
    const context = textureCanvas.getContext('2d');
    context.fillStyle = '#4444AA';
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = 'white';
    context.font = 'bold 64px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('SCHOOL', 256, 64);
    
    const signTexture = new THREE.CanvasTexture(textureCanvas);
    const signGeometry = new THREE.PlaneGeometry(8, 2);
    const signMaterial = new THREE.MeshBasicMaterial({ 
      map: signTexture, 
      transparent: true,
      side: THREE.DoubleSide
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 10.5, 6.5);
    building.add(sign);
    
    // Position the school
    building.position.copy(this.position);
    this.schoolBuilding = building;
    
    // Set collision detection properties
    building.userData.isBarrier = true;
    building.userData.isSchool = true;
    
    this.scene.add(building);
    
    // Add class cards (one for each subject)
    this.addClassroomCards();
  }
  
  addClassroomCards() {
    const cardSize = { width: 1.5, height: 1 };
    const positions = [
      { x: -5, y: 2, z: 5.9, subject: 'portuguese' },
      { x: -3, y: 2, z: 5.9, subject: 'english' },
      { x: -1, y: 2, z: 5.9, subject: 'history' },
      { x: 1, y: 2, z: 5.9, subject: 'math' },
      { x: 3, y: 2, z: 5.9, subject: 'science' },
      { x: 5, y: 2, z: 5.9, subject: 'geography' }
    ];
    
    positions.forEach(pos => {
      // Create canvas for the classroom sign
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      
      // Fill background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 256, 128);
      
      // Add border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 248, 120);
      
      // Add text
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pos.subject.toUpperCase(), 128, 64);
      
      // Create texture and material
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      // Create mesh
      const geometry = new THREE.PlaneGeometry(cardSize.width, cardSize.height);
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position the card
      mesh.position.set(
        this.position.x + pos.x,
        this.position.y + pos.y,
        this.position.z + pos.z
      );
      
      // Store the subject in userData
      mesh.userData.isClassroomCard = true;
      mesh.userData.subject = pos.subject;
      
      // Add to scene
      this.scene.add(mesh);
    });
  }
  
  update(camera, renderer, deltaTime) {
    // Check if player is near the school
    if (this.playerModel) {
      const distance = this.playerModel.position.distanceTo(this.schoolBuilding.position);
      
      // If player is close to school
      if (distance < 15) {
        // Check if player is near any classroom card
        this.checkClassroomProximity();
      } else if (this.classroomPrompt) {
        // Remove classroom prompt if player walks away
        this.hideClassroomPrompt();
      }
    }
  }
  
  checkClassroomProximity() {
    // Find all classroom cards
    const cards = this.scene.children.filter(child => 
      child.userData && child.userData.isClassroomCard
    );
    
    let nearestCard = null;
    let shortestDistance = 3; // Proximity threshold
    
    // Find the nearest card
    cards.forEach(card => {
      const distance = this.playerModel.position.distanceTo(card.position);
      if (distance < shortestDistance) {
        nearestCard = card;
        shortestDistance = distance;
      }
    });
    
    // If near a card and not already in a quiz
    if (nearestCard && !this.quizActive) {
      this.showClassroomPrompt(nearestCard.userData.subject);
      this.activeClassroom = nearestCard.userData.subject;
    } else if (!nearestCard && this.classroomPrompt) {
      this.hideClassroomPrompt();
      this.activeClassroom = null;
    }
  }
  
  showClassroomPrompt(subject) {
    if (!this.classroomPrompt) {
      this.classroomPrompt = document.createElement('div');
      this.classroomPrompt.style.position = 'fixed';
      this.classroomPrompt.style.bottom = '30%';
      this.classroomPrompt.style.left = '50%';
      this.classroomPrompt.style.transform = 'translateX(-50%)';
      this.classroomPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      this.classroomPrompt.style.color = 'white';
      this.classroomPrompt.style.padding = '15px 20px';
      this.classroomPrompt.style.borderRadius = '5px';
      this.classroomPrompt.style.zIndex = '1000';
      document.body.appendChild(this.classroomPrompt);
      
      // Add keyboard listener for L key
      this.classroomKeyListener = (e) => {
        if (e.key.toLowerCase() === 'l') {
          this.startQuiz(this.activeClassroom);
        }
      };
      
      document.addEventListener('keydown', this.classroomKeyListener);
    }
    
    this.classroomPrompt.textContent = `Press L to learn ${subject.charAt(0).toUpperCase() + subject.slice(1)}`;
    this.classroomPrompt.style.display = 'block';
  }
  
  hideClassroomPrompt() {
    if (this.classroomPrompt) {
      this.classroomPrompt.style.display = 'none';
      document.removeEventListener('keydown', this.classroomKeyListener);
    }
  }
  
  startQuiz(subject) {
    // Disable player controls
    if (window.playerControls) {
      window.playerControls.enabled = false;
    }
    
    this.quizActive = true;
    this.hideClassroomPrompt();
    
    // Create quiz container
    this.quizContainer = document.createElement('div');
    this.quizContainer.style.position = 'fixed';
    this.quizContainer.style.top = '50%';
    this.quizContainer.style.left = '50%';
    this.quizContainer.style.transform = 'translate(-50%, -50%)';
    this.quizContainer.style.width = '500px';
    this.quizContainer.style.maxHeight = '80%';
    this.quizContainer.style.overflowY = 'auto';
    this.quizContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    this.quizContainer.style.color = 'black';
    this.quizContainer.style.padding = '20px';
    this.quizContainer.style.borderRadius = '10px';
    this.quizContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    this.quizContainer.style.zIndex = '9999';
    
    // Create quiz content
    const subjectTitle = document.createElement('h2');
    subjectTitle.textContent = `${subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz`;
    subjectTitle.style.textAlign = 'center';
    subjectTitle.style.marginBottom = '20px';
    this.quizContainer.appendChild(subjectTitle);
    
    // Get questions for this subject
    const questions = this.quizData[subject];
    const userAnswers = [];
    
    // Add each question
    questions.forEach((q, qIndex) => {
      const questionDiv = document.createElement('div');
      questionDiv.style.marginBottom = '20px';
      questionDiv.style.padding = '15px';
      questionDiv.style.backgroundColor = '#f5f5f5';
      questionDiv.style.borderRadius = '5px';
      
      const questionText = document.createElement('p');
      questionText.style.fontWeight = 'bold';
      questionText.style.marginBottom = '10px';
      questionText.textContent = `${qIndex + 1}. ${q.question}`;
      questionDiv.appendChild(questionText);
      
      // Add options
      q.options.forEach((option, oIndex) => {
        const optionLabel = document.createElement('label');
        optionLabel.style.display = 'block';
        optionLabel.style.padding = '8px';
        optionLabel.style.margin = '5px 0';
        optionLabel.style.cursor = 'pointer';
        optionLabel.style.borderRadius = '3px';
        optionLabel.style.transition = 'background-color 0.2s';
        
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = `question-${qIndex}`;
        optionInput.value = oIndex;
        optionInput.style.marginRight = '10px';
        
        // Store answer when selected
        optionInput.addEventListener('change', () => {
          userAnswers[qIndex] = parseInt(optionInput.value);
          
          // Highlight selected option
          questionDiv.querySelectorAll('label').forEach(label => {
            label.style.backgroundColor = '#f5f5f5';
          });
          optionLabel.style.backgroundColor = '#e0e0e0';
        });
        
        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(document.createTextNode(option));
        questionDiv.appendChild(optionLabel);
      });
      
      this.quizContainer.appendChild(questionDiv);
    });
    
    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Quiz';
    submitButton.style.display = 'block';
    submitButton.style.margin = '20px auto';
    submitButton.style.padding = '10px 20px';
    submitButton.style.backgroundColor = '#4CAF50';
    submitButton.style.color = 'white';
    submitButton.style.border = 'none';
    submitButton.style.borderRadius = '5px';
    submitButton.style.cursor = 'pointer';
    submitButton.style.fontSize = '16px';
    
    submitButton.addEventListener('click', () => {
      this.gradeQuiz(subject, questions, userAnswers);
    });
    
    this.quizContainer.appendChild(submitButton);
    
    document.body.appendChild(this.quizContainer);
  }
  
  gradeQuiz(subject, questions, userAnswers) {
    let score = 0;
    
    // Clear the quiz container
    this.quizContainer.innerHTML = '';
    
    // Create results header
    const resultsTitle = document.createElement('h2');
    resultsTitle.textContent = `${subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz Results`;
    resultsTitle.style.textAlign = 'center';
    resultsTitle.style.marginBottom = '20px';
    this.quizContainer.appendChild(resultsTitle);
    
    // Check each answer
    questions.forEach((q, qIndex) => {
      const resultDiv = document.createElement('div');
      resultDiv.style.marginBottom = '15px';
      resultDiv.style.padding = '10px';
      resultDiv.style.borderRadius = '5px';
      
      const questionText = document.createElement('p');
      questionText.textContent = `${qIndex + 1}. ${q.question}`;
      questionText.style.fontWeight = 'bold';
      
      const userAnswer = userAnswers[qIndex] !== undefined ? 
        q.options[userAnswers[qIndex]] : 
        'Not answered';
      
      const correctAnswer = q.options[q.correct];
      
      const answerText = document.createElement('p');
      
      if (userAnswers[qIndex] === q.correct) {
        score++;
        resultDiv.style.backgroundColor = 'rgba(144, 238, 144, 0.5)'; // Light green
        answerText.innerHTML = `Your answer: <strong>${userAnswer}</strong> ✓`;
      } else {
        resultDiv.style.backgroundColor = 'rgba(255, 182, 193, 0.5)'; // Light red
        answerText.innerHTML = `Your answer: <strong>${userAnswer}</strong> ✗<br>
                               Correct answer: <strong>${correctAnswer}</strong>`;
      }
      
      resultDiv.appendChild(questionText);
      resultDiv.appendChild(answerText);
      this.quizContainer.appendChild(resultDiv);
    });
    
    // Show final score
    const scoreDiv = document.createElement('div');
    scoreDiv.style.marginTop = '20px';
    scoreDiv.style.textAlign = 'center';
    scoreDiv.style.fontSize = '24px';
    scoreDiv.style.fontWeight = 'bold';
    
    const scoreText = document.createElement('p');
    scoreText.textContent = `Your Score: ${score}/${questions.length}`;
    
    const passFailText = document.createElement('p');
    const passing = score >= Math.ceil(questions.length / 2); // Pass if score is at least half
    passFailText.textContent = passing ? "You passed!" : "You failed!";
    passFailText.style.color = passing ? '#4CAF50' : '#FF5252';
    passFailText.style.fontSize = '28px';
    
    scoreDiv.appendChild(scoreText);
    scoreDiv.appendChild(passFailText);
    this.quizContainer.appendChild(scoreDiv);
    
    // Add continue button
    const continueButton = document.createElement('button');
    continueButton.textContent = 'Continue';
    continueButton.style.display = 'block';
    continueButton.style.margin = '20px auto';
    continueButton.style.padding = '10px 20px';
    continueButton.style.backgroundColor = '#2196F3';
    continueButton.style.color = 'white';
    continueButton.style.border = 'none';
    continueButton.style.borderRadius = '5px';
    continueButton.style.cursor = 'pointer';
    continueButton.style.fontSize = '16px';
    
    continueButton.addEventListener('click', () => {
      this.endQuiz(passing);
    });
    
    this.quizContainer.appendChild(continueButton);
    
    // If failed, add warning
    if (!passing) {
      const warningDiv = document.createElement('div');
      warningDiv.style.marginTop = '20px';
      warningDiv.style.padding = '10px';
      warningDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
      warningDiv.style.color = '#FF0000';
      warningDiv.style.fontWeight = 'bold';
      warningDiv.style.textAlign = 'center';
      warningDiv.style.borderRadius = '5px';
      warningDiv.textContent = "WARNING: Failing this quiz will make all NPCs hostile!";
      
      this.quizContainer.appendChild(warningDiv);
    }
  }
  
  endQuiz(passed) {
    // Remove the quiz container
    document.body.removeChild(this.quizContainer);
    this.quizContainer = null;
    this.quizActive = false;
    
    // Re-enable player controls
    if (window.playerControls) {
      window.playerControls.enabled = true;
    }
    
    // If failed, make all NPCs hostile
    if (!passed) {
      this.makeNPCsHostile();
    }
  }
  
  makeNPCsHostile() {
    // Make all NPCs angry and attack player
    if (window.sockPuppet) {
      window.sockPuppet.becomeAngry();
    }
    
    if (window.elonMusk) {
      window.elonMusk.triggerRobbery();
    }
    
    if (window.doubleFaceMan) {
      window.doubleFaceMan.triggerAnger();
    }
    
    // Create warning message
    const warningMessage = document.createElement('div');
    warningMessage.style.position = 'fixed';
    warningMessage.style.top = '20%';
    warningMessage.style.left = '50%';
    warningMessage.style.transform = 'translateX(-50%)';
    warningMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    warningMessage.style.color = 'white';
    warningMessage.style.padding = '20px';
    warningMessage.style.borderRadius = '10px';
    warningMessage.style.fontWeight = 'bold';
    warningMessage.style.fontSize = '24px';
    warningMessage.style.zIndex = '9999';
    warningMessage.textContent = 'YOU FAILED! ALL NPCS ARE NOW HOSTILE!';
    
    document.body.appendChild(warningMessage);
    
    // Remove after 5 seconds
    setTimeout(() => {
      document.body.removeChild(warningMessage);
    }, 5000);
  }
}