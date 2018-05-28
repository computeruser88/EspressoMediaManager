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
    "Disaster", "Drama", "Drama, Action", "Drama/Disaster", "Drama/Thriller", 
    "Empire Western", "Epic", "Epic Fantasy", "Epic Western", "Epics/Historical",
    "Fairy Tale", "Family,Fantasy, Musical", "Found Footage", "Future Noir",
    "Gangster", "Hardboiled", "Heroic Fantasy", "Historical Drama", "Horror",
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

var currentYear = (new Date().getFullYear());

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

  // cancel button
  //   The cancel functionality is implemented entirely in the form element
  //   <button type="reset" class="button is-text" id="cancel" value="Cancel">Cancel</button>

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
        showMostInputs();
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
  $("#type").bind("change", function (event) {
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

  const url = "/admin-add-media";

  $('form').submit(function (event) {
    event.preventDefault();

    var isValid = validateFormInputs(inputs);
    if (isValid === false) {
      return;
    }

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
      $('#messages').text();
      $('#messages').text(okMsg);
    }).fail(function (data) {
      console.log(data);  // DEBUG
      $('#messages').text();
      $('#messages').text(JSON.stringify(data));
    });
  });
}

function updateMedia() {
  const route = "/admin-update-media/:mediaid/:quantity/:time_limit";

  $('form').submit(function (event) {
    event.preventDefault();

    var isValid = validateForUpdate();
    if (isValid === false) {
      return;
    }

    var url = route;
    url = url.replace(':mediaid',    $('#id').val());
    url = url.replace(':quantity',   $('#quantity').val());
    url = url.replace(':time_limit', $('#timelimit').val());
  
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
      $('#messages').text();
      $('#messages').text(JSON.stringify(data));
    }).fail(function (data) {
      console.log(data);  // DEBUG
      $('#messages').text();
      $('#messages').text(JSON.stringify(data));
    });
  });
}

function deleteMedia() {
  alert("DELETE Not Implemented Yet."); return;
}

function findMedia() {
  const route = "/media-search/";

  $('form').submit(function (event) {
    event.preventDefault();

    if ( /^\d+$/.test($('#id').val())  === false 
      || Number($('#id').val()) <= 0 ) {
      $('#messages').text();
      $('#messages').text("The ID must be a positive integer\n");
      return;
    }

    var url = route + $('#id').val();
    
    // execute the SELECT *  FROM Media WHERE id = <id> statement
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      encode: true

    }).done(function (data) {
      // Note: this path is taken, even if a row with the requested ID
      //       is not found in the database. In that case, "data" is null
      if (data === null) {
        $('#messages').text();
        var errMsg = "No row with ID " + $('#id').val()
                   + " was found in the database";      
        $('#messages').text(errMsg);
        return;
      }

      showMostInputs();
      displayRow(data);
      $('#messages').text();
      $('#messages').text(JSON.stringify(data));
    }).fail(function (data) {
      console.log(data);  // DEBUG
      $('#messages').text();
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

function validateFormInputs(inpObject) {
  var errors = '';

  // TODO: Must decide on the validity rules for names and artists.
  //       This might include the exclusion of certain punctuation
  //       characters, and the inclusion of accented characters
  //       from languages other than English.

  // The values from the <select> elements should always be valid,
  // unless some sort of hacking event has occurred

  if ($.inArray(inpObject.type, validTypes) <= -1) {
    errors += "Please select one of the types from the Type dropdown box\n";
  }

  if ($.inArray(inpObject.rating, validRatings) <= -1) {
    errors += "Please select one of the ratings from the Rating dropdown box\n";
  }

  var array;

  switch (inpObject.type) {
    case 'Book' : array = bookGenres;  break;
    case 'Movie': array = movieGenres; break;
    case 'Music': array = musicGenres; break;
  }

  if ($.inArray(inpObject.genre, array) <= -1) {
    errors += "Please select one of the genres from the Genre dropdown box\n";
  }

  var yearRegex = /(^\d{4}$)/;
  var year;
  var result = inpObject.year.match(yearRegex);
  var yrMsg = "Year must be a four-digit integer >= 1440 and <= " 
               + currentYear + "\n";

  if (result === null) {
    errors += yrMsg;
  } else {
      year = parseInt(result[1], 10);
      if ((year < 1440) || (year > currentYear)) {
        errors += yrMsg;
      }
  }

  // Note: this allows the quantity to be zero (which may sometimes
  //       be necessary? e.g. not in stock yet)
  var intRegex = /^\d+$/;
  if (intRegex.test(inpObject.quantity) === false) {
    errors += "Quantity must be a non-negative integer\n";
  }

  // Note: this allows Time Limit to be zero,
  // e.g. item is in stock but is not currently available for lending
  if (intRegex.test(inpObject.time_limit) === false) {
    errors += "Time Limit must be a non-negative integer\n";
  }

  var moneyRegex = /^\d+\.\d{2}$/;
  if (moneyRegex.test(inpObject.cost) === false) {
    errors += "Cost must be in the format d.dd\n";
  }

  if (errors.length > 0) {
    // remove any previous text from the message area
    $('#messages').text();
    $('#messages').text(errors);
  }

  return (errors.length > 0) ? false : true;
}

function validateForUpdate() {
  var errors = '';

  if ( /^\d+$/.test($('#id').val())  === false || Number($('#id').val()) <= 0 ) {
    errors += "The ID must be a positive integer\n";
  }

  var intRegex = /^\d+$/;
  if (intRegex.test($('#quantity').val()) === false) {
    errors += "Quantity must be a non-negative integer\n";
  }

  if (intRegex.test($('#timelimit').val()) === false) {
    errors += "Time Limit must be a non-negative integer\n";
  }

  if (errors.length > 0) {
    // remove any previous text from the message area
    $('#messages').text();
    $('#messages').text(errors);
  }

  return (errors.length > 0) ? false : true;
}
