document.addEventListener('DOMContentLoaded', () => {
    // Pet Selection Handling
    const petSelector = document.getElementById('pet-selector');
    const petImage = document.getElementById('pet-image');
    const petUpload = document.getElementById('pet-upload');
  
    petSelector.addEventListener('change', () => {
      const selectedPet = petSelector.value;
  
      if (selectedPet === 'prebuilt1') {
        petImage.src = 'https://static.wikia.nocookie.net/dandys-world-robloxhorror/images/8/89/Toodles_Render.png/revision/latest?cb=20240806012246';
      } else if (selectedPet === 'prebuilt2') {
        petImage.src = 'https://static.wikia.nocookie.net/dandys-world-robloxhorror/images/9/91/Gigi_Render.png/revision/latest?cb=20240928172027';
      } else if (selectedPet === 'prebuilt3') {
        petImage.src = 'https://static.wikia.nocookie.net/dandys-world-robloxhorror/images/9/9e/Brightney_Render.png/revision/latest?cb=20240803025907';
      } else if (selectedPet === 'custom') {
        petUpload.style.display = 'block';
      }
    });
  
    // Custom Pet Image Upload
    petUpload.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          petImage.src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Music Upload Handling
    const musicUpload = document.getElementById('music-upload');
    const petMusic = document.getElementById('pet-music');
  
    musicUpload.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const musicURL = URL.createObjectURL(file);
        petMusic.src = musicURL;
        petMusic.play();
      }
    });
  });
  