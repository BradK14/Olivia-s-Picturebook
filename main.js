const IMGWIDTH = 592;
const IMGHEIGHT = 592;

const startButton = document.getElementById("startButton");
let image;
let inputButton;

// Replace this with an array of classes called playImages
const playImages = [
    {src: 'images/PlayImages/Ladybug.png',
    alt: 'Ladybug',
    width: IMGWIDTH,
    height: IMGHEIGHT
    },
    {src: 'images/PlayImages/Elephant.png',
    alt: 'Elephant',
    width: IMGWIDTH,
    height: IMGHEIGHT
    }]

const usedImages = [];

// Cycles through list of images
function GenerateNextImage(){
    // Determine a random available image to choose
    let steps = 1 + Math.floor(Math.random() * (playImages.length - usedImages.length));
    
    // Take the random number of steps only through valid available images
    let index;
    for (let i = 0; i < playImages.length; i++){
        if (!usedImages.includes(i)){
            if (--steps === 0){
                index = i;
                break;
            }
        }
    }

    // Invalidate this image for the next use of this function or reset images when all have been run through
    usedImages.push(index);
    if (usedImages.length === playImages.length){
        usedImages.splice(0, usedImages.length);
        usedImages.push(index);
    }

    // Set the new image info and return it
    let playImage = document.createElement('img');
    playImage.src = playImages[index].src;
    playImage.alt = playImages[index].alt;
    playImage.width = playImages[index].width;
    playImage.height = playImages[index].height;
    
    return playImage;
}

function GenerateAndSetNextImage(){
    image.remove();
    image = GenerateNextImage();
    document.getElementsByClassName("ImageLocation")[0].appendChild(image);
    inputButton.textContent = image.alt;
}

function StartGame(){
    image = GenerateNextImage();
    document.getElementsByClassName("ImageLocation")[0].appendChild(image);

    startButton.remove();

    inputButton = document.createElement('button');
    inputButton.setAttribute('id', 'Correct');
    document.getElementsByClassName("InputLocation")[0].appendChild(inputButton);
    inputButton.textContent = image.alt;
    inputButton.addEventListener("click", CorrectChoiceChosen);
}

function CorrectChoiceChosen(){
    inputButton.disabled = true;
    let timeout = setTimeout(function(){
        GenerateAndSetNextImage();
        inputButton.disabled = false;
    }, 1000);
}

startButton.addEventListener("click", StartGame);