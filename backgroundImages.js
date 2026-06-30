// Global variables
// This file uses the playImages variable from the playImages file, and will not work properly without it
// playImages

// Image dimensions
const IMG_WIDTH = 300;
const IMG_HEIGHT = IMG_WIDTH;

// Generate images over time
setInterval(() => {
    // Create new image
    let playImage = playImages[Math.floor(Math.random() * playImages.length)];
    let image = document.createElement('img');
    image.src = playImage.src;
    image.alt = playImage.alt;
    image.width = IMG_WIDTH;
    image.height = IMG_HEIGHT;
    image.classList.add('backgroundImage');

    // Randomize its horizontal position at the top of the screen
    const randPx = Math.floor(Math.random() * (window.innerWidth - IMG_WIDTH + 1)) + 'px';
    image.style.setProperty('--randPx', randPx);

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
    setTimeout(() => {
        image.remove();
        image = null;
    }, 5000);
}, 1000);
