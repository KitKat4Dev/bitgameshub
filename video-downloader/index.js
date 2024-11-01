document.getElementById('downloadBtn').addEventListener('click', function() {
    const url = document.getElementById('url').value;
    const message = document.getElementById('message');

    // Clear previous messages
    message.textContent = '';

    // Check if the URL input is empty
    if (!url) {
        message.textContent = 'Please enter a URL.';
        return;
    }

    message.textContent = 'Processing your request...';

    // Fetch request to the backend for downloading the video
    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        // Display the download link
        if (data.success) {
            message.innerHTML = `<a href="${data.fileUrl}" download>Click here to download your video</a>`;
        } else {
            // If the download fails, inform the user without showing the error
            message.textContent = 'Download failed, please try again.';
        }
    })
    .catch(() => {
        // General message for network issues, without details
        message.textContent = 'An unexpected issue occurred. Please try again.';
    });
});
