const { success } = require("toastr");
const Address = require("../model/addressModel");
const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Category = require("../model/categoryModel");


// adding new address for the User
const addNewAddress = async (req, res) => {
  try {
    const category = await Category.find({})

    const user_id = req.session._id;
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });

    res.render("add-new-address", {
      loggedIn,
      title: "Add Address",
      currentPage: "checkout",
      cartCount,
      category
    });
  } catch (error) {
    console.log(error.message);
  }
};

// post the added address to the database
const postNewAddress = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      country,
      streetAddress,
      city,
      zipCode,
      phoneNumber,
    } = req.body;

    const user_id = req.session._id;

    const address = new Address({
      firstName,
      lastName,
      email,
      country,
      streetAddress,
      city,
      zipCode,
      phoneNumber,
      user_id,
    });

    if (address) {
      address.save();
      res.redirect("/user-address");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// edit address of the user
const getEditAddress = async (req, res) => {
  try {
    const category = await Category.find({})

    const _id = req.query.id;
    const user_id = req.session._id;
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });
    const address = await Address.findById({ _id });

    res.render("edit-address", {
      loggedIn,
      title: "Add Address",
      currentPage: "checkout",
      cartCount,
      address,
      category
    });
  } catch (error) {
    console.log(error.message);
  }
};

// post the edited address of the user
const postEditAddress = async (req, res) => {
  try {
    const { id } = req.query;
    const {
      firstName,
      lastName,
      email,
      country,
      streetAddress,
      city,
      zipCode,
      phoneNumber,
    } = req.body;

    const user_id = req.session._id;

    const editedAddress = await Address.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        country,
        streetAddress,
        city,
        zipCode,
        phoneNumber,
        user_id,
      },
      { new: true }
    );
    if (editedAddress) {
      res.redirect("/checkout");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// delete address of the user from the database
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.query;

    const addressDeleted = await Address.deleteOne({ _id: id });

    if (addressDeleted) {
      res.redirect("/checkout");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// manage address in user profile
const profileAddress = async (req, res) => {
  try {
    const category = await Category.find({})
    const user_id = req.session._id;
    const user = await User.findById({ _id: user_id });
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });
    const address = await Address.find({ user_id: user_id });
    res.render("userProfileAddress", {
      loggedIn,
      title: "Add Address",
      currentPage: "",
      cartCount,
      address,
      user,
      category
    });
  } catch (error) {
    console.log(error.message);
  }
};

// delete address from the users profile
const deleteAddressFromProfile = async (req, res) => {
  try {
    const { id } = req.query;

    const addressDeleted = await Address.deleteOne({ _id: id });

    if (addressDeleted) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};


// exporting the moduels
module.exports = {
  addNewAddress,
  postNewAddress,
  getEditAddress,
  postEditAddress,
  deleteAddress,
  profileAddress,
  deleteAddressFromProfile,
};
