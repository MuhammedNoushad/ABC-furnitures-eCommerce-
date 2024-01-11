const User = require("../model/userModel");

// user  middleware to handle the sessions
const userLoggedIn = async (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login");
  }
};

const userNotLoggedIn = async (req, res, next) => {
  if (!req.session.isAuth && !req.session.isAdminAuth) {
    next();
  } else {
    if (req.session.isAuth) {
      res.redirect("/user-home");
    } else {
      res.redirect("/admin");
    }
  }
};

// check the user is blocked or not
const checkBlockedStatus = async (req, res, next) => {
  try {
    const userId = req.session._id;
    const userData = await User.findById(userId);
   
    if (userData && userData.is_blocked) {
      req.session.destroy(function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/login");
        }
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exporting the modules
module.exports = {
  userNotLoggedIn,
  userLoggedIn,
  checkBlockedStatus,
};
