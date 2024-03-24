import Joi from "joi";

const registerProductTypeValidation = Joi.object({
  productTypeName: Joi.string().max(20).required(),
});

const registerProductValdiation = Joi.object({
  name: Joi.string().max(100).required(),
  price: Joi.number().max(99999999).required(),
  stock: Joi.number().max(99999).required(),
  productTypeID: Joi.number().required(),
});

const updateProductValidation = Joi.object({
  name: Joi.string().max(100),
  price: Joi.number().max(99999999),
  stock: Joi.number().max(99999),
  productTypeID: Joi.number(),
});

const findProductByID = Joi.number();

export {
  registerProductTypeValidation,
  registerProductValdiation,
  findProductByID,
  updateProductValidation,
};
