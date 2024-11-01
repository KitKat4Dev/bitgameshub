const upload = document.getElementById('upload');
const photo = document.getElementById('photo');
const filterButton = document.getElementById('filterButton');

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        photo.src = e.target.result;
        photo.style.display = 'block';
        filterButton.style.display = 'inline';
    }
    
    if (file) {
        reader.readAsDataURL(file);
    }
});

filterButton.addEventListener('click', () => {
    photo.style.filter = 'invert(100%)';
});
