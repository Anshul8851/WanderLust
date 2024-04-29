const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {isUserAvailable, saveRedirectUrl} = require("../middleware");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let{username,email,password} = req.body;
        const newUser = new User({email,username});
        const registerUser = await User.register(newUser,password);
        // console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }else{
                req.flash("success","Welcome to WanderLust!");
                res.redirect("/listings");
            }
        })
       
    }catch(err){
        req.flash("failure",err.message);
        res.redirect("/signup");
    }
    
}))

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
})

router.post("/login",saveRedirectUrl,
passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
   
}),
async(req,res)=>{
    if(res.locals.redirectUrl){
        req.flash("success","Welcome to WanderLust!");
        res.redirect(res.locals.redirectUrl);
    }
    else{
        req.flash("success","Welcome to WanderLust!");
        res.redirect("/listings");
    }
    
})

router.get("/logout",isUserAvailable,(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","you are logged out");
            res.redirect("/listings");
        }
        
    })
})

module.exports = router;