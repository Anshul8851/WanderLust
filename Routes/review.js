const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn,isReviewAuthor,validateReview } = require("../middleware");
const { destroyReview, postNewReview } = require("../controllers/review");

// post new review route
router.post("",isLoggedIn,validateReview,wrapAsync(postNewReview));

// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(destroyReview))

module.exports = router;