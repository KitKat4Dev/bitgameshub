document.getElementById('addVideoBtn').addEventListener('click', function() {
    const videoLink = document.getElementById('videoLink').value;
    const videoCount = parseInt(document.getElementById('videoCount').value);
    const videoList = document.getElementById('videoList');

    // Clear previous video list
    videoList.innerHTML = '';

    // Validate input
    if (!videoLink || videoCount < 1) {
        alert('Please enter a valid YouTube link and number of videos.');
        return;
    }

    // Get the YouTube video ID from the link
    const videoId = getYouTubeID(videoLink);

    if (!videoId) {
        alert('Please enter a valid YouTube video link.');
        return;
    }

    // Add specified number of videos
    for (let i = 0; i < videoCount; i++) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        videoList.appendChild(iframe);
    }

    // Clear input fields
    document.getElementById('videoLink').value = '';
    document.getElementById('videoCount').value = '';
});

// Function to extract YouTube video ID from the link
function getYouTubeID(url) {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}
