import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";
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

export const createProductTypeSeed = async () => {
  await prismaClient.productType.createMany({
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
export const removeProductTypeSeed = async () => {
  await prismaClient.productType.deleteMany({
    where: {
      productTypeName: {
        contains: "Type",
      },
    },
  });
};
