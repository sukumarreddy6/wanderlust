const Listing = require("./models/listing");
const Review = require("./models/review");

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema");
const { reviewSchema } = require("./schema");


module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    if (!req.isAuthenticated()) {
        //redirectUrl
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in");
        return res.redirect("/login"); // return is used to exit if not used clash occurs between re.redirect() & next 
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        //delete req.session.redirectUrl;   // optional but recommended

    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.curUser._id)) {
        req.flash("error", "You dont't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }

    next();
};

module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.curUser._id)) {
        req.flash("error", "You dont't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};