// Global variables
// This file borrows the playImages variable from the playImages file, and will not work properly without it included
// playImages

// Set up for difficulty buttons
const difficultyButtonContainer = document.getElementById("difficultyButtons");
const difficultyButtons = [];

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

const imageMoveVars = {};

// Functions
// Initial set up for the page, required before using anything on it
async function setUpPlay(){
    // First get the play images
    await getPlayImages();

    // Then attach the functions to the difficulty buttons
    for (const element of difficultyButtonContainer.children){
        difficultyButtons.push(new Button(startGame, false, element));
    }

    // If there are less than four play images, disable the start game buttons
    if (playImages.length < 4) {
        difficultyButtons.forEach((e) => {
            e.setDisabled(true);
        });

        // Display message stating the need for 4 or more play images
        const message = document.createElement('p');
        message.textContent = "Must have at least 4 images to play";
        document.querySelector('.InputLocation').appendChild(message);
    }

    // These are to be used with image movement functions
    document.addEventListener('pointermove', dragImage);
    document.addEventListener('pointerup', stopImageDrag);
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

    // Set movement functions
    setImageMoveFunctions(playImage);
    
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
function startGame(e){
    // Append the restart button to the screen
    document.getElementsByClassName("BackButtonLocation")[0].appendChild(restartButton.button);

    // Set difficulty based on which button was pressed
    if (e.target.id === "easyButton"){
        difficulty = "Easy";
    }
    else if (e.target.id === "normalButton"){
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
    for (let element of difficultyButtons){
        element.reset();
    }
    difficultyButtonContainer.remove();

    // Set up inputs
    if (difficulty === 'Hard') {
        inputButtons.push(document.createElement('input'));
        inputButtons[0].spellcheck = 'false';
        inputButtons.push(new Button(tryFormEntry, "GO"));
        inputButtons[1].button.setAttribute('id', 'Correct');
        document.getElementById("ChoiceOne").appendChild(inputButtons[0]);
        document.getElementById("ChoiceTwo").appendChild(inputButtons[1].button);

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
            inputButtons.push(new Button(disableSelf));
        }

        // Assign buttons to their appropriate locations
        document.getElementById("ChoiceOne").appendChild(inputButtons[0].button);
        document.getElementById("ChoiceTwo").appendChild(inputButtons[1].button);
        if (difficulty === 'Normal'){
            document.getElementById("ChoiceThree").appendChild(inputButtons[2].button);
            document.getElementById("ChoiceFour").appendChild(inputButtons[3].button);
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
    document.getElementsByClassName("ImageLocation")[0].appendChild(difficultyButtonContainer);

    // Remove inputs
    for (let inp of inputButtons){
        if (inp.tagName === 'INPUT'){
            inp.remove();
            inp = null;
        }
        else{
            inp.remove();
            inp = null;
        }
        
    }
    inputButtons.splice(0, inputButtons.length)

    // Remove self when done
    restartButton.remove();
}

// Input detection for hard difficulty
function onKeyDown(event){
    // Enter key attempts to test for a correct answer
    if (event.key === 'Enter' && !inputButtons[1].button.disabled){
        tryFormEntry();
    }
}

// Hard mode button uses the form enty to check for a correct answer
function tryFormEntry(){
    if (inputButtons[1].button.classList.contains('flashRed')){
        inputButtons[1].button.classList.remove('flashRed');
        void inputButtons[1].button.offsetWidth;
    }
    if (inputButtons[0].value.toLowerCase() === image.alt.toLowerCase()){
        correctChoiceChosen();
    }
    else{
        // Make the button flash red for a second
        inputButtons[1].button.classList.add('flashRed');
    }
}

// When a play button with the correct choice id is clicked
function correctChoiceChosen(){
    disableInputs(true);
    randomizeDepartAnimationVariables();
    image.classList.remove('returnToPosition');
    void image.offsetHeight;
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
function disableSelf(e){
    e.target.disabled = true;
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
        if (inputButtons[i].tagName === "INPUT"){
            inputButtons[i].disabled = disable;
        }
        else{
            inputButtons[i].button.disabled = disable;
        }
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
    inputButtons[correctChoice].button.setAttribute('id', 'Correct');
    inputButtons[correctChoice].button.textContent = image.alt;
    inputButtons[correctChoice].addNewEvent('pointerup', correctChoiceChosen, {once: true});

    // Set wrong choices with unused image names
    for (let i = 0; i < numChoices; i++){
        if (i !== correctChoice){
            let index = chooseUnusedImageIndex(usedNames);
            usedNames.push(index);
            inputButtons[i].button.textContent = playImages[index].alt;
            inputButtons[i].button.setAttribute('id', 'Incorrect');
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

// Image move functions
function setImageMoveFunctions(playImage){
    // Set initial variables for moving the image on the screen
    imageMoveVars.moving = false;
    imageMoveVars.pointerX = 0;
    imageMoveVars.pointerY = 0;
    imageMoveVars.prevX = 0;
    imageMoveVars.prevY = 0;
    imageMoveVars.moveDist = 0;
    imageMoveVars.distFromCenter = 0;
    imageMoveVars.startingAngle = 0;
    imageMoveVars.prevAngle = 0;
    imageMoveVars.rotationSpeed = 0;

    // Set the image drag move functions
    playImage.addEventListener('pointerdown', beginImageDrag);
}

function beginImageDrag(e){
    // Set and reset initial values
    image.classList.remove('arrive');
    imageMoveVars.moving = true;
    imageMoveVars.pointerX = e.clientX;
    imageMoveVars.pointerY = e.clientY;
    imageMoveVars.prevX = e.clientX;
    imageMoveVars.prevY = e.clientY;
    imageMoveVars.moveDist = 0;
    imageMoveVars.prevAngle = 0;
    image.classList.remove('returnToPosition');
    image.style.transform = `translate(0px, 0px)`;

    // Determine length from clicked point to center of image to use for rotation calculation
    const rect = image.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Calculate the hypotenuse between selected point and center of image
    let distX = e.clientX - centerX;
    let distY = e.clientY - centerY;
    const radians = Math.atan2(distY, distX);  // Find the radians for the initial angle
    distX *= distX;
    distY *= distY;
    let dist = 0;
    dist += distX < 0 ? distX * -1 : distX;
    dist += distY < 0 ? distY * -1 : distY;
    //Calculate max distance by calculating the hypotenuse to the top left corner of the image
    let maxDistX = centerX - rect.left;
    let maxDistY = centerY - rect.top;
    maxDistX *= maxDistX;
    maxDistY *= maxDistY;
    const maxDist = Math.sqrt(maxDistX + maxDistY);

    // Set grab distance from center of the image
    imageMoveVars.distFromCenter = Math.sqrt(dist);

    // Set max distance pointer can be from center
    imageMoveVars.rotationSpeed = (1 - (imageMoveVars.distFromCenter / maxDist)) * 0.09;
    
    // Set starting angle
    imageMoveVars.startingAngle = radians * (180 / Math.PI);

    // Set pivot point
    image.style.transformOrigin = `${e.clientX - rect.left}px ${e.clientY - rect.top}px`;
}

function dragImage(e){
    if (imageMoveVars.moving && image){
        // Pivot point location calculation
        const xMove = e.clientX - imageMoveVars.pointerX;
        const yMove = e.clientY - imageMoveVars.pointerY;

        // Save total distance moved
        const deltaX = imageMoveVars.prevX - e.clientX;
        const deltaY = imageMoveVars.prevY - e.clientY;
        imageMoveVars.moveDist += deltaX < 0 ? deltaX * -1 : deltaX;
        imageMoveVars.moveDist += deltaY < 0 ? deltaY * -1 : deltaY;

        // Math to determine rotation
        const radians = Math.atan2(deltaY, deltaX);
        let degrees = radians * (180 / Math.PI);
        degrees = degrees - imageMoveVars.startingAngle + 180;
        degrees -= degrees > 360 ? 360 : 0;
        degrees -= degrees > 180 ? 360 : 0;
        let difference = degrees - imageMoveVars.prevAngle;
        difference = ((difference + 180) % 360 + 360) % 360 - 180;
        let newAngle = difference * imageMoveVars.rotationSpeed + imageMoveVars.prevAngle;
        newAngle -= newAngle > 180 ? 360 : 0;
        newAngle += newAngle < -180 ? 360 : 0;
        // Apply movement and rotation
        image.style.transform = `translate(${xMove}px, ${yMove}px) rotate(${newAngle}deg)`;

        // Update positional variables
        imageMoveVars.prevX = e.clientX;
        imageMoveVars.prevY = e.clientY;
        imageMoveVars.prevAngle = newAngle;
    }
}

function stopImageDrag(e){
    if (image){
        if (!image.classList.contains('arrive')){
            imageMoveVars.moving = false;
            image.classList.add('returnToPosition');
        }
    }
}

// Run the initialization to enable use of this page
setUpPlay();
