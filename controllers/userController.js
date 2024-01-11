require("dotenv").config({ path: "./config/.env" });
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const User = require("../model/userModel");
const Product = require("../model/productModel");
const Cart = require("../model/cartModel");
const bcryptPassword = require("../services/hashPassword");
const Wallet = require("../model/walletModel");
const Wishlist = require("../model/wishlistModel");
const Category = require("../model/categoryModel");
const Banner = require("../model/bannerModel");

const otpCache = {};

// emai sending
const sendEmailWithVerification = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    otpCache[email] = otp;

    // Set up email data
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification Code",
      html: `<h3><span style='color: #FF0000;'>ABC Furniture</span> </h3>
       <h5>Account Verification Code 📩</h5>
       <h1>${otp}</h1>
       `,
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

// load the user home
const loadHome = async (req, res) => {
  try {
    const banner = await Banner.find({});
    const category = await Category.find({});
    const user_id = req.session._id;
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });
    const product = await Product.find({});

    res.render("home", {
      title: "Home",
      currentPage: "home",
      loggedIn,
      cartCount,
      category,
      banner,
    });
    if (product) {
    }
  } catch (error) {
    console.log(error.message);
  }
};

// load the login page
const loadLogin = async (req, res) => {
  const category = await Category.find({});

  const user_id = req.session._id;
  const loggedIn = req.session.isAuth ? true : false;
  const cartCount = user_id
    ? await Cart.countDocuments({ user_id })
    : await Cart.countDocuments({ user_id: null });
  res.render("login", {
    title: "User login",
    currentPage: "",
    loggedIn,
    cartCount,
    category,
  });
};

// load the signup page
const loadSignup = async (req, res) => {
  const referral = req.query.referral || null;

  req.session.referral = { referral: referral };
  const category = await Category.find({});

  const user_id = req.session._id;
  const loggedIn = req.session.isAuth ? true : false;
  const cartCount = user_id
    ? await Cart.countDocuments({ user_id })
    : await Cart.countDocuments({ user_id: null });
  res.render("signup", {
    title: "User signup",
    currentPage: "",
    loggedIn,
    cartCount,
    category,
  });
};

