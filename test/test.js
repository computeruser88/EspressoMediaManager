var Nightmare = require("nightmare");
var expect = require("chai").expect;

  //Test for sign up in public view
  new Nightmare({ show: true })
  .goto("https://floating-shelf-58188.herokuapp.com/")
  .click("#signup-button")
  .wait(5000)
  .type("#signup-userName", "Arialyn James")
  .type("#signup-email", "arial1@gmail.com")
  .type("#signup-password", "test")
  .wait(5000)
  // Click the Sign up save button
  .click("#signup-save-button")
  //.screenshot("results.png")
  .evaluate(function() {
    // Assert the "userview" link can be found
    return document.querySelector("a[href='/user-view/arial1@gmail.com']");
  })
  .then(function(link) {
    expect(link).to.not.equal(undefined);
  })
  

    //Test for search in public view
/*
new Nightmare({ show: true })
  .goto("https://floating-shelf-58188.herokuapp.com/")
  ("#search-form", "Toy Story")
  .click("#search")
  //.screenshot("results.png")
  .evaluate(function() {
    // Assert the "userview" link can be found
    return document.querySelector("a[href='/']");
    return document.querySelector("#public-media-view")
  })
  .then(function(link) {
    expect(link).to.not.equal(undefined);
  })
  .end();

*/