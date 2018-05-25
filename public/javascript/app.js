// IMPORTANT
// The HOST constant must be set to match the Heroku Domain
// where the app is deployed (?)
// e.g., https://mighty-springs-63277.herokuapp.com/,
//       https://vast-wave-20966.herokuapp.com/

const ADD_ROUTE    = "/admin-add-media";
const UPDATE_ROUTE = "/admin-update-media/:mediaid/:quantity/:time_limit";
const SHOW_ROUTE   = "/admin-show-media";

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
  $('.navbar-item').each(function(e) {
    $(this).click(function(){
      if ($('#navbar-burger-id').hasClass('is-active')){
        $('#navbar-burger-id').removeClass('is-active');
        $('#navbar-menu-id').removeClass('is-active');
      }
    });
  });
    
  // Open or Close mobile & tablet menu
  $('#navbar-burger-id').click(function () {
    if($('#navbar-burger-id').hasClass('is-active')){
      $('#navbar-burger-id').removeClass('is-active');
      $('#navbar-menu-id').removeClass('is-active');
    }else {
      $('#navbar-burger-id').addClass('is-active');
      $('#navbar-menu-id').addClass('is-active');
    }
  });

  // modal controls
  $("#signup-button").on("click", function() {
    $("#signup-modal").addClass("is-active");
  });
  $("#login-button").on("click", function() {
    $("#login-modal").addClass("is-active");
  });
  $(".delete").on("click", function() {
    $(".modal").removeClass("is-active");
  });
  $(".cancel-button").on("click", function() {
    $(".modal").removeClass("is-active");
  });

}



