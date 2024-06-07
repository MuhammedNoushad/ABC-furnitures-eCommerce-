# E-Commerce Website

This is a full-featured e-commerce platform built with Node.js, Express.js, EJS, and MongoDB. It provides a seamless online shopping experience for customers, allowing them to browse and purchase products, apply coupons, and choose their preferred payment method. The platform includes an admin panel for managing products, orders, and site configurations.

## Features

- **Product Catalog**: Browse through a wide range of products organized into different categories.
- **Product Details**: View comprehensive information about each product, including descriptions, images, and pricing.
- **Shopping Cart**: Add products to the cart and manage the items before checkout.
- **Checkout Process**: Securely complete the purchase by providing shipping and payment details.
- **Payment Integration**:
  - **Razorpay**: Seamless integration with Razorpay payment gateway for online transactions.
  - **Cash on Delivery**: Option to pay upon receiving the order.
- **Coupon System**: Apply coupons and promotional codes to get discounts on purchases.
- **Referral System**: Earn rewards by referring the platform to friends and family.
- **User Authentication**: Create accounts, log in securely, and manage order history and preferences.
- **Banners**: Display promotional banners showcasing special offers and deals.
- **Category Offers**: Highlight special offers and discounts for specific product categories.
- **Product Offers**: Showcase individual product offers and discounts.
- **Admin Panel**:
  - Manage products (add, edit, delete)
  - Manage orders (view, update status)
  - Manage site configurations (banners, offers, coupons)

## Screenshots

### Home Page
![Home Page](https://imgur.com/divGMdt.png)
*The main landing page showcasing product categories and promotional banners.*

### Product Catalog
![Product Catalog](https://imgur.com/rTW8aeV.png)
*Browse through a wide range of products organized into different categories.*

### Product Details
![Product Details](https://imgur.com/JcvF3Zc.png)
*Comprehensive product information including descriptions, images, and pricing.*

### Shopping Cart
![Shopping Cart](https://imgur.com/onf2kZI.png)
*Manage items in your cart before proceeding to checkout.*

### Checkout Process
![Checkout Process](https://imgur.com/1xk0BNU.png)
*Securely complete your purchase by providing shipping and payment details.*

### Admin Panel - Product Management
![Admin Product Management](https://imgur.com/nCqEa41.png)
*Admin interface for managing products (add, edit, delete).*

### Admin Panel - Order Management
![Admin Order Management](https://imgur.com/L8utJZ2.png)
*Track and manage customer orders.*

## Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript Templating)
- MongoDB
- Razorpay (Payment Gateway Integration)

## Getting Started

1. Clone the repository:
    ```sh
    git clone https://github.com/MuhammedNoushad/ecommerce-website.git
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Set up the environment variables (e.g., MongoDB connection string, Razorpay API keys):
    ```sh
    # .env file
    MONGODB_URI=your_mongodb_connection_string
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    ```
4. Start the development server:
    ```sh
    npm start
    ```
5. Open the application in your browser:
    ```sh
    http://localhost:3000
    ```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

