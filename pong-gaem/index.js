// Select the canvas element
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Set up the game parameters
const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;
let ballSpeedX = 5, ballSpeedY = 5;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let leftPaddleSpeed = 0, rightPaddleSpeed = 0;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let leftScore = 0, rightScore = 0;

// Power-up variables
let powerUp = null;
const powerUpSize = 20;
let powerUpActive = false;
let powerUpType = "";

// Draw the paddles and ball
function drawPaddles() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight); // Left paddle
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight); // Right paddle
}

function drawBall() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(ballX, ballY, ballSize, ballSize); // Ball
}

// Draw the score
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Left: " + leftScore, 50, 30);
    ctx.fillText("Right: " + rightScore, canvas.width - 100, 30);
}

// Draw the power-up
function drawPowerUp() {
    if (powerUp) {
        ctx.fillStyle = "#ff0";
        ctx.fillRect(powerUp.x, powerUp.y, powerUpSize, powerUpSize);
    }
}

// Move the paddles
function movePaddles() {
    leftPaddleY += leftPaddleSpeed;
    rightPaddleY += rightPaddleSpeed;

    // Prevent paddles from going out of bounds
    if (leftPaddleY < 0) leftPaddleY = 0;
    if (leftPaddleY + paddleHeight > canvas.height) leftPaddleY = canvas.height - paddleHeight;

    if (rightPaddleY < 0) rightPaddleY = 0;
    if (rightPaddleY + paddleHeight > canvas.height) rightPaddleY = canvas.height - paddleHeight;
}

// Move the ball
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball bouncing off the top and bottom
    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball bouncing off paddles
    if (ballX <= paddleWidth && ballY + ballSize >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        // Add points
        leftScore++;
        spawnPowerUp();
    }
    if (ballX + ballSize >= canvas.width - paddleWidth && ballY + ballSize >= rightPaddleY && ballY <= rightPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        // Add points
        rightScore++;
        spawnPowerUp();
    }

    // Ball out of bounds (reset)
    if (ballX <= 0 || ballX + ballSize >= canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
    }
}

// Spawn a random power-up
function spawnPowerUp() {
    if (Math.random() < 0.2 && !powerUpActive) {
        powerUp = {
            x: Math.random() * (canvas.width - powerUpSize),
            y: Math.random() * (canvas.height - powerUpSize),
        };
        powerUpActive = true;
    }
}

// Activate the power-up
function checkPowerUp() {
    if (powerUp && !powerUpType) {
        // Check if ball hits the power-up
        if (ballX + ballSize >= powerUp.x && ballX <= powerUp.x + powerUpSize &&
            ballY + ballSize >= powerUp.y && ballY <= powerUp.y + powerUpSize) {
            powerUpType = "speed"; // Example of a power-up type (e.g., speed boost)
            powerUp = null;
            powerUpActive = false;
        }
    }

    // Apply the power-up effect
    if (powerUpType === "speed") {
        ballSpeedX *= 1.5;
        ballSpeedY *= 1.5;
        setTimeout(() => {
            ballSpeedX /= 1.5;
            ballSpeedY /= 1.5;
            powerUpType = ""; // Reset power-up
        }, 5000); // Speed boost lasts for 5 seconds
    }
}

// Handle user input
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') rightPaddleSpeed = -5;
    if (e.key === 'ArrowDown') rightPaddleSpeed = 5;
    if (e.key === 'w') leftPaddleSpeed = -5;
    if (e.key === 's') leftPaddleSpeed = 5;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') rightPaddleSpeed = 0;
    if (e.key === 'w' || e.key === 's') leftPaddleSpeed = 0;
});

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddles();
    drawBall();
    drawScore();
    drawPowerUp();
    movePaddles();
    moveBall();
    checkPowerUp();
    requestAnimationFrame(gameLoop);
}

gameLoop();
