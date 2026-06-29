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
    const randPx = Math.floor(Math.random() * (window.innerWidth - IMG_WIDTH)) + 'px';
    image.style.setProperty('--randPx', randPx);

    // Set image, animate it, then remove it after a period of time
    document.body.appendChild(image);
    setTimeout(() => {
        image.remove();
        image = null;
    }, 5000);
}, 1000);
