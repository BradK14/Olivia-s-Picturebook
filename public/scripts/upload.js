// Global variables
// This file borrows the playImages variable from the playImages file, and will not work properly without it included
// playImages

const imageLocation = document.querySelector('#imageUploadLabel');
const imageNameInput = document.querySelector('#AlbumPhotoNameInput');
const saveButton = new Button(saveUploadInfo, false, document.querySelector('#SaveButton'));
saveButton.setDisabled(true);
const deleteButton = new Button(deleteImageAndReturnToAlbum, false, document.querySelector('#DeleteButton'));
deleteButton.setDisabled(true);

let defaultImage;
let image = document.createElement('img');
imageLocation.appendChild(image);
let imageBlob;

const imageFileInputter = document.querySelector('#imageUpload');

async function setUpUploadPage(){
    // First retrieve the list of play images
    await getPlayImages();

    // Find the existing image from the url query in the playImage database if there is one
    for (let playImage of playImages){
        if (window.defaultImage.toLowerCase() === playImage.alt.toLowerCase()){
            defaultImage = playImage;
            deleteButton.setDisabled(false);
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

    // Event for dragging and dropping an image file into the label
    imageLocation.addEventListener('drop', (e) => {e.preventDefault()});
    imageLocation.addEventListener('dragover', (e) => {e.preventDefault()});
    imageLocation.addEventListener('drop', dropImageIn);
}

async function saveUploadInfo(){
    // Capture and validate image information
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

    // Add the image to the local variable and return to the album
    const reader = new FileReader();
    reader.onload = function (e) {
        const imgStr = e.target.result;
        playImages.push({src: imgStr, alt: iName});
        localStorage.setItem('playImages', JSON.stringify(playImages));
    }
    reader.readAsDataURL(imageBlob);
    window.location.href = "/Olivia's_Picturebook/photo_album";
}

function setAndDisplayImageAfterInput(e){
    imageBlob = e.target.files[0];
    image.src = URL.createObjectURL(e.target.files[0]);
    image.alt = "";
    deleteButton.setDisabled(true);
    saveButton.setDisabled(false);
}

function dropImageIn(e){
    // Receive and validate files
    const files = e.dataTransfer.files;
    if(files.length !== 1){
        console.log("Only one image can be given");
        return;
    }

    // Set up and trigger the file input change event
    imageFileInputter.files = files;
    imageFileInputter.dispatchEvent(new Event('change'));
}

// Deletes the image if it is in the album, and returns to the photo album screen
function deleteImageAndReturnToAlbum(){
    // Attempt to remove the current image from the playImages array
    let deleteSuccessful = false;
    for (let i = 0; i < playImages.length; i++){
        if (image.alt === playImages[i].alt){
            playImages.splice(i, 1);
            deleteSuccessful = true;
            break;
        }
    }

    // After successful deletion, reset the playImages in local storage and return to photo album
    if (deleteSuccessful){
        localStorage.setItem('playImages', JSON.stringify(playImages));
        window.location.href = "/Olivia's_Picturebook/photo_album";
    }
}

// Run the set up of the page
setUpUploadPage();
