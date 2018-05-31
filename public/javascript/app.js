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

var currentUrl = window.location.href.split("/");

// The lists below are adapted from the following websites:
//    http://www.musicgenreslist.com/
//    http://reference.yourdictionary.com/books-literature/different-types-of-books.html
//    http://www.filmsite.org/genres.html

// list of literary genres
const bookGenres = [
  "Action and Adventure", "Anthology", "Art", "Autobiographies",
  "Biographies", "Children's", "Comics", "Cookbooks", "Diaries",
  "Dictionaries", "Drama", "Encylopedias", "Fantasy", "Guide",
  "Health", "History", "Horror", "Journals", "Math", "Mystery",
  "Poetry", "Prayer books", "Religion, Spirituality & New Age",
  "Romance", "Satire", "Science", "Science Fiction", "Self help",
  "Series", "Travel", "Trilogy"
];

// list of motion picture genres
const movieGenres = [
  "Action", "Adventure", "Comedy", "Crime & Gangster", "Drama",
  "Epics/Historical", "Horror", "Musicals/Dance", "Science Fiction",
  "War", "Westerns"
];

// list of music genres
const musicGenres = [
  "Alternative", "Arime", "Blues", "Children's Music", "Comedy",
  "Commercial", "Country", "Dance", "Elecronic", "Disney", "Easy Listening",
  "Erika", "French Pop", "German Folk", "German Pop", "Fitness & Workout",
  "Hip-Hop/Rap", "Holiday", "Indie Pop", "Industiral",
  "Inspirational - Christian & Gospel", "Instrumental", "J-Pop", "Jazz",
  "K-Pop", "Karaoke", "Kayokyoku", "Latin", "New Age", "Opera", "Pop",
  "R&B/Soul", "Reggae", "Rock", "Singer/Songwriter", "Soundtrack",
  "Spoken Word", "Tex-Mex/Tejano", "Vocal", "World"
];

const validRatings = [
  "N/A", "Unknown", "G", "PG", "PG-13", "R", "NC-17"
];

