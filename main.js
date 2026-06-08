const IMGWIDTH = 600;

const startButton = document.getElementById("startButton");

function StartGame(){
    const img = document.createElement('img');
    img.src = 'images/Ladybug.png';
    img.alt = 'Ladybug';
    img.width = IMGWIDTH;
    document.getElementsByClassName("ImageLocation")[0].appendChild(img);
}

startButton.addEventListener("click", StartGame);