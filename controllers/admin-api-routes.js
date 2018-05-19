// Requiring our models
var db = require("../models");

module.exports = function(app) {
    app.post("/admin-add-media", function(req, res) {
        //insert a new media record, assuming req.body provides all the necessary fields
        db.Media.create(req.body).then(function(dbMedia) {
          res.json(dbMedia);
        });
    });

    app.get("/admin-show-users", function(req,res) {
        db.User.findAll({
            where: { 
                type : "user"
            },
            order : [
                ['balance','DESC'],
                ['name','ASC']
            ]
          }).then(function(dbUser) {
            res.json(dbUser);
        });
    });

    app.get("/admin-show-media", function(req,res) {
        //this is different from public show media API, as in public version only shows "top rated available" media
        //this will return all media sorted by quantity in ASC so that those with low or no quantity can be brought to admin's attention immediately

        db.Media.findAll({
            order : [
                ['quantity','ASC']
            ]
          }).then(function(dbMedia) {
            res.json(dbMedia);
        });

    });

};