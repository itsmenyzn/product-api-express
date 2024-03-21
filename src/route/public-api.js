import express from "express";
import userController from "../controller/user-controller.js";
import productController from "../controller/product-controller.js";
const publicRouter = new express.Router();
publicRouter.get("/check", (req, res) => {
  res.status(200).json({
    message: "halo",
  });
});
publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users/login", userController.login);

publicRouter.post("/api/category", productController.registerProductType);
publicRouter.get("/api/category/:id", productController.findProductType);
publicRouter.get(
  "/api/category/:page?/:limit?/:offset?",
  productController.showProductType
);
publicRouter.delete("/api/category/:id", productController.deleteProductType);

publicRouter.post("/api/product", productController.registerProduct);
publicRouter.get("/api/product/:id", productController.findProduct);
publicRouter.get(
  "/api/product/:page?/:limit?/:offset?",
  productController.showProduct
);
publicRouter.put("/api/product/:id", productController.updateProduct);
publicRouter.delete("/api/product/:id", productController.deleteProduct);

export { publicRouter };
