// playImages.js holds a critical variable that is used throughout this project and must be initialized by the file using it with the code below
let playImages;

// Await this function at the start of other js files that require playImages
async function getPlayImages(){
    // Use play images from local storage
    const piJSON = localStorage.getItem('playImages');
    if (!piJSON){
        playImages = [];
    }
    else{
        playImages = JSON.parse(piJSON);
    }
}
