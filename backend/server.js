'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

//requiring path and fs modules
const path = require('path');
const fs = require('fs');
//joining path of directory
const imgDirectory = 'images';
const photosDir = './images/'
const directoryPath = path.join(__dirname, imgDirectory);
//iptc module
const exifr = require('exifr');
const fsPromises = fs.promises;

let defaultOptions = {
    // Segments (JPEG APP Segment, PNG Chunks, HEIC Boxes, etc...)
    tiff: false,
    xmp: false,
    icc: false,
    iptc: true,
    jfif: false, // (jpeg only)
    ihdr: false, // (png only)
    // Sub-blocks inside TIFF segment
    ifd0: false, // aka image
    ifd1: false, // aka thumbnail
    exif: false,
    gps: true, 
}

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Welcome to API');
});

async function listDir() {
    try {
        return fsPromises.readdir(photosDir)
            .then(filenames => Promise.all(filenames.map(filename =>
            exifr.parse(photosDir+filename, defaultOptions)
            .then(function(data) {
                let jsonImg = {'name':filename,'iptc_description':data?.['Caption']}
                console.log(jsonImg)
                return jsonImg
            })
        )));
    } catch (err) {
        console.error('Error occured while reading directory!', err);
    }
}

// Return images list with iptc description field
app.get('/api/allImagesList', async(req, res) => {
    let data =  await listDir() 
    console.log(data)
    res.json({"files":  data })
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});