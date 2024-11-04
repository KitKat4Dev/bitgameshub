const reasons = [
    "The page you are looking for is just too cool to exist.",
    "This page has gone on vacation.",
    "Error 404: Too many buttons, not enough time.",
    "You might find what you seek in the next dimension.",
    "The file has vanished into the void."
];

document.getElementById('simulateError').addEventListener('click', function() {
    const randomIndex = Math.floor(Math.random() * reasons.length);
    document.getElementById('errorMessage').textContent = reasons[randomIndex];
});
