const Joi = require('joi');
const reviewSchema = Joi.object({
    comment:Joi.string().required(),
    rating:Joi.number().min(1).max(5).required()
});

module.exports = reviewSchema;