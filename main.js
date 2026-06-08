const IMGWIDTH = 600;

const startButton = document.getElementById("startButton");
let image;
let inputButton;

// Replace this with an array of classes called playImages
const playImages = ['images/PlayImages/Ladybug.png', 'images/PlayImages/Elephant.png'];

function NextImage(){
    image.remove();

    image = document.createElement('img');
    image.src = playImages[Math.floor(Math.random() * playImages.length)]
    image.alt = 'Image';
    image.width = IMGWIDTH;
    document.getElementsByClassName("ImageLocation")[0].appendChild(image);
}

function StartGame(){
    image = document.createElement('img');
    image.src = 'images/PlayImages/Ladybug.png';
    image.alt = 'Ladybug';
    image.width = IMGWIDTH;
    document.getElementsByClassName("ImageLocation")[0].appendChild(image);

    startButton.remove();

    inputButton = document.createElement('button');
    inputButton = document.getElementsByClassName("InputLocation")[0].appendChild(inputButton);
    inputButton.textContent = 'Next';
    inputButton.addEventListener("click", NextImage);
}

startButton.addEventListener("click", StartGame);