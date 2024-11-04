const uploadInput = document.getElementById('upload');
const photo = document.getElementById('photo');
const filterSelect = document.getElementById('filterSelect');
const applyFilterButton = document.getElementById('applyFilter');

uploadInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photo.src = e.target.result;
            photo.style.display = 'block';
            filterSelect.style.display = 'block';
            applyFilterButton.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

filterSelect.addEventListener('change', function() {
    const selectedFilter = filterSelect.value;
    photo.style.filter = selectedFilter;
});

applyFilterButton.addEventListener('click', function() {
    const selectedFilter = filterSelect.value;
    photo.style.filter = selectedFilter;
});
