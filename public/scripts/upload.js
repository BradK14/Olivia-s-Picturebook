// Global variables
// This file borrows the playImages variable from the playImages file, and will not work properly without it included
// playImages

const imageLocation = document.querySelector('.ImageLocation');
const imageNameInput = document.querySelector('#AlbumPhotoNameInput');
const saveButton = document.querySelector('#SaveButton');

let uploadImage;

async function setUpUploadPage(){
    // First retrieve the list of play images
    await getPlayImages();

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
    imageLocation.appendChild(image);

    // Create and set text title at the bottom of the page
    imageNameInput.value = image.alt;

    // Set up save button
    saveButton.addEventListener('pointerup', saveUploadInfo);
    saveButton.addEventListener('pointerenter', hoverButton);
    saveButton.addEventListener('pointerleave', stopHoveringButton);
}

async function saveUploadInfo(){
    const res = await fetch("/Olivia's_Picturebook/upload/save", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({message: 'Save test'})
        });
    const jsonMessage = await res.json();
    console.log(jsonMessage);
}

function hoverButton(){
    this.style.color = 'rgb(127, 127, 255)';
}

function stopHoveringButton(){
    this.style.color = 'rgb(191, 191, 255)';
}

// Run the set up of the page
setUpUploadPage();
