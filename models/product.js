const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Object,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    boxitems: {
      type: String,
      required: true,
    },
    features: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("Products", ProductSchema);
