import { ResponseError } from '../error/response-error.js'
import productService from '../service/product-service.js'
const registerProductType = async (req,res,next) => {
    try {
        const result = await productService.register(req.body)
        res.status(200).json({
            data:result
        })
    } catch (e) {
        next(e)
    }
}

export default {
    registerProductType
}