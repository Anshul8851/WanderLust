const express = require("express");
const app = express(); 
const path = require("path"); 
const ejsmate = require("ejs-mate");
const methodoverride = require("method-override");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./Routes/listing.js")
const reviews = require("./Routes/review.js")
const userRouter = require("./Routes/user.js")
const url = "mongodb+srv://anshulsharma8882:bhardwaj90@cluster0.a0ubw0b.mongodb.net/";
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const sessionOptions = {
    secret : "me kyu batau its secret",
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now()+ 1000*60*60*24*3,
        maxAge : 1000*60*60*24*3,
        httpOnly : true
    },
}
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

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
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.curUser = req.user;
    next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);

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