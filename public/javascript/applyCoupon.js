const { model } = require("mongoose");

function applyCoupon(couponId) {
  closeCouponModal();

  fetch("/coupon/validate-coupon", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ couponId }),
  })
    .then((response) => response.json())
    .then((data) => {
      const couponMessage = document.getElementById("couponMessage");
      const couponMessageError = document.getElementById("couponMessageError");
      const subtotalElement = document.getElementById("subtotal");
      const couponDiscountElement = document.getElementById(
        "couponDiscountAmount"
      );
      const totalElement = document.getElementById("total");
      const removeCouponLink = document.getElementById("removeCoupon");

      if (data.success) {
        couponMessageError.innerText = "";
        couponMessage.innerText = data.message;

        const subtotal = extractNumericValue(subtotalElement.innerText);
        const discountAmount = parseFloat(
          String(data.discountAmount).replace("₹", "").replace(/,/g, "")
        );

        if (!isNaN(subtotal) && !isNaN(discountAmount)) {
          const discountedSubtotal = subtotal - discountAmount;

          // Update the UI
          couponDiscountElement.innerText = `₹ ${discountAmount.toLocaleString()}`;
          couponDiscountElement.parentNode.style.display = "block";
          totalElement.innerHTML = `<span>total:</span> <span>₹ ${discountedSubtotal.toLocaleString()}</span>`;
          removeCouponLink.style.display = "block";
        } else {
          couponMessage.innerText = "";
          couponMessageError.innerText =
            "Error: Invalid subtotal or discount amount.";
        }
      } else {
        // Update UI to indicate invalid coupon
        couponMessage.innerText = "";

        couponMessageError.innerText = data.message;
        couponDiscountElement.parentNode.style.display = "none"; // Hide the coupon discount li
      }
    })
    .catch((error) => {
      console.log("Fetch Error:", error.message);
    });
}

function extractNumericValue(str) {
  const numericString = str.replace(/[^0-9.-]+/g, "");
  return parseFloat(numericString);
}

function removeCoupon() {
  const couponCodeElement = document.getElementById("couponMessage");
  const couponCode = couponCodeElement.innerText.split(" ")[0];

  fetch("/coupon/remove-coupon", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ couponCode }),
  })
    .then((response) => response.json())
    .then((data) => {
      const couponMessage = document.getElementById("couponMessage");
      const couponMessageError = document.getElementById("couponMessageError");
      const couponDiscountElement = document.getElementById(
        "couponDiscountAmount"
      );
      const totalElement = document.getElementById("total");
      const removeCouponLink = document.getElementById("removeCoupon");

      if (data.success) {
        // Update UI to indicate successful coupon removal
        const total = extractNumericValue(totalElement.innerText);
        const discountAmount = data.discountAmount;

        const discountedSubtotal = total + discountAmount;

        couponMessage.innerText = "";
        couponMessageError.innerText = "";
        couponDiscountElement.parentNode.style.display = "none";
        totalElement.innerHTML = `<span>total:</span> <span>₹ ${discountedSubtotal.toLocaleString()}</span>`;
        removeCouponLink.style.display = "none";

        document.getElementById("couponCode").value = "";
      } else {
        couponMessage.innerText = "";
        couponMessageError.innerText =
          data.message || "Error: Unable to remove coupon.";
      }
    })
    .catch((error) => {
      console.log("Fetch Error:", error.message);
    });
}

// show coupon model
function openCouponModal() {
  const couponModel = document.getElementById("couponModal");
  const overlay = document.getElementById("overlay");

  couponModel.style.display = "block";
  overlay.style.display = "block";
}

// close the coupon model
function closeCouponModal() {
  const couponModel = document.getElementById("couponModal");
  const overlay = document.getElementById("overlay");

  couponModel.style.display = "none";
  overlay.style.display = "none";
}

// function to add products to cart from the product details page
function addToCartDetails(productId) {
  // Get product ID and quantity
  const quantity = document.getElementById("qty").value;

  // Create data object to send in the request
  const data = {
    productId: productId,
    quantity: quantity,
  };

  // Send AJAX request
  fetch("/products/product-details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        // If success, redirect to the add to cart route
        window.location.href = "/add-to-cart";
      } else {
        // If not success, show an alert with the error message
        const outOfStock = document.getElementById("outOfStock");
        outOfStock.innerText = result.message;
      }
    })
    .catch((error) => {
      console.error("Error adding to cart:", error);
      // Handle other types of errors, e.g., show an error message to the user
      alert("An error occurred. Please try again later.");
    });
}
