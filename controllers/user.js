const User = require("../models/user")

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","you are logged out");
            res.redirect("/listings");
        }
        
    })
}

module.exports.loginUser = async(req,res)=>{
    if(res.locals.redirectUrl){
        req.flash("success","Welcome to WanderLust!");
        res.redirect(res.locals.redirectUrl);
    }
    else{
        req.flash("success","Welcome to WanderLust!");
        res.redirect("/listings");
    }
    
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.signUpUser= async(req,res)=>{
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
    
}

module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
}