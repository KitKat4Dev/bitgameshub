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

    // Shape Definitions (20 more shapes)

    if (prompt.includes('circle')) {
        const radius = 50;
        ctx.beginPath();
        ctx.arc(250, 250, radius, 0, Math.PI * 2);
        ctx.fill();
    } else if (prompt.includes('square')) {
        ctx.fillRect(200, 200, 100, 100);
    } else if (prompt.includes('triangle')) {
        ctx.beginPath();
        ctx.moveTo(250, 200); 
        ctx.lineTo(300, 300); 
        ctx.lineTo(200, 300); 
        ctx.closePath();
        ctx.fill();
    } else if (prompt.includes('rectangle')) {
        ctx.fillRect(150, 200, 200, 100);
    } else if (prompt.includes('star')) {
        drawStar(ctx, 250, 250, 30, 70, 5);
    } else if (prompt.includes('pentagon')) {
        drawPolygon(ctx, 5, 250, 250, 50);
    } else if (prompt.includes('hexagon')) {
        drawPolygon(ctx, 6, 250, 250, 50);
    } else if (prompt.includes('octagon')) {
        drawPolygon(ctx, 8, 250, 250, 50);
    } else if (prompt.includes('heart')) {
        drawHeart(ctx, 250, 250, 50);
    } else if (prompt.includes('parallelogram')) {
        drawParallelogram(ctx, 200, 200, 150, 100, 30);
    } else if (prompt.includes('rhombus')) {
        drawRhombus(ctx, 250, 250, 100, 60);
    } else if (prompt.includes('ellipse')) {
        drawEllipse(ctx, 250, 250, 100, 50);
    } else if (prompt.includes('moon')) {
        drawMoon(ctx, 250, 250, 50, 30);
    } else if (prompt.includes('crescent')) {
        drawCrescent(ctx, 250, 250, 70, 40);
    } else if (prompt.includes('cloud')) {
        drawCloud(ctx, 250, 250, 100);
    } else if (prompt.includes('lightning')) {
        drawLightning(ctx, 250, 250, 100);
    } else if (prompt.includes('spiral')) {
        drawSpiral(ctx, 250, 250, 10, 20, 50);
    } else if (prompt.includes('smiley')) {
        drawSmileyFace(ctx, 250, 250, 50);
    } else if (prompt.includes('flame')) {
        drawFlame(ctx, 250, 250, 50);
    } else if (prompt.includes('pizza')) {
        drawPizzaSlice(ctx, 250, 250, 100, 50);
    } else if (prompt.includes('snake')) {
        drawSnake(ctx, 250, 250, 100, 50);
    } else {
        alert('Unknown shape! Try using keywords like "circle", "square", "triangle", "rectangle", "star", "heart", "parallelogram", "rhombus", "ellipse", "moon", "cloud", "lightning", "spiral", "smiley", "flame", "pizza", or "snake".');
    }
}

// New shape functions

function drawStar(context, cx, cy, spikes, outerRadius, innerRadius) {
    const rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    context.beginPath();
    context.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        context.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
        rot += step;
        context.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
    }
    context.lineTo(cx, cy - outerRadius);
    context.closePath();
    context.fill();
}

function drawPolygon(context, sides, cx, cy, radius) {
    const angle = (Math.PI * 2) / sides;
    context.beginPath();
    for (let i = 0; i < sides; i++) {
        const x = cx + Math.cos(i * angle) * radius;
        const y = cy + Math.sin(i * angle) * radius;
        if (i === 0) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
    }
    context.closePath();
    context.fill();
}

function drawHeart(context, cx, cy, size) {
    context.beginPath();
    context.moveTo(cx, cy + size / 4);
    context.bezierCurveTo(cx, cy, cx - size / 2, cy - size / 2, cx, cy - size);
    context.bezierCurveTo(cx + size / 2, cy - size / 2, cx, cy, cx, cy + size / 4);
    context.closePath();
    context.fill();
}

