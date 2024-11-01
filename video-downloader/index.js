document.getElementById('downloadBtn').addEventListener('click', function() {
    const url = document.getElementById('url').value;
    const message = document.getElementById('message');

    if (!url) {
        message.textContent = 'Please enter a URL.';
        return;
    }

    message.textContent = 'Processing your request...';

    // Example of fetch request to your backend
    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            message.innerHTML = `<a href="${data.fileUrl}" download>Click here to download your video</a>`;
        } else {
            message.textContent = 'Error downloading video: ' + data.error;
        }
    })
    .catch(error => {
        message.textContent = 'There was a problem: ' + error.message;
    });
});
