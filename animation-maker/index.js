// Animation Maker
const addFrameButton = document.getElementById('add-frame');
const playButton = document.getElementById('play-animation');
const stopButton = document.getElementById('stop-animation');
const animationContainer = document.getElementById('animation-container');
let frames = [];
let currentFrame = 0;
let interval;

addFrameButton.addEventListener('click', () => {
    const frame = document.createElement('div');
    frame.classList.add('frame');
    frame.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color for each frame
    animationContainer.appendChild(frame);
    frames.push(frame);
});

playButton.addEventListener('click', () => {
    if (frames.length === 0) return;
    stopAnimation(); // Stop previous animation if playing
    interval = setInterval(() => {
        frames.forEach((frame, index) => {
            frame.style.display = index === currentFrame ? 'block' : 'none';
        });
        currentFrame = (currentFrame + 1) % frames.length;
    }, 500); // Change frame every 500ms
});

stopButton.addEventListener('click', stopAnimation);

function stopAnimation() {
    clearInterval(interval);
    frames.forEach(frame => frame.style.display = 'none');
    currentFrame = 0;
}
