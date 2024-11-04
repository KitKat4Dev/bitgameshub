// Array of unmotivational phrases
const phrases = [
    "If at first, you don’t succeed, maybe you should just give up.",
    "You miss 100% of the naps you don’t take.",
    "Dream big... then go back to sleep.",
    "Procrastinate now, don’t put it off.",
    "Success is just failure that tried again.",
    "Why try when you can just complain?",
    "The early bird gets the worm, but the second mouse gets the cheese.",
    "It's better to be late than to arrive ugly.",
    "Failure is the condiment that gives success its flavor.",
    "Don't be a hero; just do what's expected.",
    "Why reach for the stars when you can stay on the couch?",
    "Every time you get up, you get knocked down again.",
    "The road to success is dotted with many tempting parking spaces.",
    "Life is short; take your time to do nothing.",
    "A journey of a thousand miles begins with a single step... back to bed."
];

// Function to generate a random background color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Event listener for the button
document.getElementById('generatePoster').addEventListener('click', function() {
    // Generate a random index to select a phrase
    const randomIndex = Math.floor(Math.random() * phrases.length);
    // Change the text content to the randomly selected phrase
    document.getElementById('unmotivationalText').textContent = phrases[randomIndex];
    // Change the background color of the poster
    document.getElementById('poster').style.backgroundColor = getRandomColor();
});

// Optional: Function to reset the poster text
document.getElementById('resetPoster').addEventListener('click', function() {
    document.getElementById('unmotivationalText').textContent = "Click 'Generate' for some unmotivation!";
    document.getElementById('poster').style.backgroundColor = '#FFFFFF'; // Reset to white background
});
