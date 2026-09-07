// Global variables
// This file borrows the playImages variable from the playImages file, and will not work properly without it included
// playImages

const imageLocation = document.querySelector('#imageUploadLabel');
const imageNameInput = document.querySelector('#AlbumPhotoNameInput');
const saveButton = new Button(saveUploadInfo, false, document.querySelector('#SaveButton'));

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

    // TEST GETTING IMAGE FROM LOCAL STORAGE
    const imgStrs = localStorage.getItem('images');
    const imgs = JSON.parse(imgStrs);
    image.src = imgs[0];
    console.log(imgs[0]);
    // END TEST

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

    // Change the local playImage container's value before passing it to the server
    image.alt = iName;
    // playImages.push({ src: defaultImage.src, alt: iName });

    // TESTING LOCAL UPLOAD
    const reader = new FileReader();
    reader.onload = function (e) {
        const imgStr = e.target.result;
        const imgArr = [imgStr];  // CHANGE THIS TO CONTINUE ADDING NEW IMAGES RATHER THAN REPLACING A SINGLE IMAGE
        localStorage.setItem('images', JSON.stringify(imgArr));
    }
    reader.readAsDataURL(imageBlob);
    // THIS IS AN EXAMPLE OF HOW TO ACCESS THE IMAGE ARRAY
    const imgStrs = localStorage.getItem('images');
    const imgs = JSON.parse(imgStrs);
    console.log(imgs);
    // END TESTS

    // Then post it to server
    const res = await fetch("/Olivia's_Picturebook/upload/save", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({playImages})
    });
    const jsonMessage = await res.json();
    console.log(jsonMessage.message);
}

function setAndDisplayImageAfterInput(e){
    imageBlob = e.target.files[0];
    image.src = URL.createObjectURL(e.target.files[0]);
    image.alt = "";
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

// Run the set up of the page
setUpUploadPage();
