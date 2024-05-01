const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {isUserAvailable, saveRedirectUrl} = require("../middleware");
const { logoutUser, loginUser, renderLoginForm, signUpUser, renderSignupForm } = require("../controllers/user");

router.route("/signup")
.get(renderSignupForm)
.post(wrapAsync(signUpUser));

router.route("/login")
.get(renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
       
    }),
    loginUser);

// logout route
router.get("/logout",isUserAvailable,logoutUser);

module.exports = router;