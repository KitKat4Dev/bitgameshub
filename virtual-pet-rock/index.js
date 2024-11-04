// Define the rock's moods and responses
const rockMoods = {
    neutral: "The rock remains unresponsive.",
    happy: "The rock feels your affection and seems a little brighter!",
    annoyed: "The rock trembles slightly, perhaps annoyed by the constant petting.",
    content: "The rock is content with the attention... for now."
};

// Keep track of the rock's mood
let rockMood = "neutral";
let petCount = 0;

// Update the message in the HTML element with the rock's response
function updateRockMessage(message) {
    const messageElement = document.getElementById('rockMessage');
    if (messageElement) {
        messageElement.textContent = message;
    } else {
        console.warn("Element with ID 'rockMessage' not found. Please add it in the HTML.");
    }
}

// Function to handle petting the rock
function petRock() {
    petCount++;
    if (petCount < 3) {
        rockMood = "happy";
        updateRockMessage(rockMoods.happy);
    } else if (petCount < 6) {
        rockMood = "annoyed";
        updateRockMessage(rockMoods.annoyed);
    } else {
        rockMood = "content";
        updateRockMessage(rockMoods.content);
        petCount = 0;  // Reset pet count to cycle through responses
    }

    // Display a personalized alert
    alert(`You pet the rock. ${rockMoods[rockMood]}`);
}

// Attach event listener to the button for petting
document.getElementById('petButton').addEventListener('click', petRock);

// Initial message when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateRockMessage(rockMoods.neutral);
});
