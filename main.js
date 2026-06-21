// Global variables
// Constant image sizes
const IMGWIDTH = 592;
const IMGHEIGHT = 592;

// Things that are needed to be kept track of
const easyButton = document.getElementById("easyButton");
const normalButton = document.getElementById("normalButton");
const hardButton = document.getElementById("hardButton");
let image;
const inputButtons = [];
let difficulty;

// Restart button set up behind the scenes
const restartButton = document.createElement('button');
restartButton.textContent = "Restart";
restartButton.addEventListener('click', RestartButton);

// Info relating to the images in the image file
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

// A list of indeces for images that have recently been used
const usedImages = [];

// Functions
// Cycles through list of images
function GenerateNextImage(){
    // Choose a random unused image
    let index = ChooseUnusedImageIndex(usedImages);

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
    // Append the restart button to the screen
    document.getElementsByClassName("BackButtonLocation")[0].appendChild(restartButton);

    // Set difficulty based on which button was pressed
    if (this.id === "easyButton"){
        difficulty = "Easy";
    }
    else if (this.id === "normalButton"){
        difficulty = "Normal";
    }
    else {
        difficulty = "Hard";
    }

    // Set first image
    image = GenerateNextImage();
    document.getElementsByClassName("ImageLocation")[0].appendChild(image);

    // Remove start buttons
    easyButton.remove();
    normalButton.remove();
    hardButton.remove();

    // Set up inputs
    if (difficulty === "Easy"){
        for (let i = 0; i < 2; i++){
            inputButtons.push(document.createElement('button'));
            inputButtons[i].addEventListener("click", DisableSelf);
        }
        document.getElementById("ChoiceOne").appendChild(inputButtons[0]);
        document.getElementById("ChoiceTwo").appendChild(inputButtons[1]);
    }
    else if (difficulty === "Normal"){
        for (let i = 0; i < 4; i++){
            inputButtons.push(document.createElement('button'));
            inputButtons[i].addEventListener("click", DisableSelf);
        }
        document.getElementById("ChoiceOne").appendChild(inputButtons[0]);
        document.getElementById("ChoiceTwo").appendChild(inputButtons[1]);
        document.getElementById("ChoiceThree").appendChild(inputButtons[2]);
        document.getElementById("ChoiceFour").appendChild(inputButtons[3]);
    }
    else{
        inputButtons.push(document.createElement('input'));
        inputButtons.push(document.createElement('button'));
        inputButtons[1].setAttribute('id', 'Correct');
        inputButtons[1].addEventListener("click", TryFormEntry);
        inputButtons[1].textContent = "GO";
        document.getElementById("ChoiceOne").appendChild(inputButtons[0]);
        document.getElementById("ChoiceTwo").appendChild(inputButtons[1]);

        // Focus in the input section upon starting hard mode
        inputButtons[0].focus();

        // Make the enter key activate the GO button
        document.addEventListener('keydown', EnterKey);
    }

    SetChoices();
}

// Resets everything to the way it was at the start
function RestartButton(){
    // Reset images and used images
    image.remove();
    usedImages.splice(0, usedImages.length);

    // Place difficulty buttons back in
    document.getElementsByClassName("ImageLocation")[0].appendChild(easyButton);
    document.getElementsByClassName("ImageLocation")[0].appendChild(normalButton);
    document.getElementsByClassName("ImageLocation")[0].appendChild(hardButton);

    // Remove inputs
    for (let inp of inputButtons){
        inp.remove();
        inp = null;
    }
    inputButtons.splice(0, inputButtons.length)

    // Remove self when done
    restartButton.remove();
}

function EnterKey(event){
    if (event.key === 'Enter' && !inputButtons[1].disabled){
        TryFormEntry();
    }
}

// Hard mode button uses the form enty to check for a correct answer
function TryFormEntry(){
    if (inputButtons[1].classList.contains('flashRed')){
        inputButtons[1].classList.remove('flashRed');
        void inputButtons[1].offsetWidth;
    }
    if (inputButtons[0].value.toLowerCase() === image.alt.toLowerCase()){
        CorrectChoiceChosen();
    }
    else{
        // Make the button flash red for a second
        inputButtons[1].classList.add('flashRed');
    }
}

// When a play button with the correct choice id is clicked
function CorrectChoiceChosen(){
    DisableInputs(true);
    let timeout = setTimeout(function(){
        GenerateAndSetNextImage();
        SetChoices();
        DisableInputs(false);
    }, 1000);
}

// Disables a button after it is clicked
function DisableSelf(){
    this.disabled = true;
}

// Disables all play inputs
function DisableInputs(disable){
    // Determine which inputs to disable based on difficulty
    let numChoices;
    if (difficulty === "Easy"){
        numChoices = 2;
    }
    else if (difficulty === "Normal"){
        numChoices = 4;
    }
    else{
        numChoices = 2;
    }

    // Disable inputs
    for (let i = 0; i < numChoices; i++){
        inputButtons[i].disabled = disable;
    }

    // When in hard mode, focus on the input field after enabling it
    if (difficulty === "Hard" && !disable){
        inputButtons[0].focus();
    }
}

function SetChoices(){
    // Decide how many values to change depending on difficulty
    let numChoices;
    if (difficulty === "Easy"){
        numChoices = 2;
    }
    else if (difficulty === "Normal"){
        numChoices = 4;
    }
    else{
        // Hard difficulty does not change anything else with its inputs
        inputButtons[0].value = "";
        return;
    }

    // Keep track of used image names
    const usedNames = [];

    // Add the current image as a used image name
    for (let i = 0; i < playImages.length; i++){
        if (playImages[i].alt === image.alt){
            usedNames.push(i);
        }
    }

    // Choose a location and set the correct choice
    const correctChoice = Math.floor(Math.random() * numChoices);
    inputButtons[correctChoice].setAttribute('id', 'Correct');
    inputButtons[correctChoice].textContent = image.alt;
    inputButtons[correctChoice].addEventListener("click", CorrectChoiceChosen, {once: true});

    // Set wrong choices with unused image names
    for (let i = 0; i < numChoices; i++){
        if (i !== correctChoice){
            let index = ChooseUnusedImageIndex(usedNames);
            usedNames.push(index);
            inputButtons[i].textContent = playImages[index].alt;
            inputButtons[i].setAttribute('id', 'Incorrect');
        }
    }
}

// Returns the index of a random image in playImages that is not included in a list of given indeces
function ChooseUnusedImageIndex(usedImgs){
    // Take the random number of steps only through valid available images
    let steps = 1 + Math.floor(Math.random() * (playImages.length - usedImgs.length));
    let index;
    for (let i = 0; i < playImages.length; i++){
        if (!usedImgs.includes(i)){
            if (--steps === 0){
                index = i;
                break;
            }
        }
    }

    return index;
}

// Set buttons that are already on the screen from the start
easyButton.addEventListener("click", StartGame);
normalButton.addEventListener("click", StartGame);
hardButton.addEventListener("click", StartGame);
