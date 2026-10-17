// This file holds functionality for the photo album page
// This file relies on the playImages variable from the playImages file

// Global variables
const deleteButton1Base = document.querySelector('#albumDeleteButton1');
const deleteButton1 = new Button(toggleDeleteMode, deleteButton1Base.textContent, deleteButton1Base);
const deleteButton2Base = document.querySelector('#albumDeleteButton2');
const deleteButton2 = new Button(deleteSelectedImages, deleteButton2Base.textContent, deleteButton2Base);

let deleteModeToggle = false;

// Functions
// Function to initialize the page
async function initializePhotoAlbum(){
    // Initialize the playImages
    await getPlayImages();

    // Fill the photo album with the retrieved saved images
    fillPhotoAlbumWithPlayImages();
}

function createAlbumPhoto(playImage){
    // Create the div to contain everything
    const div = document.createElement('div');
    div.classList.add('AlbumPhoto');

    // Create the image
    const image = document.createElement('img');

    // Create the button for the image
    let button;

    // Create the paragraph to give the image's name
    const p = document.createElement('p');

    // Apply the given variables values to the photo
    if (playImage === 'Upload'){
        // Set up image
        image.src = '/images/Upload.png';
        image.alt = 'Upload';

        // Set up button and attach the image to it
        button = new Button(() => {
            if (!deleteModeToggle){
                window.location.href = "/Olivia's_Picturebook/upload";
            }
        });

        // Set the paragraph's text with the name of the image
        p.textContent = image.alt;
    }
    else if (playImage === 'Download'){
        // Set up image
        image.src = '/images/Upload.png';
        image.alt = 'Download';

        // Set up button and attach the image to it
        button = new Button(async () => {
            if (!deleteModeToggle){
                const response = await fetch("/Olivia's_Picturebook/save");
            const { playImages: pi } = await response.json();
            pi.forEach((e) => {
                playImages.push(e);
            });
            localStorage.setItem('playImages', JSON.stringify(playImages));
            fillPhotoAlbumWithPlayImages();
            }
        });

        // Set the paragraph's text with the name of the image
        p.textContent = 'Download Default Images';
    }
    else {  // An actual play image
        // Set up image
        image.src = playImage.src;
        image.alt = playImage.alt;

        // Set up button and attach the image to it
        button = new Button(() => {
            if (!deleteModeToggle){
                window.location.href = `/Olivia's_Picturebook/upload?playImage=${image.alt}`;
            }
            else {
                if (!playImage.deleteThis){
                    playImage.deleteThis = true;
                    image.src = '/images/Red_X.png'
                }
                else {
                    playImage.deleteThis = false;
                    image.src = playImage.src;
                }
            }
        });

        // Set the paragraph's text with the name of the image
        p.textContent = image.alt;
    }

    // Apply the button
    button.button.appendChild(image);
    div.appendChild(button.button);
    
    // Give the image a random rotation
    const randomRotation = Math.floor(Math.random() * 51) - 25;
    image.style.transform = `rotate(${randomRotation}deg)`;

    // Apply the text underneath the image
    div.appendChild(p);

    // Return the div
    return div;
}

// Function to fill the photo album section with all current play images
function fillPhotoAlbumWithPlayImages(){
    const photoAlbumLocation = document.querySelector('.PhotoAlbumLocation');

    // First remove any existing photos in the album
    photoAlbumLocation.replaceChildren();

    // Fill the album with the playImages
    playImages.forEach((playImage) => {;
        photoAlbumLocation.appendChild(createAlbumPhoto(playImage));
    });

    // Put a link to an upload page at the end of the album
    photoAlbumLocation.appendChild(createAlbumPhoto('Upload'));

    // If there are no images, offer a download default images button
    if (playImages.length <= 0){
        photoAlbumLocation.appendChild(createAlbumPhoto('Download'));
    }
}

function toggleDeleteMode(){
    if (!deleteModeToggle){
        // Reveal second delete button and make original delete button a cancel button
        deleteButton1.button.textContent = 'Cancel';
        deleteButton2.button.hidden = false;
    }
    else {
        // Reset the buttons to their original state
        deleteButton1.button.textContent = 'Delete';
        deleteButton2.button.hidden = true;
    }
    
    deleteModeToggle = !deleteModeToggle;
}

function deleteSelectedImages(){
    // Delete selected images
    playImages = playImages.filter(playImage => !playImage.deleteThis);

    // Sync playImages state in the local storage
    localStorage.setItem('playImages', JSON.stringify(playImages));

    // Toggle when done, and reset the album
    toggleDeleteMode();
    fillPhotoAlbumWithPlayImages();
}

// Run the above code and fill the photo album
initializePhotoAlbum();
