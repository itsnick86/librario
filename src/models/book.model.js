// Load mongoose package
const mongoose = require('mongoose');

// Schema for the DB
const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  created_at: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false}
});

// Turns the Schema into a Model and Exports it
const Book = mongoose.model('Book', BookSchema);
module.exports = Book;

// Adding seed data
Book.count({}, function(err, count) {
  if (err) {
    throw err;
  }

  if (count > 0) return ;
  
  const books = require('./book.seed.json');
  Book.create(books, function(err, newBooks) {
    if (err) {
      throw err;
    }
    console.log("DB seeded")
  });
});