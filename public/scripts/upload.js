console.log(window.uploadImage);

playImages.forEach(element => {
    if (window.uploadImage.toLowerCase() === element.alt.toLowerCase()){
        console.log('Photo present');
    }
});
