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



};