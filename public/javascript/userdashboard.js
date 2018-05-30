$(document).ready(function () {

    /* global moment */
    //var email ="janedoe@gmail.com";
    var currentUrl = window.location.href.split("/");
    var email = currentUrl.pop();
    //console.log(id);
    console.log(email);
    $('table').tablesorter();
    // userDashboard holds all of our records
    var userDashboard = $(".user-dashboard");
    var userDashboardHeader = $(".user-dashboard-header");
    var userHistory = $(".user-history");
    var userHistoryHeader = $(".user-history-header");
    var userAvailableMedia = $(".user-available-media");
    var userAvailableMediaHeader = $(".user-available-media-header");
    var helloUser = $("#hello-user");

    // Click events for the checkout and return button
    $(document).on("click", "button.checkout", handleCheckout);
    $(document).on("click", "button.return", handleReturn);
    $(document).on("click", "button.review", reviewPost);
    // Variable to hold our records
    var records;
    // logout button
    $("#logout-button").on("click", function () {
        console.log("currentUrl: " + currentUrl);
        currentUrl.pop();
        var targetUrl = currentUrl.join('/');
        console.log(targetUrl);
        //console.log(targetUrl);
        window.location.replace(targetUrl);
    });

    getUserName(email);
    getAvailableRecords(email);
    getRecords(email);
    getHistoricalRecords(email);



    function getUserName(email) {
        $.get("/public/check-email/" + email, function (data) {
            if (data) {
                console.log(data);
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
                $("#user-history").trigger("update");
        });
    }


    // This function grabs records from the database and updates the view
    function getRecords(email) {
        $.get("/user-dashboard/" + email, function (data) {
            if (data)
                //initializeRows(data);
                initRows(userDashboardHeader, userDashboard, data, createHeaderRow, createNewRow);
                $("#user-dashboard").trigger("update");
        });
    }

    function getAvailableRecords(email) {
        console.log("getting available media for user email: " + email);
        $.get("/user-available-media/" + email, function (data) {
            console.log(data);
            if (data)
                initRows(userAvailableMediaHeader, userAvailableMedia, data, createAvailableHeaderRow, createAvailableRow);
                $("#user-available-media").trigger("update");
        });
    }

    function initRows(tableHeaderClass, tableClass, data, headerRowFunc, newRowFunc) {
        tableClass.empty();
        tableHeaderClass.empty();
        var recordsToAdd = [];
        tableHeaderClass.append(headerRowFunc());
        for (var i = 0; i < data.length; i++) {
            recordsToAdd.push(newRowFunc(data[i]));
        }
        //var tbody = $("<tbody>");
        //tbody.append(recordsToAdd);
        tableClass.append(recordsToAdd);
        tableClass.tablesorter();
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
        row.append(placeholder);

        return row;

    }

    // This function constructs a a record's row
    function createAvailableRow(record) {
        var newRecord = $("<div>");
        newRecord.addClass("card");

        var checkoutBtn = $("<button>");
        checkoutBtn.text("CHECKOUT");
        checkoutBtn.addClass("checkout btn btn-info");

        var newRecordRow = $("<tr>");
        // newRecordRow.append(synopsisBtn);
     

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
        newRecordRow.data("record", record);
        return newRecordRow;
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