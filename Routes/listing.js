const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing} = require("../middleware");
const { allListings, createNewListing, getListingById, updateListing, destroyListing, editListing,renderListing,findByCountryName,trendingListings, roomListings,castleListings,mountainListings,iconicListings,amazingListings } = require("../controllers/listing");
const multer = require("multer");
const{storage} = require("../cloudConfig");
const upload = multer({storage})

router.get("/trendings",trendingListings);
router.get("/Rooms",roomListings);
router.get("/Castles",castleListings);
router.get("/Mountain",mountainListings);
router.get("/IconicCities",iconicListings);
router.get("/Amazingpools",amazingListings);


router.route("/")
.get(wrapAsync(allListings))
.post(isLoggedIn,upload.single("image"),validateListing,wrapAsync(createNewListing));

// new listing route
router.get("/new",isLoggedIn,renderListing);
router.post("/search",findByCountryName);
router.route("/:id")
.get(wrapAsync(getListingById))
.put(isLoggedIn,isOwner,upload.single("image"),validateListing,wrapAsync(updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(destroyListing));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(editListing));



module.exports = router;