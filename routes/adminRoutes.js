const express = require("express");
const admin_route = express();
const session = require("express-session");
const multer = require("multer");
const adminController = require("../controllers/adminController");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const auth = require("../middlewares/adminAuthenticaion");
const orderController = require("../controllers/orderController");
const couponController = require("../controllers/couponController");
const bannerController = require("../controllers/bannerController")



admin_route.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/assets/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }));

admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/adminViews");

// admin dashboard
admin_route.get("/",auth.adminLoggedIn, adminController.loadDashboard);
admin_route.get("/sales-data",auth.adminLoggedIn, adminController.saleChart);


// user management routes
admin_route.get("/user-management",auth.adminLoggedIn,adminController.loadUserManagement)
admin_route.put("/users/:userId/block",auth.adminLoggedIn, adminController.blockUser);

// products management routes
admin_route.get("/products/product-management",auth.adminLoggedIn, productController.showProducts);
admin_route.get("/products/add-new-product",auth.adminLoggedIn, productController.addNewProduct);
admin_route.post(
  "/products/post-new-product",auth.adminLoggedIn,
  upload.array("images",10),
  productController.postNewProduct
  );
admin_route.delete("/products/delete-product",auth.adminLoggedIn, productController.deleteProduct);
admin_route.get("/products/edit-product",auth.adminLoggedIn, productController.editProduct);
admin_route.post("/products/post-edit-product",auth.adminLoggedIn,upload.array("newImages",10), productController.postEditProduct);
admin_route.delete("/delete-single-image",auth.adminLoggedIn, productController.deleteSingleImage);

// category management routes
admin_route.get("/products/category-management",auth.adminLoggedIn,categoryController.loadCategory)
admin_route.post("/category/add-new-category",auth.adminLoggedIn,categoryController.addNewcategory);
admin_route.get("/category/edit-category",auth.adminLoggedIn,categoryController.editCategory);
admin_route.delete("/category/delete-category",auth.adminLoggedIn,categoryController.deleteCategory);
admin_route.post("/category/add-updated-category",auth.adminLoggedIn,categoryController.updateCategory);

// order management 
admin_route.get("/products/products-orders",auth.adminLoggedIn,orderController.orderManagement)
admin_route.get("/order-details/:orderId",auth.adminLoggedIn,orderController.getAdminOrderDetails)
admin_route.post("/order-details/:orderId",auth.adminLoggedIn,orderController.postAdmindOrderDetails)
admin_route.post('/order-cancel/:orderId/:productId',auth.adminLoggedIn,orderController.adminSingleOrderCancel)

// coupon management 
admin_route.get("/coupons",auth.adminLoggedIn,couponController.showCoupons)
admin_route.get("/coupons/add-new-coupon",auth.adminLoggedIn,couponController.addCoupon)
admin_route.post("/coupons/add-new-coupon",auth.adminLoggedIn,couponController.postAddedCoupons)
admin_route.get("/coupons/edit-coupon/:couponId",auth.adminLoggedIn,couponController.editCoupon)
admin_route.post("/coupons/edit-coupon",auth.adminLoggedIn,couponController.postEditedCoupon)
admin_route.delete("/coupons/delete-coupon/:couponId",auth.adminLoggedIn,couponController.deleteCoupon)

//product offer management 
admin_route.get("/products/product-offers",auth.adminLoggedIn,productController.loadProductOffers)
admin_route.put("/products/add-product-offer",auth.adminLoggedIn,productController.addProductOffer)
admin_route.put("/products/remove-product-offer",auth.adminLoggedIn,productController.removeProductOffer)

// category offer management 
admin_route.get("/products/category-offers",auth.adminLoggedIn,categoryController.loadCategoryOffers)
admin_route.put("/products/add-category-offer",auth.adminLoggedIn,productController.addCategoryOffer)
admin_route.put("/products/remove-category-offer",auth.adminLoggedIn,productController.removeCategoryOffer)

// banner management 
admin_route.get("/products/banner-management",auth.adminLoggedIn,bannerController.loadBannerManagement)
admin_route.get("/products/add-new-banner",auth.adminLoggedIn,bannerController.addNewBanner)
admin_route.post("/products/post-new-banner",auth.adminLoggedIn,upload.array("images",10),bannerController.postAddedBanner)
admin_route.delete("/products/delete-banner",auth.adminLoggedIn, bannerController.deleteBanner);
admin_route.get("/products/edit-banner",auth.adminLoggedIn, bannerController.loadEditBanner);
admin_route.post("/products/post-edit-banner",auth.adminLoggedIn,upload.array("newImages",10), bannerController.postEditBanner);

// sales report 
admin_route.get("/orders/sales-report",auth.adminLoggedIn,orderController.loadSalesReport)
admin_route.get("/download-pdf",auth.adminLoggedIn,orderController.downloadPdf)
admin_route.get("/download-excel",auth.adminLoggedIn,orderController.downloadExcel)


// logout admin
admin_route.get("/logout",auth.adminLoggedIn,adminController.logoutAdmin);

// load error page is no route was found 
admin_route.get("*",adminController.loadErrorPage)

// exporting admin route 
module.exports = admin_route;
