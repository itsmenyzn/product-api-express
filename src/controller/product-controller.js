import productService from "../service/product-service.js";
const registerProductType = async (req, res, next) => {
  try {
    const result = await productService.addProductType(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const showProductType = async (req, res, next) => {
  const page = Number(req.query.page) || "";
  const limit = Number(req.query.limit) || "";
  const offset = Number(req.query.offset) || "";
  try {
    const result = await productService.showProductType(page, limit, offset);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deleteProductType = async (req, res, next) => {
  try {
    await productService.deleteProductType(Number(req.params.id));
    res.status(200).json({
      message: "Success Deleting Product Type",
    });
  } catch (e) {
    next(e);
  }
};

const findProductType = async (req, res, next) => {
  try {
    const result = await productService.findProductType(req.params.id);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const findProduct = async (req, res, next) => {
  try {
    const result = await productService.findProduct(Number(req.params.id));
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const registerProduct = async (req, res, next) => {
  try {
    const result = await productService.addProduct(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const result = await productService.updateProduct(req.body, req.params.id);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const showProduct = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const offset = Number(req.query.offset) || 0;
  try {
    const result = await productService.showProduct(page, limit, offset);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(Number(req.params.id));
    res.status(200).json({
      message: "Success Deleting Product",
    });
  } catch (e) {
    next(e);
  }
};

export default {
  registerProductType,
  registerProduct,
  updateProduct,
  showProductType,
  showProduct,
  findProduct,
  findProductType,
  deleteProduct,
  deleteProductType,
};
