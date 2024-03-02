require("dotenv").config();
const productmodel = require("../models/product");
const mongoose = require("mongoose");

const AddProduct = async (req, res) => {
  const { name, price, description, boxitems, features } = req.body;

  try {
    const newProduct = {
      name: name,
      price: price,
      description: description,
      boxitems: boxitems,
      features: features,
    };

    await productmodel.create(newProduct);
    res.status(200).json({
      isSuccessful: true,
      message: "Product Added Succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const GetAllProducts = async (req, res) => {
  try {
    const products = await productmodel.find({});

    // Send the products as a response
    res.status(200).json({
      isSuccessful: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      isSuccessful: false,
      message: "Internal server error",
    });
  }
};

const DeleteProduct = async (req, res) => {
  const { id } = req.body;
  console.log("Attempting to delete product with ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      isSuccessful: false,
      message: "Invalid ID format",
    });
  }

  try {
    const result = await productmodel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({
        isSuccessful: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      isSuccessful: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccessful: false,
      message: "Internal server error",
    });
  }
};

module.exports = { AddProduct, GetAllProducts, DeleteProduct };
