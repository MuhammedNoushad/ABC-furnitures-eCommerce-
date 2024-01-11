// importing the models
const Cart = require("../model/cartModel");
const Product = require("../model/productModel");
const Category = require("../model/categoryModel");


// loading the cart page
const loadAddToCart = async (req, res) => {
  try {
    const category = await Category.find({})

    const loggedIn = req.session.isAuth ? true : false;
    const user_id = req.session._id;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });
    const cart = user_id
      ? await Cart.find({ user_id: user_id })
      : await Cart.find({ user_id: null });
    const productIds = cart.map((cart) => cart.product_id);
    const products = await Product.find({ _id: { $in: productIds } });

    res.render("add-to-cart", {
      title: "Add To Cart",
      currentPage: "cart",
      loggedIn,
      cart,
      products,
      cartCount,
      category
    });
  } catch (error) {
    console.log(error.message);
  }
};

// product add to the cart from the detailed product page
const addProductToCart = async (req, res) => {
  try {
    const quantity = req.body.quantity;
    const user_id = req.session._id;
    const product_id = req.body.productId;
    const productData = await Product.findById({ _id: product_id });

    if (!productData) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const productPrice = productData.salePrice;
    const category_id = productData.category;

    const cartData = user_id
      ? await Cart.findOne({
          user_id: user_id,
          product_id: product_id,
        })
      : await Cart.findOne({
          user_id: null,
          product_id: product_id,
        });

    const totalCartQuantity = cartData ? cartData.quantity : 0;
    const totalQuantity = Number(totalCartQuantity) + Number(quantity);

    if (totalQuantity > productData.quantity) {
      // If the total quantity in the cart exceeds available quantity, send an error JSON response
      return res.status(400).json({
        success: false,
        message: "Out of stock",
      });
    }

    if (cartData) {
      // If the cart item exists, update the quantity
      await Cart.findOneAndUpdate(
        { user_id: user_id, product_id: product_id },
        { $inc: { quantity: quantity } },
        { new: true }
      );
    } else {
      // If the cart item doesn't exist, create a new one
      const cart = new Cart({
        product_id,
        quantity,
        productPrice,
        user_id,
        category_id,
      });

      await cart.save();
    }

    // Send a JSON response indicating success
    res
      .status(200)
      .json({ success: true, message: "Product added to cart successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// adding one item to the cart from the shop page
const addOneItemToTheCart = async (req, res) => {
  try {
    const category = await Category.find({})

    const product_id = req.query.id;
    const quantity = 1;
    const user_id = req.session._id;
    const productData = await Product.findById({ _id: product_id });
    const productPrice = productData.salePrice;
    const category_id = productData.category;

    const cartData = await Cart.findOne({
      user_id: user_id,
      product_id: product_id,
    });

    if (cartData) {
      // If the cart item exists, update the quantity
      await Cart.findOneAndUpdate(
        { user_id: user_id, product_id: product_id },
        { $inc: { quantity: quantity } },
        { new: true }
      );
    } else {
      // If the cart item doesn't exist, create a new one
      const cart = new Cart({
        product_id,
        quantity,
        productPrice,
        user_id,
        category_id,
        category
      });

      const cartUpdated = await cart.save();

      const cartCount = user_id
        ? await Cart.countDocuments({ user_id })
        : await Cart.countDocuments({ user_id: null });
      if (cartUpdated) {
        res.status(200).json({
          success: true,
          count: cartCount,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

// delete from cart
const deleteCart = async (req, res) => {
  try {
    
    const product_id = req.query.id;
    const user_id = req.session._id;

    const cartDeleted = await Cart.deleteOne({
      product_id: product_id,
      user_id: user_id,
    });

    const cartData = await Cart.find({ user_id: user_id });
    const cartCount = cartData.length;
    if (cartDeleted.deletedCount > 0) {
      const subTotal = cartData.reduce((acc, cartElement) => {
        return (acc += cartElement.totalPrice);
      }, 0);
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        subTotal,
        cartCount,
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

// increment count cart
// increment count cart
const incrementingProductCount = async (req, res) => {
  try {
    const product_id = req.query.id;
    const quantity = 1;
    const user_id = req.session._id;

    const cart = await Cart.findOne({
      user_id: user_id,
      product_id: product_id,
    });

    const productData = await Product.findById({ _id: product_id });

    if (productData.quantity <= cart.quantity) {
      res.status(404).json({ success: false, message: "Out of stock." });
    } else {
      if (cart) {
        cart.quantity += quantity;
        cart.totalPrice = cart.productPrice * cart.quantity;

        await cart.save();
      }

      if (cart) {
        const cartData = await Cart.find({ user_id: user_id });

        const subTotal = cartData.reduce((acc, cartElement) => {
          return (acc += cartElement.totalPrice);
        }, 0);

        res.status(200).json({
          success: true,
          subTotal,
          quantity: cart.quantity,
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Product not found in the cart." });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// decrement count cart
const decrementingProductCount = async (req, res) => {
  try {
    const product_id = req.query.id;
    const quantity = 1;
    const user_id = req.session._id;

    // Find the cart entry for the specified product and user
    const cart = await Cart.findOne({ user_id, product_id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in the cart." });
    }

    if (cart) {
      // Decrease the quantity and update the total price
      cart.quantity -= quantity;
      cart.totalPrice = cart.productPrice * cart.quantity;

      // Save the updated cart entry
      await cart.save();
    }

    // Fetch product details and updated cart data
    const cartData = await Cart.find({ user_id: user_id });

    // Calculate the updated subtotal by summing up the total prices in the cart
    const subTotal = cartData.reduce((acc, cartElement) => {
      return (acc += cartElement.totalPrice);
    }, 0);

    // Send the response with updated information
    res.status(200).json({
      success: true,
      subTotal,
      quantity: cart.quantity,
    });
  } catch (error) {
    console.error(error.message);

    // Handle errors and send an appropriate response
    if (error.message.includes("Quantity cannot be negative.")) {
      res
        .status(400)
        .json({ success: false, message: "Quantity cannot be negative." });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error." });
    }
  }
};

// exporting the moduels
module.exports = {
  loadAddToCart,
  addProductToCart,
  addOneItemToTheCart,
  deleteCart,
  incrementingProductCount,
  decrementingProductCount,
};
