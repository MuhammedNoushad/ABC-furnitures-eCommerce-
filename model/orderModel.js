const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const moment = require("moment");

// creating order schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      productPrice: {
        type: Number,
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
      productStatus: {
        type: String,
        default: "Pending",
      },
    },
  ],
  status: {
    type: String,
    default: "Pending",
  },
  payment: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  couponDiscound: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
    default: () => moment().format("ddd, MMM D, YYYY, h:mmA"),
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Orders", orderSchema);
