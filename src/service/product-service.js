import { prismaClient } from "../application/database.js"
import { validate } from "../validation/validation.js"
import {registerProductTypeValidation, registerProductValdiation} from '../validation/product-validation.js'
import { ResponseError } from "../error/response-error.js"

const register = async (request) => {
    const product = validate(registerProductTypeValidation, request);
    const checkProduct = await prismaClient.productType.findFirst({
        where: {
            productTypeName: product.productTypeName
        }
    });
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

const addProduct = async (request) => {
    const productData = validate(registerProductValdiation, request);
    const productType = await prismaClient.productType.findFirst({
        where: { 
            id: productData.productTypeID 
        },
    });

    if (!productType) {
        throw new Error('Product type with ID ' + productData.productTypeID + ' does not exist.');
    }
    const product = await prismaClient.product.create({
        data: productData,
        include: {
          ProductType: true,
        },
      });
      
      const transformedProduct = {
        name: product.name,
        price: product.price,
        productTypeName: product.ProductType.productTypeName,
      };
      
      return transformedProduct;
};

const updateProduct = async (request,id) => {
    const productData = validate(registerProductValdiation,request)
    const checkProduct = await prismaClient.product.count({
        where:{
            id:Number(id)
        }
    })
    if(checkProduct !== 1) throw new ResponseError(404,"Product doesnt exists")
    return prismaClient.product.update({
        data:productData,
        where:{
            id:Number(id)
        },
        select:{
            name:true,
            price:true,
            ProductType:true,
        }
    })
}

export default {
    register,
    addProduct,
    updateProduct
}