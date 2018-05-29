// Requiring our models
var db = require("../models");

var offset = 0;
var limit = 10;

module.exports = function(app) {
    app.get("/public", function(req, res) {
        //public view - show top 10 media
        if(req.query.offset) {
            offset = parseInt(req.query.offset);
        }

        if(req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        var attributes = ['id','type','name','artist','rating','year','genre'];
        db.Media.findAll({
            attributes : attributes,
            where: { 
                quantity : { [db.Op.gt]: 0 } 
            },
            offset: offset, 
            limit: limit
          }).then(function(dbMedia) {
            res.json(dbMedia);
        });
    });

    app.get("/public/:type", function(req, res) {
        //public view - show top 10 "type" of books

        var query = {
            quantity : {
                 [db.Op.gt]: 0 
            }
        };
        var type = req.params.type;
        if(type &&  (type.toLowerCase() =="book" || type.toLowerCase() == "movie" || type.toLowerCase() =="music") ){
            query.type = type;
        }

        if(req.query.offset) {
            offset = req.query.offset;
        }

        if(req.query.limit) {
            limit = req.query.limit;
        }

        db.Media.findAll({
            where: query,
            offset: offset, 
            limit: limit
          }).then(function(dbMedia) {
            res.json(dbMedia);
        });
    });

    app.get("/search", function(req,res) {
        if(!req.query.name){
            throw "search parameter name is not defined";
        }
        var query = {
            name : {
                [db.Op.like] : "%"+req.query.name+"%"
            }
        };
        var type = req.query.type;
        if(type &&  (type.toLowerCase() =="book" || type.toLowerCase() == "movie" || type.toLowerCase() =="music") ){
            query.type = type;
        }

        db.Media.findAll({
            where: query
        }).then(function(dbMedia) {
            res.json(dbMedia);
        });

    });

    app.get("/public/user-authenticate/:email/:password",function(req,res) {
        console.log("inside public/user-authenticate/:email/:password");
        if(!req.params.email || !req.params.password) {
            throw "Must provide email AND password for user authentication login";
        }

        var query = {
            email : req.params.email,
            password: req.params.password
        };

        db.User.findAll({
            where : query
        }).then(function(dbUser) {
            var count;
            count = JSON.parse(JSON.stringify(dbUser));
            console.log("dbUser: " + count);
            console.log(count.length);
            res.json(dbUser);            
        });
    });

    app.get("/public/user-authenticate",function(req,res) {
        console.log("in /public/user-authenticate/");
        if(!req.body.email || !req.body.password) {
            throw "Must provide email AND password for user authentication login";
        }
        console.log(res.body);
        var query = {
            email : req.body.email,
            password: req.body.password
        };

        db.User.findAll({
            where : query
        }).then(function(dbUser) {
            var count;
            count = JSON.parse(JSON.stringify(dbUser));
            console.log(count);
            console.log(count.length);
            if(count.length > 0){
                res.redirect("/user-view/"+count[0].email);
            }
            else{
                res.json(dbUser);
            }
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
        //console.log(req.body);
        /*db.User.create(req.body).on('success',function(dbUser){
            res.json(dbUser);
        }).on('failure',function(result){
            console.log("error occured while creating new user");
            throw "error occured while creating a new user";    
        });*/

        db.User.create(req.body).then(function(dbUser) {
            console.log("dbUser: " + dbUser);
            if(dbUser){
                res.json(dbUser);
            }
            else{
                console.log("error occured while creating new user");
                //throw "error occured while creating a new user";
            }
            
        }).catch(db.Sequelize.ValidationError, function (err) {
            console.log("validation error");
            console.log(err);
            //throw "error occured while creating a new user : " + err;
            res.status(400).send('User already exists');
        });
    });



};