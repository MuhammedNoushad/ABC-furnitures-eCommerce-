const Order = require("../model/orderModel");
const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Product = require("../model/productModel");
const Address = require("../model/addressModel");
const { YOUR_KEY_ID, YOUR_KEY_SECRET } = process.env;
const Razorpay = require("razorpay");
const Coupon = require("../model/couponModle");
const Wallet = require("../model/walletModel");
const decreaseProductQuantity = require("../services/decreaseQuantity");
const { ObjectId } = require("mongodb");
const Category = require("../model/categoryModel");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const easyinvoice = require("easyinvoice");
const { Readable } = require("stream");

const instance = new Razorpay({
  key_id: YOUR_KEY_ID,
  key_secret: YOUR_KEY_SECRET,
});

// show order complete notification to the userr and update the order to the database
const cashOnDeliveryOrder = async (req, res) => {
  try {
    const formData = req.body.formData;
    const couponCode = req.body.couponCode;
    const user_id = req.session._id;
    const { address, payment } = formData;
    const addressData = await Address.findById({ _id: address });
    const cartItems = await Cart.find({ user_id: user_id });
    const products = cartItems.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
      productPrice: item.productPrice,
      price: item.totalPrice,
    }));

    let couponDiscound;

    if (couponCode) {
      const couponData = await Coupon.findOne({ couponCode: couponCode });
      couponDiscound = couponData.discountAmount;
    }

    const totalProductPrice = products.reduce((total, product) => {
      return total + product.price;
    }, 0);

    // creating new order data to the database
    const order = new Order({
      user: user_id,
      address: {
        city: addressData.city,
        zipCode: addressData.zipCode,
        streetAddress: addressData.streetAddress,
        phoneNumber: addressData.phoneNumber,
      },
      products: products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        productPrice: product.productPrice,
        totalPrice: product.price,
        status: "Pending",
      })),
      couponDiscound: couponDiscound,
      payment: payment,
      totalPrice: Number(totalProductPrice),
    });

    if (order) {
      await order.save();
      await decreaseProductQuantity(products);
      await Cart.deleteMany({ user_id: user_id });

      if (couponCode) {
        await Coupon.findOneAndUpdate(
          {
            couponCode: couponCode,
          },
          { $push: { used_coupons: user_id } },
          { new: true }
        );
      }

      res.status(200).json({
        success: true,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// razorpay order payment
const razorPayOrder = async (req, res) => {
  try {
    const formData = req.body.formData;
    const totalPrice = req.body.totalPrice;
    const user_id = req.session._id;
    const cartItems = await Cart.find({ user_id: user_id });

    var options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    instance.orders.create(options, function (err, order) {
      if (!err) {
        res.status(200).send({
          success: true,
          msg: "Order Created",
          order_id: order.id,
          amount: totalPrice * 100,
          key_id: YOUR_KEY_ID,
          product_name: "Furniture",
          description: "Good Furniture",
          contact: 9947761188,
          name: "Muhammed Noushad",
          email: "admin@gmail.com",
          formData,
        });
      } else {
        res.status(400).send({
          success: false,
          msg: "Something went wrong",
        });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// show the order data in the user profile
const profileOrder = async (req, res) => {
  try {
    const category = await Category.find({});
    const user_id = req.session._id;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;

    // Calculate the skip value based on the requested page
    const skip = (page - 1) * perPage;

    // Fetch orders with pagination
    const orders = await Order.find({ user: user_id })
      .populate("products.productId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    // Calculate total number of pages
    const totalNumberOfOrders = await Order.countDocuments({ user: user_id });
    const totalNumberOfPages = Math.ceil(totalNumberOfOrders / perPage);

    const loggedIn = req.session.isAuth ? true : false;
    const _id = req.session._id;
    const cartCount = _id
      ? await Cart.countDocuments({ user_id: _id })
      : await Cart.countDocuments({ user_id: null });

    const userData = await User.findById({ _id });

    res.render("orderDetails", {
      orders,
      title: "User-Profile",
      user: userData,
      currentPage: page,
      loggedIn,
      cartCount,
      category,
      totalNumberOfPages,
      page,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// show the details of the ordered product in the profile
const getOrderDetails = async (req, res) => {
  try {
    const category = await Category.find({});

    const productId = req.params.productId;
    const orderId = req.params.orderId;
    const product = await Product.findById(productId);
    const order = await Order.findById(orderId).populate("user");

    const loggedIn = req.session.isAuth ? true : false;
    const _id = req.session._id;

    const productData = order.products.find((product) => {
      return product.productId.equals(new ObjectId(productId));
    });

    console.log(order);

    const cartCount = _id
      ? await Cart.countDocuments({ user_id: _id })
      : await Cart.countDocuments({ user_id: null });

    const userData = await User.findById({ _id });

    res.render("orderedProductDetails", {
      product,
      order,
      productData,
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

// order cancellation by user
const cancelOrder = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const productStatus = "Cancelled";

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: { "products.$[elem].productStatus": "Cancelled" },
      },
      {
        arrayFilters: [{ "elem.productId": productId }],
        new: true,
      }
    );

    if (updatedOrder) {
      const order = await Order.findById(orderId);
      const productStatuses = order.products.map(
        (product) => product.productStatus
      );
      const areAllProductStatusesEqual = productStatuses.every(
        (status) => status === productStatus
      );

      if (areAllProductStatusesEqual) {
        await Order.updateOne(
          { _id: orderId },
          { $set: { status: productStatus } }
        );
      }

      const { user, payment } = order;
      const { _id: userId } = user;

      if (payment !== "Cash on Delivery") {
        const canceledProduct = order.products.find(
          (product) => product.productId.toString() === productId
        );

        const refundAmount = canceledProduct.totalPrice - order.couponDiscound;

        const updatedWallet = await Wallet.findOneAndUpdate(
          { userId: userId },
          {
            $inc: { balance: refundAmount },
            $push: {
              transactions: {
                amount: refundAmount,
                transactionType: "credit",
                timestamp: new Date(),
              },
            },
          },
          { new: true }
        );
      }

      res.redirect("/user-orders");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to calculate the refunded amount based on the product price and quantity
const calculateRefundedAmount = (products, productId) => {
  const product = products.find((p) => p.productId.toString() === productId);
  if (product) {
    if (product.couponDiscound) {
      return product.price * product.quantity - product.couponDiscound;
    } else {
      return product.price * product.quantity;
    }
  }

  return 0;
};

// order management by admin
const orderManagement = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const ordersPerPage = 10;

    const totalNumberOfOrders = await Order.find({}).countDocuments();
    const totalNumberOfPages = Math.ceil(totalNumberOfOrders / ordersPerPage);

    const orders = await Order.find({})
      .sort({ date: -1 })
      .skip(page * ordersPerPage)
      .limit(ordersPerPage)
      .populate("user");

    res.status(200).render("order-management", {
      title: "Admin Orders",
      orders,
      totalNumberOfPages,
      page,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// order details in admin side
const getAdminOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orders = await Order.findById(orderId)
      .populate("user")
      .populate("products.productId");

    if (orders) {
      res.status(200).render("view-order-details", {
        title: "Admin Orders",
        orders,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// post the order status
const postAdmindOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderStatus = req.body.orderStatus;

    const orderData = await Order.findById({ _id: orderId });

    orderData.status = orderStatus;
    const changeProductsOrder = orderData.products.forEach((product) => {
      product.productStatus = orderStatus;
    });

    const statusUpdated = await orderData.save();
    if (statusUpdated) {
      res.status(200).redirect("/admin/products/products-orders");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Cancel the order from the admin side
const adminSingleOrderCancel = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const { productStatus } = req.body;

    // Retrieve the order
    const order = await Order.findById(orderId);

    // Update the order with the new productStatus
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: { "products.$[elem].productStatus": productStatus },
      },
      {
        arrayFilters: [{ "elem._id": productId }],
        new: true,
      }
    );

    if (updatedOrder) {
      // Check if all productStatus values are equal
      const productStatuses = updatedOrder.products.map(
        (product) => product.productStatus
      );
      const areAllProductStatusesEqual = productStatuses.every(
        (status) => status === productStatus
      );

      // If all productStatus values are equal, update the order status
      if (areAllProductStatusesEqual) {
        await Order.updateOne(
          { _id: orderId },
          { $set: { status: productStatus } }
        );
      }

      // Extract relevant information from the order
      const { user, payment } = order;
      const { _id: userId } = user;

      // Check if payment method is not cash on delivery
      if (payment !== "Cash on Delivery") {
        console.log(order.products[1].productId.toString(), productId);
        const canceledProduct = order.products.find(
          (product) => product._id.toString() === productId
        );

        const refundAmount = canceledProduct.totalPrice;

        // Update the user's wallet and add a transaction
        const updatedWallet = await Wallet.findOneAndUpdate(
          { userId: userId },
          {
            $inc: { balance: refundAmount },
            $push: {
              transactions: {
                amount: refundAmount,
                transactionType: "credit",
                timestamp: new Date(),
              },
            },
          },
          { new: true }
        );
      }

      res.status(200).redirect("/admin/products/products-orders");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// razor pay order completed
const orderSucessfullRazorPay = async (req, res) => {
  try {
    const user_id = req.session._id;
    const { address } = req.body.formData;
    const payment = req.body.paymentMethod;
    const couponCode = req.body.couponCode;

    const addressData = await Address.findById({ _id: address });
    const cartItems = await Cart.find({ user_id: user_id });
    const couponData = await Coupon.findOne({ couponCode: couponCode });
    let couponDiscound = 0;

    if (couponData) {
      couponDiscound = couponData.discountAmount;
    }

    const products = cartItems.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
      productPrice: item.productPrice,
      price: item.totalPrice,
    }));

    const totalProductPrice = products.reduce((total, product) => {
      return total + product.price;
    }, 0);

    const order = new Order({
      user: user_id,
      address: {
        city: addressData.city,
        streetAddress: addressData.streetAddress,
        zipCode: addressData.zipCode,
        phoneNumber: addressData.phoneNumber,
      },
      products: products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        productPrice: product.productPrice,
        totalPrice: product.price,
        status: "Pending",
      })),
      couponDiscound: couponDiscound,
      payment: payment,
      totalPrice: totalProductPrice,
    });

    if (order) {
      await order.save();
      await decreaseProductQuantity(products);
      await Cart.deleteMany({ user_id: user_id });

      if (couponCode) {
        await Coupon.findOneAndUpdate(
          {
            couponCode: couponCode,
          },
          { $push: { used_coupons: user_id } },
          { new: true }
        );
      }

      res.status(200).json({
        success: true,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Payment through wallet
const walletOrder = async (req, res) => {
  try {
    const formData = req.body.formData;
    const totalPrice = req.body.totalPrice;
    const couponCode = req.body.couponCode;
    const user_id = req.session._id;
    const { address } = formData;
    const payment = req.body.paymentMethod;
    const addressData = await Address.findById({ _id: address });
    const cartItems = await Cart.find({ user_id: user_id });
    const couponData = await Coupon.findOne({ couponCode: couponCode });

    let couponDiscound = 0;

    if (couponData) {
      const couponData = await Coupon.findOne({ couponCode: couponCode });
      couponDiscound = couponData.discountAmount;
    }
    const products = cartItems.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
      productPrice: item.productPrice,
      price: item.totalPrice,
    }));

    const totalProductPrice = products.reduce((total, product) => {
      return total + product.price;
    }, 0);

    const walletData = await Wallet.findOne({ userId: user_id });

    if (walletData.balance < totalProductPrice) {
      // Insufficient balance
      return res.status(400).json({
        success: false,
        message: "Insufficient balance in the wallet.",
      });
    }

    // Creating new order data in the database
    const order = new Order({
      user: user_id,
      address: {
        city: addressData.city,
        zipCode: addressData.zipCode,
        streetAddress: addressData.streetAddress,
        phoneNumber: addressData.phoneNumber,
      },
      products: products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        productPrice: product.productPrice,
        totalPrice: product.price,
        status: "Pending",
      })),
      couponDiscound: couponDiscound,
      payment: payment,
      totalPrice: totalProductPrice,
    });

    if (order) {
      await order.save();
      await decreaseProductQuantity(products);

      // Update wallet balance and add transaction details
      walletData.balance -= totalPrice;
      walletData.transactions.push({
        amount: totalPrice,
        transactionType: "debit", // Assuming payment is a debit transaction
        timestamp: new Date(),
      });

      await walletData.save();

      await Cart.deleteMany({ user_id: user_id });

      if (couponCode) {
        await Coupon.findOneAndUpdate(
          { couponCode: couponCode },
          { $push: { used_coupons: user_id } },
          { new: true }
        );
      }

      return res.status(200).json({
        success: true,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// load sales report
const loadSalesReport = async (req, res) => {
  try {
    const { date } = req.query;

    let query = { "products.productStatus": "Completed" };

    if (date) {
      const [startDateStr, endDateStr] = date.split(" - ");

      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      endDate.setDate(endDate.getDate() + 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    const deliveredOrders = await Order.find(query)
      .populate("user")
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.render("sales-report", {
      orders: deliveredOrders,
      title: "Sales report",
      date: date,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

// to download the pdf of the sale's report
const downloadPdf = async (req, res) => {
  try {
    const { date } = req.query;
    let query = { "products.productStatus": "Completed" };

    if (date) {
      const [startDateStr, endDateStr] = date.split(" - ");

      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      endDate.setDate(endDate.getDate() + 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    const deliveredOrders = await Order.find(query)
      .populate("user")
      .populate("products.productId")
      .sort({ createdAt: -1 });
    const doc = new PDFDocument();

    // Set the Content-Type header to display the PDF in the browser
    res.setHeader("Content-Type", "application/pdf");
    // Set Content-Disposition to suggest a filename
    res.setHeader("Content-Disposition", 'inline; filename="sale_report.pdf"');
    // Pipe the PDF content to the response stream
    doc.pipe(res);

    // Add content to the PDF (based on your sale report structure)
    doc.text("Sale Report", { fontSize: 17, underline: true }).moveDown();
    doc
      .fontSize(18)
      .text("ABC", { align: "center" })
      .text("Furnitures ", { align: "center" });

    const rowHeight = 30;

    // Calculate the vertical position for each line of text in the row
    const yPos = doc.y + rowHeight / 2;

    // Create a table header
    doc
      .fontSize(10)
      .rect(0, doc.y, 750, rowHeight)
      .text("Order ID", 0, yPos)
      .text("Date", 140, yPos)
      .text("Customer", 250, yPos)
      .text("Product Name", 310, yPos)
      .text("Quantity", 400, yPos)
      .text("Total", 450, yPos)
      .text("Status", 480, yPos)
      .text("Payment", 550, yPos);
    doc.moveDown();

    // Loop through fetched orders and products
    for (const order of deliveredOrders) {
      for (let j = 0; j < order.products.length; j++) {
        const currentProduct = order.products[j].productId;

        // Set a fixed height for each row
        const rowHeight = 20;

        // Calculate the vertical position for each line of text in the row
        const yPos = doc.y + rowHeight / 2;

        // Add the sale report details to the PDF table
        doc
          .fontSize(8)
          .rect(0, doc.y, 750, rowHeight) // Set a rectangle for each row
          .stroke()
          .text(order._id.toString(), 0, yPos)
          .text(order.date, 140, yPos)
          .text(
            order.user ? order.user.username : "User not available",
            250,
            yPos
          )
          .text(
            currentProduct
              ? currentProduct.productName
              : "Product not available",
            310,
            yPos
          ) // Add product name
          .text(order.products[j].quantity.toString(), 400, yPos)
          .text(order.products[j].totalPrice.toString(), 450, yPos)
          .text("Delivered", 480, yPos)
          .text(order.payment, 550, yPos);

        // Move to the next row
        doc.moveDown();
      }
      // Add a separator between rows
    }

    // End the document
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// to download the excel of the sale's report
const downloadExcel = async (req, res) => {
  try {
    const { date } = req.query;
    let query = { "products.productStatus": "Completed" };

    if (date) {
      const [startDateStr, endDateStr] = date.split(" - ");

      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      endDate.setDate(endDate.getDate() + 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    const deliveredOrders = await Order.find(query)
      .populate("user")
      .populate("products.productId")
      .sort({ createdAt: -1 });
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sale Report");

    // Add headers to the worksheet with Product Name
    worksheet.addRow([
      "Order ID",
      "Date",
      "Customer",
      "Product Name",
      "Quantity",
      "Total",
      "Status",
      "Payment Method",
    ]);

    // Add data to the worksheet
    orders.forEach((order) => {
      order.products.forEach((product) => {
        worksheet.addRow([
          order._id,
          order.date,
          order.user ? order.user.userName : "User not available",
          product.product
            ? product.product.productName
            : "Product not available",
          product.quantity,
          order.totalPrice,
          "Delivered",
          order.payment,
        ]);
      });
    });

    // Set headers for the response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sale_report.xlsx"
    );

    // Write the Excel workbook to the response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error) {
    console.error("Error downloading Excel:", error);
    res.status(500).send("Internal Server Error");
  }
};

async function fetchSaleReportData(selectedDate) {
  try {
    // Construct the query for fetching orders
    const query = {
      "products.productStatus": "Delivered",
    };

    // If a selected date is provided, add it to the query
    if (selectedDate) {
      query.date = new Date(selectedDate);
    }

    // Fetch the orders from the MongoDB database
    const orders = await Order.find(query)
      .populate("user")
      .populate("products.productId")
      .exec();

    return orders;
  } catch (error) {
    console.error("Error fetching sale report data:", error);
    throw error;
  }
}

// for returning the order from the user profile
const returnOrder = async (req, res) => {
  try {
    console.log("hello");
    const { productId, orderId } = req.params;
    const productStatus = "Returned";

    console.log(productId, orderId);
    const updatedOrder = await Order.updateOne(
      {
        "products.productId": new ObjectId(productId),
      },
      {
        $set: { "products.$.productStatus": productStatus },
      },
      { new: true }
    );

    console.log(updatedOrder);

    const order = await Order.findById(orderId);

    const { user, product } = order;
    const { _id: userId } = user;

    if (updatedOrder) {
      const productStatuses = order.products.map(
        (product) => product.productStatus
      );
      const areAllProductStatusesEqual = productStatuses.every(
        (status) => status === productStatus
      );

      if (areAllProductStatusesEqual) {
        await Order.updateOne(
          { _id: orderId },
          { $set: { status: productStatus } }
        );
      }

      const canceledProduct = order.products.find(
        (product) => product.productId.toString() === productId
      );
      if (canceledProduct) {
        // calculating the product quantity to add into the product stock
        const productQuantity = canceledProduct.quantity;

        // calculating the refund amound
        const refundAmount = canceledProduct.totalPrice - order.couponDiscound;

        // update the user wallet
        const updatedWallet = await Wallet.findOneAndUpdate(
          { userId: userId },
          {
            $inc: { balance: refundAmount },
            $push: {
              transactions: {
                amount: refundAmount,
                transactionType: "credit",
                timestamp: new Date(),
              },
            },
          },
          { new: true }
        );

        console.log(refundAmount);
        // add the product quantity to the product stock
        const updateStock = await Product.findByIdAndUpdate(productId, {
          $inc: { quantity: productQuantity },
        });
      }

      res.redirect("/user-orders");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// for downloading the order invoice
const downloadInvoice = async (req, res) => {
  try {
    try {
      const { orderId, productId } = req.query;
      const userId = req.session.user_id;

      // Fetch the order details with product and address information
      const order = await Order.findById(orderId);

      const product = await Product.findById(productId);

      const selectedProduct = order.products.find(
        (product) => product.productId.toString() === productId
      );

      console.log(selectedProduct);
      // Fetch user details
      const user = await User.findById(userId);

      // Extract relevant information from the order
      const invoiceData = {
        id: orderId,
        total: order.totalPrice,
        date: order.date,
        paymentMethod: order.payment,
        orderStatus: order.status,
        name: order.address.fullName,
        number: order.address.phoneNumber,
        house: order.address.streetAddress,
        pincode: order.address.pinCode,
        town: order.address.townCity,
        state: order.address.state,
        products: [
          {
            quantity: selectedProduct.quantity,
            description: product.productName,
            price: selectedProduct.price,
            total: selectedProduct.price * selectedProduct.quantity,
            "tax-rate": 0,
          },
        ],
        sender: {
          company: "ABC",
          address: "123 Main Street",
          city: "Anytown",
          country: "India",
        },
        client: {
          company: "Customer Address",
          zip: order.address.zipCode,
          city: order.address.townCity,
          address: order.address.streetAddress,
        },
        information: {
          number: "order" + order.id,
          date: order.date,
        },
        "bottom-notice": "Happy shopping and visit ABC furnitures again",
      };

      // Generate PDF using easyinvoice
      const pdfResult = await easyinvoice.createInvoice({
        ...invoiceData,
        bottomNotice: "Happy shopping and visit flock again",
      });
      const pdfBuffer = Buffer.from(pdfResult.pdf, "base64");

      // Set HTTP headers for the PDF response
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="invoice.pdf"'
      );
      res.setHeader("Content-Type", "application/pdf");

      // Create a readable stream from the PDF buffer and pipe it to the response
      const pdfStream = new Readable();
      pdfStream.push(pdfBuffer);
      pdfStream.push(null);

      pdfStream.pipe(res);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// show order successful page
const orderSucessfull = async (req, res) => {
  res.render("orderComplete");
};

// exporting modules
module.exports = {
  cashOnDeliveryOrder,
  profileOrder,
  getOrderDetails,
  cancelOrder,
  orderManagement,
  getAdminOrderDetails,
  postAdmindOrderDetails,
  adminSingleOrderCancel,
  orderSucessfull,
  razorPayOrder,
  orderSucessfullRazorPay,
  walletOrder,
  loadSalesReport,
  downloadPdf,
  downloadExcel,
  returnOrder,
  downloadInvoice,
};
