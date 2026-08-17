const Joi = require("joi");


// ================= LISTING JOI SCHEMA =================

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.number().min(0).required(),
        country: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});


// ================= REVIEW JOI SCHEMA =================

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required()
    }).required()
});


module.exports = {
    listingSchema,
    reviewSchema
};


// new syntax
// module.exports.reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().min(1).max(5).required(),
//         comment: Joi.string().required()
//     }).required()
// }); 