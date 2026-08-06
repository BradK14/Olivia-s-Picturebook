// This file holds functionality for the photo album page
// This file relies on the playImages variable from the playImages file

// Global variables
IMG_WIDTH = 200;
IMG_HEIGHT = IMG_WIDTH;

// Functions
// Function to initialize the page
async function initializePhotoAlbum(){
    // Initialize the playImages
    await getPlayImages();

    // Fill the photo album with the retrieved saved images
    fillPhotoAlbumWithPlayImages();
}

// Using a play image from the global array playImages, set up and return an Album Photo
function createAlbumPhoto(playImage){
    // Create the div to contain everything
    const div = document.createElement('div');
    div.classList.add('AlbumPhoto');

    // Create the image
    const image = document.createElement('img');
    image.src = playImage.src;
    image.alt = playImage.alt;
    image.width = IMG_WIDTH;
    image.height = IMG_HEIGHT;

    // Create a link to house the image
    const link = document.createElement('a');
    link.href = `/Olivia's_Picturebook/upload?playImage=${image.alt}`;
    link.appendChild(image);

    // Create the paragraph to give the image's name
    const p = document.createElement('p');
    p.textContent = image.alt;

    // Put the link (that holds the image) and paragraph into the div
    div.appendChild(link);
    div.appendChild(p);

    // Return the div
    return div;
}

function createUploadAlbumPhoto(){
    // Create the div to contain everything
    const div = document.createElement('div');
    div.classList.add('AlbumPhoto');

    // Create the image
    const image = document.createElement('img');
    image.src = '/images/Upload.png';
    image.alt = 'Upload';
    image.width = IMG_WIDTH;
    image.height = IMG_HEIGHT;

    // Create a link to house the image
    const link = document.createElement('a');
    link.href = "/Olivia's_Picturebook/upload";
    link.appendChild(image);

    // Create the paragraph to give the image's name
    const p = document.createElement('p');
    p.textContent = image.alt;

    // Put the link (that holds the image) and paragraph into the div
    div.appendChild(link);
    div.appendChild(p);

    // Return the div
    return div;
}

// Function to fill the photo album section with all current play images
function fillPhotoAlbumWithPlayImages(){
    const photoAlbumLocation = document.querySelector('.PhotoAlbumLocation');
    playImages.forEach((playImage) => {;
        photoAlbumLocation.appendChild(createAlbumPhoto(playImage));
    });

    photoAlbumLocation.appendChild(createUploadAlbumPhoto());
}

// Run the above code and fill the photo album
initializePhotoAlbum();
