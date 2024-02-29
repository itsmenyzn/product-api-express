import supertest from "supertest"
import { web } from "../src/application/web"
import { prismaClient } from "../src/application/database"


describe('POST /api/users', function () {


    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where : {
                username : "Adhit"
            }
        })
    })

    it('should can register new user', async () => {
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
})