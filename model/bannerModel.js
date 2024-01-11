const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  offerCategory: {
    type: ObjectId,
    required: true,
  },
  offerPercentage: {
    type: Number,
    required: true,
  },
});

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
