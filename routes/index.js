var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")

//===============
//Root Route
//===============
router.get("/", function(req, res){
    res.render("landing");
});
//===================
//Register Form Route
//===================
router.get("/register", function(req, res){
    res.render("register");
});
//===========================
//Handling Registration Logic
//===========================
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            })
    })
});

//================
//Login Form Route
//================
router.get("/login", function(req, res){
    res.render("login");
});

//====================
//Handling Login Logic
//====================
router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){

});

//===============
//Logout Route
//===============
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
})
//==================
//Middleware
//==================
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to Login first");
    res.redirect("/login");
}

module.exports = router;