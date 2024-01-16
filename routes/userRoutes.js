const express = require("express");
const nocache = require("nocache");
const session = require("express-session");
const user_route = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");
const addressController = require("../controllers/addressController");
const orderController = require("../controllers/orderController");
const couponController = require("../controllers/couponController");
const walletController = require("../controllers/walletContoller");
const referralController = require("../controllers/referralController");
const wishlistController = require("../controllers/wishlistController")

const auth = require("../middlewares/userAuthentication");
const wishlistModel = require("../model/wishlistModel");


user_route.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

user_route.use(nocache());

// register user
user_route.get("/user-registration", auth.userNotLoggedIn,userController.loadSignup);
user_route.post("/user-registration", auth.userNotLoggedIn,userController.signupUser);

// verify user
user_route.get("/verify-user",auth.userNotLoggedIn,userController.verifyUserEmail);
user_route.post("/verify-user", auth.userNotLoggedIn, userController.checkOtp);

// resend Otp
user_route.get("/resend-otp", auth.userNotLoggedIn, userController.resendOtp);

// user login
user_route.get("/", auth.userNotLoggedIn,auth.checkBlockedStatus, userController.loadHome);
user_route.get("/login", auth.userNotLoggedIn, userController.loadLogin);
user_route.post("/login", auth.userNotLoggedIn, userController.verifyUser);

// after login user
user_route.get("/user-home", auth.userLoggedIn,auth.checkBlockedStatus, userController.loadHomeUser);

// forgot password 
user_route.get("/forgot-password",auth.userNotLoggedIn,userController.forgotPassword)
user_route.post("/forgot-password",auth.userNotLoggedIn,userController.userAuthentication)
user_route.get("/change-password/verify-email",auth.userNotLoggedIn,userController.otpCheckforPassword)
user_route.post("/verify-user/change-password",auth.userNotLoggedIn,userController.verifyUserForPasswordChange)
user_route.get("/update-changed-password",auth.userNotLoggedIn,userController.loadUpdateNewPassword)
user_route.post("/update-changed-password",auth.userNotLoggedIn,userController.updateNewPassword)

// user product 
user_route.get("/products-shop", auth.checkBlockedStatus,productController.loadProducts);
user_route.put("/add-to-cart-icon", auth.checkBlockedStatus,cartController.addOneItemToTheCart);
user_route.get("/products/product-details",auth.checkBlockedStatus,productController.loadProductDetails);
user_route.post("/products/product-details",auth.checkBlockedStatus, cartController.addProductToCart);

// user cart
user_route.get("/add-to-cart",auth.checkBlockedStatus, cartController.loadAddToCart);
user_route.delete("/products/cart-delete",auth.checkBlockedStatus, cartController.deleteCart);
user_route.put("/cart/incrementing-product",auth.checkBlockedStatus,cartController.incrementingProductCount);
user_route.put("/cart/decrementing-product",auth.checkBlockedStatus,cartController.decrementingProductCount);

// checkout product
user_route.get("/checkout",auth.userLoggedIn,auth.checkBlockedStatus, productController.checkoutProduct);
user_route.post("/checkout/cash-on-delivery",auth.userLoggedIn,auth.checkBlockedStatus, orderController.cashOnDeliveryOrder);
user_route.post("/checkout/razor-pay",auth.userLoggedIn,auth.checkBlockedStatus, orderController.razorPayOrder);
user_route.post("/checkout/razor-pay/completed",auth.userLoggedIn,auth.checkBlockedStatus,orderController.orderSucessfullRazorPay)
user_route.post("/checkout/wallet",auth.userLoggedIn,auth.checkBlockedStatus, orderController.walletOrder);

// user address 
user_route.get("/add-new-address",auth.userLoggedIn,auth.checkBlockedStatus,addressController.addNewAddress)
user_route.post("/add-new-address",auth.userLoggedIn,auth.checkBlockedStatus,addressController.postNewAddress)
user_route.get("/edit-address",auth.userLoggedIn,auth.checkBlockedStatus,addressController.getEditAddress)
user_route.post("/edit-address",auth.userLoggedIn,auth.checkBlockedStatus,addressController.postEditAddress)
user_route.get("/delete-address",auth.userLoggedIn,auth.checkBlockedStatus,addressController.deleteAddress)

// user profile 
user_route.get("/user-profile",auth.userLoggedIn,auth.checkBlockedStatus,userController.loadUserProfile);
user_route.get('/edit-user-name',auth.userLoggedIn,auth.checkBlockedStatus,userController.editUserName)
user_route.post('/update-username',auth.userLoggedIn,auth.checkBlockedStatus,userController.updateUserName)
user_route.get('/edit-user-mobile',auth.userLoggedIn,auth.checkBlockedStatus,userController.editUserMobile)
user_route.post('/update-mobile',auth.userLoggedIn,auth.checkBlockedStatus,userController.updateMobile)
user_route.get('/edit-password',auth.userLoggedIn,auth.checkBlockedStatus,userController.editUserPassword)
user_route.post('/update-password',auth.userLoggedIn,auth.checkBlockedStatus,userController.updatePassword)
user_route.get("/user-address",auth.userLoggedIn,auth.checkBlockedStatus,addressController.profileAddress)
user_route.delete("/profile/delete-address",auth.userLoggedIn,auth.checkBlockedStatus,addressController.deleteAddressFromProfile)
user_route.get("/user-orders",auth.userLoggedIn,auth.checkBlockedStatus,orderController.profileOrder)
user_route.get('/order-details/:productId/:orderId',auth.userLoggedIn,auth.checkBlockedStatus,orderController.getOrderDetails)
user_route.get('/order-cancel/:orderId/:productId',auth.userLoggedIn,auth.checkBlockedStatus,orderController.cancelOrder)
user_route.get('/order-return/:orderId/:productId',auth.userLoggedIn,auth.checkBlockedStatus,orderController.returnOrder)
user_route.get("/user-wallet",auth.userLoggedIn,auth.checkBlockedStatus,walletController.getUserWallet)

// order sucessfull & failure pages
user_route.get("/success-page",auth.userLoggedIn,auth.checkBlockedStatus,orderController.orderSucessfull)
user_route.get("/failure-page",auth.userLoggedIn,auth.checkBlockedStatus,orderController.orderFailure)

// applying coupon code 
user_route.post("/coupon/validate-coupon",auth.userLoggedIn,auth.checkBlockedStatus,couponController.validateCoupon)
user_route.post("/coupon/remove-coupon",auth.userLoggedIn,auth.checkBlockedStatus,couponController.removeCoupon)

// referrals 
user_route.get("/referrals",auth.userLoggedIn,auth.checkBlockedStatus,referralController.loadReferralPage)
user_route.post("/referral-check",referralController.checkReferralCode)

// user wishlist 
user_route.get("/user-wishlist",wishlistController.loadWishlist)
user_route.put("/add-to-wishlist-icon", wishlistController.addToWishlist);
user_route.delete("/products/wishlist-delete", wishlistController.deleteWishlist);

// order invoice  
user_route.get("/download-invoice",auth.userLoggedIn,auth.checkBlockedStatus,orderController.downloadInvoice) 

// user logout
user_route.get("/logout", auth.userLoggedIn,auth.checkBlockedStatus, userController.logoutUser);



// exporting user route 
module.exports = user_route;
