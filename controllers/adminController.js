const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");

// loading admin dashboard
const loadDashboard = async (req, res) => {
  try {
    const category = await Category.find({});
    const ordersTotal = await Order.find({});
    const orders = await Order.find({})
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(6);

    // Calculate revenue by summing up total product prices for Completed products
    const revenue = ordersTotal.reduce((totalRevenue, order) => {
      const completedProducts = order.products.filter(
        (product) => product.productStatus === "Delivered"
      );

      const productTotalPrices = completedProducts.map(
        (product) => product.totalPrice
      );

      const orderRevenue = productTotalPrices.reduce(
        (subtotal, totalPrice) => subtotal + totalPrice,
        0
      );

      return totalRevenue + orderRevenue;
    }, 0);

    // to find the total number of orders
    const totalNumberOfOrders = ordersTotal.reduce((totalOrders, order) => {
      return totalOrders + order.products.length;
    }, 0);

    // to find the total number of products
    const totalNumberOfProducts = await Product.find({}).countDocuments();

    // to find the total number of categories
    const totalCategories = await Category.find({}).countDocuments();

    // to find the montly revenue of the store
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Find orders within the current month
    const monthlyOrders = await Order.find({
      createdAt: { $gte: firstDayOfMonth },
    });

    // Calculate revenue for the current month
    const monthlyRevenue = monthlyOrders.reduce((totalRevenue, order) => {
      const completedProducts = order.products.filter(
        (product) => product.productStatus === "Delivered"
      );

      const productTotalPrices = completedProducts.map(
        (product) => product.totalPrice
      );

      const orderRevenue = productTotalPrices.reduce(
        (subtotal, totalPrice) => subtotal + totalPrice,
        0
      );

      return totalRevenue + orderRevenue;
    }, 0);


    if (category) {
      res.status(200).render("dashboard", {
        title: "Admin Dashboard",
        category,
        orders,
        revenue,
        totalNumberOfOrders,
        totalNumberOfProducts,
        totalCategories,
        monthlyRevenue,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// block the user and update it on the database
const blockUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    userData.is_blocked = !userData.is_blocked;
    await userData.save();

    if (userData.is_blocked) res.json({ success: true, is_blocked: true });

    if (!userData.is_blocked) res.json({ success: true, is_blocked: false });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// admin logout
const logoutAdmin = async (req, res) => {
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

// show charts in the dashboard
const saleChart = async (req, res) => {
  try {
    if (!req.query.interval) {
      console.error("Error: Missing interval parameter in the request");
      return res.status(400).json({ error: "Missing interval parameter" });
    }

    const interval = req.query.interval.toLowerCase();

    let dateFormat, groupByFormat;

    switch (interval) {
      case "yearly":
        dateFormat = "%Y";
        groupByFormat = { $dateToString: { format: "%Y", date: "$createdAt" } };
        break;
      case "monthly":
        dateFormat = "%B %Y";
        groupByFormat = {
          $dateToString: { format: "%B %Y", date: "$createdAt" },
        };
        break;
      case "daily":
        dateFormat = "%Y-%m-%d";
        groupByFormat = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        };
        break;
      default:
        return res.status(400).json({ error: "Invalid time interval" });
    }

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: groupByFormat,
          totalSales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = salesData.map((item) => item._id);
    const values = salesData.map((item) => item.totalSales);

    res.json({ labels, values });
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// to load user management in admin side
const loadUserManagement = async (req, res) => {
  try {
    const user = await User.find({ is_admin: false });

    if (user) {
      res.status(200).render("user-management", {
        title: "User Management",
        user,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// to load the error page
const loadErrorPage = (req, res) => {
  res.status(404).render("error-page", {
    title: "Error",
  });
};

// exporting the moduels
module.exports = {
  loadDashboard,
  blockUser,
  logoutAdmin,
  saleChart,
  loadUserManagement,
  loadErrorPage,
};
