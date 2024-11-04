document.getElementById('generateColor').addEventListener('click', () => {
    // Simulate rolling a dice (1 to 6)
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    
    // Generate a random hex color code
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    
    // Set the background color of the colorBox
    document.getElementById('colorBox').style.backgroundColor = randomColor;
    document.getElementById('colorCode').textContent = `Dice rolled: ${diceRoll}, Color: ${randomColor}`;
});
