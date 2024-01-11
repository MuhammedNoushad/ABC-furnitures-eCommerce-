const Product = require("../model/productModel");

const decreaseProductQuantity = async (products) => {
  try {
    for (const product of products) {
      const { productId, quantity } = product;

      // Retrieve the product from the database
      const existingProduct = await Product.findById(productId);

      if (existingProduct) {
        // Update the quantity in the database
        existingProduct.quantity -= quantity;
        await existingProduct.save();
      }
    }
  } catch (error) {
    console.log(error.message);
    throw new Error("Error updating product quantity");
  }
};

module.exports = decreaseProductQuantity;
