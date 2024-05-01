const Listing = require("../models/listing")

module.exports.allListings = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderListing = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.getListingById = async(req,res)=>{
    let {id} = req.params;
    let listData = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listData){
        req.flash("error","This list does not exist now!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listData});
}

module.exports.createNewListing = async(req,res)=>{
    // console.log(req.body);
    let{path,filename} = req.file;
    const newList = new Listing(req.body); 
    newList.owner = req.user._id;
    let url = path;
    newList.image = {url,filename};
    await newList.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params; 
    // with the help of findByIdAndUpdate function everything is updated except our new image
    let listing = await Listing.findByIdAndUpdate(id,{...req.body});
    if(typeof req.file !== "undefined"){
        let{path,filename} = req.file;
        let url = path;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Changes Saved Successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success","Deleted Successfully");
    res.redirect("/listings");
}

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error","This list does not exist now!");
        res.redirect("/listings");
    }else{
        list.image.url = list.image.url.replace("/upload","/upload/h_300,w_300");
        res.render("listings/edit.ejs",{list});
    }
   
}
module.exports.findByCountryName = async(req,res)=>{
    let {country} = req.body;
    // console.log(country);
    if(country){
        let country1 = country.toUpperCase();
        const allListings = await Listing.find({country:country1});
        // console.log(allListings);
        res.render("listings/index.ejs",{allListings});
        // res.redirect("/listings");
    }else{
        res.redirect("/listings");
    }
   
}

module.exports.trendingListings = async(req,res)=>{
    const allListings = await Listing.find({category:"Trending"});
    if(allListings.length !== 0){
        res.render("listings/index.ejs",{allListings});
    }
    else{
        res.redirect("/listings");
    }
   
}

module.exports.roomListings = async(req,res)=>{
    const allListings = await Listing.find({category:"Room"});
    if(allListings.length !== 0){
        res.render("listings/index.ejs",{allListings});
    }
    else{
        res.redirect("/listings");
    }
   
}

module.exports.iconicListings = async(req,res)=>{
    const allListings = await Listing.find({category:"Iconic Cities"});
    if(allListings.length !== 0){
        res.render("listings/index.ejs",{allListings});
    }
    else{
        res.redirect("/listings");
    }
   
}

module.exports.mountainListings = async(req,res)=>{
    const allListings = await Listing.find({category:"Mountain"});
    if(allListings.length !== 0){
        res.render("listings/index.ejs",{allListings});
    }
    else{
        res.redirect("/listings");
    }
   
}

module.exports.castleListings = async(req,res)=>{
    const allListings = await Listing.find({category:"Castles"});
    if(allListings.length !== 0){
        res.render("listings/index.ejs",{allListings});
    }
    else{
        res.redirect("/listings");
    }
   
}

module.exports.amazingListings = async(req,res)=>{
    const allListings = await Listing.find({category:"Amazing Pools"});
    if(allListings.length !== 0){
        res.render("listings/index.ejs",{allListings});
    }
    else{
        res.redirect("/listings");
    }
   
}