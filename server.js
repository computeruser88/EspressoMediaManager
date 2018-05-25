// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Static directory
app.use(express.static("public"));

 require('./controllers/admin-api-routes.js')(app);
 require('./controllers/user-api-routes.js')(app);
 require('./controllers/public-api-routes.js')(app);


 //HTML
 app.get("/user-view", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/user-view.html"));
});

app.get("/admin-view", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/admin-view.html"));
});

app.get("/media-manager", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/media-manager.html"));
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/public-view.html"));
});


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
