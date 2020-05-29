var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//====================
//Show All Campgrounds
//====================
router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allcampgrounds});
        }
    })
});
//===========================
//Create New Campground in DB
//===========================
router.post("/campgrounds", isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newcampground = {name: name, image: image, price: price, description: desc, author: author};
    Campground.create(newcampground, function(err, newlycreated){
        if(err){
            console.log("something went wrong");
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    })
});
//==================================
//Show Form to create new campground
//==================================
router.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});                                                     
//==========================================
//Show more info about particular Campground
//==========================================
router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show", {campground: foundcampground})
        }
    });
});

//Edit Route
router.get("/campgrounds/:id/edit", checkcampgroundownership, function(req, res){
    Campground.findById(req.params.id, function(err, foundcampground){
        res.render("campgrounds/edit", {campground: foundcampground});
         });
});
//Update Route
router.put("/campgrounds/:id", checkcampgroundownership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedcampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })
})

//Destroy Campground
router.delete("/campgrounds/:id", checkcampgroundownership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
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

function checkcampgroundownership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundcampground){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundcampground.author.id.equals(req.user._id)){
                next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You need to be Logged in first to do that");
        res.redirect("back");
    }
}


module.exports = router;