document.getElementById('addVideoBtn').addEventListener('click', function() {
    const videoLink = document.getElementById('videoLink').value.trim(); // Trim whitespace
    const videoCount = parseInt(document.getElementById('videoCount').value);
    const videoList = document.getElementById('videoList');

    // Clear previous video list
    videoList.innerHTML = '';

    // Validate input
    if (!videoLink || isNaN(videoCount) || videoCount < 1) {
        alert('Please enter a valid YouTube link and a positive number of videos.');
        return;
    }

    // Get the YouTube video ID from the link
    const videoId = getYouTubeID(videoLink);

    if (!videoId) {
        alert('Please enter a valid YouTube video link.');
        return;
    }

    // Create a document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Add specified number of videos
    for (let i = 0; i < videoCount; i++) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`; // Added &rel=0 to disable related videos
        iframe.width = '560'; // Set width of the iframe
        iframe.height = '315'; // Set height of the iframe
        iframe.allow = 'autoplay; encrypted-media'; // Allow autoplay and encrypted media
        iframe.style.margin = '10px'; // Add some spacing between iframes
        fragment.appendChild(iframe);
    }

    // Append the fragment to the video list
    videoList.appendChild(fragment);

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
