const express = require("express");
const app = express(); 
const path = require("path"); 
const ejsmate = require("ejs-mate");
const methodoverride = require("method-override");
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
const Listing = require("./models/listing.js")
const mongoose = require("mongoose");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

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
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine("ejs",ejsmate);

const validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    }else{
        next();
    }
}

app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("listings/edit.ejs",{list});
}))
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listData = await Listing.findById(id);
    res.render("listings/show.ejs",{listData});
}))
app.post("/listings",validateListing,wrapAsync(async(req,res)=>{
    const newList = new Listing(req.body); 
    await newList.save();
    res.redirect("/listings");
}))
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
   
    let {id} = req.params; 
    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/listings/${id}`);
}))
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
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