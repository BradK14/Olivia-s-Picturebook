// Global variables
// This file borrows the playImages variable from the playImages file, and will not work properly without it included
// playImages

const imageLocation = document.querySelector('#imageUploadLabel');
const imageNameInput = document.querySelector('#AlbumPhotoNameInput');
const saveButton = new Button(saveUploadInfo, false, document.querySelector('#SaveButton'));

let defaultImage;
let image = document.createElement('img');
imageLocation.appendChild(image);

const imageFileInputter = document.querySelector('#imageUpload');

async function setUpUploadPage(){
    // First retrieve the list of play images
    await getPlayImages();

    // Find the existing image from the url query in the playImage database if there is one
    for (let playImage of playImages){
        if (window.defaultImage.toLowerCase() === playImage.alt.toLowerCase()){
            defaultImage = playImage;
        }
    }

    // If there wasn't a matching image, default to the upload new image image
    if (!defaultImage){
        defaultImage = {
            src: '/images/Upload.png',
            alt: 'Upload'
        }
    }

    // Create and set the image on the screen
    image.src = defaultImage.src;
    image.alt = defaultImage.alt;

    // Create and set text title at the bottom of the page
    imageNameInput.value = image.alt;

    // Set up events for the image input system
    imageFileInputter.addEventListener('change', setAndDisplayImageAfterInput);
}

async function saveUploadInfo(){
    // Capture and validate image information
    for (let f of imageFileInputter.files){
        console.log(f);
    }
    // console.log(imageFileInputter.files);
    const iName = imageNameInput.value;
    // Can't use the default upload image
    if (image.alt.toLowerCase() === 'upload'){
        console.log("NOT SAVED: No image given");
        return;
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
    // playImages.push({ src: defaultImage.src, alt: iName });

    // Then post it to server
    const res = await fetch("/Olivia's_Picturebook/upload/save", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({playImages})
    });
    const jsonMessage = await res.json();
    console.log(jsonMessage);
}

function setAndDisplayImageAfterInput(e){
    const imageURL = URL.createObjectURL(e.target.files[0]);
    console.log(imageURL);
    image.src = imageURL;
}

// Run the set up of the page
setUpUploadPage();
