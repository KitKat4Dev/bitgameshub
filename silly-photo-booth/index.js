const upload = document.getElementById('upload');
const photo = document.getElementById('photo');
const filterButton = document.getElementById('filterButton');
const filterSelect = document.getElementById('filterSelect');
const downloadButton = document.getElementById('downloadButton');

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        photo.src = e.target.result;
        photo.style.display = 'block';
        filterSelect.style.display = 'inline'; // Show filter select
        filterButton.style.display = 'inline'; // Show filter button
        downloadButton.style.display = 'inline'; // Show download button
    }
    
    if (file) {
        reader.readAsDataURL(file);
    }
});

filterButton.addEventListener('click', () => {
    const selectedFilter = filterSelect.value; // Get selected filter
    photo.style.filter = selectedFilter; // Apply the filter
});

// Download functionality
downloadButton.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = photo.width;
    canvas.height = photo.height;

    // Draw the image on the canvas
    context.drawImage(photo, 0, 0);

    // Get the filter styles from the photo and apply it to the canvas
    context.filter = photo.style.filter; 
    context.drawImage(photo, 0, 0);

    // Create a link to download the image
    const link = document.createElement('a');
    link.download = 'silly-photo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
