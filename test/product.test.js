import supertest from "supertest";
import { web } from "../src/application/web";
import {
  createProductSeed,
  createSingleProductType,
  removeProductSeed,
  removeProductTypeTest,
} from "./test-util";

describe("POST /api/product", function () {
  beforeEach(async () => {
    await removeProductTypeTest();
    await removeProductSeed();
  });
  test("should can register new product", async () => {
    const productType = await createSingleProductType();
    const result = await supertest(web).post("/api/product").send({
      name: "TestProduct",
      price: 90000,
      stock: 10,
      productTypeID: productType.id,
    });
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("TestProduct");
    removeProductTypeTest();
  });
  test("should reject register new product due to invalid body data type", async () => {
    const productType = await createSingleProductType();
    const result = await supertest(web).post("/api/product").send({
      name: 123,
      price: 90000,
      stock: 10,
      productTypeID: productType.id,
    });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
    removeProductTypeTest();
  });
  test("should reject register new product due to missing required body data", async () => {
    const productType = await createSingleProductType();
    const result = await supertest(web).post("/api/product").send({
      name: 123,
      stock: 10,
      productTypeID: productType.id,
    });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
    removeProductTypeTest();
  });
  test("should reject register new product due to not found relation foreign key", async () => {
    const productType = await createSingleProductType();
    const result = await supertest(web)
      .post("/api/product")
      .send({
        name: "TestProduct",
        price: 90000,
        stock: 10,
        productTypeID: 123132 + productType.id,
      });
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    removeProductTypeTest();
  });
});

describe("GET /api/product/:id", function () {
  beforeEach(async () => {
    await removeProductTypeTest();
    await removeProductSeed();
  });
  test("should can give single product by given id", async () => {
    const productType = await createSingleProductType();
    let result = await supertest(web).post("/api/product").send({
      name: "TestProduct",
      price: 90000,
      stock: 10,
      productTypeID: productType.id,
    });
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("TestProduct");
    const id = result.body.data.id;
    result = await supertest(web).get(`/api/product/${id}`);
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("TestProduct");
    removeProductTypeTest();
  });
  test("should reject give single product due to invalid given id", async () => {
    const productType = await createSingleProductType();
    let result = await supertest(web).post("/api/product").send({
      name: "TestProduct",
      price: 90000,
      stock: 10,
      productTypeID: productType.id,
    });
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("TestProduct");
    const id = 9999 + result.body.data.id;
    result = await supertest(web).get(`/api/product/${id}`);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Product Doesnt Exists");
    removeProductTypeTest();
  });
  test("should reject give single product due to invalid parameter given", async () => {
    const result = await supertest(web).get(`/api/product/dsa`);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBe("Invalid Parameter Given");
  });

  beforeEach(async () => {
    await removeProductTypeTest();
  });
});

