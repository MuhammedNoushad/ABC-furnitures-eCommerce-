const mongoose = require("mongoose");

// creating category schema
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  listed: {
    type: Boolean,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  categoryOffer: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Category", categorySchema);
