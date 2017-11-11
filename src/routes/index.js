// src/routes/index.js
const router = require('express').Router();
const mongoose = require('mongoose');

const FILES = [
  {id: 'a', title: 'cutecat1.jpg', description: 'A cute cat'},
  {id: 'b', title: 'uglycat1.jpg', description: 'Just kidding, all cats are cute'},
  {id: 'c', title: 'total_recall_poster.jpg', description: 'Quaid, start the reactor...'},
  {id: 'd', title: 'louisville_coffee.txt', description: 'Coffee shop ratings'},
];

router.use('/doc', function(req, res, next) {
  res.end(`Documentation http://expressjs.com/`);
});

// List handler
router.get('/file', function(req, res, next) {
  mongoose.model('File').find({}, function(err, files) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  
    res.json(files);
  });
});

// Create handler
router.post('/file', function(req, res, next) {
  const File = mongoose.model('File');
  const fileData = {
    title: req.body.title,
    description: req.body.description,
  };

  File.create(fileData, function(err, newFile) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(newFile);
  });
});

// Update handler
router.put('/file/:fileId', function(req, res, next) {
  const {fileId} = req.params;
  const file = FILES.find(entry => entry.id === fileId);
  if (!file) {
    return res.status(404).end(`Could not find file '${fileId}'`);
  }

  file.title = req.body.title;
  file.description = req.body.description;
  res.json(file);
});

// Delete handler
router.delete('/file/:fileId', function(req, res, next) {
  res.end(`Deleting file '${req.params.fileId}'`);
});

// Read handler
router.get('/file/:fileId', function(req, res, next) {
  const {fileId} = req.params;
  // same as 'const fileId = req.params.fileId'

  const file = FILES.find(entry => entry.id === fileId);
  if (!file) {
    return res.status(404).end(`Could not find file '${fileId}'`);
  }

  res.json(file);
});

module.exports = router;