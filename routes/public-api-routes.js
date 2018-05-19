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



};