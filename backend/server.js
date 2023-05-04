'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const fs = require('fs');
const exifr = require('exifr');
const fsPromises = fs.promises;
const photosDir = './images/'

let defaultOptions = {
    /*tiff: false,
    xmp: false,
    icc: false,*/
    iptc: true,
    /*jfif: false, // (jpeg only)
    ihdr: false, // (png only)
    ifd0: false, // aka image
    ifd1: false, // aka thumbnail
    exif: false,
    gps: true, */
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
                let jsonImg = {
                    'name':filename,
                    'path':photosDir+filename,
                    'iptc_description':data?.['Caption']
                }
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