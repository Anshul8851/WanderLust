const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/review");
const {reviewSchema} = require("../schema");
const { isLoggedIn,isReviewAuthor } = require("../middleware");


const validateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    }else{
        next();
    }
}

router.post("",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let id = req.params.id;
  
    let list = await Listing.findById(id);
    
    let newReview = new Review(req.body);
    newReview.author = req.user._id; 
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    req.flash("success","Review Created Successfully");
    res.redirect(`/listings/${id}`)
}));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);

}))

module.exports = router;