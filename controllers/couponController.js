const Coupon = require("../model/couponModle");
const Cart = require("../model/cartModel");
const Category = require("../model/categoryModel");

// add the coupon to the data base
const addCoupon = async (req, res) => {
  try {
    res.render("add-new-coupon", {
      title: "Coupon Mangement",
    });
  } catch (error) {
    console.log(error.message);
  }
};

// to show coupons on admin side
const showCoupons = async (req, res) => {
  try {
    const coupon = await Coupon.find({});
    res.render("coupon-management", {
      title: "Coupon Mangement",
      coupons: coupon,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const postAddedCoupons = async (req, res) => {
  try {
    const {
      couponCode,
      description,
      discountAmount,
      minimumPurchase,
      expirationDate,
    } = req.body;

    // Check if the coupon code already exists
    const existingCoupon = await Coupon.findOne({ couponCode: couponCode });

    if (!existingCoupon) {
      // If the coupon does not exist, create a new coupon
      const coupon = new Coupon({
        couponCode,
        discountAmount,
        minimumPurchase,
        expirationDate,
        description,
      });

      const couponSaved = await coupon.save();
      res.status(200).json({ success: true });
    } else {
      return res.status(400).json({
        success: false,
        message: "Coupon code is already in use by another coupon",
      });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error(error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// edit the coupon
const editCoupon = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    const coupon = await Coupon.findById({ _id: couponId });
    res.render("edit-coupon", {
      title: "Coupon Mangement",
      coupon,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// post the updated coupon data
const postEditedCoupon = async (req, res) => {
  try {
    const {
      couponId,
      couponCode,
      description,
      discountAmount,
      minimumPurchase,
      expirationDate,
    } = req.body;

    // Check if the couponCode already exists for a different coupon
    const existingCoupon = await Coupon.findOne({
      couponCode,
      _id: { $ne: couponId },
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is already in use by another coupon",
      });
    }

    // Create an update object with only the fields that are present
    const updateObject = {
      couponCode,
      description,
      discountAmount,
      minimumPurchase,
    };

    // Add expirationDate to the updateObject if it is present
    if (expirationDate) {
      updateObject.expirationDate = expirationDate;
    }

    const couponUpdated = await Coupon.findByIdAndUpdate(
      couponId,
      updateObject,
      {
        new: true,
      }
    );

    if (!couponUpdated) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      updatedCoupon: couponUpdated,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete the existing coupon
const deleteCoupon = async (req, res) => {
  try {
    const _id = req.params.couponId;
    const couponDeleted = await Coupon.findByIdAndDelete({ _id: _id });

    if (couponDeleted) {
      res
        .status(200)
        .json({ success: true, message: "Coupon deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Coupon not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// validate coupon from the user side
const validateCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;
    const user_id = req.session._id;

    const validCoupon = await Coupon.findById({ _id: couponId });
    const cartData = await Cart.find({ user_id: user_id });

    const subTotal = cartData.reduce((acc, cartElement) => {
      return (acc += cartElement.totalPrice);
    }, 0);

    if (validCoupon) {
      const userUsedCoupon = validCoupon.used_coupons.includes(user_id);

      if (userUsedCoupon) {
        res.status(400).json({
          success: false,
          message: "Sorry the coupen already used",
        });
      } else if (subTotal >= validCoupon.minimumPurchase)
        res.status(200).json({
          success: true,
          message: `${validCoupon.couponCode} applied`,
          discountAmount: validCoupon.discountAmount,
        });
      else {
        res.status(400).json({
          success: false,
          message: `purchase minimum of ${validCoupon.minimumPurchase} to use this coupon`,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid Coupon",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const removeCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    const validCoupon = await Coupon.findOne({ couponCode: couponCode });

    res
      .status(200)
      .json({ success: true, discountAmount: validCoupon.discountAmount });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  showCoupons,
  addCoupon,
  postAddedCoupons,
  editCoupon,
  postEditedCoupon,
  deleteCoupon,
  validateCoupon,
  removeCoupon,
};