const validTypes = [
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

  /*
    $("#myTable").hide();
    $("#search").click(function () {
    $("#carouselExampleControls").hide();
    $("#myTable").show();
    });
*/
  var inputs = {};

  inputs.offset = offset;
  inputs.limit = limit;

  fetchData("/public", inputs);

  $(document).on("click", "button.synopsis", synopsisView);
  //Search button logic 

  $("#search").on('click', function (e) {
    e.preventDefault();
    $("#search-form").parsley().validate();
    if ($("#search-form").parsley().isValid()) {
      search($("#search-form").val().trim());
    }
  });

  $("#search-form").on('keypress', function (e) {
    if (event.keyCode === 13) {
      e.preventDefault();
      $("#search-form").parsley().validate();
      if ($("#search-form").parsley().isValid()) {
        search($("#search-form").val().trim());
      }
    }
  });

  function search(input) {
    var searchInput = {
      name: input
    };
    fetchData("/search", searchInput);

    $("#carouselExampleControls").hide();
    //synopsisView();
    backNextToggle();


  }
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

  // modal controls

  // synposis button near sign up
  /*$("#synopsis-button").on("click", function () {
    console.log("synopsis button clicked!");
    var currentRecord = $(this)
            .parent()
            .data("record");
        console.log(currentRecord);
     $("#synopsis-modal").addClass("is-active");
     $(".modal-card-title").html("Synopsis");
     
   }); */



  $("#signup-button").on("click", function () {
    console.log("signup-button clicked");
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
    userName = $("#signup-userName").val().trim();
    emailAddress = $("#signup-email").val().trim();
    password = $("#signup-password").val().trim();
    console.log("userName: " + userName + " emailAddress: " + emailAddress + " password: " + password);
    if (userName.length > 0 && emailAddress.length > 0 && password.length > 0) {
      $("#signup-userName").val("");
      $("#signup-email").val("");
      $("#signup-password").val("");
      saveSignupData(userName, emailAddress, password);
      $("#signup-modal").removeClass("is-active");
    } else {
      $(".modal-card-title").html("Sign up - please complete all fields.");
    }
  });

  $("#login-save-button").on("click", function () {
    emailAddress = $("#login-email").val().trim();
    password = $("#login-password").val().trim();
    console.log("emailAddress: " + emailAddress + " password: " + password);
    if (emailAddress.length > 0 && password.length > 0) {
      $("#login-email").val("");
      $("#login-password").val("");
      authenticate(emailAddress, password);
      $("#login-modal").removeClass("is-active");
    } else {
      $(".modal-card-title").html("Login - please complete all fields.");
    }
  });


  function saveSignupData(name, email, password) {
    console.log("saving signup for " + name + " email: " + email);
    var inputs = {};
    inputs.name = name;
    inputs.email = email;
    inputs.password = password;
    $.ajax({
      type: 'POST',
      url: "/public/new-user/",
      data: inputs,
      success: function (data, text) {
        console.log("signup: success");
        console.log(data);
        authenticate(data.email, data.password);
      },
      error: function (request, status, error) {
        //alert(request.responseText);
        console.log("sign up : failure");
        $("#signup-modal").addClass("is-active");
        $(".modal-card-title").html("Sign up");
        $("#sign-up-error").show();
        $("#sign-up-error").text("Sign up failed: " + email + " already exists");
      }
    });
  }

  function authenticate(email, password) {
    console.log("inside authenticate");
    var inputs = {};
    inputs.email = email;
    inputs.password = password;
    $.ajax({
      type: 'GET',
      url: "/public/user-authenticate/" + email + "/" + password,
      data: inputs
    }).done(function (data) {
      console.log("after login");
      console.log(data);
      if (data && data.length > 0) {
        console.log("authentication: success");
        if (data[0].type === "admin") {
          var currentUrl = window.location.href.split('/').pop();
          var targetUrl = currentUrl + "/media-manager";
          //console.log(targetUrl);
          window.location.replace(targetUrl);
        } else {
          var currentUrl = window.location.href.split('/').pop();
          //console.log("currentUrl: " + currentUrl);
          var targetUrl = currentUrl + "/user-view/" + data[0].email;
          //console.log(targetUrl);
          window.location.replace(targetUrl);
        }
      } else {
        console.log("authentication: failure");
        $("#login-modal").addClass("is-active");
        $(".modal-card-title").html("Login - authentication failure");
      }
    });
  }

  function fetchData(url, inputs) {
    console.log("inputs: ");
    console.log(inputs);
    $.ajax({
      type: 'GET',
      url: url,
      data: inputs,
      dataType: 'json',
      encode: true

    }).done(function (data) {
      console.log("data fetched!");
      console.log(data);
      populatePublicView(data);
    }).fail(function (data) {

      console.log(data); // DEBUG

    });
  }

  //Function for synopsis view

  function synopsisView() {
    console.log("synopsis button clicked");
    var currentRecord = $(this)
      .parent()
      .data("record");
    console.log(currentRecord);
    //currentRecord.name will give you the name of the media 

    //Getting synopsis and rating

    var movie = $("#search-form").val().trim();

    /*var omdbURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    $.ajax({
      url: omdbURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      console.log(response.Plot);
     $("#movie-synopsis").text(response.Plot);
      */
    var movieQueryURL = "https://api.themoviedb.org/3/search/movie?api_key=1fc17c4180643016e173ba07928a30f2&query=" + encodeURI(movie) + "&page=1";

    // Make ajax request on movie API first
    $.ajax({
      url: movieQueryURL,
      method: "GET"
    }).done(function (response) {
      console.log(response);
      var movieID = (response.results[0].id);
      var creditsURL = "https://api.themoviedb.org/3/movie/" + movieID + "/credits?api_key=1fc17c4180643016e173ba07928a30f2";
      $("#movie-synopsis").text(response.results[0].overview);
      $("#synopsis-modal").addClass("is-active");
      //$("#movie-synopsis").text("Movie Synopsis for " + currentRecord.name);
      $(".modal-card-title").html("Synopsis");

    });
  }



  function backNextToggle() {
    if (offset == 0) {
      $('#back-link').hide();
    }

    var nextLink = $('#next-link');
    nextLink.show();
    var nextButton = $("<button>");
    nextButton.text("Next 10");
    nextButton.addClass("next btn btn-info");
  }

  function populatePublicView(data) {
    publicView.empty();
    var rowsToAdd = [];
    for (i = 0; i < data.length; i++) {
      rowsToAdd.push(createRow(data[i]));
    }

    publicView.append(rowsToAdd);
    $("table").trigger("update");
  }

  function createRow(record) {
    var newRow = $("<tr>");
    var name = $("<td>");
    name.text(record.name);
    newRow.append(name);

    //Adding synopsis in public view
    var synposisHeader = $("<td>");

    var synopsisBtn = $("<button>");
    synopsisBtn.text("SYNOPSIS");
    synopsisBtn.attr("id", "synopsis-button")
    synopsisBtn.addClass("synopsis btn btn-info");
    newRow.append(synopsisBtn);

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

    newRow.data("record", record);
    return newRow;
  }
  //Static modals


  // Synopsis Modal
  var modal = document.getElementById('myModal');
  var btn = document.getElementById("myBtn");
  var span = document.getElementsByClassName("close")[0];
  btn.onclick = function () {
    modal.style.display = "block";
  }
  span.onclick = function () {
    modal.style.display = "none";
  }
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }




  //ending ready function
}