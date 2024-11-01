const upload = document.getElementById('upload');
const photo = document.getElementById('photo');
const filterButton = document.getElementById('filterButton');
const filterSelect = document.getElementById('filterSelect');

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        photo.src = e.target.result;
        photo.style.display = 'block';
        filterSelect.style.display = 'inline'; // Show filter select
        filterButton.style.display = 'inline'; // Show filter button
    }
    
    if (file) {
        reader.readAsDataURL(file);
    }
});

filterButton.addEventListener('click', () => {
    const selectedFilter = filterSelect.value; // Get selected filter
    photo.style.filter = selectedFilter; // Apply the filter
});
