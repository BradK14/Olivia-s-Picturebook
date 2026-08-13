// Global variables
// This file uses the playImages variable from the playImages file, and will not work properly without it
// playImages

// Image dimensions
const IMG_WIDTH = 15;  // This is taken directly from the styles file, if it is changed there it must be changed here too

let backgroundImageLoopInterval;

// Functions
// This runs the file, first awaiting initialization of playImages from saved file
async function runBackgroundImages(){
    // Initialize the play images
    await getPlayImages();
    // Begin the background image loop
    backgroundImageLoopInterval = startGeneratingBackgroundImageLoop();
}

// Generate images over time
function startGeneratingBackgroundImageLoop(){
    const interval = setInterval(() => {
        // Create new image
        let playImage = playImages[Math.floor(Math.random() * playImages.length)];
        let image = document.createElement('img');
        image.src = playImage.src;
        image.alt = playImage.alt;
        image.classList.add('backgroundImage');
        image.addEventListener('mousedown', onBackgroundImageClick);

        // Randomize its horizontal position at the top of the screen
        const randPx = Math.floor(Math.random() * (100 - IMG_WIDTH + 1)) + 'vw';
        image.style.setProperty('--posX', randPx);

        // Randomize how much it will rotate, and in which direction
        const isNegTrue = Math.floor(Math.random() * 2);
        let randNeg;
        if (isNegTrue){
            randNeg = -1;
        }
        else{
            randNeg = 1;
        }
        const randDeg = (Math.floor(Math.random() * (360 * 3 + 1)) * randNeg) + 'deg';
        image.style.setProperty('--randDeg', randDeg);

        // Set image, animate it, then remove it after a period of time
        document.body.appendChild(image);
        image.addEventListener('animationend', () => {
            image.remove();
            image = null;
        });
    }, 1000);

    return interval;
}

// Activate an animation when clicking on a background image
function onBackgroundImageClick(){
    const rect = this.getBoundingClientRect();
    const imgCenterY = rect.top + (rect.bottom - rect.top) / 2;
    const imgCenterX = rect.left + (rect.right - rect.left) / 2;
    this.style.setProperty('--posY', (imgCenterY - this.offsetHeight / 2) / window.innerHeight * 100 + 'vh');
    this.classList.add('backgroundImgClicked');
    this.removeEventListener('mousedown', onBackgroundImageClick);

    // Set up positioning for and create text to accompany this animation
    let x = imgCenterX;
    let y = imgCenterY;
    if (y >= window.innerHeight){
        y -= this.offsetHeight / 2;
    }
    else if (y <= 0){
        y += this.offsetHeight / 2;
    }

    displayBackgroundImageTextAnimation(this.alt, x, y);
}

// Create and display text to accompany a background image
function displayBackgroundImageTextAnimation(text, x, y){
    let imgName = document.createElement('p');
    imgName.classList.add('backgroundImgText');
    imgName.textContent = text;
    imgName.style.setProperty('--posX', x / window.innerWidth * 100 + 'vw');
    imgName.style.setProperty('--posY', y / window.innerHeight * 100 + 'vh');

    document.body.appendChild(imgName);
    imgName.addEventListener('animationend', () => {
        imgName.remove();
        imgName = null;
    });
}

// Check if the page is open
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden'){
        clearInterval(backgroundImageLoopInterval);
    }
    else{
        backgroundImageLoopInterval = startGeneratingBackgroundImageLoop();
    }
});

// This begins all the processes defined above
runBackgroundImages();