function drawParallelogram(context, x, y, width, height, angle) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + Math.cos(Math.PI * angle / 180) * width, y + Math.sin(Math.PI * angle / 180) * width);
    context.lineTo(x + Math.cos(Math.PI * angle / 180) * width + height, y + Math.sin(Math.PI * angle / 180) * width + height);
    context.lineTo(x + height, y + height);
    context.closePath();
    context.fill();
}

function drawRhombus(context, cx, cy, width, height) {
    context.beginPath();
    context.moveTo(cx, cy - height / 2);
    context.lineTo(cx + width / 2, cy);
    context.lineTo(cx, cy + height / 2);
    context.lineTo(cx - width / 2, cy);
    context.closePath();
    context.fill();
}

function drawEllipse(context, cx, cy, rx, ry) {
    context.beginPath();
    context.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    context.fill();
}

function drawMoon(context, cx, cy, outerRadius, innerRadius) {
    context.beginPath();
    context.arc(cx, cy, outerRadius, 0, Math.PI * 2);
    context.globalCompositeOperation = 'destination-out';
    context.arc(cx + 20, cy - 20, innerRadius, 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = 'source-over';
}

function drawCrescent(context, cx, cy, outerRadius, innerRadius) {
    context.beginPath();
    context.arc(cx, cy, outerRadius, 0, Math.PI * 2);
    context.globalCompositeOperation = 'destination-out';
    context.arc(cx + 20, cy - 20, innerRadius, 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = 'source-over';
}

function drawCloud(context, cx, cy, size) {
    context.beginPath();
    context.arc(cx - size / 2, cy, size, Math.PI, Math.PI * 2);
    context.arc(cx, cy - size / 2, size, Math.PI, Math.PI * 2);
    context.arc(cx + size / 2, cy, size, Math.PI, Math.PI * 2);
    context.closePath();
    context.fill();
}

function drawLightning(context, cx, cy, width) {
    context.beginPath();
    context.moveTo(cx, cy);
    context.lineTo(cx + width, cy - width);
    context.lineTo(cx + width / 2, cy);
    context.lineTo(cx + width, cy + width);
    context.lineTo(cx, cy);
    context.closePath();
    context.fill();
}

function drawSpiral(context, cx, cy, startRadius, step, loops) {
    context.beginPath();
    for (let i = 0; i < loops * 10; i++) {
        const radius = startRadius + step * i;
        const angle = i * 0.1;
        context.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    }
    context.stroke();
}

function drawSmileyFace(context, cx, cy, size) {
    context.beginPath();
    context.arc(cx, cy, size, 0, Math.PI * 2); // Head
    context.moveTo(cx - size / 3, cy - size / 3); // Left Eye
    context.arc(cx - size / 3, cy - size / 3, size / 10, 0, Math.PI * 2);
    context.moveTo(cx + size / 3, cy - size / 3); // Right Eye
    context.arc(cx + size / 3, cy - size / 3, size / 10, 0, Math.PI * 2);
    context.moveTo(cx - size / 2, cy + size / 4); // Smile
    context.arc(cx, cy + size / 4, size / 2, 0, Math.PI);
    context.closePath();
    context.stroke();
}

function drawFlame(context, cx, cy, size) {
    context.beginPath();
    context.moveTo(cx, cy);
    context.lineTo(cx - size / 2, cy + size / 2);
    context.lineTo(cx + size / 2, cy + size / 2);
    context.closePath();
    context.fill();
}

function drawPizzaSlice(context, cx, cy, size, angle) {
    context.beginPath();
    context.moveTo(cx, cy);
    context.lineTo(cx + size * Math.cos(angle), cy + size * Math.sin(angle));
    context.lineTo(cx + size * Math.cos(angle + Math.PI / 3), cy + size * Math.sin(angle + Math.PI / 3));
    context.closePath();
    context.fill();
}

function drawSnake(context, cx, cy, size, angle) {
    context.beginPath();
    context.moveTo(cx, cy);
    for (let i = 0; i < 10; i++) {
        context.lineTo(cx + size * Math.cos(angle + i), cy + size * Math.sin(angle + i));
    }
    context.closePath();
    context.stroke();
}
