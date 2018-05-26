$(document).ready(function () {

    /* global moment */
    //var email ="janedoe@gmail.com";

    var currentUrl = window.location.href.split("/");
    var email = currentUrl.pop();
    //console.log(id);
    console.log(email);

    // userDashboard holds all of our records
    var userDashboard = $(".user-dashboard");
    var userHistory = $(".user-history");
    var userAvailableMedia = $(".user-available-media");

    // Click events for the checkout and return buttons
    $(document).on("click", "button.checkout", handleCheckout);
    $(document).on("click", "button.return", handleReturn);
    // Variable to hold our records
    var records;

    // logout button
    $("#logout-button").on("click", function() {
        console.log("currentUrl: " + currentUrl);
        currentUrl.pop();
        var targetUrl = currentUrl.join('/');
        console.log(targetUrl);
        //console.log(targetUrl);
        window.location.replace(targetUrl);
    });

    getAvailableRecords(email);
    getRecords(email);
    getHistoricalRecords(email);
    // The code below handles the case where we want to get transaction records for a specific user
    // Looks for a query param in the url for useremail
   /*var url = window.location.search;
    var email;
    if (url.indexOf("?email=") !== -1) {
        email = url.split("=")[1];
        getrecords(email);
    }
    // If there's no email we just get all records as usual
    else {
        $(".user-dashboard").hide();
    }*/
 

    function getHistoricalRecords(email) {
        $.get("/user-history/"+ email, function (data) {
            if (data)
                //initializeHistoricalRows(data);
                initRows(userHistory,data,createHistoricalHeaderRow,createHistoryRow);
        });
    }


    // This function grabs records from the database and updates the view
    function getRecords(email) {
        $.get("/user-dashboard/"+ email, function (data) {
            if (data)
                //initializeRows(data);
                initRows(userDashboard,data,createHeaderRow,createNewRow);
        });
    }

    function getAvailableRecords(email) {
        console.log("getting available media for user email: " + email);
        $.get("/user-available-media/"+ email, function (data) {
            console.log(data);
            if (data)
                initRows(userAvailableMedia,data,createAvailableHeaderRow,createAvailableRow);
        });
    }

    function initRows(tableClass,data,headerRowFunc,newRowFunc){
        tableClass.empty();
        var recordsToAdd = [];
        tableClass.append(headerRowFunc());
        for(var i = 0; i < data.length; i++){
            recordsToAdd.push(newRowFunc(data[i]));
        }
        tableClass.append(recordsToAdd);
    }

    function createAvailableHeaderRow(){
        var row = $("<tr>");
        var placeholder = $("<th>");
        row.append(placeholder);

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

        return row;

    }

    // This function constructs a a record's row
    function createAvailableRow(record) {
        var newRecord = $("<div>");
        newRecord.addClass("card");
        var checkoutBtn = $("<button>");
        checkoutBtn.text("CHECKOUT");
        checkoutBtn.addClass("checkout btn btn-info");
        
        var newRecordRow= $("<tr>");
        newRecordRow.append(checkoutBtn);

        var Name = $("<td>");
        Name.text(record.name);
        var Type = $("<td>");
        Type.text(record.type);
        var Genre= $("<td>");
        Genre.text(record.genre);
        var Rating= $("<td>");
        Rating.text(record.rating);
        var ReleaseYear = $("<td>");
        ReleaseYear.text(record.year);

        newRecordRow.append(Name);
        newRecordRow.append(Type);
        newRecordRow.append(Genre);
        newRecordRow.append(Rating);
        newRecordRow.append(ReleaseYear);
 
        newRecordRow.data("record",record);
        return newRecordRow;
    }

    function createHeaderRow(){
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
        
        var newRecordRow= $("<tr>");
        newRecordRow.append(returnBtn);

        var Name = $("<td>");
        Name.text(record.Medium.name);
        var checkedOut = $("<td>");
        checkedOut.text(record.checked_out_date);
        var Type = $("<td>");
        Type.text(record.Medium.type);
        var Genre= $("<td>");
        Genre.text(record.Medium.genre);
        var Rating= $("<td>");
        Rating.text(record.Medium.rating);
        var ReleaseYear = $("<td>");
        ReleaseYear.text(record.Medium.year);

        newRecordRow.append(Name);
        newRecordRow.append(checkedOut);
        newRecordRow.append(Type);
        newRecordRow.append(Genre);
        newRecordRow.append(Rating);
        newRecordRow.append(ReleaseYear);
 
        newRecordRow.data("record",record);
        return newRecordRow;
    }

    function createHistoricalHeaderRow(){
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
        
        var newRecordRow= $("<tr>");
        newRecordRow.append(reviewBtn);

        var Name = $("<td>");
        Name.text(record.Medium.name);
        var checkedOut = $("<td>");
        checkedOut.text(record.checked_out_date);
        var returned = $("<td>");
        returned.text(record.returned_date);
        var Type = $("<td>");
        Type.text(record.Medium.type);
        var Genre= $("<td>");
        Genre.text(record.Medium.genre);
        var Rating= $("<td>");
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
 
        newRecordRow.data("record",record);
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
        //window.location.href = "/user-return-media/"+email+"/" + currentRecord.Medium.id;
    }

    function returnMedia(email,id){
        $.ajax({
            method: "GET",
            url: "/user-return-media/"+email+"/"+id
        }).then(function(result) {
              console.log(result);
              window.location.href = "/user-view/"+email;
              window.location.reload();
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
        userDashboard.empty();
        var messageH2 = $("<h2>");
        messageH2.css({
            "text-align": "center",
            "margin-top": "50px"
        });
        messageH2.html("No records yet" + partial + ", navigate <a href='/cms" + query +
            "'>here</a> in order to get started.");
        userDashboard.append(messageH2);
    }*/

});