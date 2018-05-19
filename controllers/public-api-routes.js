// Requiring our models
var db = require("../models");

var offset = 0;
var limit = 10;

module.exports = function(app) {
    app.get("/", function(req, res) {
        //public view - show top 10 media
        if(req.query.offset) {
            offset = req.query.offset;
        }

        if(req.query.limit) {
            limit = req.query.limit;
        }

        db.Media.findAll({
            where: { 
                quantity : { [db.Op.gt]: 0 } 
            },
            offset: offset, 
            limit: limit
          }).then(function(dbMedia) {
            res.json(dbMedia);
        });
    });

    app.get("/search/:name", function(req,res) {
        if(!req.params.name){
            throw "search parameter name is not defined";
        }
        var query = {
            name : {
                [db.Op.like] : "%"+req.params.name+"%"
            }
            
        };
        db.Media.findAll({
            where: query
        }).then(function(dbMedia) {
            res.json(dbMedia);
        });

    });

    app.get("/public/user-authenticate/:email/:passwd",function(req,res) {
        if(!req.params.email || !req.params.passwd) {
            throw "Must provide email AND password for user authentication login";
        }

        var query = {
            email : req.params.email,
            password: req.params.passwd
        };

        db.User.findAll({
            where : query
        }).then(function(dbUser) {
            res.json(dbUser);
        });
    });

    app.get("/public/check-email/:email",function(req,res) {
        //this api-route is used to check if an email already exits in the User db
        //this should be performed prior to creating a new user, to make sure 1 email per user account
        //ideally should be done on-type of the "email" input in the form

        if(!req.params.email){
            throw "Must provide valid email input to check if it exists in DB";
        }
        var query = {
            email : req.params.email
        };

        db.User.findAll({
            where : query
        }).then(function(dbUser) {
            res.json(dbUser);
        });

    });

    app.post("/public/new-user", function(req,res) {
        //this post API should only be called after it's been confirmed that there's no existing user with this input email
        //input should come from form body

        db.User.create(req.body).then(function(dbUser) {
            res.json(dbUser);
        });
    });



};