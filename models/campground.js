var mongoose = require("mongoose");
var campgroundschema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    description: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: "Comment"
        }
    ]
});
module.exports = mongoose.model("Campground", campgroundschema);