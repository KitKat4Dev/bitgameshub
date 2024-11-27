// Character data with strengths and introductions
const characters = {
    brightney: {
        name: "Brightney",
        strength: 3,
        introduction: "Brightney is a brilliant lamp that lights up your day with her bright personality!",
        img: "Assets/Brightney_render.png"
    },
    boxten: {
        name: "Boxten",
        strength: 4,
        introduction: "Boxten is a music box filled with the sweetest tunes! He’ll make your heart dance.",
        img: "Assets/Boxten_render.png"
    },
    cosmo: {
        name: "Cosmo",
        strength: 5,
        introduction: "Cosmo is a delicious pastry with a heart of sweetness, ready to roll into action!",
        img: "Assets/Cosmo_render.png"
    },
    finn: {
        name: "Finn",
        strength: 2,
        introduction: "Finn is a brave fish who can tackle any challenge that comes his way!",
        img: "Assets/Finn_render.png"
    },
    glisten: {
        name: "Glisten",
        strength: 4,
        introduction: "Glisten is a shiny mirror that reflects your best qualities!",
        img: "Assets/Glisten_render.png"
    },
    scraps: {
        name: "Scraps",
        strength: 3,
        introduction: "Scraps is a crafty little paper cat who loves to play and create!",
        img: "Assets/Scraps_render.png"
    },
    pebble: {
        name: "Pebble",
        strength: 2,
        introduction: "Pebble is a rock dog who loves to dig and fetch!",
        img: "Assets/Pebble_render.png"
    },
    toodles: {
        name: "Toodles",
        strength: 1,
        introduction: "Toodles is an 8-ball who’s always ready to play games!",
        img: "Assets/Toodles_render.png"
    },
    dandy: {
        name: "Dandy",
        strength: 5,
        introduction: "Dandy is a flower-like character full of life and energy!",
        img: "Assets/Dandy_render.png"
    },
    shrimp: {
        name: "Shrimpo",
        strength: 3,
        introduction: "Shrimpo is an angry shrimp who’s not afraid to speak his mind!",
        img: "Assets/Shrimpo_render.png"
    },
    astro: {
        name: "Astro",
        strength: 4,
        introduction: "Astro is a dreamy moon who brings calm and tranquility.",
        img: "Assets/Astro_render.png"
    },
    flutter: {
        name: "Flutter",
        strength: 2,
        introduction: "Flutter is a cheerful butterfly who spreads joy wherever she goes!",
        img: "Assets/Flutter_render.png"
    },
    goob: {
        name: "Goob",
        strength: 3,
        introduction: "Goob is a playful craft character who loves to have fun!",
        img: "Assets/Goob_render.png"
    },
    poppy: {
        name: "Poppy",
        strength: 1,
        introduction: "Poppy is a bubbly character full of excitement and laughter!",
        img: "Assets/Poppy_render.png"
    },
    gigi: {
        name: "Gigi",
        strength: 3,
        introduction: "Gigi is a Gachapon always searching for fun adventures!",
        img: "Assets/Gigi_render.png"
    },
    tisha: {
        name: "Tisha",
        strength: 2,
        introduction: "Tisha is a helpful tissue box ready to lend a hand!",
        img: "Assets/Tisha_render.png"
    },
    connie: {
        name: "Connie",
        strength: 4,
        introduction: "Connie is a shapeshifting ghost with a love for music!",
        img: "Assets/Connie_render.png"
    }
};

// Select elements
const characterBtns = document.querySelectorAll('.character-btn');
const computerCharacterDisplay = document.getElementById('computer-character');
const resultDisplay = document.getElementById('result');
const playAgainButton = document.getElementById('play-again');

// Character selection event
characterBtns.forEach(button => {
    button.addEventListener('click', () => {
        const playerChoice = characters[button.id.replace('-btn', '')];
        const computerChoice = getComputerChoice();

        computerCharacterDisplay.innerText = computerChoice.name;
        resultDisplay.innerText = determineWinner(playerChoice, computerChoice);
        playAgainButton.style.display = 'block';

        // Display character introduction
        alert(playerChoice.introduction);
    });
});

// Function to get computer's character
function getComputerChoice() {
    const characterKeys = Object.keys(characters);
    const randomIndex = Math.floor(Math.random() * characterKeys.length);
    return characters[characterKeys[randomIndex]];
}

// Function to determine the winner
function determineWinner(player, computer) {
    if (player.strength > computer.strength) {
        return `You win! ${player.name} is stronger than ${computer.name}!`;
    } else if (player.strength < computer.strength) {
        return `You lose! ${computer.name} is stronger than ${player.name}.`;
    } else {
        return `It's a tie! Both ${player.name} and ${computer.name} are equally strong!`;
    }
}

// Play Again functionality
playAgainButton.addEventListener('click', () => {
    resultDisplay.innerText = '';
    computerCharacterDisplay.innerText = '?';
    playAgainButton.style.display = 'none';
});




// Initialize variables
let shrimpoClickCount = 0;
const MAX_SHRIMPO_CLICKS = 11;
const JUMP_SCARE_SOUND = new Audio("Assets/jump_scare.mp3"); // Add your jump scare sound file
const WARNING_MESSAGES = [
    "Why would you use Shrimpo?",
    "He's useless.",
    "DONT USE HIM.",
    "WHY?"
];

// Function to handle Shrimpo clicks
function handleShrimpoClick() {
    shrimpoClickCount++;

    if (shrimpoClickCount === MAX_SHRIMPO_CLICKS) {
        jumpScare();
    }
}

// Function to trigger jump scare
function jumpScare() {
    // Enter fullscreen mode
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }

    // Play jump scare sound
    JUMP_SCARE_SOUND.play();

    // Show warning messages
    let warningDiv = document.createElement("div");
    warningDiv.style.position = "fixed";
    warningDiv.style.top = "50%";
    warningDiv.style.left = "50%";
    warningDiv.style.transform = "translate(-50%, -50%)";
    warningDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    warningDiv.style.color = "white";
    warningDiv.style.padding = "20px";
    warningDiv.style.zIndex = "9999";
    warningDiv.style.textAlign = "center";
    warningDiv.style.fontSize = "24px";

    WARNING_MESSAGES.forEach((message) => {
        let msg = document.createElement("p");
        msg.innerText = message;
        warningDiv.appendChild(msg);
    });

    document.body.appendChild(warningDiv);
}

// Prevent exiting fullscreen with a fake warning
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey) {
        event.preventDefault();
        alert("Do you want to leave?");
    }
});

// Add event listener for Shrimpo click (assuming there is an element with id 'shrimpo')
document.getElementById("shrimpo").addEventListener("click", handleShrimpoClick);
