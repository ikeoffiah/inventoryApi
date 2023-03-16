const express = require("express");
const {
  getAllProducts,
  getAllProductsInCategory,
  updateProduct,
  createProduct,
  deleteProduct,
  retrieveProduct,
} = require("../controller/productController");

const router = express.Router();

router.route("/").get(getAllProducts).post(createProduct);
router
  .route("/:id")
  .delete(deleteProduct)
  .put(updateProduct)
  .get(retrieveProduct);
router.route("/category/:id").get(getAllProductsInCategory);

module.exports = router;
