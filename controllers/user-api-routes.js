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
  

//[db.Media.name,'Media Name'], db.Transaction.checked_out_date, db.Media.genre, db.Media.type, [db.Media.cost,"cost per day"]
module.exports = function(app) {
  app.get("/user-dashboard/:email", function(req,res) {
    //return all media in the transaction table for this user-email
    var email = req.params.email;

    db.Transaction.findAll({
      attributes : [ 'checked_out_date', 'MediumId', 'returned_date' ] ,
      where: { 
          UserEmail : email
      },
      include: [{
        model: db.Media
      }]
    }).then(function(dbMediaTransaction) {
      res.json(dbMediaTransaction);
    });

  });


};