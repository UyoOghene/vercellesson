  const Joi= require('joi')
  
  module.exports.postSchema = Joi.object({
    post: Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    caption: Joi.string().required()
  }).required()
  })
  // const result = postSchema.validate(req.body);

