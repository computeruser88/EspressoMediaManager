$(document).ready(function () {

    /* global moment */
    //var email ="janedoe@gmail.com";
    var currentUrl = window.location.href.split("/");
    var email = currentUrl.pop();

    // userDashboard holds all of our records
    var userDashboard = $(".user-dashboard");
    var userDashboardHeader = $(".user-dashboard-header");
    var userHistory = $(".user-history");
    var userHistoryHeader = $(".user-history-header");
    var userAvailableMedia = $(".user-available-media");
    var userAvailableMediaHeader = $(".user-available-media-header");
    var helloUser = $("#hello-user");
    var userDashboardTable = $("#user-dashboard");
    var userHistoryTable = $("#user-history");
    var userAvailableMediaTable = $("#user-available-media");

    // Click events for the checkout and return button
    $(document).on("click", "button.checkout", handleCheckout);
    $(document).on("click", "button.return", handleReturn);
    $(document).on("click", "button.review", reviewPost);
    $(document).on("click", "button.synopsis", synopsisView);
    // Variable to hold our records
    var records;
    // logout button
    $("#logout-button").on("click", function () {
        //console.log("currentUrl: " + currentUrl);
        currentUrl.pop();
        var targetUrl = currentUrl.join('/');
        //console.log(targetUrl);
        window.location.replace(targetUrl);
    });

    $("#search").on('click', function (e) {
        e.preventDefault();
        $("#search-form").parsley().validate();
        if ($("#search-form").parsley().isValid()) {
          getAvailableRecords(email,$("#search-form").val().trim());
        }
      });
    
      $("#search-form").on('keypress', function (e) {
        if (event.keyCode === 13) {
          e.preventDefault();
          $("#search-form").parsley().validate();
          if ($("#search-form").parsley().isValid()) {
            getAvailableRecords(email,$("#search-form").val().trim());
          }
        }
      });

    getUserName(email);
    getAvailableRecords(email);
    getRecords(email);
    getHistoricalRecords(email);



    function getUserName(email) {
        $.get("/public/check-email/" + email, function (data) {
            if (data) {
                helloUser.text("Welcome " + data[0].name);
            }
        });
    }

    function getHistoricalRecords(email) {
        $.get("/user-history/" + email, function (data) {
            console.log("getting rental history");
            console.log(data);
            if (data)
                //initializeHistoricalRows(data);
                initRows(userHistoryHeader, userHistory, data, createHistoricalHeaderRow, createHistoryRow);
            // userDashboardTable.trigger("update");
            userHistoryTable.tablesorter();
            userHistoryTable.trigger("update");
            // userAvailableMediaTable.trigger("update");
        });
    }


    // This function grabs records from the database and updates the view
    function getRecords(email) {
        $.get("/user-dashboard/" + email, function (data) {
            if (data)
                //initializeRows(data);bncczx
                initRows(userDashboardHeader, userDashboard, data, createHeaderRow, createNewRow);
            userDashboardTable.tablesorter();
            userDashboardTable.trigger("update");
            // userHistoryTable.trigger("update");
            // userAvailableMediaTable.trigger("update");
        });
    }

    function getAvailableRecords(email,searchInput) {
        console.log("getting available media for user email: " + email);
        console.log("search input: " + searchInput);
        var input = {
            email : email,
            search: searchInput
        };
        $.ajax({
            type: 'GET',
            url: "/user-available-media/" + email,
            data: input,
            dataType: 'json',
            encode: true
      
          }).done(function (data) {
                initRows(userAvailableMediaHeader, userAvailableMedia, data, createAvailableHeaderRow, createAvailableRow);
                // userDashboardTable.trigger("update");
                // userHistoryTable.trigger("update");
                userAvailableMediaTable.tablesorter();
                userAvailableMediaTable.trigger("update");
          }).fail(function (data) {
            console.log(data); // DEBUG
      
        });

        /*$.get("/user-available-media/" + email, function (data) {
            //console.log(data);
            if (data)
                initRows(userAvailableMediaHeader, userAvailableMedia, data, createAvailableHeaderRow, createAvailableRow);
                // userDashboardTable.trigger("update");
                // userHistoryTable.trigger("update");
                userAvailableMediaTable.tablesorter();
                userAvailableMediaTable.trigger("update");
        });*/
    }

    function initRows(tableHeaderClass, tableClass, data, headerRowFunc, newRowFunc) {
        tableClass.empty();
        tableClass.tablesorter();
        tableHeaderClass.empty();
        var recordsToAdd = [];
        tableHeaderClass.append(headerRowFunc());
        for (var i = 0; i < data.length; i++) {
            recordsToAdd.push(newRowFunc(data[i]));
        }
        //var tbody = $("<tbody>");
        //tbody.append(recordsToAdd);
        tableClass.append(recordsToAdd);

    }

    function createAvailableHeaderRow() {
        var row = $("<tr>");


        var name = $("<th>");
        name.text("Name");
        row.append(name);

        var mediaType = $("<th>");
        mediaType.text("Media Type");
        row.append(mediaType);

        var genre = $("<th>");
        genre.text("Genre");
        row.append(genre);

        var rating = $("<th>");
        rating.text("Rating");
        row.append(rating);

        var year = $("<th>");
        year.text("Release Year");
        row.append(year);

        var placeholder = $("<th>");
        placeholder.text("Checkout");
        row.append(placeholder);

        // var placeholder2 = $("<th>");
        // placeholder2.text("Synopsis");
        // row.append(placeholder2);

        return row;

    }

    // This function constructs a a record's row
    function createAvailableRow(record) {
        var newRecord = $("<div>");
        newRecord.addClass("card");

        var checkoutBtn = $("<button>");
        checkoutBtn.text("CHECKOUT");
        checkoutBtn.addClass("checkout btn btn-info");

        //Synopsis button

        var synopsisBtn = $("<button>");
        synopsisBtn.text("SYNOPSIS");
        synopsisBtn.attr("id", "synopsis-button")
        synopsisBtn.addClass("synopsis btn btn-info");

        var newRecordRow = $("<tr>");



        var Name = $("<td>");
        Name.text(record.name);
        var Type = $("<td>");
        Type.text(record.type);
        var Genre = $("<td>");
        Genre.text(record.genre);
        var Rating = $("<td>");
        Rating.text(record.rating);
        var ReleaseYear = $("<td>");
        ReleaseYear.text(record.year);

        newRecordRow.append(Name);
        newRecordRow.append(Type);
        newRecordRow.append(Genre);
        newRecordRow.append(Rating);
        newRecordRow.append(ReleaseYear);
        newRecordRow.append(checkoutBtn);
        newRecordRow.append(synopsisBtn);
        newRecordRow.data("record", record);
        return newRecordRow;
        //end of available records
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

        var movie = currentRecord.name;

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
            $("#synopsis-cancel-button").on("click", function () {
                $(".modal").removeClass("is-active");
              });
        });
        //end of synopsis view function
    }


    function createHeaderRow() {
        var row = $("<tr>");

        var name = $("<th>");
        name.text("Name");
        row.append(name);

        var checkedOutDate = $("<th>");
        checkedOutDate.text("Checked Out Date");
        row.append(checkedOutDate);

        var mediaType = $("<th>");
        mediaType.text("Media Type");
        row.append(mediaType);

        var genre = $("<th>");
        genre.text("Genre");
        row.append(genre);

        var rating = $("<th>");
        rating.text("Rating");
        row.append(rating);

        var year = $("<th>");
        year.text("Release Year");
        row.append(year);
        //thead.append(row);
        var placeholder = $("<th>");
        placeholder.text("Return");
        row.append(placeholder);

        return row;

    }
    // This function constructs a a record's row
    function createNewRow(record) {
        var newRecord = $("<div>");
        newRecord.addClass("card");
        var checkoutBtn = $("<button>");
        checkoutBtn.text("CHECKOUT");
        checkoutBtn.addClass("checkout btn btn-info");
        var returnBtn = $("<button>");
        returnBtn.text("RETURN");
        returnBtn.addClass("return btn btn-info");



        var newRecordRow = $("<tr>");


        var Name = $("<td>");
        Name.text(record.Medium.name);
        var checkedOut = $("<td>");
        checkedOut.text(record.checked_out_date);
        var Type = $("<td>");
        Type.text(record.Medium.type);
        var Genre = $("<td>");
        Genre.text(record.Medium.genre);
        var Rating = $("<td>");
        Rating.text(record.Medium.rating);
        var ReleaseYear = $("<td>");
        ReleaseYear.text(record.Medium.year);

        newRecordRow.append(Name);
        newRecordRow.append(checkedOut);
        newRecordRow.append(Type);
        newRecordRow.append(Genre);
        newRecordRow.append(Rating);
        newRecordRow.append(ReleaseYear);
        newRecordRow.append(returnBtn);
        newRecordRow.data("record", record);
        return newRecordRow;

        //Ending createnewrow function
    }

    function createHistoricalHeaderRow() {
        var row = $("<tr>");

        var name = $("<th>");
        name.text("Name");
        row.append(name);

        var checkedOutDate = $("<th>");
        checkedOutDate.text("Checked Out Date");
        row.append(checkedOutDate);

        var returnedDate = $("<th>");
        returnedDate.text("Returned Date");
        row.append(returnedDate);

        var mediaType = $("<th>");
        mediaType.text("Media Type");
        row.append(mediaType);

        var genre = $("<th>");
        genre.text("Genre");
        row.append(genre);

        var rating = $("<th>");
        rating.text("Rating");
        row.append(rating);

        var year = $("<th>");
        year.text("Release Year");
        row.append(year);

        var placeholder = $("<th>");
        placeholder.text("Review");
        row.append(placeholder);

        return row;

    }

    //Creates a rental history record
    console.log("Program reaches here"); //DEBUG
    function createHistoryRow(record) {
        var newRecord = $("<div>");
        newRecord.addClass("card");
        var checkoutBtn = $("<button>");
        checkoutBtn.text("CHECKOUT");
        checkoutBtn.addClass("checkout btn btn-info");

        var reviewBtn = $("<button>");
        reviewBtn.text("Write Review");
        reviewBtn.addClass("review btn btn-info");
        reviewBtn.attr("id", "reviewBtn");


        //Review button modal pop up functionality
        /*  
          $("#reviewbtn").on("click", function () {
              $("#review-modal").addClass("is-active");
              $(".modal-card-title").html("Write a review");
            });
          */
        var newRecordRow = $("<tr>");

        var Name = $("<td>");
        Name.text(record.Medium.name);
        var checkedOut = $("<td>");
        checkedOut.text(record.checked_out_date);
        var returned = $("<td>");
        returned.text(record.returned_date);
        var Type = $("<td>");
        Type.text(record.Medium.type);
        var Genre = $("<td>");
        Genre.text(record.Medium.genre);
        var Rating = $("<td>");
        Rating.text(record.Medium.rating);
        var ReleaseYear = $("<td>");
        ReleaseYear.text(record.Medium.year);

        newRecordRow.append(Name);
        newRecordRow.append(checkedOut);
        newRecordRow.append(returned);
        newRecordRow.append(Type);
        newRecordRow.append(Genre);
        newRecordRow.append(Rating);
        newRecordRow.append(ReleaseYear);
        newRecordRow.append(reviewBtn);
        newRecordRow.data("record", record);
        return newRecordRow;
    }

    // This function figures out which post we want to checkout and then calls checkout
    function handleCheckout() {
        var currentRecord = $(this)
            .parent()
            .data("record");
        console.log(currentRecord);
        checkoutMedia(email, currentRecord.id);
    }

    function checkoutMedia(email, id) {
        console.log("checkout - email: " + email + " id: " + id);
        $.ajax({
            method: "GET",
            url: "/user-checkout-media/" + email + "/" + id,
            success: function (data, text) {
                console.log("refresh page after checkoutMedia");
                getAvailableRecords(email);
                getRecords(email);
                $("table").trigger("update");
            },
            error: function (request, status, error) {
                //alert(request.responseText);
                console.log("Check Out Limit Exceeded");
                //alert("Checkout Limit exceeded! Please return some media");
                $("#limit-modal").addClass("is-active");
                //$(".modal-card-title").html("Limit Exceeded");
                $("#limit-modal").show();

                $(".close-limit").on("click", function () {
                    $("#limit-modal").removeClass("is-active");
                });

                $("#close-limit").on("click", function () {
                    $("#limit-modal").removeClass("is-active");
                });
                //$("#sign-up-error").text("Sign up failed: " + email + " already exists");
            }
        });
    }

    // This function figures out which post we want to return 
    function handleReturn() {
        var currentRecord = $(this)
            .parent()
            .data("record");
        console.log(currentRecord);
        returnMedia(email, currentRecord.Medium.id);
        $("table").trigger("update");
        //window.location.href = "/user-return-media/"+email+"/" + currentRecord.Medium.id;
    }

    function returnMedia(email, id) {
        console.log("returnMedia - email: " + email + " id: " + id);
        $.ajax({
            method: "GET",
            url: "/user-return-media/" + email + "/" + id
        }).then(function (result) {
            console.log(result);
            console.log("refresh page after returnMedia");

            getAvailableRecords(email);
            getRecords(email);
            getHistoricalRecords(email);
            $("table").trigger("update");

            //window.location.href = "/user-view/"+email;
            //window.location.reload();
            //getPosts(postCategorySelect.val());
        });
    }

    //Posts the reviews

    function reviewPost() {
        var currentRecord = $(this)
            .parent()
            .data("record");
        //console.log("reviewPost function");
        //console.log(currentRecord);
        $("#review-modal").addClass("is-active");
        $("#review-text").attr("placeholder", "Write your review for " + currentRecord.Medium.name + " here");

        $("#review-submit-button").on("click", function () {
            writeReview(email, currentRecord.Medium.id);
            $("#review-modal").removeClass("is-active");
        });

        $("#review-cancel").on("click", function () {
            $("#review-modal").removeClass("is-active");
        });

        $(".close-review").on("click", function () {
            $("#review-modal").removeClass("is-active");
        });


    }

    // This function figures out which post we want to checkout and then calls checkout
    $(".reviewbtn").click(reviewPost);

    function writeReview(email, id) {
        console.log("write review for Media - email: " + email + " id: " + id);
        $.ajax({
            method: "GET",
            url: "/user-writereview-media/" + email + "/" + id
        }).then(function (result) {
            console.log(result);
            console.log("refresh page after review is written");

            getAvailableRecords(email);
            getRecords(email);
        });
    }

    // This function displays a message when there are no records
    function displayEmpty(id) {
        var query = window.location.search;
        var partial = "";
        if (id) {
            partial = " for email #" + id;
        }
        userDashboard.empty();
        var messageH2 = $("<h2>");
        messageH2.css({
            "text-align": "center",
            "margin-top": "50px"
        });
        messageH2.html("No records yet" + partial + ", navigate <a href='/cms" + query +
            "'>here</a> in order to get started.");
        userDashboard.append(messageH2);
    }
});