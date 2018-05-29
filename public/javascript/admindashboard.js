$(document).ready(function () {

    /* global moment */
    // adminDashboard holds all of our records
    var allUsers = $(".all-users");
    var allMedia = $(".all-media");

    var currentUrl = window.location.href.split("/");

    // Click events for the checkout and return buttons
    //$(document).on("click", "button.checkout", handleCheckout);
    //$(document).on("click", "button.return", handleReturn);
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

    showUsers();
    showMedia();
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

    //this function populates the tables to show the admin all the users 
    function showUsers() {
        $.get("/admin-show-users/", function (data) {
            if (data)
            initRows(allUsers,data,createUserHeaderRow,createUserRow);
                //initializeHistoricalRows(data);
        });
    }


    //this function populates the tables to show the admin the media
    function showMedia() {
        $.get("/admin-show-media/", function (data) {
            if (data)
                initRows(allMedia,data,createMediaHeaderRow,createMediaRow);
        });
    }

    function initRows(tableClass, data, headerRowFunc, newRowFunc) {
        tableClass.empty();
        var recordsToAdd = [];
        tableClass.append(headerRowFunc());
        for (var i = 0; i < data.length; i++) {
            recordsToAdd.push(newRowFunc(data[i]));
        }
        tableClass.append(recordsToAdd);
    }


    function createUserHeaderRow() {
        var row = $("<tr>");

        var name = $("<th>");
        name.text("Name");
        row.append(name);

        var email= $("<th>");
        email.text("Email");
        row.append(email);

        var totalCheckedOut = $("<th>");
        totalCheckedOut.text("Total Media Checked out");
        row.append(totalCheckedOut);

        var balance = $("<th>");
        balance.text("Balance");
        row.append(balance);

        return row;
    }
    // This function constructs a a record's row
    function createUserRow(record) {
        var newRecord = $("<div>");
        newRecord.addClass("card");

        var newRecordRow = $("<tr>");
        //newRecordRow.append(returnBtn);

        var Name = $("<td>");
        Name.text(record.name);
        var email = $("<td>");
        email.text(record.email);
        var count = $("<td>");
        count.text(0);
        var balance = $("<td>");
        balance.text(record.balance);

        newRecordRow.append(Name);
        newRecordRow.append(email);
        newRecordRow.append(count);
        newRecordRow.append(balance);

        newRecordRow.data("record", record);
        return newRecordRow;
    }

    function createMediaHeaderRow() {
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

        var quantity = $("<th>");
        quantity.text("Quantity");
        row.append(quantity);

        var time_limit = $("<th>");
        time_limit.text("Time Limit");
        row.append(time_limit);

        return row;

    }

    function createMediaRow(record) {
        var newRecord = $("<div>");
        newRecord.addClass("card");

        var newRecordRow = $("<tr>");
        //newRecordRow.append(reviewBtn);

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
        var quantity = $("<td>");
        quantity.text(record.quantity);
        var time_limit = $("<td>");
        time_limit.text(record.time_limit);

        newRecordRow.append(Name);
        newRecordRow.append(Type);
        newRecordRow.append(Genre);
        newRecordRow.append(Rating);
        newRecordRow.append(ReleaseYear);
        newRecordRow.append(quantity);
        newRecordRow.append(time_limit);

        newRecordRow.data("record", record);
        return newRecordRow;
    }

    
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
    function displayEmpty(id) {
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
    }

});