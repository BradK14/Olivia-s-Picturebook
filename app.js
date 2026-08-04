const path = require('node:path');
const express = require('express');
const app = express();
const rootDir = path.dirname(__filename);
const savePath = path.join(rootDir, 'data', 'saveData.json');
const { promises: fs } = require('node:fs');

app.set('view engine', 'ejs');

app.use(express.static(path.join(rootDir, "public")));
app.use(express.json());

app.listen(3000, () => {
    console.log(`http://localhost:3000/Olivia's_Picturebook`);
});

app.get("/Olivia's_Picturebook", (request, response) => {
    return response.sendFile(path.join(rootDir, "views", "index.html"));
});

app.get("/", (request, response) => {
    return response.redirect("/Olivia's_Picturebook");
});

app.get("/Olivia's_Picturebook/play", (request, response) => {
    return response.sendFile(path.join(rootDir, "views", "play.html"));
});

app.get("/Olivia's_Picturebook/photo_album", (request, response) => {
    return response.sendFile(path.join(rootDir, "views", "photoAlbum.html"));
});

app.get("/Olivia's_Picturebook/upload", (request, response) => {
    if (!request.query.playImage){
        response.render('upload', { uploadImage: '' });
    }
    else{
        response.render('upload', { uploadImage: request.query.playImage });
    }

    return response.sendFile(path.join(rootDir, "views", "upload.ejs"));
});

app.post("/Olivia's_Picturebook/upload/save", (request, response) => {
    console.log(request.body);
    return response.json({message: 'Save not yet implemented'});
});
