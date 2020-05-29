var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment"); 

//=====================
//Show New Comment Form
//=====================

router.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){console.log(err);}
        else{
            res.render("comments/new",{campground: campground});
        }
    })
})

//=====================
// Create Comment in DB
//=====================
router.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){console.log(err);
        res.redirect("/campgrounds");}
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){console.log(err);}
                    else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment Successfully Added");
                    res.redirect("/campgrounds/"+ req.params.id);
                }
            })
        }
    })
})
//Edit Comment
router.get("/campgrounds/:id/comments/:comment_id/edit", checkcommentownership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundcomment){
        if(err){
            res.redirect("back")
        }
        else{
            res.render("comments/edit", {comment: foundcomment, campground_id: req.params.id});
        }
    })
})

//Update Comment
router.put("/campgrounds/:id/comments/:comment_id",checkcommentownership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatecomment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })

})

//Delete Comment
router.delete("/campgrounds/:id/comments/:comment_id",checkcommentownership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
        res.redirect("back");
        }else{
            req.flash("success", "Comment Successfully Deleted");
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
})
//==================
//Middleware
//==================
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Logged in first to do that");
    res.redirect("/login");
}

function checkcommentownership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundcomment){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundcomment.author.id.equals(req.user._id)){
                next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }
    else{
        res.redirect("back");
    }
}


module.exports = router;