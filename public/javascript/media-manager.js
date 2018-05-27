$(document).ready(readyFunc);
var adminMedia = $(".admin-media");
var currentUrl = window.location.href.split("/");
// list of literary genres
const bookGenres =
  [
    "Action and Adventure", "Adventure", "Anthology", "Art", "Autobiographies",
    "Biographies", "Children's", "Comics", "Cookbooks", "Diaries",
    "Dictionaries", "Dominant Romance", "Drama", "Encylopedias", "Fantasy",
    "Guide", "Guides/Travel", "Health", "Help/Self Help", "History", "Horror",
    "Journals", "Math", "Mystery", "Mythology", "Poetry", "Prayer books",
    "Religion, Spirituality & New Age", "Romance", "Satire", "Science",
    "Science/Medical", "Science Fiction", "Self help", "Series", "Tragedy",
    "Tragic Comedy", "Travel", "Trilogy"
  ];

// list of motion picture genres
const movieGenres =
[
   "2D CGI Animation", "3D CGI Animation", "Action", "Action, Adventure",
   "Action and Adventure", "Action, Thriller, Comedy, Romance", "Adventure",
   "Alternate History", "Apocalyptic Sci-Fi", "Biblical", "Biopic",
   "Chick Flick", "Claymation", "Comedy", "Contemporary Fantasy", "Courtroom",
   "Crime/Caper Story", "Crime & Gangster", "Cutout Animation", "Dark Fantasy",
   "Disaster", "Drama", "Drama, Action", "Drama/Thriller", "Empire Western",
   "Epic", "Epic Fantasy", "Epic Western", "Epics/Historical", "Fairy Tale",
   "Family,Fantasy, Musical", "Found Footage", "Future Noir", "Gangster",
   "Hardboiled", "Heroic Fantasy", "Historical Drama", "Horror",
   "Legal Thriller", "Live Action/Animation", "Marshal Western", "Martial Arts",
   "Military Science Fiction", "Monster", "Musicals/Dance", "Outlaw Western",
   "Paranormal/Occult", "Period", "Psychological Horror", "Punk Sci-Fi",
   "Puppet Animation", "Revenge Western", "Revisionist Western", "Rom-com",
   "Romantic Drama", "Romantic Thriller", "Science Fiction", "Slasher Movies",
   "Space Opera", "Spaghetti Western",  "Speculative Sci-Fi", "Splatter Movies",
   "Spy", "Superhero", "Survival Horror", "Sword and Sorcery", "Thriller",
   "Traditional Animation", "War", "Westerns", "Whodunnit/Detective"
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

var currentUrl = window.location.href.split("/");

function readyFunc() {
  populateAdminResult();

  // admin-dashboard-button
  $("#admin-dashboard-button").on("click", function () {
    console.log("currentUrl: " + currentUrl);
    currentUrl.pop();
    var targetUrl = currentUrl.join('/');
    targetUrl = targetUrl + "/admin-view";
    console.log(targetUrl);
    //console.log(targetUrl);
    window.location.replace(targetUrl);
  });

  // logout button
  $("#logout-button").on("click", function () {
    console.log("currentUrl: " + currentUrl);
    currentUrl.pop();
    var targetUrl = currentUrl.join('/');
    console.log(targetUrl);
    //console.log(targetUrl);
    window.location.replace(targetUrl);
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
        // Hide all input fields except for id
        hideMostInputs();

      case 'update':
        if (btnValue === 'update') { showMostInputs(); hideForUpdate(); }

      case 'delete':
        $('#id').prop('disabled', false);
        if (btnValue === 'delete')
          showMostInputs();
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

function populateAdminResult() {
  $.get("/admin-show-media", function (data) {
    if (data)
      initRows(data);
  });
}

function initRows(records) {
  adminMedia.empty();
  var recordsToAdd = [];

  for (var i = 0; i < records.length; i++) {
    recordsToAdd.push(createNewRow(records[i]));
  }
  adminMedia.append(recordsToAdd);
}

function createNewRow(record) {
  var newRecordRow = $("<tr>");
  var id = $("<td>");
  id.text(record.id);
  newRecordRow.append(id);

  var Name = $("<td>");
  Name.text(record.name);
  newRecordRow.append(Name);

  var type = $("<td>");
  type.text(record.type);
  newRecordRow.append(type);

  var genre = $("<td>");
  genre.text(record.genre);
  newRecordRow.append(genre);

  var rating = $("<td>");
  rating.text(record.rating);
  newRecordRow.append(rating);

  var year = $("<td>");
  year.text(record.year);
  newRecordRow.append(year);

  var quantity = $("<td>");
  quantity.text(record.quantity);
  newRecordRow.append(quantity);

  var time_limit = $("<td>");
  time_limit.text(record.time_limit);
  newRecordRow.append(time_limit);

  var cost = $("<td>");
  cost.text(record.cost);
  newRecordRow.append(cost);

  newRecordRow.data("record", record);
  return newRecordRow;
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

  const url = "/admin-add-media";

  $('form').submit(function (event) {
    event.preventDefault();

    // remove any previous text from the message area
    $('#messages').text('');

    // execute the INSERT INTO `Media` ... statement
    $.ajax({
      type: 'POST',
      url: url,
      data: inputs,
      dataType: 'json',
      encode: true

    }).done(function (data) {
      console.log(data);  // DEBUG
      var okMsg = data.name + "\nwas successfully added as ID " + data.id;
      $('#messages').text(okMsg);
    }).fail(function(data) {
      console.log(data);  // DEBUG
      $('#messages').text(JSON.stringify(data));
    });
  });
}

function updateMedia() {
  const route = "/admin-update-media/:mediaid/:quantity/:time_limit";
  var url = route;
  url = url.replace(':mediaid', $('#id').val());
  url = url.replace(':quantity', $('#quantity').val());
  url = url.replace(':time_limit', $('#timelimit').val());

  $('form').submit(function (event) {
    event.preventDefault();

    // remove any previous text from the message area
    $('#messages').text('');

    // execute the UPDATE `Media` SET ... statement
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      encode: true

    }).done(function (data) {
      console.log(data);  // DEBUG
      showForUpdate();
      displayRow(data)
      $('#messages').text(JSON.stringify(data));
    }).fail(function(data) {
      console.log(data);  // DEBUG
      $('#messages').text(JSON.stringify(data));
    });
  });
}

function deleteMedia() {
  alert("DELETE Not Implemented Yet."); return;
}

function findMedia() {
  const route = "/media-search/";
  var url = route + $('#id').val();

  $('form').submit(function (event) {
    event.preventDefault();

    // remove any previous text from the message area
    $('#messages').text('');

    // execute the SELECT *  FROM Media WHERE id = <id> statement
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      encode: true

    }).done(function (data) {
      showMostInputs();
      displayRow(data);
      $('#messages').text(JSON.stringify(data));
    }).fail(function(data) {
      console.log(data);  // DEBUG
      $('#messages').text(JSON.stringify(data));
    });
  });
}

function displayRow(data) {
  $('#name').val(data.name);
  $('#artist').val(data.artist);
  $('#type').val(data.type);

  // The selected genre can't be stored until the correct list of
  // genres has been stored in the #genre <select> control

  var options = restoreGenres(data.type);

  $("#genre").empty();
  $("#genre").html(options);

  $('#genre').val(data.genre);
  $('#rating').val(data.rating);
  $('#year').val(data.year);
  $('#quantity').val(data.quantity);
  $('#timelimit').val(data.time_limit);
  $('#cost').val(data.cost);
}

function restoreGenres(mediaType) {
  var array;
  switch (mediaType) {
    case 'Book': array = bookGenres; break;
    case 'Movie': array = movieGenres; break;
    case 'Music': array = musicGenres; break;
  }

  return createGenreOptions(array);
}

function hideMostInputs() {
  $('.hideable').hide();
}

function showMostInputs() {
  $('.hideable').show();
}

function hideForUpdate() {
  $('.updhide').hide();
}

function showForUpdate() {
  $('.updhide').show();
}

  // http://digipiph.com/blog/submitting-multipartform-data-using-jquery-and-ajax
  // https://scotch.io/tutorials/submitting-ajax-forms-with-jquery
