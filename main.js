// Global variables
// This file borrows the playImages variable from the playImages file, and will not work properly without it included
// playImages

// Image dimensions
const IMG_WIDTH = 592;
const IMG_HEIGHT = IMG_WIDTH;

// Set up for difficulty buttons
const difficultyButtons = document.getElementById("difficultyButtons");
document.getElementById("easyButton").addEventListener("click", startGame);
document.getElementById("normalButton").addEventListener("click", startGame);
document.getElementById("hardButton").addEventListener("click", startGame);

// This holds the current shown image
let image;

// This keeps track of the various input buttons, it will have different elements based on difficulty chosen
const inputButtons = [];

// The currently chosen difficulty
let difficulty;

// Restart button set up behind the scenes
const restartButton = document.createElement('button');
restartButton.textContent = "Restart";
restartButton.addEventListener('click', onRestart);

// A list of indeces for images that have recently been used
const usedImages = [];

// Functions
// Cycles through list of images
function generateNextImage(){
    // Choose a random unused image
    let index = chooseUnusedImageIndex(usedImages);

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
    playImage.width = IMG_WIDTH;
    playImage.height = IMG_HEIGHT;
    
    return playImage;
}

// Removes current image and replaces it with a new image
function generateAndSetNextImage(){
    image.remove();
    image = generateNextImage();
    document.getElementsByClassName("ImageLocation")[0].appendChild(image);

    // Animate its arrival
    image.classList.add('arrive');
}

// Run this function when clicking a difficulty button
function startGame(){
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
    image = generateNextImage();
    document.getElementsByClassName("ImageLocation")[0].appendChild(image);
    image.classList.add('arrive');

    // Remove start buttons
    difficultyButtons.remove();

    // Set up inputs
    if (difficulty === "Easy"){
        for (let i = 0; i < 2; i++){
            inputButtons.push(document.createElement('button'));
            inputButtons[i].addEventListener("click", disableSelf);
        }
        document.getElementById("ChoiceOne").appendChild(inputButtons[0]);
        document.getElementById("ChoiceTwo").appendChild(inputButtons[1]);
    }
    else if (difficulty === "Normal"){
        for (let i = 0; i < 4; i++){
            inputButtons.push(document.createElement('button'));
            inputButtons[i].addEventListener("click", disableSelf);
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
        inputButtons[1].addEventListener("click", tryFormEntry);
        inputButtons[1].textContent = "GO";
        document.getElementById("ChoiceOne").appendChild(inputButtons[0]);
        document.getElementById("ChoiceTwo").appendChild(inputButtons[1]);

        // Focus in the input section upon starting hard mode
        inputButtons[0].focus();

        // Make the enter key activate the GO button
        document.addEventListener('keydown', onKeyDown);
    }

    setChoices();
}

// Resets everything to the way it was at the start
function onRestart(){
    // Reset images and used images
    image.remove();
    usedImages.splice(0, usedImages.length);

    // Place difficulty buttons back in
    document.getElementsByClassName("ImageLocation")[0].appendChild(difficultyButtons);

    // Remove inputs
    for (let inp of inputButtons){
        inp.remove();
        inp = null;
    }
    inputButtons.splice(0, inputButtons.length)

    // Remove self when done
    restartButton.remove();
}

// Input detection for hard difficulty
function onKeyDown(event){
    // Enter key attempts to test for a correct answer
    if (event.key === 'Enter' && !inputButtons[1].disabled){
        tryFormEntry();
    }
}

// Hard mode button uses the form enty to check for a correct answer
function tryFormEntry(){
    if (inputButtons[1].classList.contains('flashRed')){
        inputButtons[1].classList.remove('flashRed');
        void inputButtons[1].offsetWidth;
    }
    if (inputButtons[0].value.toLowerCase() === image.alt.toLowerCase()){
        correctChoiceChosen();
    }
    else{
        // Make the button flash red for a second
        inputButtons[1].classList.add('flashRed');
    }
}

// When a play button with the correct choice id is clicked
function correctChoiceChosen(){
    disableInputs(true);
    randomizeDepartAnimationVariables();
    image.classList.add('depart');
    let timeout = setTimeout(function(){
        generateAndSetNextImage();
        setChoices();
        disableInputs(false);
    }, 500);
}

// Image depart animation has variables that are to be randomized before the animation plays
function randomizeDepartAnimationVariables(){
    const selector = document.querySelectorAll('img');
    for (let elem of selector){
        const randDeg = Math.floor(Math.random() * 71) + 20 + 'deg';
        const randPx = Math.floor(Math.random() * 651) + 250 + 'px';
        elem.style.setProperty('--randDeg', randDeg);
        elem.style.setProperty('--randPx', randPx);
    }
}

// Disables a button after it is clicked
function disableSelf(){
    this.disabled = true;
}

// Disables all play inputs
function disableInputs(disable){
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

// Resets the input choices
function setChoices(){
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
    inputButtons[correctChoice].addEventListener("click", correctChoiceChosen, {once: true});

    // Set wrong choices with unused image names
    for (let i = 0; i < numChoices; i++){
        if (i !== correctChoice){
            let index = chooseUnusedImageIndex(usedNames);
            usedNames.push(index);
            inputButtons[i].textContent = playImages[index].alt;
            inputButtons[i].setAttribute('id', 'Incorrect');
        }
    }
}

// Returns the index of a random image in playImages that is not included in a list of given indeces
function chooseUnusedImageIndex(usedImgs){
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
