const IMGWIDTH = 592;
const IMGHEIGHT = 592;

const startButton = document.getElementById("startButton");
let image;
const inputButtons = [];
let difficulty;

// Replace this with an array of classes called playImages
const playImages = [
    {src: 'images/PlayImages/Blueberry.png',
    alt: 'Blueberry',
    width: IMGWIDTH,
    height: IMGHEIGHT
    },
    {src: 'images/PlayImages/Butterfly.png',
    alt: 'Butterfly',
    width: IMGWIDTH,
    height: IMGHEIGHT
    },
    {src: 'images/PlayImages/Ladybug.png',
    alt: 'Ladybug',
    width: IMGWIDTH,
    height: IMGHEIGHT
    },
    {src: 'images/PlayImages/Elephant.png',
    alt: 'Elephant',
    width: IMGWIDTH,
    height: IMGHEIGHT
    },
    {src: 'images/PlayImages/Flower.png',
    alt: 'Flower',
    width: IMGWIDTH,
    height: IMGHEIGHT
    },
    {src: 'images/PlayImages/IceCream.png',
    alt: 'Ice Cream',
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
}

function StartGame(){
    // Set difficulty
    difficulty = "Normal";

    // Set first image
    image = GenerateNextImage();
    document.getElementsByClassName("ImageLocation")[0].appendChild(image);

    // Remove start buttons
    startButton.remove();

    // Set up inputs
    if (difficulty === "Normal"){
        for (let i = 0; i < 4; i++){
        inputButtons.push(document.createElement('button'));
        inputButtons[i].addEventListener("click", DisableSelf);
        }
        document.getElementById("ChoiceOne").appendChild(inputButtons[0]);
        document.getElementById("ChoiceTwo").appendChild(inputButtons[1]);
        document.getElementById("ChoiceThree").appendChild(inputButtons[2]);
        document.getElementById("ChoiceFour").appendChild(inputButtons[3]);
    }

    SetChoices();
}

function CorrectChoiceChosen(){
    DisableInputs(true);
    let timeout = setTimeout(function(){
        GenerateAndSetNextImage();
        SetChoices();
        DisableInputs(false);
    }, 1000);
}

function DisableSelf(){
    this.disabled = true;
}

function DisableInputs(disable){
    if (difficulty === "Normal"){
        for (let i = 0; i < 4; i++){
        inputButtons[i].disabled = disable;
        }
    }
}

function SetChoices(){
    if (difficulty === "Normal"){
        const correctChoice = Math.floor(Math.random() * 4);
        inputButtons[correctChoice].setAttribute('id', 'Correct');
        inputButtons[correctChoice].textContent = image.alt;
        inputButtons[correctChoice].addEventListener("click", CorrectChoiceChosen, {once: true});
        for (let i = 0; i < 4; i++){
            if (i !== correctChoice){
                inputButtons[i].textContent = "Wrong";
                inputButtons[i].setAttribute('id', 'Incorrect');
            }
        }
    }
}

startButton.addEventListener("click", StartGame);
