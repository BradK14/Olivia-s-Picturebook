// Global variables
// This file uses the playImages variable from the playImages file, and will not work properly without it
// playImages
const IMGWIDTH = 300;
const IMGHEIGHT = 300;

// Generate images over time
setInterval(() => {
    // Create new image
    let playImage = playImages[Math.floor(Math.random() * playImages.length)];
    let image = document.createElement('img');
    image.src = playImage.src;
    image.alt = playImage.alt;
    image.width = IMGWIDTH;
    image.height = IMGHEIGHT;

    // Set image, animate it, then remove it after a period of time
    document.body.appendChild(image);
    setInterval(() => {
        image.remove();
        image = null;
    }, 1000);
}, 1000);