import express from "express"
import userController from "../controller/user-controller.js"
const publicRouter = new express.Router()
publicRouter.get('/check', (req,res) => {
    res.status(200).json({
        message : "halo"
    })
})
publicRouter.post('/api/users', userController.register)
publicRouter.post('/api/users/login', userController.login)

export {
    publicRouter
}