describe("PATCH /api/product/:id", function () {
  beforeEach(async () => {
    await removeProductSeed();
    await removeProductTypeTest();
  });
  afterEach(async () => {
    await removeProductSeed();
    await removeProductTypeTest();
  });
  test("should can update single product by given id", async () => {
    const productType = await createSingleProductType();
    let result = await supertest(web).post("/api/product").send({
      name: "Product",
      price: 90000,
      stock: 10,
      productTypeID: productType.id,
    });
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("Product");
    const id = result.body.data.id;
    result = await supertest(web).patch(`/api/product/${id}`).send({
      name: "Updated",
      price: 9999,
      stock: 99,
    });
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("Updated");
    expect(result.body.data.price).toBe(9999);
    expect(result.body.data.stock).toBe(99);
    removeProductTypeTest();
  });
  test("should reject update single product due to invalid given id", async () => {
    const result = await supertest(web).patch(`/api/product/asd`).send({
      name: "Product",
      price: 9999,
      stock: 99,
    });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  test("should reject update single product due to invalid body parameter given", async () => {
    const productType = await createSingleProductType();
    let result = await supertest(web).post("/api/product").send({
      name: "Product",
      price: 90000,
      stock: 10,
      productTypeID: productType.id,
    });
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("Product");
    const id = result.body.data.id;
    result = await supertest(web).patch(`/api/product/${id}`).send({
      name: 123313,
      price: "9999",
      stock: 99,
    });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
    removeProductTypeTest();
  });
  test("should reject update single product due to product id not found", async () => {
    const productType = await createSingleProductType();
    let result = await supertest(web).post("/api/product").send({
      name: "Product",
      price: 90000,
      stock: 10,
      productTypeID: productType.id,
    });
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("Product");
    const id = 12313 + result.body.data.id;
    result = await supertest(web).patch(`/api/product/${id}`).send({
      name: 123313,
      price: "9999",
      stock: 99,
    });
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    removeProductTypeTest();
  });

  test("should reject give single product due to invalid given id", async () => {
    const productType = await createSingleProductType();
    let result = await supertest(web).post("/api/product").send({
      name: "TestProduct",
      price: 90000,
      stock: 10,
      productTypeID: productType.id,
    });
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("TestProduct");
    const id = 9999 + result.body.data.id;
    result = await supertest(web).get(`/api/product/${id}`);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Product Doesnt Exists");
    removeProductTypeTest();
  });
  test("should reject give single product due to invalid parameter given", async () => {
    const result = await supertest(web).get(`/api/product/dsa`);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBe("Invalid Parameter Given");
  });
});

describe("DELETE /api/product/:id", function () {
  beforeEach(async () => {
    await removeProductTypeTest();
    await removeProductSeed();
  });
  test("should can delete single product by given id", async () => {
    const productType = await createSingleProductType();
    let result = await supertest(web).post("/api/product").send({
      name: "TestProduct",
      price: 90000,
      stock: 10,
      productTypeID: productType.id,
    });
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("TestProduct");
    const id = result.body.data.id;
    result = await supertest(web).delete(`/api/product/${id}`);
    expect(result.status).toBe(200);
    result = await supertest(web).get(`/api/product/${id}`);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    removeProductTypeTest();
  });
  test("should reject delete single product due to product not found", async () => {
    const productType = await createSingleProductType();
    let result = await supertest(web).post("/api/product").send({
      name: "TestProduct",
      price: 90000,
      stock: 10,
      productTypeID: productType.id,
    });
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("TestProduct");
    const id = 9999 + result.body.data.id;
    result = await supertest(web).delete(`/api/product/${id}`);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    removeProductTypeTest();
  });
  test("should reject delete single product due to invalid parameter given", async () => {
    const result = await supertest(web).delete(`/api/product/asd`);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  beforeEach(async () => {
    await removeProductTypeTest();
  });
});

describe("GET /api/product/:page?/:limit?/:offset?", function () {
  beforeEach(async () => {
    await removeProductTypeTest();
    await createProductSeed();
  });
  afterEach(async () => {
    await removeProductTypeTest();
    await removeProductSeed();
  });

  test("should give all product", async () => {
    let result = await supertest(web).get("/api/product");
    expect(result.status).toBe(200);
    expect(result.body.data.totalData).toBe(6);
    expect(result.body.data.totalPage).toBe(2);
    expect(result.body.data.limit).toBe(5);
    expect(result.body.data.offset).toBe(0);
    for (const item of result.body.data.data) {
      expect(item.name).toContain("Product");
    }
  });
  test("should give product on page 2", async () => {
    let result = await supertest(web).get("/api/product?page=2");
    expect(result.status).toBe(200);
    expect(result.body.data.data).toHaveLength(1);
    expect(result.body.data.page).toBe(2);
    expect(result.body.data.limit).toBe(5);
    expect(result.body.data.offset).toBe(5);
    for (const item of result.body.data.data) {
      expect(item.name).toContain("TestProduct6");
    }
  });
  test("should give product with limit 10", async () => {
    let result = await supertest(web).get("/api/product?limit=10");
    expect(result.status).toBe(200);
    expect(result.body.data.data).toHaveLength(6);
    expect(result.body.data.limit).toBe(10);
    expect(result.body.data.offset).toBe(0);
    expect(result.body.data.totalPage).toBe(1);
  });
  test("should give product with offset 5", async () => {
    let result = await supertest(web).get("/api/product?offset=4");
    expect(result.status).toBe(200);
    expect(result.body.data.data).toHaveLength(2);
    expect(result.body.data.limit).toBe(5);
    expect(result.body.data.offset).toBe(4);
    expect(result.body.data.totalPage).toBe(1);
  });
  test("should give product with offset 1", async () => {
    let result = await supertest(web).get(
      "/api/product?offset=1&page=1&limit=2"
    );
    expect(result.status).toBe(200);
    expect(result.body.data.data).toHaveLength(2);
    expect(result.body.data.limit).toBe(2);
    expect(result.body.data.offset).toBe(1);
    expect(result.body.data.totalPage).toBe(3);
  });
  test("should give product with offset 2 on page 2 with limit 3", async () => {
    let result = await supertest(web).get(
      "/api/product?offset=2&page=2&limit=3"
    );
    expect(result.status).toBe(200);
    expect(result.body.data.data).toHaveLength(1);
    expect(result.body.data.limit).toBe(3);
    expect(result.body.data.offset).toBe(5);
    expect(result.body.data.totalPage).toBe(2);
  });
});
