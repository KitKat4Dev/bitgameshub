document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.id = 'uploadedImage';
            imgElement.style.maxWidth = '100%';
            document.getElementById('imageContainer').innerHTML = ''; // Clear previous image
            document.getElementById('imageContainer').appendChild(imgElement);
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('applyFilterButton').addEventListener('click', function() {
    const selectedFilter = document.getElementById('filterOptions').value;
    const imgElement = document.getElementById('uploadedImage');
    if (imgElement) {
        imgElement.style.filter = selectedFilter;
    }
});
