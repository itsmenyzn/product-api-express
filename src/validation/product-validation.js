import Joi from 'joi'

const registerProductTypeValidation = Joi.object({
    productTypeName: Joi.string().max(20).required()
})

export {
    registerProductTypeValidation
}