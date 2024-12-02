let buttons = document.getElementsByClassName("button");
let buttonSound = new Audio("audio/select.wav");
buttonSound.preload = "auto";


console.log(buttons);

for(let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("mousedown", (event) => {
        console.log(event);
        buttonSound.play();
    })
}