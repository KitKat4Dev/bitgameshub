const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let color = '#0000ff'; // Default color

canvas.addEventListener('mousedown', () => {
    drawing = true;
});
canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});
canvas.addEventListener('mousemove', draw);

// Event listeners for the buttons
document.getElementById('colorPicker').addEventListener('input', (event) => {
    color = event.target.value; // Update color based on the color picker
});

document.getElementById('drawButton').addEventListener('click', drawShape);
document.getElementById('clearButton').addEventListener('click', clearCanvas);

function draw(event) {
    if (!drawing) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color; // Use the selected color

    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

function drawShape() {
    const prompt = document.getElementById('prompt').value.toLowerCase();
    ctx.fillStyle = color; // Set the fill color

    // Simple shape drawing based on the prompt
    switch (prompt) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(250, 250, 50, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'square':
            ctx.fillRect(200, 200, 100, 100);
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(250, 200);
            ctx.lineTo(300, 300);
            ctx.lineTo(200, 300);
            ctx.closePath();
            ctx.fill();
            break;
        default:
            alert('Unknown shape! Try "circle", "square", or "triangle".');
            break;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
