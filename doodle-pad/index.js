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

    // Determine the shape to draw based on user input
    if (prompt.includes('circle')) {
        const radius = 50; // Define a fixed radius
        ctx.beginPath();
        ctx.arc(250, 250, radius, 0, Math.PI * 2);
        ctx.fill();
    } else if (prompt.includes('square')) {
        ctx.fillRect(200, 200, 100, 100); // Fixed position and size
    } else if (prompt.includes('triangle')) {
        ctx.beginPath();
        ctx.moveTo(250, 200); // Top vertex
        ctx.lineTo(300, 300); // Bottom right vertex
        ctx.lineTo(200, 300); // Bottom left vertex
        ctx.closePath();
        ctx.fill();
    } else if (prompt.includes('rectangle')) {
        ctx.fillRect(150, 200, 200, 100); // Fixed position and size
    } else if (prompt.includes('star')) {
        drawStar(ctx, 250, 250, 30, 70, 5); // Draw a star
    } else {
        alert('Unknown shape! Try using keywords like "circle", "square", "triangle", "rectangle", or "star".');
    }
}

function drawStar(context, cx, cy, spikes, outerRadius, innerRadius) {
    const rot = (Math.PI / 2) * 3; // Starting angle
    const step = Math.PI / spikes; // Angle between spikes

    context.beginPath();
    context.moveTo(cx, cy - outerRadius); // Move to top point of the star
    for (let i = 0; i < spikes; i++) {
        context.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius); // Outer point
        rot += step;

        context.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius); // Inner point
        rot += step;
    }
    context.lineTo(cx, cy - outerRadius); // Close the star path
    context.closePath();
    context.fill();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
