
const Joi = require("joi");

const categorySchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(5).required(),
    status: Joi.boolean().optional(),
});

module.exports = { categorySchema };
