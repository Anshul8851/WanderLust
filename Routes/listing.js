const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema} = require("../models/listing");
const Listing = require("../models/listing")
const ExpressError = require("../utils/ExpressError")


const validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    }else{
        next();
    }
}

router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("listings/edit.ejs",{list});
}))
router.get("",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listData = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listData});
}))
router.post("/",validateListing,wrapAsync(async(req,res)=>{
    const newList = new Listing(req.body); 
    await newList.save();
    res.redirect("/listings");
}))
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
   
    let {id} = req.params; 
    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/listings/${id}`);
}))
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
}))

module.exports = router;