import express from "express"
import userController from "../controller/user-controller.js"
import productController from "../controller/product-controller.js"
const publicRouter = new express.Router()
publicRouter.get('/check', (req,res) => {
    res.status(200).json({
        message : "halo"
    })
})
publicRouter.post('/api/users', userController.register)
publicRouter.post('/api/users/login', userController.login)

publicRouter.post('/api/category', productController.registerProductType)
publicRouter.post('/api/product', productController.registerProduct)
publicRouter.put('/api/product/:id', productController.updateProduct)

export {
    publicRouter
}