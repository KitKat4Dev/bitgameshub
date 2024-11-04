// Get references to HTML elements
const colorPicker = document.getElementById('colorPicker');
const addColorBtn = document.getElementById('addColor');
const clearFlagBtn = document.getElementById('clearFlag');
const flagCanvas = document.getElementById('flagCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const ctx = flagCanvas.getContext('2d');

let colors = [];

// Function to draw the flag based on the colors array
function drawFlag() {
    const flagHeight = flagCanvas.height / colors.length;
    ctx.clearRect(0, 0, flagCanvas.width, flagCanvas.height); // Clear the canvas

    colors.forEach((color, index) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, index * flagHeight, flagCanvas.width, flagHeight);
    });
}

// Event listener for adding a color to the flag
addColorBtn.addEventListener('click', () => {
    const selectedColor = colorPicker.value;
    colors.push(selectedColor);
    drawFlag();
});

// Event listener for clearing the flag
clearFlagBtn.addEventListener('click', () => {
    colors = [];
    ctx.clearRect(0, 0, flagCanvas.width, flagCanvas.height);
});

// Event listener for downloading the flag as an image
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'custom_flag.png';
    link.href = flagCanvas.toDataURL();
    link.click();
});
