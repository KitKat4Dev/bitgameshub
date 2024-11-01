document.getElementById('boredButton').addEventListener('click', function() {
    const messages = [
        "You're staring at the wall.",
        "You wonder how many times you can blink.",
        "You think about your life choices.",
        "You're now watching paint dry."
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('status').textContent = randomMessage;
});
