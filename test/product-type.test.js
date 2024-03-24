import supertest from "supertest";
import { web } from "../src/application/web";
import {
  createProductTypeSeed,
  removeProductTypeSeed,
  removeProductTypeTest,
  removeTestProductType,
} from "./test-util";

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
});
describe("GET /api/category/:page?/:limit?/:offset?", function () {
  beforeEach(async () => {
    await removeTestProductType();
    await removeProductTypeSeed();
    await removeProductTypeTest();
    await createProductTypeSeed();
  });
  test("should give all product type", async () => {
    const result = await supertest(web).get("/api/category");
    console.log(result.body.data);
    expect(result.status).toBe(200);
    expect(result.body.data.totalData).toBe(6);
    expect(result.body.data.totalPage).toBe(2);
    expect(result.body.data.limit).toBe(5);
    expect(result.body.data.offset).toBe(0);
    for (const item of result.body.data.data) {
      expect(item.productTypeName).toContain("Type");
    }
  });
  test("should give product type on page 2", async () => {
    const result = await supertest(web).get("/api/category?page=2");
    expect(result.status).toBe(200);
    expect(result.body.data.data).toHaveLength(1);
    expect(result.body.data.page).toBe(2);
    expect(result.body.data.limit).toBe(5);
    expect(result.body.data.offset).toBe(5);
    for (const item of result.body.data.data) {
      expect(item.productTypeName).toBe("Type6");
    }
  });
  test("should give product type with limit 10", async () => {
    const result = await supertest(web).get("/api/category?limit=10");
    expect(result.status).toBe(200);
    expect(result.body.data.data).toHaveLength(6);
    expect(result.body.data.limit).toBe(10);
    expect(result.body.data.offset).toBe(0);
    expect(result.body.data.totalPage).toBe(1);
  });
  test("should give product type with offset 5", async () => {
    const result = await supertest(web).get("/api/category?offset=4");
    expect(result.status).toBe(200);
    expect(result.body.data.data).toHaveLength(2);
    expect(result.body.data.limit).toBe(5);
    expect(result.body.data.offset).toBe(4);
    expect(result.body.data.totalPage).toBe(1);
  });
  test("should give product type with offset 1", async () => {
    const result = await supertest(web).get(
      "/api/category?offset=1&page=1&limit=2"
    );
    expect(result.status).toBe(200);
    expect(result.body.data.data).toHaveLength(2);
    expect(result.body.data.limit).toBe(2);
    expect(result.body.data.offset).toBe(1);
    expect(result.body.data.totalPage).toBe(3);
  });
  test("should give product type with offset 2 on page 2 with limit 3", async () => {
    const result = await supertest(web).get(
      "/api/category?offset=2&page=2&limit=3"
    );
    expect(result.status).toBe(200);
    expect(result.body.data.data).toHaveLength(1);
    expect(result.body.data.limit).toBe(3);
    expect(result.body.data.offset).toBe(5);
    expect(result.body.data.totalPage).toBe(2);
  });
});
describe("DELETE /api/category/:id", function () {
  beforeEach(async () => {
    await removeProductTypeSeed();
  });
  test("should can delete product by given valid id", async () => {
    let result = await supertest(web).post("/api/category").send({
      productTypeName: "delete",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.productTypeName).toBe("delete");
    const id = result.body.data.id;
    result = await supertest(web).delete(`/api/category/${id}`);
    console.info("status : ", result.status);
    console.info("body : ", result.body);
    expect(result.status).toBe(200);
    result = await supertest(web).get(`/api/category/${id}`);
    expect(result.status).toBe(404);
  });
  test("should reject delete product due to invalid given id", async () => {
    let result = await supertest(web).post("/api/category").send({
      productTypeName: "TestType",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.productTypeName).toBe("TestType");
    const id = 99999 + result.body.data.id;
    result = await supertest(web).delete(`/api/category/${id}`);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Product Type Doesnt Exists");
  });
  test("should reject delete product due to invalid parameter given", async () => {
    const result = await supertest(web).delete(`/api/category/asd`);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBe("Invalid Parameter Given");
  });
});
describe("GET /api/category/:id", function () {
  beforeEach(async () => {
    await removeProductTypeSeed();
  });
  test("should can give single product by given id", async () => {
    let result = await supertest(web).post("/api/category").send({
      productTypeName: "TestType",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.productTypeName).toBe("TestType");
    const id = result.body.data.id;
    result = await supertest(web).get(`/api/category/${id}`);
    expect(result.status).toBe(200);
    expect(result.body.data.productTypeName).toBe("TestType");
  });
  test("should reject give single product due to invalid given id", async () => {
    let result = await supertest(web).post("/api/category").send({
      productTypeName: "TestType",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.productTypeName).toBe("TestType");
    const id = 99999 + result.body.data.id;
    result = await supertest(web).get(`/api/category/${id}`);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Product Type Doesnt Exists");
  });
  test("should reject give single product due to invalid parameter given", async () => {
    const result = await supertest(web).get(`/api/category/asd`);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBe("Invalid Parameter Given");
  });
});
