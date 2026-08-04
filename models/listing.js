const mongoose = require("mongoose");
// const { title } = require("node:process");
// const { describe } = require("node:test");
const { isStringOneByteRepresentation } = require("node:v8");
const Schema = mongoose.Schema;

let modelSchema = new Schema({
    title:{
        type:String,
        require:true
    },
    description:String,
    location:String,
    price:Number,
    image:{
        type:String,
        default: "https://www.puzzlemania.eu/random-galaxy-1000-pieces-schmidt",
        set: (v) => v === "" ? "https://www.puzzlemania.eu/random-galaxy-1000-pieces-schmidt" : v
    },
    country:String,
    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]

});

let Listing = new mongoose.model("Listing", modelSchema);

module.exports = Listing;