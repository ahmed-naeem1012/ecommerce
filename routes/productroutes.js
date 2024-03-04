const express = require("express");
const productRouter = express.Router();

const {
  AddProduct,
  GetAllProducts,
  DeleteProduct,
  ModifyProduct,
} = require("../controllers/productcontroller");
const { UserAuth, AdminAuth } = require("../middlewares/auth");

productRouter.post("/addproduct", AdminAuth, AddProduct);
productRouter.post("/deleteproduct", AdminAuth, DeleteProduct);
productRouter.get("/getallproducts", UserAuth, GetAllProducts);
productRouter.put("/modifyproduct", AdminAuth, ModifyProduct);

module.exports = productRouter;
