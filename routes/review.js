const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/reviews.js");


// CREATE REVIEW
router.route("/")
    .post(
        isLoggedIn,
        validateReview,
        wrapAsync(reviewController.createReview)
    );


// DELETE REVIEW
router.route("/:reviewId")
    .delete(
        isLoggedIn,
        isReviewAuthor,
        wrapAsync(reviewController.destroyReview)
    );

module.exports = router;

// For the review router, you must create it like this:
// const router = express.Router({ mergeParams: true });
// Without mergeParams: true, req.params.id will be undefined.