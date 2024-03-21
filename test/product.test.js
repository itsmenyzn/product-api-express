import supertest from "supertest";
import { web } from "../src/application/web";
import { removeTestProductType } from "./test-util";

describe("POST /api/category", function () {
  beforeEach(async () => {
    await removeTestProductType();
  });
  test("should can register new product type", async () => {
    const result = await supertest(web).post("/api/category").send({
      productTypeName: "Otomotif",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.productTypeName).toBe("Otomotif");
  });
  test("should reject register new product type due to invalid data type value", async () => {
    const result = await supertest(web).post("/api/category").send({
      productTypeName: 123,
    });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  test("should reject register new product type due to invalid body", async () => {
    const result = await supertest(web).post("/api/category").send({
      randomBody: "Otomotif",
    });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  test("should reject register new product type due to duplicate product type", async () => {
    const createDummy = await supertest(web).post("/api/category").send({
      productTypeName: "Olahraga",
    });
    expect(createDummy.status).toBe(200);
    expect(createDummy.body.data.productTypeName).toBe("Olahraga");

    const checkDuplicate = await supertest(web).post("/api/category").send({
      productTypeName: "Olahraga",
    });
    expect(checkDuplicate.status).toBe(409);
    expect(checkDuplicate.body.errors).toBeDefined();
  });
  test("should give product type based on given id", async () => {
    let result = await supertest(web).post("/api/category").send({
      productTypeName: "Category",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.productTypeName).toBe("Category");
    const id = result.body.data.id;

    result = await supertest(web).get(`/api/category/${id}`);
    expect(result.status).toBe(200);
    expect(result.body.data.productTypeName).toBe("Category");
  });
  test("should not give product type due to product type not found", async () => {
    let result = await supertest(web).post("/api/category").send({
      productTypeName: "Category",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.productTypeName).toBe("Category");
    const id = result.body.data.id + 9999;

    result = await supertest(web).get(`/api/category/${id}`);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
  test("should not give product type due to invalid parameter", async () => {
    const result = await supertest(web).get(`/api/category/asd`);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  test("should not give product type because product is deleted", async () => {
    let result = await supertest(web).post("/api/category").send({
      productTypeName: "TestProduct",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.productTypeName).toBe("TestProduct");
    const id = result.body.data.id;
    result = await supertest(web).delete(`/api/category/${id}`);
    expect(result.status).toBe(200);
    result = await supertest(web).get(`/api/category/${id}`);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  afterEach(async () => {
    await removeTestProductType();
  });
});
