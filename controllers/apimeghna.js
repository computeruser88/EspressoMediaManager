/*
  
  // /user-writereview-media/:email/:mediaId - check the media is returned and update the review in the review table
      app.get("/user-writereview-media/:email/:mediaId",function(req,res) {
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
              review: writeReview(),
            }).then(function(result) {
              console.log("Updated review of the media");
              db.Media.update('quantity', { where :
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

      */