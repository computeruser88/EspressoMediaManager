// Requiring our models
var db = require("../models");
var router = require('express').Router();


// creating a new user
router.post('/user/new', function(req, res) {
    var newUser = req.body;
  
    db.User.create(newUser)
    .then(function(user) {
      res.redirect('/')
    })
    .catch(function(err) {
      res.json(err)
    })
  })
  
module.exports = function(app) {

};