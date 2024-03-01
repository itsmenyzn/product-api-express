import { prismaClient } from "../application/database.js"
import { getCurrentUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js"
import { validate } from "../validation/validation.js"
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"
const register = async(request) => {
    const user = validate(registerUserValidation,request)

    const countUser = await prismaClient.user.count({
        where:{
            username: user.username
        }
    })

    if (countUser === 1 ){
        throw new ResponseError(400,"username already exists")
    }

    user.password= await bcrypt.hash(user.password,10)

    return prismaClient.user.create({
        data : user,
        select : {
            username:true,
            name:true,
        }
    })   
}

const login = async (request) => {
    const dataLogin = validate(loginUserValidation,request)

    const userData = await prismaClient.user.findUnique({
        where: {
            username: dataLogin.username
        },
        select: {
            username:true,
            password:true,
        }
    })

    if(!userData) {
        throw new ResponseError(401,"Invalid username or password")
    }

    const isPasswordValid = await bcrypt.compare(dataLogin.password,userData.password)
    if(!isPasswordValid) {
        throw new ResponseError(401,"Invalid username or password")
    }

    const token = uuid().toString()
    return prismaClient.user.update({
        data: {
            token:token
        },
        where: {
            username: userData.username
        },
        select: {
            token: true,
        }
    })
}

const get = async (username) => {
    username = validate(getCurrentUserValidation,username)
    const user = await prismaClient.user.findUnique({
        where: {
            username : username
        },
        select : {
            username:true,
            name:true,
        }
    })
    if(!user) {
        throw new ResponseError(404,"user not found")
    }

    return user
}

const update = async (request) => {
    const updateData = validate(updateUserValidation,request)

    const checkUser = await prismaClient.user.count({
        where:{
            username : updateData.username
        }
    })

    if(checkUser !== 1){
        throw new ResponseError(404,"user not found")
    }

    const data = {}
    if(updateData.name){
        data.name = updateData.name
    }
    if(updateData.password){
        data.password = await bcrypt.hash(updateData.password,10)
    }

    const updateUser = await prismaClient.user.update({
        data: data,
        where : {
            username : updateData.username,
        },
        select : {
            username: true,
            name : true,
        }
    })

    if(!updateUser) {
        throw new ResponseError(500,"Failed Update User")
    }
    
    return updateUser
}

const logout = async (username) => {
    username = validate(getCurrentUserValidation,username)

    const user = await prismaClient.user.findUnique({
        where:{
            username : username
        }
    })

    if(!user) {
        throw new ResponseError(404,"user not found")
    }

    return prismaClient.user.update({
        where:{
            username:username,
        },
        data:{
            token:null
        },
    })

}

export default {
    register,
    login,
    get,
    update,
    logout
}