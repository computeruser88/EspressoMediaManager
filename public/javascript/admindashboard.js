$(document).ready(function () {

    /* global moment */
    var email = "janedoe@gmail.com";
    // adminDashboard holds all of our records
    var adminDashboard = $(".admin-dashboard");
    var adminHistory = $(".admin-history");

    var currentUrl = window.location.href.split("/");

    // Click events for the checkout and return buttons
    $(document).on("click", "button.checkout", handleCheckout);
    $(document).on("click", "button.return", handleReturn);
    // Variable to hold our records
    var records;

    // media manager button
    $("#media-manager-button").on("click", function () {
        console.log("currentUrl: " + currentUrl);
        currentUrl.pop();
        var targetUrl = currentUrl.join('/');
        targetUrl = targetUrl + "/media-manager";
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

    getRecords(email);
    getHistoricalRecords(email);
    // The code below handles the case where we want to get transaction records for a specific admin
    // Looks for a query param in the url for adminemail
    /*var url = window.location.search;
     var email;
     if (url.indexOf("?email=") !== -1) {
         email = url.split("=")[1];
         getrecords(email);
     }
     // If there's no email we just get all records as usual
     else {
         $(".admin-dashboard").hide();
     }*/

    function getHistoricalRecords(email) {
        console.log(email);
        $.get("/admin-history/" + email, function (data) {
            if (data)
                initializeHistoricalRows(data);
        });
    }


    // This function grabs records from the database and updates the view
    function getRecords(email) {
        $.get("/admin-dashboard/" + email, function (data) {
            records = data;
            if (records)
                initializeRows();
        });
    }

    //this function populates the tables to show the admin all the users 
    function showUsers(name, email) {
        $.ajax({
            method: "GET",
            url: "/admin-show-users/" + name + "/" + email + "/" + medianame + "/" + timelimit
        }).then(function (result) {
            console.log(result);
            window.location.href = "/admin-view";

        });
    }

    //this function populates the tables to show the admin the media
    function showMedia(name, type, genre, timelimit, amountleft) {
        $.ajax({
            method: "GET",
            url: "/admin-show-media/" + name + "/" + type + "/" + genre + "/" + timeleft + "/" + cost
        }).then(function (result) {
            console.log(result);
            window.location.href = "/admin-view";

        });
    }

    // InitializeRows handles appending all of our constructed post HTML inside adminDashboard
    function initializeRows() {
        adminDashboard.empty();
        var recordsToAdd = [];
        adminDashboard.append(createHeaderRow());
        for (var i = 0; i < records.length; i++) {
            recordsToAdd.push(createNewRow(records[i]));
        }
        adminDashboard.append(recordsToAdd);
    }

    function initializeHistoricalRows(data) {
        adminHistory.empty();
        var recordsToAdd = [];
        adminHistory.append(createHistoricalHeaderRow());
        for (i = 0; i < data.length; i++) {
            recordsToAdd.push(createHistoryRow(data[i]));
        }
        adminHistory.append(recordsToAdd);
    }

    function createHeaderRow() {
        var row = $("<tr>");
        var placeholder = $("<th>");
        row.append(placeholder);

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
        newRecordRow.append(returnBtn);

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

        newRecordRow.data("record", record);
        return newRecordRow;
    }

    function createHistoricalHeaderRow() {
        var row = $("<tr>");
        var placeholder = $("<th>");
        row.append(placeholder);

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

        return row;

    }

    function createHistoryRow(record) {
        var newRecord = $("<div>");
        newRecord.addClass("card");
        var checkoutBtn = $("<button>");
        checkoutBtn.text("CHECKOUT");
        checkoutBtn.addClass("checkout btn btn-info");
        var reviewBtn = $("<button>");
        reviewBtn.text("Write Review");
        reviewBtn.addClass("review btn btn-info");

        var newRecordRow = $("<tr>");
        newRecordRow.append(reviewBtn);

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

        newRecordRow.data("record", record);
        return newRecordRow;
    }

    /*
    // This function figures out which post we want to checkout and then calls checkout
    function handleCheckout() {
        var currentRecord = $(this)
            .parent()
            .parent()
            .data("record");
        checkoutMedia(currentPost.id);
    }

    // This function figures out which post we want to return 
    function handleReturn() {
        var currentRecord = $(this)
            .parent()
            .data("record");
        console.log(currentRecord);
        returnMedia(email,currentRecord.Medium.id);
        //window.location.href = "/admin-return-media/"+email+"/" + currentRecord.Medium.id;
    }

    function returnMedia(email,id){
        $.ajax({
            method: "GET",
            url: "/admin-return-media/"+email+"/"+id
        }).then(function(result) {
              console.log(result);
              window.location.href = "/admin-view";
              //getPosts(postCategorySelect.val());
        });
    }

    // This function displays a message when there are no records
    /*function displayEmpty(id) {
        var query = window.location.search;
        var partial = "";
        if (id) {
            partial = " for email #" + id;
        }
        adminDashboard.empty();
        var messageH2 = $("<h2>");
        messageH2.css({
            "text-align": "center",
            "margin-top": "50px"
        });
        messageH2.html("No records yet" + partial + ", navigate <a href='/cms" + query +
            "'>here</a> in order to get started.");
        adminDashboard.append(messageH2);
    }*/

});