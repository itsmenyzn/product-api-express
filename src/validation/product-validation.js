import Joi from 'joi'

const registerProductTypeValidation = Joi.object({
    productTypeName: Joi.string().max(20).required()
})

const registerProductValdiation = Joi.object({
    name: Joi.string().max(100).required(),
    price: Joi.number().required(),
    productTypeID: Joi.number().required(),
})

export {
    registerProductTypeValidation,
    registerProductValdiation
}