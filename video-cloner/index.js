document.getElementById('cloneBtn').addEventListener('click', function() {
    const url = document.getElementById('youtubeUrl').value;
    const cloneCount = parseInt(document.getElementById('cloneCount').value);
    const videoContainer = document.getElementById('videoContainer');

    // Clear previous videos
    videoContainer.innerHTML = '';

    if (url && cloneCount >= 1 && cloneCount <= 1000) {
        const videoId = extractVideoId(url);
        if (videoId) {
            for (let i = 0; i < cloneCount; i++) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                iframe.frameborder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                videoContainer.appendChild(iframe);
            }
        } else {
            alert('Invalid YouTube URL');
        }
    } else {
        alert('Please enter a valid URL and select a valid number');
    }
});

// Extract YouTube video ID from the URL
function extractVideoId(url) {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}
