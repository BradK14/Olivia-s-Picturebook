// Global variables
// This file borrows the playImages variable from the playImages file, and will not work properly without it included
// playImages

// Set up for difficulty buttons
const difficultyButtons = document.getElementById("difficultyButtons");

// This holds the current shown image
let image;

// This timeout is for generating the next image after a delay.  It must be cancelled early when restarting the game
let nextImageTimeout;

// This keeps track of the various input buttons, it will have different elements based on difficulty chosen
const inputButtons = [];

// The currently chosen difficulty
let difficulty;

// Restart button set up before it is needed
const restartButton = new Button(onRestart, "Restart");

// A list of indeces for images that have recently been used
const usedImages = [];

// Functions
// Initial set up for the page, required before using anything on it
async function setUpPlay(){
    // First get the play images
    await getPlayImages();

    // Then attach the functions to the difficulty buttons
    for (let element of difficultyButtons.children){
        element.addEventListener('pointerup', startGame);
        element.addEventListener('pointerenter', hoverButton);
        element.addEventListener('pointerleave', stopHoveringButton);
        element.addEventListener('pointercancel', stopHoveringButton);
    }
}

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
    document.getElementsByClassName("BackButtonLocation")[0].appendChild(restartButton.button);

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
    for (let element of difficultyButtons.children){
        element.classList.remove('hovering');
    }
    difficultyButtons.remove();

    // Set up inputs
    if (difficulty === 'Hard') {
        inputButtons.push(document.createElement('input'));
        inputButtons.push(document.createElement('button'));
        inputButtons[0].spellcheck = 'false';
        inputButtons[1].setAttribute('id', 'Correct');
        inputButtons[1].addEventListener('pointerup', tryFormEntry);
        inputButtons[1].addEventListener('pointerenter', hoverButton);
        inputButtons[1].addEventListener('pointerleave', stopHoveringButton);
        inputButtons[1].addEventListener('pointercancel', stopHoveringButton);
        inputButtons[1].textContent = "GO";
        document.getElementById("ChoiceOne").appendChild(inputButtons[0]);
        document.getElementById("ChoiceTwo").appendChild(inputButtons[1]);

        // Focus in the input section upon starting hard mode
        inputButtons[0].focus();

        // Make the enter key activate the GO button
        document.addEventListener('keydown', onKeyDown);
    }
    else {  // Easy or Normal
        // Set the number of buttons based on difficulty
        let numButtons = difficulty === 'Easy' ? 2 : 4;

        // Set up button functionality
        for (let i = 0; i < numButtons; i++){
            inputButtons.push(document.createElement('button'));
            inputButtons[i].addEventListener('pointerup', disableSelf);
            inputButtons[i].addEventListener('pointerenter', hoverButton);
            inputButtons[i].addEventListener('pointerleave', stopHoveringButton);
            inputButtons[i].addEventListener('pointercancel', stopHoveringButton);
        }

        // Assign buttons to their appropriate locations
        document.getElementById("ChoiceOne").appendChild(inputButtons[0]);
        document.getElementById("ChoiceTwo").appendChild(inputButtons[1]);
        if (difficulty === 'Normal'){
            document.getElementById("ChoiceThree").appendChild(inputButtons[2]);
            document.getElementById("ChoiceFour").appendChild(inputButtons[3]);
        }
    }

    setChoices();
}

// Resets everything to the way it was at the start
function onRestart(){
    // Reset images and used images
    image.remove();
    usedImages.splice(0, usedImages.length);

    // If resetting mid image change, it causes another image to generate outside of the game.  So clear the timeout manually.
    if (nextImageTimeout){
        clearTimeout(nextImageTimeout);
        disableInputs(false);
    }

    // Place difficulty buttons back in
    document.getElementsByClassName("ImageLocation")[0].appendChild(difficultyButtons);

    // Remove inputs
    for (let inp of inputButtons){
        inp.remove();
        inp = null;
    }
    inputButtons.splice(0, inputButtons.length)

    // Remove self when done
    restartButton.disable();
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
    nextImageTimeout = setTimeout(function(){
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
        const randDist = Math.floor(Math.random() * 31) + 20 + 'vw';
        elem.style.setProperty('--randDeg', randDeg);
        elem.style.setProperty('--randDist', randDist);
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
    inputButtons[correctChoice].addEventListener('pointerup', correctChoiceChosen, {once: true});

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

// Button hovering effects for mobile
function hoverButton(){
    this.classList.add('hovering');
    this.style.setProperty('--color', 'rgb(127, 127, 255)');
}

function stopHoveringButton(){
    this.classList.remove('hovering');
    this.style.setProperty('--color', 'rgb(191, 191, 255)');
}

// Run the initialization to enable use of this page
setUpPlay();
