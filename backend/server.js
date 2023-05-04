'use strict';

const express = require('express');

const fs = require('fs');
const exifr = require('exifr');
const fsPromises = fs.promises;

const PORT = 8080;
const HOST = '0.0.0.0';
const photosDir = './images/'

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
                let jsonImg = {
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

// Return images list with iptc description field
app.get('/api/allImagesList', async(req, res) => {
    let data =  await listDir() 
    res.json({"files":  data })
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});