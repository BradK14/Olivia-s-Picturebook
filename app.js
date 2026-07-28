const path = require('node:path');
// const { fileURLToPath } = require('node:url');
const express = require('express');
const app = express();
const rootDir = path.dirname(__filename);

app.use(express.static(path.join(rootDir, "public")));

app.listen(3000, () => {
    console.log(`http://localhost:3000/Olivia's_Picturebook`);
});

app.get("/Olivia's_Picturebook", (request, response) => {
    response.sendFile(path.join(rootDir, "views", "index.html"));
});

app.get("/", (request, response) => {
    response.redirect("/Olivia's_Picturebook");
});

app.get("/Olivia's_Picturebook/play", (request, response) => {
    response.sendFile(path.join(rootDir, "views", "play.html"));
});

app.get("/Olivia's_Picturebook/photo_album", (request, response) => {
    response.sendFile(path.join(rootDir, "views", "photoAlbum.html"));
});

app.get("/Olivia's_Picturebook/upload", (request, response) => {
    response.sendFile(path.join(rootDir, "views", "upload.html"));
});
