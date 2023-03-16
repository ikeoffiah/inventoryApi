const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const asynchandler = require("express-async-handler");
const formidable = require("formidable");

//Get Category
const getCategories = asynchandler(async (req, res) => {
  await Category.find()
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(400).json({ error: error.message }));
});

//Create Category
const createCategory = asynchandler(async (req, res) => {
  const form = formidable({ multiples: true });

  if (!req.body.name) {
    res.status(400).json({ error: "Please input Category name" });
  }

  await Category.create({
    name: req.body.name,
  })
    .then((response) => res.status(201).json(response))
    .catch((error) => res.status(400).json(error));
});

//Update Category
const updateCategory = asynchandler(async (req, res) => {
  const category = await Category.findById(req.params.id).catch((error) =>
    res.status(400).json({ error: error.message })
  );

  if (!category) {
    res.status(404).json({
      error: "Category Not Found",
    });
  }

  await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(400).json({ error: error.message }));
});

//Delete Category
const deleteCategory = asynchandler(async (req, res) => {
  const category = await Category.findById(req.params.id).catch((error) =>
    res.status(400).json({ error: error.message })
  );

  if (!category) {
    res.status(404).json({
      error: "Category Not Found",
    });
  }

  await Product.deleteMany({ category: req.params.id }).catch((error) =>
    res.status(400).json({ error: error.message })
  );

  await Category.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).send("Category has been successfully deleted"))
    .catch((error) =>
      res.status(400).json({
        error: error.message,
      })
    );
});

//Get Category
const getCategory = asynchandler(async (req, res) => {
  const category = await Category.findById(req.params.id).catch((error) =>
    res.status(400).json({ error: error.message })
  );

  if (!category) {
    res.status(404).json({
      error: "Category Not Found",
    });
  }

  await Category.findById(req.params.id)
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(400).json({ error: error.message }));
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
};
