// src/routes/index.js
const router = require('express').Router();
const mongoose = require('mongoose');

router.use('/doc', function(req, res, next) {
  res.end(`Documentation http://expressjs.com/`);
});

// List handler
router.get('/book', function(req, res, next) {
  mongoose.model('Book').find({deleted: {$ne: true}}, function(err, books) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    res.json(books);
  });
});

// Create handler
router.post('/book', function(req, res, next) {
  const Book = mongoose.model('Book');
  const bookData = {
    title: req.body.title,
    author: req.body.author,
    series: req.body.series,
  };

  Book.create(bookData, function(err, newBook) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    res.json(newBook);
  });
});

// Update handler
router.put('/book/:bookId', function(req, res, next) {
  const Book = mongoose.model('Book');
  const bookId = req.params.bookId;
  
  Book.findById(bookId, function(err, book) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (!book) {
      return res.status(404).json({message: "Book not found"});
    }
  
    book.title = req.body.title;
    book.author = req.body.author;
    book.series = req.body.series;
  
    book.save(function(err, savedBook) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(savedBook);
    })
  
  })
  });

// Delete handler
router.delete('/book/:bookId', function(req, res, next) {
  const Book = mongoose.model('Book');
  const bookId = req.params.bookId;

  Book.findById(bookId, function(err, book) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (!book) {
      return res.status(404).json({message: "Book not found"});
    }

    book.deleted = true;

    book.save(function(err, doomedBook) {
      res.json(doomedBook);
    })

  })
});

// Read handler
router.get('/book/:bookId', function(req, res, next) {
  const {bookId} = req.params;

  const book = BOOKS.find(entry => entry.id === bookId);
  if (!book) {
    return res.status(404).end(`Could not find book '${bookId}'`);
  }

  res.json(book);
});

module.exports = router;