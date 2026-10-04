// Global variables
// This file borrows the playImages variable from the playImages file, and will not work properly without it included
// playImages

const imageUploadLabel = document.querySelector('#imageUploadLabel');
const imageNameInput = document.querySelector('#AlbumPhotoNameInput');
const saveButton = new Button(saveUploadInfo, false, document.querySelector('#SaveButton'));
saveButton.setDisabled(true);
const deleteButton = new Button(deleteImageAndReturnToAlbum, false, document.querySelector('#DeleteButton'));
deleteButton.setDisabled(true);

let defaultImage;
let image = document.createElement('img');
imageUploadLabel.appendChild(image);
let imageBlob;
const imageMoveVars = {};

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

    // Set initial variables for moving the image on the screen
    imageMoveVars.moving = false;
    imageMoveVars.pointerX = 0;
    imageMoveVars.pointerY = 0;
    imageMoveVars.prevX = 0;
    imageMoveVars.prevY = 0;
    imageMoveVars.moveDist = 0;
    imageMoveVars.distFromCenter = 0;
    imageMoveVars.startingAngle = 0;
    imageMoveVars.prevAngle = 0;

    // Set the image drag move functions
    imageUploadLabel.addEventListener('pointerdown', beginImageDrag);
    document.addEventListener('pointermove', dragImage);
    document.addEventListener('pointerup', stopImageDrag);

    // Create and set text title at the bottom of the page
    imageNameInput.value = image.alt;

    // Set up events for the image input system
    imageFileInputter.addEventListener('change', setAndDisplayImageAfterInput);

    // Event for dragging and dropping an image file into the label
    imageUploadLabel.addEventListener('drop', (e) => {e.preventDefault()});
    imageUploadLabel.addEventListener('dragover', (e) => {e.preventDefault()});
    imageUploadLabel.addEventListener('drop', dropImageIn);
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
        showInvalidNameInput();
        return;
    }
    // Can't use a pre-existing name
    for (let pi of playImages){
        if (iName.toLowerCase() === pi.alt.toLowerCase()){
            console.log("NOT SAVED: This image name is already in use");
            showInvalidNameInput();
            return;
        }
    }
    // Can't use an empty string or all space characters as a name
    let valid = false;
    for (let char of iName){
        if (char !== ' '){
            valid = true;
            break;
        }
    }
    if (!valid){
        console.log("NOT SAVED: No image name given");
        showInvalidNameInput();
        return;
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

async function setAndDisplayImageAfterInput(e){
    imageBlob = await cropImageToSquare(URL.createObjectURL(e.target.files[0]));
    image.src = URL.createObjectURL(imageBlob);
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

function showInvalidNameInput(){
    if (imageNameInput.classList.contains('flashRed')){
        imageNameInput.classList.remove('flashRed');
        void imageNameInput.offsetWidth;
    }

    imageNameInput.classList.add('flashRed');
}

function cropImageToSquare(imgSrc){
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            // Get the shortest side of the image
            const sideLength = Math.min(img.width, img.height);
            let sideX = 0;
            let sideY = 0;
            if (img.width > img.height){
                sideX = (img.width - img.height) / 2;
            }
            else{
                sideY = (img.height - img.width) / 2;
            }

            // Set up a canvas object
            const canvas = document.createElement('canvas');
            canvas.width = sideLength;
            canvas.height = sideLength;
            const context = canvas.getContext('2d');

            // Draw the image with the new cropped dimensions
            context.drawImage(img, sideX, sideY, sideLength, sideLength, 0, 0, sideLength, sideLength);

            // Return the canvas image blob
            canvas.toBlob((blob) => { resolve(blob) }, 'image/jpeg');
        };

        image.onerror = () => {
            reject(new Error("Failed to crop image"));
        };
    });
}

// Image move functions
function beginImageDrag(e){
    // Set and reset initial values
    imageFileInputter.disabled = false;  // Allow regular clicks
    imageMoveVars.moving = true;
    imageMoveVars.pointerX = e.clientX;
    imageMoveVars.pointerY = e.clientY;
    imageMoveVars.prevX = e.clientX;
    imageMoveVars.prevY = e.clientY;
    imageMoveVars.moveDist = 0;
    imageUploadLabel.classList.remove('returnToPosition');
    imageUploadLabel.style.transform = `translate(0px, 0px)`;
    // imageUploadLabel.setPointerCapture(e.pointerId);

    // Determine length from clicked point to center of image to use for rotation calculation
    const rect = image.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Calculate the hypotenuse between selected point and center of image
    let distX = e.clientX - centerX;
    let distY = e.clientY - centerY;
    const radians = Math.atan2(distY, distX);  // Find the radians for the initial angle
    distX *= distX;
    distY *= distY;
    let dist = 0;
    dist += distX < 0 ? distX * -1 : distX;
    dist += distY < 0 ? distY * -1 : distY;

    // Set grab distance from center of the image
    imageMoveVars.distFromCenter = Math.sqrt(dist);

    // Set starting angle
    imageMoveVars.startingAngle = radians * (180 / Math.PI);
    imageMoveVars.prevAngle = imageMoveVars.startingAngle;

    // Set pivot point
    imageUploadLabel.style.transformOrigin = `${e.clientX - rect.left}px ${e.clientY - rect.top}px`;
}

function dragImage(e){
    if (imageMoveVars.moving){
        // Pivot point location calculation
        const xMove = e.clientX - imageMoveVars.pointerX;
        const yMove = e.clientY - imageMoveVars.pointerY;

        // Save total distance moved
        const deltaX = imageMoveVars.prevX - e.clientX;
        const deltaY = imageMoveVars.prevY - e.clientY;
        imageMoveVars.moveDist += deltaX < 0 ? deltaX * -1 : deltaX;
        imageMoveVars.moveDist += deltaY < 0 ? deltaY * -1 : deltaY;

        // Use total distance moved to determine if it is ready to disable the file inputter
        if (imageMoveVars.moveDist > 5){
            imageFileInputter.disabled = true;  // If the image has been dragged away intentionally do not allow input
        }

        // Math to determine rotation
        const radians = Math.atan2(deltaY, deltaX);
        let degrees = radians * (180 / Math.PI);
        degrees = degrees - imageMoveVars.startingAngle + 180;
        degrees -= degrees > 360 ? 360 : 0;
        degrees -= degrees > 180 ? 360 : 0;
        let difference = degrees - imageMoveVars.prevAngle;
        difference = ((difference + 180) % 360 + 360) % 360 - 180;
        let newAngle = difference * 0.01 + imageMoveVars.prevAngle;
        newAngle -= newAngle > 180 ? 360 : 0;
        newAngle += newAngle < -180 ? 360 : 0;
        // Apply movement and rotation
        imageUploadLabel.style.transform = `translate(${xMove}px, ${yMove}px) rotate(${newAngle}deg)`;

        // Update positional variables
        imageMoveVars.prevX = e.clientX;
        imageMoveVars.prevY = e.clientY;
        imageMoveVars.prevAngle = newAngle;
    }
}

function stopImageDrag(e){
    imageMoveVars.moving = false;
    imageUploadLabel.classList.add('returnToPosition');
}

// Run the set up of the page
setUpUploadPage();
