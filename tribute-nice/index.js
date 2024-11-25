// Doodle Pad JavaScript
const canvas = document.getElementById('doodle-pad');
const ctx = canvas.getContext('2d');
let drawing = false;

function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Event Listeners for Doodle Pad
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Event Listener for Clear Button
document.getElementById('clear-button').addEventListener('click', clearCanvas);
