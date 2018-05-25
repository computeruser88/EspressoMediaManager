// IMPORTANT
// The HOST constant must be set to match the Heroku Domain
// where the app is deployed (?)
// e.g., https://mighty-springs-63277.herokuapp.com/,
//       https://vast-wave-20966.herokuapp.com/

const ADD_ROUTE = "/admin-add-media";
const UPDATE_ROUTE = "/admin-update-media/:mediaid/:quantity/:time_limit";
const SHOW_ROUTE = "/admin-show-media";

var publicView = $("#public-media-view");
var offset = 0;
var limit = 10;

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
let userName;
let emailAddress;
let password;

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

  fetchData();

  backNextToggle();

  //$(document).on("click", "button.next", handleNext);

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
  $(".dropdown-item").on("click", function () {
    $("#media-type").html($(this).html());
    $(".dropdown").removeClass("is-active");
  });

  // modal controls
  $("#signup-button").on("click", function () {
    $("#signup-modal").addClass("is-active");
    $(".modal-card-title").html("Sign up");
  });
  $("#login-button").on("click", function () {
    $("#login-modal").addClass("is-active");
    $(".modal-card-title").html("Login");
  });
  $(".delete").on("click", function () {
    $(".modal").removeClass("is-active");
  });
  $(".cancel-button").on("click", function () {
    $(".modal").removeClass("is-active");
  });

  $("#signup-save-button").on("click", function () {
    userName = $("#signup-userName").val();
    emailAddress = $("#signup-email").val();
    password = $("#signup-password").val();
    console.log("userName: " + userName + " emailAddress: " + emailAddress + " password: " + password);
    if (userName.length > 0 && emailAddress.length > 0 && password.length > 0) {
      $("#signup-userName").val("");
      $("#signup-email").val("");
      $("#signup-password").val("");
      $("#signup-modal").removeClass("is-active");
    }
    else {
      $(".modal-card-title").html("Sign up - please complete all fields.");
    }
  });

  $("#login-save-button").on("click", function () {
    emailAddress = $("#login-email").val();
    password = $("#login-password").val();
    console.log("emailAddress: " + emailAddress + " password: " + password);
    if (emailAddress.length > 0 && password.length > 0) {
      $("#login-email").val("");
      $("#login-password").val("");
      $("#login-modal").removeClass("is-active");
    }
    else {
      $(".modal-card-title").html("Login - please complete all fields.");
    }
  });

}


function fetchData(){
  var inputs = {};

    inputs.offset = offset;
    inputs.limit = limit;

    const url = "/public";
    $.ajax({
      type     : 'GET',
      url      : url,
      data     : inputs,
      dataType : 'json',
      encode   : true

    }).done(function(data) {
      console.log("data fetched!");
      console.log(data);
      populatePublicView(data);
    }).fail(function(data) {

      console.log(data);  // DEBUG

    });
}

function backNextToggle(){
  if(offset == 0){
    $('#back-link').hide();
  }

  var nextLink = $('#next-link');
  nextLink.show();
  var nextButton = $("<button>");
  nextButton.text("Next 10");
  nextButton.addClass("next btn btn-info");  
}

function populatePublicView(data){
  publicView.empty();
  var rowsToAdd = [];
  for(i = 0; i < data.length; i++){
    rowsToAdd.push(createRow(data[i]));
  }

  publicView.append(rowsToAdd);
  
}

function createRow(record){
  var newRow = $("<tr>");
  var name = $("<td>");
  name.text(record.name);
  newRow.append(name);

  var type = $("<td>");
  type.text(record.type);
  newRow.append(type);

  var genre = $("<td>");
  genre.text(record.genre);
  newRow.append(genre);

  var rating = $("<td>");
  rating.text(record.rating);
  newRow.append(rating);

  var year = $("<td>");
  year.text(record.year);
  newRow.append(year);

  var artist = $("<td>");
  artist.text(record.artist);
  newRow.append(artist);

  newRow.data("record",record);
  return newRow;

}