import { prismaClient } from "../application/database.js"
import { loginUserValidation, registerUserValidation } from "../validation/user-validation.js"
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

export default {
    register,
    login
}