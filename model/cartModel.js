const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  product_id: {
    type: ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category_id: {
    type: ObjectId,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  user_id: {
    type: ObjectId,
    default: null,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

// Use a pre-save middleware to calculate totalPrice before saving the document
cartSchema.pre('save', function (next) {
  this.totalPrice = this.productPrice * this.quantity;
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
