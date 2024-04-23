const express = require("express");
const app = express(); 
const path = require("path"); 
const ejsmate = require("ejs-mate");
const methodoverride = require("method-override");
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
const Listing = require("./models/listing.js")
const Review = require("./models/review.js");
const mongoose = require("mongoose");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const router = require("./Routes/listing.js")
const url = "mongodb+srv://anshulsharma8882:bhardwaj90@cluster0.a0ubw0b.mongodb.net/";

app.use(express.urlencoded({extended:true}));

main().then((res)=>{
    console.log("DB CONNECTION SUCCESSFUL");
}).
catch((err)=>{
    console.log(err);
}) 
async function main(){
    await mongoose.connect(url);
} 

app.set("view engine","ejs");
app.engine("ejs",ejsmate);
app.set("views",path.join(__dirname,"views"));




const validateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    }else{
        next();
    }
}

app.use("/listings",router);
// const validateListing = (req,res,next)=>{
//     let{error} = listingSchema.validate(req.body);
//     if(error){
//         throw new ExpressError(404,error);
//     }else{
//         next();
//     }
// }

app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let id = req.params.id;
  
    let list = await Listing.findById(id);
    
    let newReview = new Review(req.body); 
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    res.redirect(`/listings/${id}`)
}));

app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);

}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})



app.use((err,req,res,next)=>{
    let{statusCode = 500,message} = err;
    res.render("listings/error.ejs",{message});
    // res.status(statusCode).send(message);
})
app.listen(3000,()=>{ 
    console.log("server is listening");
})