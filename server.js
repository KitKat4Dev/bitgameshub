const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // To handle JSON requests

// Simple GET route to test
app.get('/', (req, res) => {
    res.send('Hello! I am your chatbot server.');
});

// Chatbot POST endpoint
app.post('/chat', (req, res) => {
    const userMessage = req.body.message; // Get the message from the user
    const botResponse = `You said: ${userMessage}`; // Simple echo bot response
    res.json({ response: botResponse });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://bitgameshub.com/`);
});
