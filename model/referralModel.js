const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  refereeName: {
    type: String,
    required: true,
  },
  referralDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ReferralProgram", referralSchema);
