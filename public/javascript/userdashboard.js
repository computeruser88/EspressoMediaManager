$(document).ready(function () {
    /* global moment */
var email ="janedoe@gmail.com";
    // userDashboard holds all of our records
    var userDashboard = $(".user-dashboard");

    // Click events for the checkout and return buttons
    $(document).on("click", "button.checkout", handleCheckout);
    $(document).on("click", "button.return", handleReturn);
    // Variable to hold our records
    var records;

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


    // This function grabs records from the database and updates the view
    function getrecords(email) {

        $.get("/user-dashboard/"+ email, function (data) {
            console.log("records", data);
            records=data;
            if (records)
                initializeRows();
        });
    }

    // InitializeRows handles appending all of our constructed post HTML inside userDashboard
    function initializeRows() {
        userDashboard.empty();
        var recordsToAdd = [];
        for (var i = 0; i < records.length; i++) {
            recordsToAdd.push(createNewRow(records[i]));
        }
        userDashboard.append(recordsToAdd);
    }

    // This function constructs a post's HTML
    function createNewRow(record) {

        var newRecord = $("<div>");
        newRecord.addClass("card");
        var newRecordHeading = $("<div>");
        newRecordHeading.addClass("card-header");
        var checkoutBtn = $("<button>");
        checkoutBtn.text("CHECKOUT");
        checkoutBtn.addClass("checkout btn btn-info");
        var returnBtn = $("<button>");
        returnBtn.text("RETURN");
        returnBtn.addClass("return btn btn-info");
        var Name = $("<td>");
        var Type = $("<td>");
        var Genre= $("<td>");
        var Rating= $("<td>");
        var ReleaseYear = $("<td>");
        var Quantity = $("<td");
        var TimeLimit = $("<td>");
        var Cost= $("<td>");
        newRecordBody.addClass("card-body");
        var newPostBody = $("<tr>");
        newPostBody.text(post.body);
        newRecordHeading.append(checkoutBtn);
        newRecordHeading.append(returnBtn);
        newRecordHeading.append(Name);
        newRecordHeading.append(Type);
        newRecordHeading.append(Genre);
        newRecordHeading.append(Rating);
        newRecordHeading.append(ReleaseYear);
        newRecordHeading.append(Quantity);
        newRecordHeading.append(TimeLimit);
        newRecordHeading.append(Cost);
        newRecordBody.append(newPostBody);
        newRecord.append(newRecordHeading);
        newRecord.append(newRecordBody);
        newRecord.data("record", record);
        return newRecord;
    }

    // This function figures out which post we want to delete and then calls deletePost
    function handlehandleCheckout() {
        var currentRecord = $(this)
            .parent()
            .parent()
            .data("record");
        checkoutMedia(currentPost.id);
    }

    // This function figures out which post we want to edit and takes it to the appropriate url
    function handleReturn() {
        var currentRecord = $(this)
            .parent()
            .parent()
            .data("record");
        window.location.href = "/cms?post_id=" + currentRecord.id;
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