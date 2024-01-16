const fs = require("fs");
const Product = require("../model/productModel");
const Category = require("../model/categoryModel");
const Cart = require("../model/cartModel");
const Order = require("../model/orderModel");
const Address = require("../model/addressModel");
const Coupon = require("../model/couponModle");
const Wallet = require("../model/walletModel");
const category = require("../model/categoryModel");
const Wishlist = require("../model/wishlistModel");

// show products to the admin
const showProducts = async (req, res) => {
  try {
    const sortCategory = req.query.id;
    const page = req.query.page || 0;
    const productsPerPage = 10;
    const category = await Category.find({});
    const totalNumberOfProducts = sortCategory
      ? await Product.find({ category: sortCategory }).countDocuments()
      : await Product.find({}).countDocuments();
    const totalNumberOfPages = Math.ceil(
      totalNumberOfProducts / productsPerPage
    );

    const productData = sortCategory
      ? await Product.find({ category: sortCategory })
          .skip(page * productsPerPage)
          .limit(productsPerPage)
      : await Product.find({})
          .skip(page * productsPerPage)
          .limit(productsPerPage);

    res.render("products-management", {
      title: "Product Management",
      product: productData,
      totalNumberOfPages,
      page,
      category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// add new products to the website from the admin side
const addNewProduct = async (req, res) => {
  try {
    const categoryData = await Category.find({});

    if (categoryData) {
      res.render("add-product", {
        title: "Add Product",
        category: categoryData,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// post the added products to the website
const postNewProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      marketPrice,
      salePrice,
      myCategory,
      quantity,
    } = req.body;

    let imageFiles = [];
    if (req.files && req.files.length > 0) {
      imageFiles = req.files.map((file) => ({ filename: file.filename }));
    }

    const categoryData = await Category.findOne({ _id: myCategory });

    const product = new Product({
      productName: productName,
      description: description,
      regularPrice: marketPrice,
      salePrice: salePrice,
      category: categoryData._id,
      quantity: quantity,
      image: imageFiles,
    });

    const productData = await product.save();

    if (productData) {
      return res.redirect("/admin/products/add-new-product");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// delete the product from the admin side and update it to the database
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.query;

    const productData = await Product.deleteOne({ _id: id });

    if (productData.deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
      });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// edit the products from the admin side
const editProduct = async (req, res) => {
  try {
    const { id } = req.query;

    const productData = await Product.findByIdAndUpdate({ _id: id });
    const categoryData = await Category.find({});

    if (productData) {
      res.render("edit-product", {
        title: "Edit-Product",
        product: productData,
        category: categoryData,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// update already existing product
const postEditProduct = async (req, res) => {
  try {
    const _id = req.query.productId;
    const {
      productName,
      description,
      marketPrice,
      salePrice,
      myCategory,
      quantity,
    } = req.body;

    const imageFiles = req.files;

    let imageArray = [];
    if (imageFiles) {
      imageArray = imageFiles.map((file) => ({ filename: file.filename }));
    }

    // Get the existing product data
    const existingProduct = await Product.findById(_id);

    // Append the new images to the existing ones
    const updatedImages = [...existingProduct.image, ...imageArray];

    // Update the product with the new data
    const productData = await Product.findByIdAndUpdate(
      _id,
      {
        productName: productName,
        description: description,
        regularPrice: marketPrice,
        salePrice: salePrice,
        category: myCategory,
        quantity: quantity,
        image: updatedImages,
      },
      { new: true }
    );

    if (productData) {
      res.redirect("/admin/products/product-management#products");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

// load products for the users
const loadProducts = async (req, res) => {
  try {
    const user_id = req.session._id;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });

    const sortCategory = req.query.id;
    const page = req.query.page || 0;
    const productsPerPage = 6;

    const categorySearch = req.query.category;

    const search = req.query.search;
    const priceRange = req.query.priceRange;

    const wishlist = await Wishlist.find({ user_id: user_id });

    let productData;

    if (search) {
      if (categorySearch === "all") {
        productData = await Product.find({
          productName: { $regex: new RegExp(".*" + search + ".*", "i") },
        })
          .skip(page * productsPerPage)
          .limit(productsPerPage);
      } else {
        productData = await Product.find({
          category: categorySearch,
          productName: { $regex: new RegExp(".*" + search + ".*", "i") },
        })
          .skip(page * productsPerPage)
          .limit(productsPerPage);
      }
    } else {
      if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split("-");
        productData = sortCategory
          ? await Product.find({
              category: sortCategory,
              salePrice: { $gte: minPrice, $lte: maxPrice },
            })
              .skip(page * productsPerPage)
              .limit(productsPerPage)
          : await Product.find({
              salePrice: { $gte: minPrice, $lte: maxPrice },
            })
              .skip(page * productsPerPage)
              .limit(productsPerPage);
      } else {
        productData = sortCategory
          ? await Product.find({ category: sortCategory })
              .skip(page * productsPerPage)
              .limit(productsPerPage)
          : await Product.find({})
              .skip(page * productsPerPage)
              .limit(productsPerPage);
      }
    }

    const totalNumberOfProducts = sortCategory
      ? await Product.find({ category: sortCategory }).countDocuments()
      : await Product.find({}).countDocuments();
    const totalNumberOfPages = Math.ceil(
      totalNumberOfProducts / productsPerPage
    );

    const categoryData = await Category.find({});

    const loggedIn = req.session.isAuth ? true : false;

    if (productData && categoryData) {
      res.render("shop", {
        loggedIn,
        currentPage: "shop",
        title: "Shop",
        category: categoryData,
        products: productData,
        page: page,
        totalNumberOfProducts: productData.length,
        totalNumberOfPages,
        cartCount,
        wishlist,
        selectedPriceRange: priceRange, 
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// load the details of the products to the users
const loadProductDetails = async (req, res) => {
  try {
    const category = await Category.find({});

    const user_id = req.query.id;
    const productData = await Product.findById({ _id: user_id });
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id: user_id })
      : await Cart.countDocuments({ user_id: null });

    res.render("productDetails.ejs", {
      loggedIn,
      title: "Product Details",
      currentPage: "shop",
      products: productData,
      cartCount,
      category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// product check out
const checkoutProduct = async (req, res) => {
  try {
    const category = await Category.find({});

    const user_id = req.session._id;
    const cart = await Cart.find({ user_id: user_id });
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = await Cart.countDocuments({ user_id });
    const address = await Address.find({ user_id });
    const productIds = cart.map((cart) => cart.product_id);
    const products = await Product.find({ _id: { $in: productIds } });
    const coupons = await Coupon.find({});
    const wallet = await Wallet.findOne({ userId: user_id });
    console.log(wallet);

    res.render("checkout", {
      loggedIn,
      title: "Checkout Products",
      currentPage: "checkout",
      cartCount,
      address,
      cart,
      products,
      coupons,
      wallet,
      category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// delete single image from the product details
const deleteSingleImage = async (req, res) => {
  try {
    const { productId, filename } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    const imageIndex = product.image.findIndex(
      (img) => img.filename === filename
    );

    if (imageIndex === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Image not found in the product" });
    }

    product.image.splice(imageIndex, 1);

    await product.save();

    const filePath = `public/assets/uploads/${filename}`;

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res
          .status(500)
          .json({ success: false, error: "Error deleting file" });
      }

      res
        .status(200)
        .json({ success: true, message: "Image deleted successfully" });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// load product offers
const loadProductOffers = async (req, res) => {
  try {
    const sortCategory = req.query.id;
    const page = req.query.page || 0;
    const productsPerPage = 10;
    const category = await Category.find({});
    const totalNumberOfProducts = sortCategory
      ? await Product.find({ category: sortCategory }).countDocuments()
      : await Product.find({}).countDocuments();
    const totalNumberOfPages = Math.ceil(
      totalNumberOfProducts / productsPerPage
    );

    const productData = sortCategory
      ? await Product.find({ category: sortCategory })
          .skip(page * productsPerPage)
          .limit(productsPerPage)
      : await Product.find({})
          .skip(page * productsPerPage)
          .limit(productsPerPage);

    res.render("products-offers", {
      title: "Offer Management",
      product: productData,
      totalNumberOfPages,
      page,
      category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// add product offer
const addProductOffer = async (req, res) => {
  try {
    const { productId, offerPercentage } = req.body;
    const productData = await Product.findById(productId);
    let updated;

    if (productData) {
      productData.productOffer = Math.floor(
        productData.regularPrice * (offerPercentage / 100)
      );
      productData.salePrice = productData.salePrice - productData.productOffer;
      updated = productData.save();
    }

    if (updated) {
      res.status(200).json({
        success: true,
        salePrice: productData.salePrice,
        message: "Offer updated successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Can't updated the offer." });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// remove added offer of a product
const removeProductOffer = async (req, res) => {
  try {
    const { productId } = req.body;
    const productData = await Product.findById(productId);
    let updated;

    if (productData) {
      productData.salePrice =
        Number(productData.productOffer) + Number(productData.salePrice);
      productData.productOffer = 0;
      updated = await productData.save();
    }

    if (updated) {
      res.status(200).json({
        success: true,
        salePrice: productData.salePrice,
        message: "Offer removed successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Can't updated the offer." });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// add category offer
const addCategoryOffer = async (req, res) => {
  try {
    const { categoryId, offerPercentage } = req.body;

    const categoryData = await Category.findById(categoryId);
    categoryData.categoryOffer = offerPercentage;
    categoryData.save();

    const productData = await Product.find({ category: categoryId });

    for (const product of productData) {
      const discountAmount = Math.floor(
        product.regularPrice * (offerPercentage / 100)
      );
      product.salePrice = +(product.salePrice - discountAmount);

      product.save();
    }

    res.status(200).json({
      success: true,
      message: "Category offer updated successfully.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Ineternal sever error.",
    });
  }
};

// for removing category offer
const removeCategoryOffer = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const categoryData = await Category.findById(categoryId);
    const productData = await Product.find({ category: categoryId });
    const offerPercentage = categoryData.categoryOffer;

    if (productData) {
      for (const product of productData) {
        const discountAmount = Math.floor(
          product.regularPrice * (offerPercentage / 100)
        );
        product.salePrice = +(product.salePrice + discountAmount);

        product.save();
      }

      categoryData.categoryOffer = 0;
      categoryData.save();
    }

    res.status(200).json({
      success: true,
      salePrice: productData.salePrice,
      message: "Offer removed successfully",
    });
  } catch (error) {
    console.log(error.messge);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
// exproting modules
module.exports = {
  showProducts,
  addNewProduct,
  postNewProduct,
  deleteProduct,
  editProduct,
  postEditProduct,
  loadProducts,
  loadProductDetails,
  checkoutProduct,
  deleteSingleImage,
  loadProductOffers,
  addProductOffer,
  removeProductOffer,
  addCategoryOffer,
  removeCategoryOffer,
};
