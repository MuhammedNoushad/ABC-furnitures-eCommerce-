const Banner = require("../model/bannerModel");
const Product = require("../model/productModel");
const Category = require("../model/categoryModel");

// load banner to admin dashboard
const loadBannerManagement = async (req, res) => {
  try {
    const banner = await Banner.find({});
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

    res.render("banner-management", {
      title: "Banner Management",
      product: productData,
      totalNumberOfPages,
      page,
      category,
      banner,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// add new banner from admin pannel
const addNewBanner = async (req, res) => {
  try {
    const categoryData = await Category.find({});

    if (categoryData) {
      res.render("add-new-banner", {
        title: "Add New Banner",
        category: categoryData,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// post added banner to the database
const postAddedBanner = async (req, res) => {
  try {
    const { bannerName, description, myCategory, offerPercentage } = req.body;

    let imageFiles = [];
    if (req.files && req.files.length > 0) {
      imageFiles = req.files.map((file) => ({ filename: file.filename }));
    }

    const banner = new Banner({
      title: bannerName,
      imageUrl: imageFiles,
      description: description,
      offerCategory: myCategory,
      offerPercentage: offerPercentage,
    });

    const bannerData = await banner.save();

    if (bannerData)
      res
        .status(200)
        .json({ success: true, message: "Banner created successfully." });
    else
      res.status(400).json({
        success: false,
        message: "An error occurred while creating this banner.",
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// delete banner from admin side
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.query;

    const bannerData = await Banner.deleteOne({ _id: id });

    if (bannerData.deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: "Banner deleted successfully.",
      });
    } else {
      res.status(404).json({ success: false, message: "Banner not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// load edit banner option
const loadEditBanner = async (req, res) => {
  try {
    const { id } = req.query;

    const bannerData = await Banner.findByIdAndUpdate({ _id: id });
    const categoryData = await Category.find({});

    if (bannerData) {
      res.render("edit-Banner", {
        title: "Edit-Banner",
        banner: bannerData,
        category: categoryData,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// post edited banner data
const postEditBanner = async (req, res) => {
  try {
    const _id = req.query.bannerId;
    const { bannerName, description, myCategory, offerPercentage } = req.body;

    const imageFiles = req.files;


    let imageArray = [];
    if (imageFiles.length) {
      imageArray = imageFiles.map((file) => ({ filename: file.filename }));
    } else {
      const existingBanner = await Banner.findById(_id);


      if (existingBanner && existingBanner.imageUrl) {
        imageArray = existingBanner.imageUrl;
      }
    }

    // Update the product with the new data
    const bannerData = await Banner.findByIdAndUpdate(
      _id,
      {
        title: bannerName,
        imageUrl: imageArray,
        description: description,
        offerCategory: myCategory,
        offerPercentage: offerPercentage,
      },
      { new: true }
    );

    if (bannerData) {
      res.redirect("/admin/products/banner-management#products");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};



module.exports = {
  loadBannerManagement,
  addNewBanner,
  postAddedBanner,
  deleteBanner,
  loadEditBanner,
  postEditBanner,
};
