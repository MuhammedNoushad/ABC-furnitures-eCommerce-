const Referral = require("../model/referralModel");
const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Category = require("../model/categoryModel");


const loadReferralPage = async (req, res) => {
  try {
    const category = await Category.find({})

    const user_id = req.session._id;
    const loggedIn = req.session.isAuth ? true : false;
    const user = await User.findById({ _id: user_id });
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });
    res.render("referrals", {
      loggedIn,
      title: "Referral",
      currentPage: "referral",
      cartCount,
      user,
      category
    });
  } catch (error) {
    console.log(error.message);
  }
};

// check referral code valid or not
const checkReferralCode = async (req, res) => {
  try {
    const referralCode = req.body.referralCode;

    
    //  check the referral  code is existing or not
    const referralData = await User.findOne({ referralCode: referralCode });

    if (referralData) {
      res
        .status(200)
        .json({ success: true, message: "Code successfully applied" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Invalid referral code." });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadReferralPage,
  checkReferralCode,
};
