var Nightmare = require("nightmare");
var expect = require("chai").expect;

    //Test for login in public view
    new Nightmare({ show: true })
    .goto("https://floating-shelf-58188.herokuapp.com/")
    .click("#login-button")
    .wait(5000)
    .type("#login-email", "admin@example.com")
    .type("#login-password", "admin")
    .wait(5000)
    // Click the Sign up save button
    .click("#login-save-button")
    .wait(10000)
    .click("#admin-dashboard-button")
    //.screenshot("results.png")
    .evaluate(function() {
      // Assert the "userview" link can be found
      return document.querySelector("a[href='/admin-view']");
    })
    .then(function(link) {
      expect(link).to.not.equal(undefined);
    })
    