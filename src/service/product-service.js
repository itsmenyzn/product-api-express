import { prismaClient } from "../application/database.js"
import { validate } from "../validation/validation.js"
import {registerProductTypeValidation} from '../validation/product-validation.js'
import { ResponseError } from "../error/response-error.js"

const register = async (request) => {
    const product = validate(registerProductTypeValidation, request);
    console.log(product);
    const checkProduct = await prismaClient.productType.findFirst({
        where: {
            productTypeName: product.productTypeName
        }
    });
    console.log("Check product " + checkProduct);
    if (checkProduct != null) {
        throw new ResponseError(409, 'Product Type Already Exists');
    }
    return prismaClient.productType.create({
        data: product,
        select: {
            productTypeName: true,
        }
    });
}


export default {
    register
}