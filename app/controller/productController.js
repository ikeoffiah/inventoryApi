const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const asynchandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");

//Create Product
const createProduct = asynchandler(async (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    const { category, name, price, description, quantity } = fields;
    if (
      !category ||
      !name ||
      !price ||
      !description ||
      !quantity ||
      !files.image
    ) {
      res.status(400).json({
        error: "something went wrong",
      });
    }
    const file = files.image;
    const uploaded_image = await cloudinary.uploader.upload(file.filepath);

    const category_instance = await Category.findById(category).catch((error) =>
      res.json({ error: error.message })
    );

    if (category_instance === null) {
      res.status(404).json({
        error: "Category Not Found",
      });
    } else {
      await Product.create({
        category: category_instance._id,
        name: name,
        quantity: parseInt(quantity),
        description: description,
        price: parseFloat(price),
        image: uploaded_image.url,
      })
        .then((response) => res.status(201).json(response))
        .catch((error) => res.status(400).json({ error: error.message }));
    }
  });
});

//Get all products
const getAllProducts = asynchandler(async (req, res) => {
  await Product.find()
    .then((response) => res.status(200).json(response))
    .catch(() =>
      res
        .status(400)
        .json({ error: "Something went wrong while fetching products" })
    );
});

//Get all products in a category
const getAllProductsInCategory = asynchandler(async (req, res) => {
  const category = await Category.findById(req.params.id).catch((error) =>
    res.status(400).json({ error: error.message })
  );

  if (!category) {
    res.status(404).json({
      error: "Category Not Found",
    });
  }

  await Product.find({ category: req.params.id })
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(400).json({ error: error.message }));
});

const retrieveProduct = asynchandler(async (req, res) => {
  const product = await Product.findById(req.params.id).catch((error) =>
    res.status(400).json({ error: error.message })
  );

  if (!product) {
    res.status(404).json({
      error: "Product Not Found",
    });
  }

  await Product.findById(req.params.id)
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(400).json({ error: error.message }));
});

//Delete Product
const deleteProduct = asynchandler(async (req, res) => {
  const product = await Product.findById(req.params.id).catch((error) =>
    res.status(400).json({ error: error.message })
  );

  if (!product) {
    res.status(404).json({
      error: "Product Not Found",
    });
  }

  await Product.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).send("delete was successful"))
    .catch((error) => res.status(40).json({ error: error.message }));
});

//Update a product
const updateProduct = asynchandler(async (req, res) => {
  const product = await Product.findById(req.params.id).catch((error) =>
    res.status(400).json({ error: error.message })
  );
  if (!product) {
    res.status(404).json({
      error: "Product Not Found",
    });
  }

  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (files.image) {
      const file = files.image;
      const uploaded_image = await cloudinary.uploader.upload(file.filepath);
      fields.image = uploaded_image.url;
    }

    await Product.findByIdAndUpdate(req.params.id, fields, {
      new: true,
    })
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(400).json({ error: error.message }));
  });
});

module.exports = {
  createProduct,
  getAllProductsInCategory,
  retrieveProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
};
