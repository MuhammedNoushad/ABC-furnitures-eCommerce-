const mongoose = require("mongoose");
const validator = require("validator");

// Function to generate a random string of five capital letters
function generateReferralCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let referralCode = "";
  for (let i = 0; i < 5; i++) {
    referralCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return referralCode;
}

// creating user schema
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minilength: 8,
  },
  referralCode: {
    type: String,
    default: generateReferralCode,
    unique: true,
  },
  is_blocked: {
    type: Boolean,
    required: true,
  },
  is_admin: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
