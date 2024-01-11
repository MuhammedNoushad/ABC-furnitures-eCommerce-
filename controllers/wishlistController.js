const Wishlist = require("../model/wishlistModel");
const Cart = require("../model/cartModel");
const Product = require("../model/productModel");
const Category = require("../model/categoryModel");


const loadWishlist = async (req, res) => {
  try {
    const category = await Category.find({})

    const loggedIn = req.session.isAuth ? true : false;
    const user_id = req.session._id;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });
    const wishlist = user_id
      ? await Wishlist.find({ user_id: user_id })
      : await Wishlist.find({ user_id: null });
    const productIds = wishlist.map((cart) => cart.product_id);
    const products = await Product.find({ _id: { $in: productIds } });

    res.render("whishlist", {
      title: "Add To Cart",
      currentPage: "wishlist",
      loggedIn,
      wishlist,
      products,
      cartCount,
      category
    });
  } catch (error) {
    console.log(error.message);
  }
};

// add item to the wishlist
const addToWishlist = async (req, res) => {
  try {
    const prodcutId = req.query.id;
    const userId = req.session._id;

    const productData = await Product.findById(prodcutId);

    const { productName, salePrice, regularPrice } = productData;

    const wishlist = new Wishlist({
      product_id: prodcutId,
      productName,
      salePrice,
      regularPrice,
      user_id: userId,
    });

    const wishlistData = await wishlist.save();
    if (wishlistData) {
      res
        .status(200)
        .json({ success: true, message: "Wishlist successfully added" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// delete item from the wishlist
const deleteWishlist = async (req, res) => {
  try {
    const product_id = req.query.id;
    const user_id = req.session._id;

    const wishlistDeleted = await Wishlist.deleteOne({
      product_id: product_id,
      user_id: user_id,
    });

    const wishlistData = await Wishlist.find({ user_id: user_id });


    if (wishlistDeleted.deletedCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        wishlistData: wishlistData.length,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in the cart" });
    }
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  loadWishlist,
  addToWishlist,
  deleteWishlist,
};
