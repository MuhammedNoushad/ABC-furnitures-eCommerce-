const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

// creating address schema 
const addressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  user_id: {
    type: ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Address", addressSchema);
