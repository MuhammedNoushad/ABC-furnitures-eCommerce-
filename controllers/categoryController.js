const Category = require("../model/categoryModel");
const User = require("../model/userModel");

// adding new category and update the category into the database
const addNewcategory = async (req, res) => {
  try {
    const { categoryName, categoryId } = req.body;
    const selectedList = req.body["list-unlist"];
    const listed = selectedList === "list" ? true : false;

    const category = new Category({
      categoryName,
      listed,
    });
    await category.save();

    res.json({
      success: true,
      message: "Category added successfully",
      newCategory: category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// edit category from the database
const editCategory = async (req, res) => {
  try {
    const { id } = req.query;

    req.session.categoryId = id;

    const category = await Category.findById({ _id: id });

    if (category) {
      res.render("edit-category", {
        title: "Edit-Category",
        category,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// delete category and update it on the database
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.query;

    const categoryData = await Category.deleteOne({ _id: id });

    if (categoryData.deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
      });
    } else {
      res.status(404).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// edit updated category to the database
const updateCategory = async (req, res) => {
  try {
    const { categoryName, categoryId } = req.body;
    const categoryLower = (categoryName || "").trim().toLowerCase();

    // Check if the categoryName is not empty
    if (categoryName.trim() !== "") {
      const selectedList = req.body["list-unlist"];
      const listed = selectedList === "list" ? true : false;

      const existingCategory = await Category.findOne({
        categoryName: { $regex: new RegExp(categoryLower, "i") },
        _id: { $ne: categoryId },
      });

      if (existingCategory) {
        return res
          .status(409)
          .json({ error: "Category with this name already exists." });
      } else {
        // categoryName is not empty, proceed with the update
        const updatedCategory = await Category.findByIdAndUpdate(
          { _id: categoryId },
          {
            categoryName,
            listed,
          },
          { new: true }
        );

        if (updatedCategory) {
          return res.status(200).json({
            success: true,
            message: "Category edited successfully",
            data: updatedCategory,
          });
        }
      }
    } else {
      // categoryName is empty, return a 400 response
      return res.status(400).json({ error: "Fields cannot be empty" });
    }
  } catch (error) {
    console.error("Error in updateCategory:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// load category management page
const loadCategory = async (req, res) => {
  try {
    const user = await User.find({ is_admin: false });

    const category = await Category.find({});
    res.render("category-management", {
      title: "Category Management",
      user,
      category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// load the category offer page
const loadCategoryOffers = async (req, res) => {
  try {
    const category = await Category.find({});
    res.render("category-offer", {
      title: "Offer Management",
      category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// exproting modules
module.exports = {
  addNewcategory,
  editCategory,
  deleteCategory,
  updateCategory,
  loadCategory,
  loadCategoryOffers,
};
