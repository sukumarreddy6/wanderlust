const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user); { req stores the user information }
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res) => {

    const listing = await Listing.findById(req.params.id).
        populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings");
        // throw new ExpressError(404, "Listing not found");
    } else {
        res.render("listings/show.ejs", { listing });
    }
};

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    let originalUrl = listing.image.url;
    console.log(listing.image);
    console.log(listing.image.url);
    originalUrl = originalUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalUrl });
}

module.exports.updateListing = async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(
        req.params.id,
        { ...req.body.listing },
        { runValidators: true, new: true }
    );

    if (typeof req.file != "undefined") {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await listing.save();
    }

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyListing = async (req, res) => {

    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted");

    res.redirect("/listings");
}