const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const url = "mongodb+srv://anshulsharma8882:bhardwaj90@cluster0.a0ubw0b.mongodb.net/";

async function main(){
    await mongoose.connect(url);
}

main().then((res)=>{
    console.log("DB CONNECTION IS SUCCESSFUL");
}).
catch((err)=>{
    console.log(err);
})

const intitDb = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("DATA INITIALIZE SUCCESSFULLY");
}
intitDb();