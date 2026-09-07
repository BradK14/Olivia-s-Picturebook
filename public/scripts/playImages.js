// playImages.js holds a critical variable that is used throughout this project and must be initialized by the file using it with the code below
let playImages;

// Await this function at the start of other js files that require playImages
async function getPlayImages(){
    // Use play images from local storage
    const piJSON = localStorage.getItem('playImages');
    playImages = JSON.parse(piJSON);

    // Check if there are any play images in local storage
    let playImagesPresent = false;
    if (playImages){
        if (playImages.length > 0){
            playImagesPresent = true;
        }
    }

    // If there aren't any play images in local storage, download default images from the server
    if (!playImagesPresent){
        console.log('Play Images empty.  Filling in with default images.');
        const response = await fetch("/Olivia's_Picturebook/save");
        const { playImages: pi } = await response.json();
        playImages = pi;
    }
}

// {
//   "playImages": [
//     {
//       "src": "/images/PlayImages/Blueberry.png",
//       "alt": "Blueberry"
//     },
//     {
//       "src": "/images/PlayImages/Butterfly.png",
//       "alt": "Butterfly"
//     },
//     {
//       "src": "/images/PlayImages/Cat.png",
//       "alt": "Cat"
//     },
//     {
//       "src": "/images/PlayImages/Dog.png",
//       "alt": "Dog"
//     },
//     {
//       "src": "/images/PlayImages/Elephant.png",
//       "alt": "Elephant"
//     },
//     {
//       "src": "/images/PlayImages/Flower.png",
//       "alt": "Flower"
//     },
//     {
//       "src": "/images/PlayImages/IceCream.png",
//       "alt": "Ice Cream"
//     },
//     {
//       "src": "/images/PlayImages/Ladybug.png",
//       "alt": "Ladybug"
//     },
//     {
//       "src": "/images/PlayImages/Spider.png",
//       "alt": "Spider"
//     },
//     {
//       "src": "/images/PlayImages/Strawberry.png",
//       "alt": "Strawberry"
//     }
//   ]
// }
