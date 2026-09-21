// playImages.js holds a critical variable that is used throughout this project and must be initialized by the file using it with the code below
let playImages;

// Await this function at the start of other js files that require playImages
async function getPlayImages(){
    // Use play images from local storage
    const piJSON = localStorage.getItem('playImages');
    if (!piJSON){
        // If this is the first time opening Olivia's Picturebook, populate playImages local variable with default images from the server
        const response = await fetch("/Olivia's_Picturebook/save");
        const { playImages: pi } = await response.json();
        playImages = pi;
        localStorage.setItem('playImages', JSON.stringify(playImages));
    }
    else{
        playImages = JSON.parse(piJSON);
    }
}
