import supertest from "supertest"
import { web } from "../src/application/web"

import { logger } from "../src/application/logging"
import { createTestUser, removeTestUser } from "./test-util"


// describe('POST /api/users', function () {
//     afterEach(async () => {
//         await removeTestUser()
//     })

//     test('should can register new user', async () => {
//         const result = await supertest(web)
//             .post('/api/users')
//             .send({
//                 username : "test",
//                 password : "test",
//                 name: "test"
//             });

//             expect(result.status).toBe(200)
//             expect(result.body.data.username).toBe("test")
//             expect(result.body.data.name).toBe("test")
//             expect(result.body.data.password).toBeUndefined()
//     })

//     test('should reject if request is invalid', async () => {
//         const result = await supertest(web)
//             .post('/api/users')
//             .send({
//                 username : "",
//                 password : "",
//                 name: ""
//             });
//             logger.info("=========================")
//             logger.info(result.body)

//             expect(result.status).toBe(400)
//             expect(result.body.errors).toBeDefined()
//     })

//     test('should reject if username already exists', async () => {
//         let result = await supertest(web)
//             .post('/api/users')
//             .send({
//                 username : "test",
//                 password : "test",
//                 name: "test"
//             });
//             logger.info("=========================")
//             logger.info(result.body)

//             expect(result.status).toBe(200)
//             expect(result.body.data.username).toBe("test")
//             expect(result.body.data.name).toBe("test")
//             expect(result.body.data.password).toBeUndefined()

//             result = await supertest(web)
//             .post('/api/users')
//             .send({
//                 username : "test",
//                 password : "test",
//                 name: "test"
//             });
//             logger.info("=========================")
//             logger.info(result.body)

//             expect(result.status).toBe(400)
//             expect(result.body.errors).toBeDefined()
//     })

   

//     afterAll(done => {
//         done()
//     })

// })

describe('POST /api/users/login', function () {
    beforeEach(async () => {
        await createTestUser()
    })
    test('should can login valid user', async () => {
        const result = await supertest(web)
                .post('/api/users/login')
                .send({
                    username:"test",
                    password:"test"
                })
                logger.info("=========================")
                logger.info("Data body : "  + result.body)

                expect(result.status).toBe(200)
                expect(result.body.data.token).toBeDefined()
                expect(result.body.data.token).not.toBe("test")
    })
    test('should reject login if login request is invalid', async () => {
        const result = await supertest(web)
                .post('/api/users/login')
                .send({
                    username:"",
                    password:""
                })
                logger.info("=========================")
                logger.info("Data body : "  + result.body)

                expect(result.status).toBe(400)
                expect(result.body.errors).toBeDefined()
    })
    test('should reject login if password is invalid', async () => {
        const result = await supertest(web)
                .post('/api/users/login')
                .send({
                    username:"test",
                    password:"katasandi"
                })
                logger.info("=========================")
                logger.info("Data body : "  + result.body)

                expect(result.status).toBe(401)
                expect(result.body.errors).toBeDefined()
    })
    test('should reject login if username is invalid', async () => {
        const result = await supertest(web)
                .post('/api/users/login')
                .send({
                    username:"katasandi",
                    password:"katasandi"
                })
                logger.info("=========================")
                logger.info("Data body : "  + result.body)

                expect(result.status).toBe(401)
                expect(result.body.errors).toBeDefined()
    })
    afterEach(async () => {
        await removeTestUser()
    })
})
