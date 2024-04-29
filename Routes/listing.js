const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema} = require("../schema");
const Listing = require("../models/listing")
const ExpressError = require("../utils/ExpressError")
const {isLoggedIn,isOwner} = require("../middleware");

const validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    }
    else{
        next();
    }
}

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error","This list does not exist now!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{list});
}))
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
})
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listData = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listData){
        req.flash("error","This list does not exist now!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listData});
}))
router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
    const newList = new Listing(req.body); 
    newList.owner = req.user._id;
    await newList.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}))
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
   
    let {id} = req.params; 
   
    await Listing.findByIdAndUpdate(id,{...req.body});
    req.flash("success","Changes Saved Successfully");
    res.redirect(`/listings/${id}`);
}))


router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success","Deleted Successfully");
    res.redirect("/listings");
}))

module.exports = router;