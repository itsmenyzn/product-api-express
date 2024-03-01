import supertest from "supertest"
import { web } from "../src/application/web"
import { prismaClient } from "../src/application/database"
import { logger } from "../src/application/logging"

describe('POST /api/users', function () {
    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where : {
                username : "Adhit"
            }
        })
    })

    test('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username : "Adhit",
                password : "user",
                name: "Adhitya"
            });

            expect(result.status).toBe(200)
            expect(result.body.data.username).toBe("Adhit")
            expect(result.body.data.name).toBe("Adhitya")
            expect(result.body.data.password).toBeUndefined()
    })

    test('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username : "",
                password : "",
                name: ""
            });
            logger.info("=========================")
            logger.info(result.body)

            expect(result.status).toBe(400)
            expect(result.body.errors).toBeDefined()
    })

    test('should reject if username already exists', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                username : "kribo",
                password : "kribo",
                name: "kribo"
            });
            logger.info("=========================")
            logger.info(result.body)

            expect(result.status).toBe(200)
            expect(result.body.data.username).toBe("kribo")
            expect(result.body.data.name).toBe("kribo")
            expect(result.body.data.password).toBeUndefined()

            result = await supertest(web)
            .post('/api/users')
            .send({
                username : "kribo",
                password : "kribo",
                name: "kribo"
            });
            logger.info("=========================")
            logger.info(result.body)

            expect(result.status).toBe(400)
            expect(result.body.errors).toBeDefined()
    })

    afterAll(done => {
        prismaClient.$disconnect
        done()
    })

})