import supertest from "supertest";
import { web } from "../src/application/web";

import { logger } from "../src/application/logging";
import { createTestUser, getTestUser, removeTestUser } from "./test-util";
import bcrypt from "bcrypt";

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUser();
  });

  test("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "test",
      name: "test",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();
  });

  test("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });
    logger.info("=========================");
    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  test("should reject if username already exists", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "test",
      name: "test",
    });
    logger.info("=========================");
    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "test",
      name: "test",
    });
    logger.info("=========================");
    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  afterAll((done) => {
    done();
  });
});

describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  test("should can login valid user", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "test",
    });
    logger.info("=========================");
    logger.info("Data body : " + result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });
  test("should reject login if login request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });
    logger.info("=========================");
    logger.info("Data body : " + result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  test("should reject login if password is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "katasandi",
    });
    logger.info("=========================");
    logger.info("Data body : " + result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
  test("should reject login if username is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "katasandi",
      password: "katasandi",
    });
    logger.info("=========================");
    logger.info("Data body : " + result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
  afterEach(async () => {
    await removeTestUser();
  });
});
describe("GET /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  test("should can get current user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "test");
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
  });
  test("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "asdjkla");
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
  test("should reject if token is missing", async () => {
    const result = await supertest(web).get("/api/users/current");
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
  afterEach(async () => {
    await removeTestUser();
  });
});

describe("PATCH /api/users/update", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  test("should can update all user data", async () => {
    const result = await supertest(web)
      .patch("/api/users/update")
      .set("Authorization", "test")
      .send({
        name: "updated",
        password: "updated",
      });
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("updated");

    const user = await getTestUser();
    expect(await bcrypt.compare("updated", user.password)).toBe(true);
  });

  test("should can update name only", async () => {
    const result = await supertest(web)
      .patch("/api/users/update")
      .set("Authorization", "test")
      .send({
        name: "updated",
      });
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("updated");

    const user = await getTestUser();
    expect(await bcrypt.compare("test", user.password)).toBe(true);
  });

  test("should can update password only", async () => {
    const result = await supertest(web)
      .patch("/api/users/update")
      .set("Authorization", "test")
      .send({
        password: "updated",
      });
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");

    const user = await getTestUser();
    expect(await bcrypt.compare("updated", user.password)).toBe(true);
  });
  test("should reject update if request is invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/update")
      .set("Authorization", "test")
      .send({
        password: 123123,
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  test("should reject update if token is missing or invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/update")
      .set("Authorization", "salahtoken")
      .send({
        password: "updated",
      });
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
  afterEach(async () => {
    await removeTestUser();
  });
});
describe("DELETE /api/users/logout", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  test("should can logout user", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "test");

    const user = await getTestUser();

    expect(result.status).toBe(200);
    expect(result.body.message).toBeDefined();
    expect(user.token).toBeNull();
  });
  test("should reject logout if token is invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "salah");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
  afterEach(async () => {
    await removeTestUser();
  });
});
