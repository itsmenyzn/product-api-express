import supertest from "supertest";
import { web } from "../src/application/web";
import { removeTestProductType } from "./test-util";

describe('POST /api/category', function () {
    beforeEach(async () => {
        await removeTestProductType()
    })
    test('should can register new product type', async() => {
        const result = await supertest(web)
        .post('/api/category')
        .send({
            productTypeName : "Otomotif"
        })
        expect(result.status).toBe(200)
        expect(result.body.data.productTypeName).toBe("Otomotif")
    })
    test('should reject register new product type due to invalid data type value'
    , async() => {
        const result = await supertest(web)
        .post('/api/category')
        .send({
            productTypeName : 123
        })
        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
    test('should reject register new product type due to invalid body'
    , async() => {
        const result = await supertest(web)
        .post('/api/category')
        .send({
            randomBody : "Otomotif"
        })
        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
    test('should reject register new product type due to duplicate product type'
    , async() => {
        const createDummy = await supertest(web)
        .post('/api/category')
        .send({
            productTypeName : "Olahraga"
        })
        expect(createDummy.status).toBe(200)
        expect(createDummy.body.data.productTypeName).toBe("Olahraga")
        
        const checkDuplicate = await supertest(web)
        .post('/api/category')
        .send({
            productTypeName : "Olahraga"
        })
        expect(checkDuplicate.status).toBe(409)
        expect(checkDuplicate.body.errors).toBeDefined()
    })
    afterEach(async () => {
        await removeTestProductType()
    })
})