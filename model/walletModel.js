const mongoose = require("mongoose");
const moment = require("moment");


const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      amount: { type: Number, required: true },
      transactionType: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
      },
      date: {
        type: String,
        default: () => moment().format("ddd, MMM D, YYYY, h:mmA"),
      },
    },
  ],
});

module.exports = mongoose.model("Wallet", walletSchema);
