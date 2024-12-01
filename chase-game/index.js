// Game Settings
const backgrounds = [
    { img: 'assets/kitchen.avif', theme: 'kitchen' },
    { img: 'assets/livingroom.png', theme: 'livingroom' },
    { img: 'assets/mcdonalds.jpg', theme: 'mcdonalds' },
    { img: 'assets/beach.jpeg', theme: 'office' },
];

const bugdroidImage = 'assets/bugdroid-head.png';
const kitdroidImage = 'assets/Kitdroid.png';

let currentDifficulty = 1;
let points = 0;
let extraTime = 30;
let numKitdroids = 10;
let gameInterval;
let timeLeft = extraTime;
let bugdroidFound = false;
let comboCounter = 0;
let resetGameInProgress = false;

// Random number generator
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Update points in the UI
function updatePoints() {
    document.getElementById('points').innerText = points;
    document.getElementById('shopPoints').innerText = points;
    document.getElementById('combo').innerText = comboCounter;
}

// Set the background of the game container
function setBackground() {
    const container = document.getElementById('gameContainer');
    const bg = backgrounds[getRandomInt(backgrounds.length)];
    container.style.backgroundImage = `url(${bg.img})`;
    return bg.theme;
}

// Create a new droid (bugdroid or kitdroid) and add interaction
function createDroid(isBugdroid, theme) {
    const droid = document.createElement('img');
    droid.src = isBugdroid ? bugdroidImage : kitdroidImage;
    droid.classList.add('droid');
    
    // Randomize droid's position
    droid.style.top = `${getRandomInt(window.innerHeight - 50)}px`;
    droid.style.left = `${getRandomInt(window.innerWidth - 50)}px`;

    // Ensure Bugdroid can be clicked even behind HUD
    if (isBugdroid) {
        droid.style.zIndex = 999;  // Bugdroid gets a higher z-index for clickability
    } else {
        droid.style.zIndex = 5;  // Normal z-index for Kitdroids
    }

    // Event listener for when a droid (Kitdroid or Bugdroid) is clicked
    droid.addEventListener('click', () => {
        if (isBugdroid) {
            const findSound = document.getElementById('findSound');
            findSound.currentTime = 0;
            findSound.play(); // Play found sound

            points += 20 + (comboCounter * 5); // Add points based on combo counter
            comboCounter++; // Increase combo
            numKitdroids += 40; // Add 3 new kitdroids
            updatePoints();
            bugdroidFound = true;
            resetGame(); // Reset the game after finding the Bugdroid
        } else {
            const clickSound = document.getElementById('clickSound');
            clickSound.currentTime = 0;
            clickSound.play(); // Play click sound when clicking on a Kitdroid

            comboCounter = 0; // Reset combo on wrong click
            points += 10; // Add points for clicking a Kitdroid
            updatePoints();

            // Remove the clicked Kitdroid from the game container
            droid.remove();
        }
    });

    return droid;
}

// Countdown timer
function countdown() {
    const timerElement = document.getElementById('timer');
    gameInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            alert('Time\'s up! You lost! Combo resets!');
            clearInterval(gameInterval);
            comboCounter = 0; // Reset combo
            resetGame(); // Reset the game
        }
    }, 1000);
}

// Reset the game
function resetGame() {
    if (resetGameInProgress) return; // Prevent game reset if already in progress
    resetGameInProgress = true;

    const container = document.getElementById('gameContainer');
    container.innerHTML = ''; // Clear the game container

    const theme = setBackground(); // Set a new background theme

    let bugdroidPosition = getRandomInt(numKitdroids); // Randomize Bugdroid position

    for (let i = 0; i < numKitdroids; i++) {
        let isBugdroid = i === bugdroidPosition;
        container.appendChild(createDroid(isBugdroid, theme)); // Add droids to the screen
    }

    clearInterval(gameInterval); // Clear previous countdown
    timeLeft = extraTime; // Reset timer
    countdown(); // Start a new countdown
    resetGameInProgress = false;
}

// Toggle shop visibility
document.getElementById('toggleShop').addEventListener('click', () => {
    const shop = document.getElementById('shop');
    shop.classList.toggle('hidden');
});

// Add your shop logic (buying items, difficulty, etc.)
document.getElementById('increaseDifficulty').addEventListener('click', () => {
    if (points >= 20) {
        points -= 20;
        currentDifficulty++;
        numKitdroids += 40; // Increase the number of Kitdroids
        updatePoints();
        alert('Difficulty increased!');
    } else {
        alert('Not enough points!');
    }
});

// Initialize the game
function startGame() {
    updatePoints();
    resetGame(); // Start the game
}

startGame();
