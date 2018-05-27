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


function findAllCheckedOutMedia(email,cb,anotherCb){

    var attributes = [ 'checked_out_date', 'returned_date'];
    var mediaAttributes = ['id','type','name','rating','year','genre'];
    db.Transaction.findAll({
      attributes : attributes,
      where: { 
          UserEmail : email,
          returned_date : null
      },
      include: [{
        model: db.Media, attributes: mediaAttributes
      }]
    }).then(function(dbMediaTransaction) {
      console.log(JSON.parse(JSON.stringify(dbMediaTransaction)));
      var results = JSON.parse(JSON.stringify(dbMediaTransaction));
      var checkedOutMediaIds = [];
      for(i = 0;i < results.length; i++){
        checkedOutMediaIds.push(results[i].Medium.id);
      }
      console.log("checkedOutMediaIds: " + checkedOutMediaIds);
      if(anotherCb){
        cb(email,checkedOutMediaIds,function(data){
          anotherCb(data);
        });
      }
      else{
        cb(dbMediaTransaction);
      }
      
    });
};

function findAvailableMedia(email,excludeMediaIds,cb) {
  //exclude the Id's currently checked out. 
  var mediaAttributes = ['id','type','name','rating','year','genre'];
    db.Media.findAll({
      attributes : mediaAttributes,
      where: { 
          quantity : {
            [db.Sequelize.Op.gt] : 0
          },
          id : {
            [db.Sequelize.Op.notIn] : excludeMediaIds
          }
      },
      include: [{
        model: db.Transaction, 
        required:false,
        attributes: ['returned_date','checked_out_date'],
        where : {
          [db.Sequelize.Op.or] : [{UserEmail : { [db.Sequelize.Op.ne] : email}}, {UserEmail : null}],
          returned_date : {
            [db.Sequelize.Op.ne] : null
          }
        }
      }]
    }).then(function(dbMedia) {
      cb(dbMedia);
    });
}

module.exports = function(app) {
  app.get("/user-dashboard/:email", function(req,res) {
    //return all media in the transaction table for this user-email
    var email = req.params.email;
    findAllCheckedOutMedia(email,function(data){
      res.json(data);
    });

  });

  app.get("/user-total-checkedout/:email", function(req,res) {
    //return total number of media currently checked out by a user (that hasn't been returned yet)
    var email = req.params.email;

    db.Transaction.findAll({
      attributes : [ [db.sequelize.fn('COUNT', db.sequelize.col('MediumId')), 'total'] ] ,
      where: { 
          UserEmail : email,
          returned_date : null
      }
    }).then(function(dbMediaTransaction) {
      res.json(dbMediaTransaction);
    });

  });

  app.get("/user-available-media/:email", function(req,res){
    //return a list of media that is available for a particular user to check-out/rent/borrow
    //user must not currently have this media checked out
    //make sure media quantity is greater than
    var email = req.params.email;
    //findAll(email,availableMedia);
    console.log("/user-available-media/:email route API");
    findAllCheckedOutMedia(email,findAvailableMedia,function(data){
      res.json(data);
    });

  });
  

  //More API routes to create
  // /user-checkout-media/:email/:mediaId - check the current count and only proceed if current count is less than 6
      // create a new transaction record, and update quantity in media table
  app.get("/user-checkout-media/:email/:mediaId",function(req,res) {
    var email = req.params.email;
    var mediaId = req.params.mediaId;
    var count = 0;

    //first check current count of checked out media
    db.Transaction.findAll({
      attributes : [ [db.sequelize.fn('COUNT', db.sequelize.col('MediumId')), 'total'] ] ,
      where: { 
          UserEmail : email,
          returned_date : null
      }
    }).then(function(dbMediaTransaction) {
      if(dbMediaTransaction) {
        count = JSON.parse(JSON.stringify(dbMediaTransaction));
        count = parseInt(count[0].total);
        if(count < 6) {
          db.Transaction.create({
            checked_out_date : Date.now(),
            returned_date : null,
            UserEmail : email,
            MediumId : mediaId
          }).then(function(dbTransaction) {
            console.log("new transaction created: " + JSON.stringify(dbTransaction));
            //update media quantity
            db.Media.decrement('quantity', { where :
              {id : mediaId}
            }).then(function(dbMedia) {
              console.log("Decremented media quantity for id : " + mediaId);
              res.json(dbTransaction);
            });
          });
        }
        
      }
      else {
        throw "invalid transaction record for user email: " + email;
      }

    });
  })


  // /user-return-media/:email/:mediaId - allow user to return media, update returned_date in transaction, and quantity in media
  app.get("/user-return-media/:email/:mediaId", function(req,res) {
    var email = req.params.email;
    var mediaId = req.params.mediaId;

    db.Transaction.findOne({
      where : {
        UserEmail: email,
        MediumId : mediaId
      }
    }).then(function(obj) {
      if(obj) {
        //console.log(JSON.stringify(obj));
        console.log("Transaction exists already for this email: " + email + " and for Media ID: " + mediaId);
        obj.update({
          returned_date: Date.now() 
        }).then(function(result) {
          console.log("Returned media by setting returned_date value. Now update media's quantity");
          db.Media.increment('quantity', { where :
            {id : mediaId}
          }).then(function(dbMedia) {
            console.log("Incremented media quantity for id : " + mediaId);
            res.json(result);
            //res.redirect("/user-view/"+email);
          });
        })
      }
      else{
        console.log("transaction does not exist for User Email: " + email + " and for Media ID: " + mediaId);
        console.log("nothing to return");
        res.redirect("/user-view/"+email);
      }
    });
  });

  app.get("/user-history/:email", function(req,res) {
    //returns all the historical rental history of media that have been returned
    var email = req.params.email;
    var attributes = [ 'checked_out_date', 'returned_date'];
    var mediaAttributes = ['id','type','name','rating','year','genre'];

    db.Transaction.findAll({
      attributes : attributes,
      where: { 
          UserEmail : email,
          returned_date : {
            [db.Sequelize.Op.ne] : null
          }
      },
      include: [{
        model: db.Media, attributes: mediaAttributes
      }]
    }).then(function(dbMediaTransaction) {
      res.json(dbMediaTransaction);
    });
  });

  


};