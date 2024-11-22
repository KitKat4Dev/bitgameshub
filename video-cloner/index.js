document.getElementById('cloneBtn').addEventListener('click', function() {
    const url = document.getElementById('youtubeUrl').value;
    const cloneCount = parseInt(document.getElementById('cloneCount').value, 10);
    const videoContainer = document.getElementById('videoContainer');
    
    // Clear previous videos
    videoContainer.innerHTML = '';

    // Validate input
    if (!url || isNaN(cloneCount) || cloneCount < 1 || cloneCount > 1000) {
        alert('Please enter a valid YouTube URL and select a number between 1 and 1000');
        return;
    }

    const videoId = extractVideoId(url);
    
    // Validate video ID
    if (!videoId) {
        alert('Invalid YouTube URL');
        return;
    }

    // Clone the iframe
    for (let i = 0; i < cloneCount; i++) {
        const iframe = createIframe(videoId);
        videoContainer.appendChild(iframe);
    }
});

// Extract YouTube video ID from the URL
function extractVideoId(url) {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

// Create an iframe element for the YouTube video
function createIframe(videoId) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.frameborder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    return iframe;
}
