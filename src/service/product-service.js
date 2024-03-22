import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validation.js";
import {
  findProductByID,
  registerProductTypeValidation,
  registerProductValdiation,
} from "../validation/product-validation.js";
import { ResponseError } from "../error/response-error.js";

const addProductType = async (request) => {
  const product = validate(registerProductTypeValidation, request);
  const checkProduct = await prismaClient.productType.findFirst({
    where: {
      productTypeName: product.productTypeName,
      isDeleted: false,
    },
  });
  if (checkProduct != null) {
    throw new ResponseError(409, "Product Type Already Exists");
  }
  return prismaClient.productType.create({
    data: product,
    select: {
      id: true,
      productTypeName: true,
    },
  });
};

const findProductType = async (request) => {
  const productID = validate(
    findProductByID,
    request,
    "Invalid Parameter Given"
  );
  const product = await prismaClient.productType.findUnique({
    where: {
      id: productID,
      isDeleted: false,
    },
    select: {
      id: true,
      productTypeName: true,
    },
  });

  if (!product) {
    throw new ResponseError(404, "Product Type Doesnt Exists");
  }

  return product;
};

const showProductType = async (page, limit, offset) => {
  page = page == "" ? 1 : Number(page);
  limit = limit == "" ? 5 : Number(limit);
  let skipped;
  let defaultOffset;
  if (offset == "") {
    skipped = Number((page - 1) * limit);
    defaultOffset = 0;
  } else {
    defaultOffset = offset;
    if (offset == 1) {
      skipped = Number(offset);
    }
    if (page != 1) {
      skipped = Number(offset * page + 1);
    } else {
      skipped = Number(offset * page);
    }
  }
  const getTotalData = await prismaClient.productType.count({
    skip: defaultOffset,
  });
  const totalPage = Math.ceil(getTotalData / limit);
  const getProductData = await prismaClient.productType.findMany({
    take: limit,
    skip: skipped,
    orderBy: {
      id: "asc",
    },
    where: {
      isDeleted: false,
    },
  });

  const productTypeData = {
    data: getProductData,
    limit: limit,
    offset: skipped,
    page: page,
    totalData: getTotalData,
    totalPage: totalPage,
  };
  return productTypeData;
};

const deleteProductType = async (id) => {
  console.log(id);
  console.log(typeof id);
  await findProductType(id);
  return prismaClient.productType.update({
    where: {
      id: Number(id),
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });
};

const findProduct = async (id) => {
  const product = await prismaClient.product.findUnique({
    where: {
      id: Number(id),
      isDeleted: false,
    },
  });
  if (!product) {
    throw new ResponseError(404, "Product Doesnt Exists");
  }
  return product;
};

const addProduct = async (request) => {
  const productDataRequest = validate(registerProductValdiation, request);
  const productTypeCheck = await prismaClient.productType.findFirst({
    where: {
      id: productDataRequest.productTypeID,
      isDeleted: false,
    },
  });

  if (!productTypeCheck) {
    throw new ResponseError(
      404,
      "Product type with ID " +
        productDataRequest.productTypeID +
        " does not exist."
    );
  }
  const product = await prismaClient.product.create({
    data: productDataRequest,
    include: {
      ProductType: true,
    },
  });

  const productData = {
    name: product.name,
    price: product.price,
    productTypeName: product.ProductType.productTypeName,
  };
  return productData;
};

const updateProduct = async (request, id) => {
  await findProduct(id);
  const productData = validate(registerProductValdiation, request);
  return prismaClient.product.update({
    data: productData,
    where: {
      id: Number(id),
    },
    select: {
      name: true,
      price: true,
      ProductType: true,
    },
  });
};

const showProduct = async (page, limit, offset) => {
  offset = limit * page - limit;
  const getTotalData = await prismaClient.product.count();
  const getData = await prismaClient.product.findMany({
    take: limit,
    skip: offset,
    orderBy: {
      id: "asc",
    },
    where: {
      isDeleted: false,
    },
  });
  const totalPage = Math.ceil(getTotalData / limit);
  const productData = {
    data: getData,
    limit: limit,
    offset: offset,
    page: page,
    totalData: getTotalData,
    totalPage: totalPage,
  };
  return productData;
};

const deleteProduct = async (id) => {
  await findProduct(id);
  return prismaClient.product.update({
    where: {
      id: Number(id),
    },
    data: {
      isDeleted: true,
    },
  });
};

export default {
  addProductType,
  addProduct,
  updateProduct,
  showProductType,
  showProduct,
  findProduct,
  findProductType,
  deleteProduct,
  deleteProductType,
};
