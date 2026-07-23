IMG_WIDTH = 200;
IMG_HEIGHT = IMG_WIDTH;

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

    // Create the paragraph to give the image's name
    const p = document.createElement('p');
    p.textContent = image.alt;

    // Put the image and paragraph into the div
    div.appendChild(image);
    div.appendChild(p);

    // Return the div
    return div;
}

// Function to fill the photo album section with all current play images
function fillPhotoAlbumWithPlayImages(){
    playImages.forEach((playImage) => {
        document.getElementsByClassName('PhotoAlbumLocation')[0].appendChild(createAlbumPhoto(playImage));
    });
}

fillPhotoAlbumWithPlayImages();
