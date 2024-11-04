let blinked = false;

document.getElementById('startContest').addEventListener('click', () => {
    document.getElementById('result').textContent = "Don't blink!";
    setTimeout(() => {
        if (!blinked) {
            document.getElementById('result').textContent = "You win!";
        } else {
            document.getElementById('result').textContent = "You blinked! You lose!";
        }
    }, 5000);
});

document.getElementById('eye').addEventListener('click', () => {
    blinked = true;
});
