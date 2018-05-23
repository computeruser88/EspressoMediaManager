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
      attributes : [ 'checked_out_date', 'returned_date','Medium.type','Medium.name','Medium.rating','Medium.year','Medium.genre' ] ,
      where: { 
          UserEmail : email,
          returned_date : null
      },
      include: [{
        model: db.Media
      }]
    }).then(function(dbMediaTransaction) {
      res.json(dbMediaTransaction);
    });

  });

  app.get("/user-history/:email", function(req,res) {
    var email = req.params.email;

    db.Transaction.findAll({
      attributes : [ 'checked_out_date', 'returned_date','Medium.type','Medium.name','Medium.rating','Medium.year','Medium.genre' ] ,
      where: { 
          UserEmail : email,
          returned_date : {
            [db.Sequelize.Op.ne] : null
          }
      },
      include: [{
        model: db.Media
      }]
    }).then(function(dbMediaTransaction) {
      res.json(dbMediaTransaction);
    });
  });


};