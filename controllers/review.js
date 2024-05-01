const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.destroyReview = async(req,res)=>{
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);

}

module.exports.postNewReview = async(req,res)=>{
    let id = req.params.id;
  
    let list = await Listing.findById(id);
    
    let newReview = new Review(req.body);
    newReview.author = req.user._id; 
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    req.flash("success","Review Created Successfully");
    res.redirect(`/listings/${id}`)
}