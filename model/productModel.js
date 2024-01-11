const { Double, ObjectId } = require("mongodb");
const mongoose = require("mongoose");

// creating product schema
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: ObjectId,
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  quantity: {
    type: Number,
    default:0,
  },
  image: {
    type: Array,
    required: true,
  },
  productOffer: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Products", productSchema);
