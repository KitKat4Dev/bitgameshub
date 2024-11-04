document.getElementById('newButton').addEventListener('click', function() {
    const buttonContainer = document.getElementById('buttonContainer');
    const newButton = document.createElement('button');
    newButton.textContent = "Random Button " + (Math.floor(Math.random() * 100));
    newButton.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    newButton.style.color = '#fff';
    newButton.style.border = 'none';
    newButton.style.padding = '10px 20px';
    newButton.style.margin = '5px';
    newButton.style.cursor = 'pointer';
    buttonContainer.appendChild(newButton);
});
