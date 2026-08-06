// playImages.js holds a critical variable that is used throughout this project and must be initialized by the file using it with the code below
let playImages;

// Await this function at the start of other js files that require playImages
async function getPlayImages(){
    const response = await fetch("/Olivia's_Picturebook/save");
    const { playImages: pi } = await response.json();
    playImages = pi;
}
