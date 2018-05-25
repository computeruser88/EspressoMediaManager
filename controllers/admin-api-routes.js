// Requiring our models
var db = require("../models");

module.exports = function(app) {
    app.post("/admin-add-media", function(req, res) {
        //insert a new media record, assuming req.body provides all the necessary fields
        db.Media.create(req.body).then(function(dbMedia) {
            //res.redirect('/media-manager');
          res.json(dbMedia);
        });
    });

    //admin-update-media API route needed - to allow admin to update media's quantity and time_limit
    app.get("/admin-update-media/:mediaid/:quantity/:time_limit", function(req,res) {
        var mediaId = req.params.mediaid;
        var quantity = req.params.quantity;
        var time_limit = req.params.time_limit;

        db.Media.findOne({
            where : {
                id : mediaId
            }
        }).then(function(obj){
            console.log(JSON.stringify(obj));
            if(obj) {
                console.log("Media exists. Let's update these quantity and time_limit fields");
                if(quantity) {
                    obj.update(
                        {quantity : quantity}
                    ).then(function(result) {
                        console.log(JSON.stringify(result));
                        console.log("quantity field updated");
                    });
                }

                if(time_limit) {
                    obj.update({ 
                        time_limit: time_limit
                    }).then(function(result) {
                        console.log(JSON.stringify(result));
                        console.log("time_limit field updated");
                        res.json(result);
                    });
                }
            }
            else{
                console.log("No media with this ID : " + mediaId + " found. Nothing to update");
            }
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
                ['id','ASC']
            ]
          }).then(function(dbMedia) {
            res.json(dbMedia);
        });

    });

};
