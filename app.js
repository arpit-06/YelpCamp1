var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    body                  = require("body-parser"),
    LocalStrategy         = require("passport-local"),
    passportlocalmongoose = require("passport-local-mongoose"),
    flash                 = require("connect-flash"),
    User                  = require("./models/user"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    methodoverride        = require("method-override")

//requiring routes    
var commentRoutes         = require("./routes/comments"),
    campgroundRoutes      = require("./routes/campgrounds"),
    indexRoutes           = require("./routes/index")
//var seeddb = require("./seeds");
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true,
// useUnifiedTopology: true
// });

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Arpit:12345@cluster0-cqrno.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


// mongoose.connect("mongodb://Arpit:12345@cluster0-cqrno.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true,
// useUnifiedTopology: true
//  });
//mongodb+srv://Arpit:12345@cluster0-cqrno.mongodb.net/test?retryWrites=true&w=majority
app.use(body.urlencoded({extended:true}));
app.use(express.static(__dirname+ "/public"));
app.use(flash());
app.set("view engine", "ejs");
app.use(methodoverride("_method"));
//seeddb();


//=============================================
//Authentication Stuff
//=============================================
app.use(require("express-session")({
    secret: "I love Virat and Arijit",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentuser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})
//=======================================================



app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000, function(){
    console.log("The YelpCamp Server is starting!!!!")
});