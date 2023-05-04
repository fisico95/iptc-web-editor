'use strict';

const express = require('express');

const fs = require('fs');
const exifr = require('exifr');
const exiftool = require("exiftool-vendored").exiftool;
const bodyParser = require('body-parser');
const fsPromises = fs.promises;

const PORT = 8080;
const HOST = '0.0.0.0';
const photosDir = './images/'
// create application/json parser
const jsonParser = bodyParser.json()

const app = express();
app.get('/', (req, res) => {
  res.send('Welcome to API');
});

// Function : return all images and iptc caption field of directory
async function listDir() {
    try {
        return fsPromises.readdir(photosDir)
            .then(filenames => Promise.all(filenames.map(filename =>
            exifr.parse(photosDir+filename, {iptc: true})
            .then(function(data) {
                const jsonImg = {
                    'name':filename,
                    'path':photosDir+filename,
                    'iptc_description':data?.['Caption']
                }
                return jsonImg
            })
        )));
    } catch (err) {
        console.error('Error occured while reading directory!', err);
    }
}

// Return images list with iptc caption field
app.get('/api/allImagesList', async(req, res) => {
    const data =  await listDir() 
    res.json({"files":  data })
});

// Add iptc description field on selected image
app.post('/api/addIptcCaption', jsonParser, (req, res) => {
    const img = req.body;
    const imgName = req.body?.name;
    const imgCaption = req.body?.iptc_description;
    const tags = {
        "Caption-Abstract":imgCaption,
    };
    exiftool.write(photosDir+imgName, tags);
    res.status(201).json(img);
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});