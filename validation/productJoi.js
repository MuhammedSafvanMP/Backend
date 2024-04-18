import Joi from "joi";

// Product Joi validation schema
const productJoi = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(50).required(),
    price: Joi.number().integer().positive(),
    category: Joi.string().min(2).max(30).required()
});

export default productJoi;
