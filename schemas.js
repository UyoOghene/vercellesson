
const Joi = require('joi');

const postSchema = Joi.object({
    post: Joi.object({
        title: Joi.string().required(),
        caption: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array().items(Joi.string()).default([])
});

module.exports = { postSchema };

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required()
    }).required()
});
