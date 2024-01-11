
const mongoose = require("mongoose");

// Creating coupon schema
const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: true,
    unique: true,
  },
  discountAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  minimumPurchase: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,   
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  used_coupons: {
    type: [String], 
    default: [], 
  },
});

module.exports = mongoose.model("Coupon", couponSchema);

