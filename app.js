const express = require("express");
const app = express();
const path = require("path");
const url = "mongodb+srv://anshulsharma8882:bhardwaj90@cluster0.a0ubw0b.mongodb.net/";

const Listing = require("./models/listing.js")
const mongoose = require("mongoose");
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
app.set("views",path.join(__dirname,"views"));
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("/listings/index.ejs",{allListings});
})

app.listen(3000,()=>{
    console.log("server is listening");
})