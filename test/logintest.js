var Nightmare = require("nightmare");
var expect = require("chai").expect;

    //Test for login in public view
    new Nightmare({ show: true })
    .goto("https://floating-shelf-58188.herokuapp.com/")
    .click("#login-button")
    .wait(5000)
    .type("#login-email", "arial1@gmail.com")
    .type("#login-password", "test")
    .wait(5000)
    // Click the Sign up save button
    .click("#login-save-button")
    //.screenshot("results.png")
    .evaluate(function() {
      // Assert the "userview" link can be found
      return document.querySelector("a[href='/user-view/arial1@gmail.com']");
    })
    .then(function(link) {
      expect(link).to.not.equal(undefined);
    })
    