// send the email verification to sign up
const signupUser = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, mobile, password } = req.body;
    req.session.tempUserData = { username, email, mobile, password };

    const existUsername = await User.findOne({ username: username });
    const emailExisting = await User.findOne({ email: email });

    if (!existUsername) {
      if (!emailExisting) {
        // Additional logic can be added here if needed
        await sendEmailWithVerification(email);
        res.json({
          success: true,
          message: "Verification email sent. Redirect to /verify-user.",
        });
      } else {
        console.log("existing email");
        res.status(409).json({
          success: false,
          errorType: "email",
          message: "Email already existing.",
        });
      }
    } else {
      console.log("existing user");
      res.status(409).json({
        success: false,
        errorType: "username",
        message: "Username already taken. Please choose a different username.",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// verify user
const verifyUser = async (req, res) => {
  try {
    const { username, pass } = req.body;
    const user_id = req.session._id;
    const userData = await User.findOne({ username: username });
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });
    const category = await Category.find({});

    if (userData) {
      const passwordMatch = await bcrypt.compare(pass, userData.password);

      if (!userData.is_admin) {
        if (!userData.is_blocked) {
          if (passwordMatch) {
            req.session.isAuth = true;
            req.session._id = userData._id;

            // Update wishlist database for the logged-in user
            await Wishlist.updateMany(
              { user_id: null },
              { $set: { user_id: userData._id } }
            );

            res.redirect("/user-home");
          } else {
            res.status(200).render("login", {
              title: "User login",
              currentPage: "",
              loggedIn,
              cartCount,
              category,
              message: "Please Check Your Password.",
            });
          }
        } else {
          res.status(403).render("login", {
            title: "User login",
            currentPage: "",
            loggedIn,
            cartCount,
            message: "We apologize, but access is currently restricted.",
            category,
          });
        }
      } else {
        if (passwordMatch) {
          req.session.isAdminAuth = true;
          res.status(200).redirect("/admin");
        } else {
          res.status(200).render("login", {
            title: "User login",
            currentPage: "",
            loggedIn,
            cartCount,
            message: "Please Check Your Password.",
            category,
          });
        }
      }
    } else {
      res.status(409).render("login", {
        title: "User login",
        currentPage: "",
        loggedIn,
        cartCount,
        message: "User not found.",
        category,
      });
    }
  } catch (error) {
    console.error("Error in verifyUser:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const checkOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email, mobile, username, password } = req.session.tempUserData;
    const { referral } = req.session.referral;
    const user_id = req.session._id;

    if (otpCache[email] === otp) {
      try {
        const securePassword = await bcryptPassword(password);

        // Create a new user
        const user = new User({
          username,
          email,
          mobile,
          password: securePassword,
          is_blocked: false,
          is_admin: false,
        });

        // Save the user data
        const userData = await user.save();

        if (userData) {
          const wallet = new Wallet({
            userId: userData._id,
            balance: 0,
            transactions: [],
          });

          const walletData = await wallet.save();

          if (walletData) {
            const refereeName = await User.findOne({ referralCode: referral });

            if (refereeName) {
              const updatedWallet = await Wallet.findOneAndUpdate(
                { userId: refereeName._id },
                {
                  $inc: { balance: 100 },
                  $push: {
                    transactions: {
                      amount: 100,
                      transactionType: "credit",
                      timestamp: new Date(),
                    },
                  },
                },
                { new: true }
              );
            }

            res
              .status(200)
              .json({ success: true, message: "User created successfully" });
          } else {
            res.status(500).json({
              success: false,
              message: "Failed to create a wallet for the user",
            });
          }
        } else {
          res
            .status(500)
            .json({ success: false, message: "Failed to update user data" });
        }
      } catch (error) {
        console.log("Error creating user and wallet:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred while creating user and wallet",
        });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Otp entered is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// otp resend
const resendOtp = async (req, res) => {
  try {
    const { email } = req.session.tempUserData;

    if (email) {
      await sendEmailWithVerification(email);
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// load the user profile
const loadUserProfile = async (req, res) => {
  try {
    const category = await Category.find({});

    const loggedIn = req.session.isAuth ? true : false;
    const _id = req.session._id;
    const cartCount = _id
      ? await Cart.countDocuments({ user_id: _id })
      : await Cart.countDocuments({ user_id: null });

    const userData = await User.findById({ _id });

    res.render("userProfile", {
      title: "User-Profile",
      user: userData,
      currentPage: "",
      loggedIn,
      cartCount,
      category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// load the user home page
const loadHomeUser = async (req, res) => {
  try {
    const category = await Category.find({});
    const banner = await Banner.find({});
    const user_id = req.session._id;
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });

    res.render("homeAfterLogin", {
      loggedIn,
      title: "Home",
      currentPage: "home",
      cartCount,
      category,
      banner,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// email verification page
const verifyUserEmail = async (req, res) => {
  const category = await Category.find({});

  const user_id = req.session._id;
  const loggedIn = req.session.isAuth ? true : false;
  const cartCount = user_id
    ? await Cart.countDocuments({ user_id })
    : await Cart.countDocuments({ user_id: null });

  res.render("verification", {
    loggedIn,
    title: "User verification",
    currentPage: "",
    cartCount,
    category,
  });
};

// logout the user
const logoutUser = async (req, res) => {
  try {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/login");
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

// edit user name
const editUserName = async (req, res) => {
  try {
    const category = await Category.find({});

    const user_id = req.query.id;
    const userData = await User.findById({ _id: user_id });
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id: user_id })
      : await Cart.countDocuments({ user_id: null });
    if (userData) {
      res.status(200).render("editUserName", {
        title: "User-Profile",
        user: userData,
        currentPage: "",
        loggedIn,
        cartCount,
        category,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// update the edited name of user
const updateUserName = async (req, res) => {
  try {
    const { username } = req.body;
    const user_id = req.session._id;

    const userData = await User.findByIdAndUpdate(
      user_id,
      { username: username },
      { new: true }
    );
    if (userData) {
      res.status(200).redirect("/user-profile");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// edit user mobile
const editUserMobile = async (req, res) => {
  try {
    const user_id = req.query.id;
    const userData = await User.findById({ _id: user_id });
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id: user_id })
      : await Cart.countDocuments({ user_id: null });
    if (userData) {
      res.status(200).render("editUserMobile", {
        title: "User-Profile",
        user: userData,
        currentPage: "",
        loggedIn,
        cartCount,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// update the user mobile
const updateMobile = async (req, res) => {
  try {
    const { mobile } = req.body;
    const user_id = req.query.id;

    const userData = await User.findByIdAndUpdate(
      user_id,
      { mobile: mobile },
      { new: true }
    );

    if (userData) {
      // Mobile number updated successfully
      res.status(200).json({
        success: true,
        message: "Mobile number updated successfully.",
      });
    } else {
      // Failed to update mobile number
      res
        .status(500)
        .json({ success: false, message: "Error updating mobile number." });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// edit password
const editUserPassword = async (req, res) => {
  try {
    const category = await Category.find({});

    const user_id = req.query.id;
    const userData = await User.findById({ _id: user_id });
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id: user_id })
      : await Cart.countDocuments({ user_id: null });
    if (userData) {
      res.status(200).render("editPassword", {
        title: "User-Profile",
        user: userData,
        currentPage: "",
        loggedIn,
        cartCount,
        category,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// update the edited password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user_id = req.query.id;
    const userData = await User.findById({ _id: user_id });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      userData.password
    );

    if (passwordMatch) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      userData.password = hashedNewPassword;
      const updatedPass = await userData.save();

      if (updatedPass) {
        // Respond with JSON for AJAX request
        res.status(200).json({ message: "Password updated successfully" });
      }
    } else {
      // Respond with JSON for AJAX request
      res.status(401).json({ message: "Current password is incorrect" });
    }
  } catch (error) {
    console.error("Error updating password:", error.message);

    // Respond with JSON for AJAX request
    res.status(500).json({ message: "Internal server error" });
  }
};

// forgot password
const forgotPassword = async (req, res) => {
  try {
    const category = await Category.find({});

    const user_id = req.session._id;
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });
    res.render("forgot-password", {
      title: "Password change",
      currentPage: "",
      loggedIn,
      cartCount,
      category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// authenticate the user before allowing to change the password
const userAuthentication = async (req, res) => {
  try {
    const { email } = req.body;

    const userData = await User.findOne({ email: email });

    if (userData) {
      req.session.tempUserData = email;
      await sendEmailWithVerification(email);

      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// load otp input field for changing password
const otpCheckforPassword = async (req, res) => {
  try {
    const category = await Category.find({});

    const user_id = req.session._id;
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });

    res.render("otp-check-password", {
      loggedIn,
      title: "User verification",
      currentPage: "",
      cartCount,
      category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// verify user for password change
const verifyUserForPasswordChange = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.session.tempUserData;

    if (otpCache[email] === otp) {
      res.status(200).json({
        success: true,
        message: "OTP verification successful",
        redirectTo: "/update-changed-password",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// load update new password
const loadUpdateNewPassword = async (req, res) => {
  try {
    const category = await Category.find({});
    const user_id = req.session._id;
    const loggedIn = req.session.isAuth ? true : false;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });

    res.render("change-password", {
      title: "Change password",
      currentPage: "",
      loggedIn,
      cartCount,
      category,
    });
  } catch (error) {
    console.error("Error loading update new password:", error.message);
    // Handle the error as needed (e.g., redirect to an error page)
    res.status(500).send("Internal Server Error");
  }
};

// update new password
const updateNewPassword = async (req, res) => {
  try {
    const newPassword = req.body.newPassword;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const email = req.session.tempUserData;
    const userData = await User.findOne({ email: email });
    userData.password = hashedNewPassword;
    const updatedPass = await userData.save();

    if (updatedPass) {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// for loading the error page of users
const loadErrorPage = async (req, res) => {
  try {
    const category = await Category.find({});

    const loggedIn = req.session.isAuth ? true : false;
    const user_id = req.session._id;
    const cartCount = user_id
      ? await Cart.countDocuments({ user_id })
      : await Cart.countDocuments({ user_id: null });

    res.render("error-page", {
      title: "Error",
      currentPage: "",
      loggedIn,
      cartCount,
      category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// exporting modules
module.exports = {
  loadHome,
  loadLogin,
  loadSignup,
  signupUser,
  verifyUser,
  verifyUserEmail,
  checkOtp,
  loadHomeUser,
  loadUserProfile,
  logoutUser,
  resendOtp,
  editUserName,
  updateUserName,
  editUserMobile,
  updateMobile,
  editUserPassword,
  updatePassword,
  forgotPassword,
  userAuthentication,
  otpCheckforPassword,
  verifyUserForPasswordChange,
  updateNewPassword,
  loadUpdateNewPassword,
  loadErrorPage,
};
