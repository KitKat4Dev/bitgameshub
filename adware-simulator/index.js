// Grab the popups container
const popupsContainer = document.getElementById("popups");

// Array of random popup messages
const messages = [
    "You won a free iPhone! Click to claim now!",
    "Your computer is infected with a virus!",
    "Download this to optimize your PC performance.",
    "Congratulations! You're the 1,000th visitor.",
    "Critical error! Immediate action required!",
    "Low disk space detected! Click for a solution.",
    "Claim your $100 gift card today!",
    "Warning! Spyware detected on your system.",
    "Upgrade to premium to fix all errors.",
    "Your device might be at risk!",

    // Dandy's World-inspired
    "Dandy needs your help! Send $5 for rainbow seeds.",
    "Shrimpo just crashed your system! Click here to fix it.",
    "Vee detected your microphone is on. Want us to record?",
    "Gigi says: ‘This prize is totally real, trust me!’",
    "Warning: Goob has overloaded your memory with hugs!",
    "Uh-oh! Toodles is speeding up your CPU. Good or bad?",
    "Brightney recommends buying a new lamp bulb… again.",
    "Shelly detected your comfort levels are too low!",

    // Kick Buttowski-inspired
    "Kick Buttowski is challenging you to a stunt-off! Click to accept.",
    "Warning: Gunther just ate your cookies. Buy more?",
    "Kick's bike needs upgrades! Send $20 to win races.",
    "Brad says you're grounded! Pay now to unground yourself.",
    "Speedometer error: You've gone too extreme. Slow down?",

    // BFDI/Object Show-inspired
    "Leafy stole your prize! Click to get it back.",
    "Woody is scared of your hard drive! Fix now!",
    "Four detected glitches in your system. Wanna rejoin?",
    "Warning: X found a missing recovery center. Download to restore.",
    "Uh-oh! Donut needs 10 more points to fix this error.",
    "Lollipop says your password is weak. Upgrade with candy.",
    "Gelatin says you’re in 'wobble mode.' Want to stabilize?",
    "Fiery says your system is overheating! Add water?",
    "Blocky is pranking your files. Click here to stop him!"
];

// Function to generate a random position
function getRandomPosition() {
    const x = Math.random() * (window.innerWidth - 300);
    const y = Math.random() * (window.innerHeight - 200);
    return { x, y };
}

// Function to create a single popup
function createPopup() {
    const { x, y } = getRandomPosition();
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    // Header
    const header = document.createElement("div");
    header.classList.add("popup-header");
    header.innerHTML = `Totally cool offer!`;

    // Close button
    const closeButton = document.createElement("span");
    closeButton.textContent = "✖";
    closeButton.addEventListener("click", () => popup.remove());
    header.appendChild(closeButton);

    // Content
    const content = document.createElement("div");
    content.classList.add("popup-content");
    content.textContent = messages[Math.floor(Math.random() * messages.length)];

    popup.appendChild(header);
    popup.appendChild(content);

    popupsContainer.appendChild(popup);
}

// Function to spawn multiple popups
function spawnPopups(count) {
    for (let i = 0; i < count; i++) {
        createPopup();
    }
}

// Limit the number of active popups to prevent memory issues
const MAX_POPUPS = 100;
function cleanupPopups() {
    const popups = document.querySelectorAll(".popup");
    if (popups.length > MAX_POPUPS) {
        popupsContainer.removeChild(popups[0]); // Remove the oldest popup
    }
}

// Spawn 10 popups every second
setInterval(() => {
    spawnPopups(1);
    cleanupPopups();
}, 1000);
