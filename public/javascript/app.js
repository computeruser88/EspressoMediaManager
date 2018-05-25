// IMPORTANT
// The HOST constant must be set to match the Heroku Domain
// where the app is deployed (?)
// e.g., https://mighty-springs-63277.herokuapp.com/,
//       https://vast-wave-20966.herokuapp.com/

const ADD_ROUTE = "/admin-add-media";
const UPDATE_ROUTE = "/admin-update-media/:mediaid/:quantity/:time_limit";
const SHOW_ROUTE = "/admin-show-media";

// The lists below are adapted from the following websites:
//    http://www.musicgenreslist.com/
//    http://reference.yourdictionary.com/books-literature/different-types-of-books.html
//    http://www.filmsite.org/genres.html

// list of literary genres
const bookGenres =
  [
    "Action and Adventure", "Anthology", "Art", "Autobiographies",
    "Biographies", "Children's", "Comics", "Cookbooks", "Diaries",
    "Dictionaries", "Drama", "Encylopedias", "Fantasy", "Guide",
    "Health", "History", "Horror", "Journals", "Math", "Mystery",
    "Poetry", "Prayer books", "Religion, Spirituality & New Age",
    "Romance", "Satire", "Science", "Science Fiction", "Self help",
    "Series", "Travel", "Trilogy"
  ];

// list of motion picture genres
const movieGenres =
  [
    "Action", "Adventure", "Comedy", "Crime & Gangster", "Drama",
    "Epics/Historical", "Horror", "Musicals/Dance", "Science Fiction",
    "War", "Westerns"
  ];

// list of music genres
const musicGenres =
  [
    "Alternative", "Arime", "Blues", "Children's Music", "Comedy",
    "Commercial", "Country", "Dance", "Elecronic", "Disney", "Easy Listening",
    "Erika", "French Pop", "German Folk", "German Pop", "Fitness & Workout",
    "Hip-Hop/Rap", "Holiday", "Indie Pop", "Industiral",
    "Inspirational - Christian & Gospel", "Instrumental", "J-Pop", "Jazz",
    "K-Pop", "Karaoke", "Kayokyoku", "Latin", "New Age", "Opera", "Pop",
    "R&B/Soul", "Reggae", "Rock", "Singer/Songwriter", "Soundtrack",
    "Spoken Word", "Tex-Mex/Tejano", "Vocal", "World"
  ];

const validRatings =
  [
    "N/A", "Unknown", "G", "PG", "PG-13", "R", "NC-17"
  ];

const validTypes =
  [
    "Book", "Movie", "Music"
  ];


/*
   Note: document.onload() waits until the entire page, includng any
   images has been loaded before it reports the event.

   document.ready() allows us to start examining and modifying the
   DOM much sooner than document.onload()
*/

// Specify what function should run as soon as this page has been
// completely loaded
$(document).ready(readyFunc);

// Execute this code after this web page has been fully loaded
// All of the code in this function simply creates click handler
// delarations; no functions are actually executed

