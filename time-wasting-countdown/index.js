let time = 43200; // 12 hours in seconds
const countdownElement = document.getElementById('countdown');

function updateCountdown() {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    countdownElement.textContent = `${hours}:${minutes}:${seconds}`;

    if (time > 0) {
        time--;
    } else {
        alert("Time wasted successfully!");
        time = 43200; // Reset to 12 hours
    }
}

setInterval(updateCountdown, 1000);
