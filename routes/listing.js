const express = require("express");
const router = express.Router();
const path = require("path");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../Joi/schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { revieSchema } = require("../Joi/review.js");
const reviewSchema = require("../Joi/review.js");
const Review = require("../models/review.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// router.get("/", wrapAsync(async (req, res) => {
//     let allListing = await Listing.find({});
//     res.render("./listing/index.ejs", { allListing });
// }));

router.get("/", wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("./listing/index.ejs", { allListing });
}));

router.get("/new", (req, res) => {
    res.render("./listing/new.ejs");
});

router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const listOne = req.body;
    await Listing.insertOne(listOne);
    req.flash("success","New Listing is created");
    res.redirect("/listing");
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs", { listing });
}));

router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let uplist = req.body;
    await Listing.findByIdAndUpdate(id, uplist);
    res.redirect(`/listing/${id}`);
}));

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("review");
    res.render("./listing/show.ejs", { listing });
}));

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    await Review.deleteMany({ _id: { $in: deleteListing.review } });
    req.flash("success", "Listing is Deleted.");
    console.log(deleteListing);
    res.redirect("/listing");
}));

//Post request for review 
router.post("/:id/review", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById({ _id: req.params.id });
    let review = await req.body;
    let newreview = await new Review(review);
    await listing.review.push(newreview);

    await newreview.save();
    await listing.save();
    res.redirect(`/listing/${listing._id}`);
}));

//DELET ROUTE FOR REVIEW
router.delete("/:id/review/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}));

module.exports = router;