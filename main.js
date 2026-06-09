const IMGWIDTH = 600;

const startButton = document.getElementById("startButton");
let image;
let inputButton;

// Replace this with an array of classes called playImages
const playImages = [
    {src: 'images/PlayImages/Ladybug.png',
    alt: 'Ladybug',
    width: IMGWIDTH
    },
    {src: 'images/PlayImages/Elephant.png',
    alt: 'Elephant',
    width: IMGWIDTH
    }]

function NextImage(){
    image.remove();
    image = document.createElement('img');
    
    imageNum = Math.floor(Math.random() * playImages.length);
    image.src = playImages[imageNum].src;
    image.alt = playImages[imageNum].alt;
    image.width = playImages[imageNum].width;
    document.getElementsByClassName("ImageLocation")[0].appendChild(image);
}

function StartGame(){
    image = document.createElement('img');

    imageNum = Math.floor(Math.random() * playImages.length);
    image.src = playImages[imageNum].src;
    image.alt = playImages[imageNum].alt;
    image.width = playImages[imageNum].width;
    document.getElementsByClassName("ImageLocation")[0].appendChild(image);

    startButton.remove();

    inputButton = document.createElement('button');
    document.getElementsByClassName("InputLocation")[0].appendChild(inputButton);
    inputButton.textContent = 'Next';
    inputButton.addEventListener("click", NextImage);
}

startButton.addEventListener("click", StartGame);