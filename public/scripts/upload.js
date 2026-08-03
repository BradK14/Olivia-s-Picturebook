// Global variables
// This file borrows the playImages variable from the playImages file, and will not work properly without it included
// playImages

// Image dimensions
const IMG_WIDTH = 592;
const IMG_HEIGHT = IMG_WIDTH;

const imageLocation = document.querySelector('.ImageLocation');
const imageNameInput = document.querySelector('#AlbumPhotoNameInput');
const saveButton = document.querySelector('#SaveButton');

let uploadImage;

function setUpUploadPage(){
    // Find the existing image from the url query in the playImage database if there is one
    for (let playImage of playImages){
        if (window.uploadImage.toLowerCase() === playImage.alt.toLowerCase()){
            uploadImage = playImage;
        }
    }

    // If there wasn't a matching image, default to the upload new image image
    if (!uploadImage){
        uploadImage = {
            src: '/images/Upload.png',
            alt: 'Upload'
        }
    }

    // Create and set the image on the screen
    const image = document.createElement('img');
    image.src = uploadImage.src;
    image.alt = uploadImage.alt;
    image.width = IMG_WIDTH;
    image.height = IMG_HEIGHT;
    imageLocation.appendChild(image);

    // Create and set text title at the bottom of the page
    imageNameInput.value = image.alt;

    // Set up save button
    saveButton.addEventListener('click', saveUploadInfo);
}

async function saveUploadInfo(){
    const res = await fetch("/Olivia's_Picturebook/upload/save");
    console.log(res);
    const jsonMessage = await res.json();
    console.log(jsonMessage);
}

setUpUploadPage();
