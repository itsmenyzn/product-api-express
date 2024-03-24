import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";
import productService from "../src/service/product-service";
export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: "test",
    },
  });
};

export const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: "test",
      password: await bcrypt.hash("test", 10),
      name: "test",
      token: "test",
    },
  });
};

export const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      username: "test",
    },
  });
};

export const removeTestProductType = async () => {
  await prismaClient.productType.deleteMany({
    where: {
      OR: [
        { productTypeName: "Otomotif" },
        { productTypeName: "Olahraga" },
        { productTypeName: "Category" },
        { productTypeName: "TestProduct" },
      ],
    },
  });
};

export const removeProductTypeSeed = async () => {
  return prismaClient.productType.updateMany({
    data: {
      isDeleted: true,
    },
    where: {
      productTypeName: {
        contains: "Type",
      },
    },
  });
};
export const removeProductTypeTest = async () => {
  return prismaClient.productType.updateMany({
    data: {
      isDeleted: true,
    },
    where: {
      productTypeName: "Test",
    },
  });
};

export const createProductTypeSeed = async () => {
  return prismaClient.productType.createMany({
    data: [
      {
        productTypeName: "Type1",
      },
      {
        productTypeName: "Type2",
      },
      {
        productTypeName: "Type3",
      },
      {
        productTypeName: "Type4",
      },
      {
        productTypeName: "Type5",
      },
      {
        productTypeName: "Type6",
      },
    ],
  });
};

export const createSingleProductType = async () => {
  const request = { productTypeName: "Test" };
  return productService.addProductType(request);
  // return prismaClient.productType.create({
  //   data: {
  //     productTypeName: "TypeTest",
  //   },
  //   select: {
  //     id: true,
  //     productTypeName: true,
  //   },
  // })
};

export const removeProductSeed = async () => {
  await prismaClient.product.updateMany({
    data: {
      isDeleted: true,
    },
    where: {
      OR: [
        {
          name: {
            contains: "Product",
          },
        },
        {
          name: {
            contains: "Updated",
          },
        },
      ],
    },
  });
};

export const createProductSeed = async () => {
  const productType = await createSingleProductType();
  await prismaClient.product.createMany({
    data: [
      {
        name: "TestProduct1",
        price: 90000,
        stock: 10,
        productTypeID: productType.id,
      },
      {
        name: "TestProduct2",
        price: 90000,
        stock: 10,
        productTypeID: productType.id,
      },
      {
        name: "TestProduct3",
        price: 90000,
        stock: 10,
        productTypeID: productType.id,
      },
      {
        name: "TestProduct4",
        price: 90000,
        stock: 10,
        productTypeID: productType.id,
      },
      {
        name: "TestProduct5",
        price: 90000,
        stock: 10,
        productTypeID: productType.id,
      },
      {
        name: "TestProduct6",
        price: 90000,
        stock: 10,
        productTypeID: productType.id,
      },
    ],
  });
};
