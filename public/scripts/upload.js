// Global variables
// This file borrows the playImages variable from the playImages file, and will not work properly without it included
// playImages

const imageLocation = document.querySelector('.ImageLocation');
const imageNameInput = document.querySelector('#AlbumPhotoNameInput');
const saveButton = new Button(saveUploadInfo, false, document.querySelector('#SaveButton'));

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
}

async function saveUploadInfo(){
    // Capture and validate image information
    const iName = imageNameInput.value;
    // Can't use the default upload image
    if (uploadImage.alt.toLowerCase() === 'upload'){
        console.log("NOT SAVED: No image given");
    }
    // Can't use the name upload
    if (iName.toLowerCase() === 'upload'){
        console.log("NOT SAVED: Can not use upload as the image's name");
        return;
    }
    // Can't use a pre-existing name
    for (let pi of playImages){
        if (iName.toLowerCase() === pi.alt.toLowerCase()){
            console.log("NOT SAVED: This image name is already in use");
            return;
        }
    }

    // Change the local playImage container's value before passing it to the server
    // playImages.push({ src: uploadImage.src, alt: iName });

    // Then post it to server
    const res = await fetch("/Olivia's_Picturebook/upload/save", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({playImages})
    });
    const jsonMessage = await res.json();
    console.log(jsonMessage);

}

// Run the set up of the page
setUpUploadPage();
