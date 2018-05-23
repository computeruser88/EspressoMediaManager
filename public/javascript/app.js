// The lists below are adapted from the following websites:
//    http://www.musicgenreslist.com/
//    http://reference.yourdictionary.com/books-literature/different-types-of-books.html
//    http://www.filmsite.org/genres.html

// list of literary genres
var bookGenres =
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
var movieGenres =
[
   "Action", "Adventure", "Comedy", "Crime & Gangster", "Drama",
   "Epics/Historical", "Horror", "Musicals/Dance", "Science Fiction",
   "War", "Westerns"
];

// list of music genres
var musicGenres =
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

/*
   Note: document.onload() waits until the entire page, includng any
   images has been loaded before it reports the event.

   document.ready() allows us to start examining and modifying the
   DOM much sooner than document.onload()
*/

// Specify what function should run as soon as this page has been
// completely loded
$(document).ready(readyFunc);

// Execute this code after this web page has been fully loaded
// All of the code in this function simply creates click handler
// delarations; no functions are actually executed

function readyFunc() {

    // click handler for the Operation radio buttons
    $('#opbuttons').on( "click", function() {

    });

    // click handler for the Execute submit button
    $("#execute").on( "click", function() {

    });

    // Bind a click event to the Type select menu
    $("#type").bind( "click", function( event ) {
      // Update the list of available genres to match the selected
      // media type
      var typeChoice = $(this).val();

      switch (typeChoice) {
        case 'Book' :

          break;
    
        case 'Movie' :

          break;

        case 'Music' :
        
          break;

        default :

      }

    });

    // Bind a click event to the Rating select menu
    $("#rating").bind( "click", function( event ) {
  
    });

}


/*
     1. Validate the inputs that are typed in
     2. Display error messages when appropriate
     3. Escape any manual inputs before inserting them into the database
     4. Validate that the genre is compatible with the type
 */
