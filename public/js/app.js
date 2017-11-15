// Function to get the book list
function getBooks() {
  return $.ajax('/api/book')
    .then(res => {
      console.log("Results from getBooks()", res);
      return res;
    })
    .fail(err => {
      console.log("Error in getBooks()", err);
      throw err;
    });
}

// Function to refresh the book list
function refreshBookList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getBooks()
    .then(books => {

      window.bookList = books;

      const data = {books: books};
      const html = compiledTemplate(data);
      $('#list-container').html(html);
    })
}


// Function to toggle the form
function toggleAddBookForm() {
  console.log("Baby steps...");
  setFormData({});
  toggleAddBookFormVisibility();
}


function toggleAddBookFormVisibility() {
  $('#form-container').toggleClass('hidden');
}


function submitBookForm() {
  console.log("You clicked 'submit'. Congratulations.");

  const bookData = {
    title: $('#book-title').val(),
    author: $('#book-author').val(),
    series: $('#book-series').val(),
    _id: $('#book-id').val(),
  };

  let method, url;
  if (bookData._id) {
    method = 'PUT';
    url = '/api/book/' + bookData._id;
  } else {
    method = 'POST';
    url = '/api/book';
  }

  $.ajax({
    type: method,
    url: url,
    data: JSON.stringify(bookData),
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("We have posted the data");
      refreshBookList();
      toggleAddBookForm();
    })
    .fail(function(error) {
      console.log("Failures at posting, we are", error);
    })

  console.log("Your book data", bookData);
}

function cancelBookForm() {
  toggleAddBookFormVisibility();
}

// Edits the form
function editBookClick(id) {
  const book = window.bookList.find(book => book._id === id);
  if (book) {
    setFormData(book);
    toggleAddBookFormVisibility();
  }
}


function deleteBookClick(id) {
  if (confirm("Are you sure?")) {
    $.ajax({
      type: 'DELETE',
      url: '/api/book/' + id,
      dataType: 'json',
      contentType : 'application/json',
    })
      .done(function(response) {
        console.log("Book", id, "is DOOMED!!!!!!");
        refreshBookList();
      })
      .fail(function(error) {
        console.log("I'm not dead yet!", error);
      })
  }
}


function setFormData(data) {
  data = data || {};

  const book = {
    title: data.title || '',
    author: data.author || '',
    series: data.series || '',
    _id: data._id || '',
  };

  $('#book-title').val(book.title);
  $('#book-author').val(book.author);
  $('#book-series').val(book.series);
  $('#book-id').val(book._id);
}