const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require("../controller/categoryController");

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);
router
  .route("/:id")
  .delete(deleteCategory)
  .put(updateCategory)
  .get(getCategory);

module.exports = router;
