const Listing = require("./models/listing")
const Review = require("./models/review")
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema")

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you have to login first");
        res.redirect("/login");
    }else{
        next();
    }
   
}

module.exports.isUserAvailable = (req,res,next)=>{
   if(req.user){
        next();
   }else{
    res.redirect("*");
   }
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next(); 
 }

 module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    if(!res.locals.curUser._id.equals(list.owner._id)){
        req.flash("error","you are not the owner");
        res.redirect(`/listings/${id}`);
    }else{
        next();
    }

 }

 module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!res.locals.curUser._id.equals(review.author._id)){
        req.flash("error","you are not the author of this review");
        res.redirect(`/listings/${id}`);
    }else{
        next();
    }

 }
 
module.exports.validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    // console.log(req.body);
    let{error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    }else{
        next();
    }
}