function readyFunc() {
  $("table").tablesorter();
  // Close mobile & tablet menu on item click
  $('.navbar-item').each(function (e) {
    $(this).click(function () {
      if ($('#navbar-burger-id').hasClass('is-active')) {
        $('#navbar-burger-id').removeClass('is-active');
        $('#navbar-menu-id').removeClass('is-active');
      }
    });
  });

  // Open or Close mobile & tablet menu
  $('#navbar-burger-id').click(function () {
    if ($('#navbar-burger-id').hasClass('is-active')) {
      $('#navbar-burger-id').removeClass('is-active');
      $('#navbar-menu-id').removeClass('is-active');
    } else {
      $('#navbar-burger-id').addClass('is-active');
      $('#navbar-menu-id').addClass('is-active');
    }
  });

  // dropdown controls
  $(".dropdown-trigger").on("click", function () {
    if ($(".dropdown").hasClass("is-active")) {
      $(".dropdown").removeClass("is-active");
    } else {
      $(".dropdown").addClass("is-active");
    }
  });
  $(".dropdown-item").on("click", function() {
    $("#media-type").html($(this).html());
    $(".dropdown").removeClass("is-active");
  });

  // modal controls
  $("#signup-button").on("click", function () {
    $("#signup-modal").addClass("is-active");
  });
  $("#login-button").on("click", function () {
    $("#login-modal").addClass("is-active");
  });
  $(".delete").on("click", function () {
    $(".modal").removeClass("is-active");
  });
  $(".cancel-button").on("click", function () {
    $(".modal").removeClass("is-active");
  });


  // click handler for the Operation radio buttons
  $('#opbuttons').on("click", function () {
    var btnValue;
    btnValue = $('input[name=operation]:checked').val();

    // Don't allow the user to enter an ID when a row is being added
    switch (btnValue) {

      case 'add':
        $('#id').prop('disabled', true);
        break;

      case 'find':
      case 'update':
      case 'delete':
        $('#id').prop('disabled', false);
        break;

      default:
        throw "An internal error occured.\n" + "Invalid value (" + btnValue
        + ") for radio button";
    }

  });

  // click handler for the Execute submit button
  $("#execute").on("click", function () {
    // Get the requested operation type
    var opType = $('input[name=operation]:checked').val();

    switch (opType) {

      case 'add':
        insertMedia();
        break;

      case 'find':
        findMedia();
        break;

      case 'update':
        updateMedia();
        break;

      case 'delete':
        deleteMedia();
        break;

      default:
        throw "An internal error occured.\n" + "Invalid value (" + btnValue
        + ") for radio button";
    }

  });

  // Bind a click event to the Type select menu
  $("#type").bind("click", function (event) {
    // Update the list of available genres to match the selected
    // media type
    var typeChoice = $(this).val();
    var options;
    var array;

    switch (typeChoice) {
      case 'Book':
        array = bookGenres;
        break;

      case 'Movie':
        array = movieGenres;
        break;

      case 'Music':
        array = musicGenres;
        break;

      default:
        throw "An internal error occured.\n" + "Cannot get genres for: " + typeChoice;
    }

    options = createGenreOptions(array);

    // Remove any previous content from the #genre <select> control
    $("#genre").empty();

    // Store the new content
    $("#genre").html(options);

  });


  // Bind a click event to the Type select menu
  $("#type").bind("click", function (event) {

  });

}

function createGenreOptions(genreList) {
  var numItems = genreList.length;
  var optionsString = '';
  var nextOption = '';

  for (var i = 0; i < numItems; i++) {
    nextOption = '<option>' + genreList[i] + '</option>';
    optionsString += nextOption;
  }

  return optionsString;
}

function insertMedia() {
  var inputs = {};
  inputs.name = $('#name').val();
  inputs.artist = $('#artist').val();
  inputs.type = $('#type').val();
  inputs.genre = $('#genre').val();
  inputs.rating = $('#rating').val();
  inputs.year = $('#year').val();
  inputs.quantity = $('#quantity').val();
  inputs.time_limit = $('#timelimit').val();
  inputs.cost = $('#cost').val();

  // TODO: add some validation code here

  const url = HOST + ':' + PORT + ADD_ROUTE;

  $('form').submit(function (event) {

    // remove any previous text from the message area
    $('#messages').val('');

    // execute the INSERT INTO `Media` ... statement
    $.ajax({
      type: 'POST',
      url: url,
      data: inputs,
      dataType: 'json',
      encode: true

    }).done(function (data) {
      alert('.done executing');  // DEBUG
      console.log(data);  // DEBUG
      var okMsg = data.name + "\nwas successfully added as ID " + data.id;
      $('#messages').val(okMsg);
    }).fail(function (data) {
      alert('.fail executing');  // DEBUG
      console.log(data);  // DEBUG
      $('#messages').val(JSON.stringify(data));
    });

    event.preventDefault();

  });
}

function updateMedia() {
  alert("UPDATE Not Implemented Yet."); return;
  var inputs = {};
  const url = HOST + ':' + PORT + UPDATE_ROUTE;

  $('form').submit(function (event) {

    // remove any previous text from the message area
    $('#messages').val('');

    // execute the INSERT INTO `Media` ... statement
    $.ajax({
      type: 'POST',
      url: url,
      data: inputs,
      dataType: 'json',
      encode: true

    }).done(function (data) {
      console.log(data);  // DEBUG
    }).fail(function (data) {
      console.log(data);  // DEBUG
      $('#messages').val(JSON.stringify(data));
    });

    event.preventDefault();

  });
}

function deleteMedia() {
  alert("DELETE Not Implemented Yet."); return;
}

function findMedia() {
  alert("FIND Not Implemented Yet."); return;
}
  // http://digipiph.com/blog/submitting-multipartform-data-using-jquery-and-ajax
  // https://scotch.io/tutorials/submitting-ajax-forms-with-jquery
