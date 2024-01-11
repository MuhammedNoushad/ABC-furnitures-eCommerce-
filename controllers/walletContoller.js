const Wallet = require("../model/walletModel");
const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Category = require("../model/categoryModel");


// to show the wallet to user
const getUserWallet = async (req, res) => {
  try {
    const category = await Category.find({})

    const loggedIn = req.session.isAuth ? true : false;
    const _id = req.session._id;
    const cartCount = _id
      ? await Cart.countDocuments({ user_id: _id })
      : await Cart.countDocuments({ user_id: null });
    const wallet = await Wallet.findOne({ userId: _id }).sort({
      "transactions.date": -1,
    });

    const userData = await User.findById({ _id });
    res.status(200).render("wallet-profile", {
      title: "User-Wallet",
      user: userData,
      currentPage: "",
      loggedIn,
      cartCount,
      wallet,
      category
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getUserWallet,
};
