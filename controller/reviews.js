const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);

    await review.save();
    await listing.save();
    req.flash("success","New review Created");

    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async (req, res) => {

    const { id, reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });
    req.flash("success","review deleted");

    res.redirect(`/listings/${id}`);
};