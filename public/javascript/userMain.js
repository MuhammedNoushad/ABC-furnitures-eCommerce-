const { default: fundAccount } = require("razorpay/dist/types/fundAccount");

// add to cart from icon
function addToCart(productId) {
  $.ajax({
    url: `/add-to-cart-icon?id=${productId}`,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify({ is_blocked: true }),
    success: function (response) {
      updateCartNumber(response.count);
    },
    error: function (xhr, status, error) {
      console.error("Failed to block user", error);
    },
  });

  // Show SweetAlert at the center
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Product added to cart!",
    showConfirmButton: false,
    timer: 1500,
  });
}

// function to add item to the wishlist 
function addToWishlist(productId) {
  $.ajax({
    url: `/add-to-wishlist-icon?id=${productId}`,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify({ is_blocked: true }),
    success: function (response) {
      const wishlistIcon = document.getElementById(
        "wishlist-icon-" + productId
      );

      // Toggle color between red and default (c4c4c4)
      wishlistIcon.style.color =
        wishlistIcon.style.color === "red" ? "#c4c4c4" : "red";

      // Toggle onclick function between addToWishlist and removeFromWishlist
      wishlistIcon.parentElement.onclick =
        wishlistIcon.style.color === "red"
          ? function () {
              removeFromWishlist(productId);
            }
          : function () {
              addToWishlist(productId);
            };

      // Show SweetAlert at the center
      toastr.success("Item added to wishlist successfully.");
    },
    error: function (xhr, status, error) {
      console.error("Failed to add to wishlist", error);
    },
  });
}

// remove items from wishlist
function removeFromWishlist(productId) {
  fetch("/products/wishlist-delete?id=" + productId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        const wishlistIcon = document.getElementById(
          "wishlist-icon-" + productId
        );
        wishlistIcon.className = "fa-regular fa-heart";
        wishlistIcon.style.color = "#c4c4c4";

        // Assign the addToWishlist function directly to onclick
        wishlistIcon.parentElement.onclick = function () {
          addToWishlist(productId);
        };

        toastr.success("Item removed from wishlist.");
      } else {
        console.error("Error deleting product on the server");
      }
    })
    .catch((error) => {
      console.error("Error deleting product", error);
    });
}

// Function to update the cart number dynamically
function updateCartNumber(newCount) {
  const cartNumberElement = document.getElementById("cart-number");
  if (cartNumberElement) {
    cartNumberElement.innerText = `(${newCount})`;
  }
}

// function to delete cart items
function deleteCartItems(productId) {
  const rowToDelete = document.getElementById(productId);
  if (rowToDelete) {
    const siblingRow = rowToDelete.nextElementSibling; 
    if (siblingRow) {
      siblingRow.remove();
    }
    rowToDelete.remove();
  }
}


// Function to delete the row from the UI
function deleteRow(productId) {
  const rowToDelete = document.getElementById(productId);
  if (rowToDelete) {
    rowToDelete.remove();
  }
}

// Function to confirm and delete
function confirmDelete(productId) {
  const modal = document.getElementById("deleteModal");
  const confirmBtn = document.getElementById("confirmBtn");

  modal.style.display = "block";

  confirmBtn.onclick = function () {
    // Send AJAX request using fetch
    fetch("/products/cart-delete?id=" + productId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          console.log('hy');
          deleteCartItems(productId);
          updateSubtotal(data);
          updateCartNumber(data);

          // Check if the cart is empty and update the view
          if (data.cartCount === 0) {
            displayEmptyCartImage();
          }
        } else {
          console.error("Error deleting product on the server");
        }

        modal.style.display = "none";
      })
      .catch((error) => {
        console.error("Error deleting product", error);
        modal.style.display = "none";
      });
  };

  document.getElementById("cancelBtn").onclick = function () {
    modal.style.display = "none";
  };
}

// remove the item from the wishlist
function confirmDeleteWishlist(productId) {
  const modal = document.getElementById("deleteModal");
  const confirmBtn = document.getElementById("confirmBtn");

  modal.style.display = "block";

  confirmBtn.onclick = function () {
    // Send AJAX request using fetch
    fetch("/products/wishlist-delete?id=" + productId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          deleteRow(productId);

          // Check if the cart is empty and update the view
          if (data.wishlistData === 0) {
            displayEmptyCartImage();
          }
        } else {
          console.error("Error deleting product on the server");
        }

        modal.style.display = "none";
      })
      .catch((error) => {
        console.error("Error deleting product", error);
        modal.style.display = "none";
      });
  };

  document.getElementById("cancelBtn").onclick = function () {
    modal.style.display = "none";
  };
}

// to display the empty placeholder for cart
function displayEmptyCartImage() {
  const emptyCartImage = document.getElementById("emptyCartImage");
  const cartTable = document.getElementById("cartTable");

  // Hide the cart table and display the empty cart image
  cartTable.style.display = "none";
  emptyCartImage.style.display = "flex";
}

// updating the cart
function updateCartNumber(data) {
  const cart = document.getElementById("cart-number");
  cart.innerText = `(${data.cartCount})`;
}

// cancel the order from user profile
function confirmOrderDelete(orderId, productId) {
  const modal = document.getElementById("deleteModal");
  const confirmBtn = document.getElementById("confirmBtn");

  modal.style.display = "block";

  confirmBtn.onclick = function () {
    window.location.href = `/order-cancel/${orderId}/${productId} `;
    modal.style.display = "none";
  };

  document.getElementById("cancelBtn").onclick = function () {
    modal.style.display = "none";
  };
}

// return the order from user profile
function initiateReturn(orderId, productId) {
  const modal = document.getElementById("deleteModal");
  const confirmBtn = document.getElementById("confirmBtn");

  modal.style.display = "block";

  confirmBtn.onclick = function () {
    window.location.href = `/order-return/${orderId}/${productId}`;
    modal.style.display = "none";
  };
  document.getElementById("cancelBtn").onclick = function () {
    modal.style.display = "none";
  };
}

// Increment product quantity in the cart
function incrementProductQuantity(productId) {
  // Send an AJAX request to increment the quantity
  fetch(`/cart/incrementing-product?id=${productId}`, {
    method: "PUT",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        updateQuantity(productId, data.quantity);

        updateSubtotal(data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
      }
    })
    .catch((error) => {
      console.error("Error incrementing quantity:", error);
    });
}

// Decrement product quantity in the cart
function decrementProductQuantity(productId) {
  // Send an AJAX request to decrement the quantity

  const quantityInput = document.querySelector(`#qty-${productId}`);
  const currentQuantity = parseInt(quantityInput.value, 10);

  if (currentQuantity > 1) {
    fetch(`/cart/decrementing-product?id=${productId}`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the quantity on the page
        updateQuantity(productId, data.quantity);

        // Update the subtotal
        updateSubtotal(data);
      })
      .catch((error) => {
        console.error("Error decrementing quantity:", error);
      });
  }
}

// Update the quantity on the page
function updateQuantity(productId, newQuantity) {
  // Update the quantity input field on the page
  const quantityInput = document.querySelector(`#qty-${productId}`);
  if (quantityInput) {
    quantityInput.value = newQuantity;
  }
}

// Update the subtotal on the page
function updateSubtotal(data) {
  if (data && data.success) {
    let newSubTotal = data.subTotal;
    let subtotalElement = document.getElementById("subtotal");
    let totalElement = document.getElementById("total");

    subtotalElement.innerText = `₹${newSubTotal.toLocaleString()}`;
    totalElement.innerText = `₹${newSubTotal.toLocaleString()}`;
  } else {
    console.error(`Error updating subtotal: ${data.message}`);
  }
}

// checkout products
function checkout(addressLength, cartLength) {
  const hasAddress = addressLength > 0;
  const hasCart = cartLength > 0;

  if (!hasCart) {
    invalidCart();
  } else {
    if (!hasAddress) {
      invalidAddress();
    } else {
      if (document.getElementById("Razorpay").checked) {
        sendRazorpayRequest();
      } else if (document.getElementById("cod").checked) {
        sendCashOnDeliveryRequest();
      } else if (document.getElementById("wallet").checked) {
        sendWalletRequest();
      }
    }
  }

  function sendWalletRequest() {
    const formData = new FormData(document.getElementById("orderFormData"));
    const couponCodeElement = document.getElementById("couponMessage");
    const couponCode = couponCodeElement.innerText.split(" ")[0];
    const totalPrice = document.getElementById("total").innerText;
    const total = extractNumericValue(totalPrice);

    const requestData = {
      paymentMethod: "Wallet",
      formData: Object.fromEntries(formData),
      totalPrice: total,
      couponCode,
    };

    $.ajax({
      url: "/checkout/wallet",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(requestData),
      success: function (data) {
        if (data.success) {
          window.location.href = "/success-page";
        } else {
          const walletError = document.getElementById("walletError");
          walletError.innerText = data.message || "An unknown error occurred.";
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Ajax error:", errorThrown);
        const walletError = document.getElementById("walletError");
        walletError.innerText =
          jqXHR.responseJSON.message ||
          "An error occurred while processing your request.";
      },
    });
  }

  // Function to send a request for creating a Razorpay order
  function sendRazorpayRequest() {
    const couponCodeElement = document.getElementById("couponMessage");
    const couponCode = couponCodeElement.innerText.split(" ")[0];
    const formData = new FormData(document.getElementById("orderFormData"));
    const totalPrice = document.getElementById("total").innerText;
    const total = extractNumericValue(totalPrice);

    const requestData = {
      paymentMethod: "Razorpay",
      couponCode,
      formData: Object.fromEntries(formData),
      totalPrice: total,
    };

    $.ajax({
      url: "/checkout/razor-pay",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(requestData),
      success: function (res) {
        if (res.success) {
          initiateRazorpayPayment(res);
        } else {
          console.error("Error creating Razorpay order:", res.message);
          alert("Error creating Razorpay order");
        }
      },
      error: function (error) {
        console.error("Ajax error:", error);
        alert("Ajax error");
      },
    });
  }

  function initiateRazorpayPayment(orderDetails) {
    const options = {
      key: orderDetails.key_id,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      order_id: orderDetails.order_id,
      handler: function (response) {
        toastr.success("Payment completed sucessfully.", "Checkout");

        sendCompleteRequest(response, orderDetails.formData);
      },
      prefill: {
        contact: orderDetails.contact,
        name: orderDetails.name,
        email: orderDetails.email,
      },
    };

    const rzp1 = window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert("Razorpay payment failed");
    });
    rzp1.open();
  }

  function sendCashOnDeliveryRequest() {
    const formData = new FormData(document.getElementById("orderFormData"));
    const couponCodeElement = document.getElementById("couponMessage");
    const couponCode = couponCodeElement.innerText.split(" ")[0];
    const totalPrice = document.getElementById("total").innerText;
    const total = extractNumericValue(totalPrice);

    const requestData = {
      paymentMethod: "CashOnDelivery",
      formData: Object.fromEntries(formData),
      totalPrice: total,
      couponCode,
    };

    $.ajax({
      url: "/checkout/cash-on-delivery",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(requestData),
      success: function (data) {
        if (data.success) {
          window.location.href = "/success-page";
        } else {
        }
      },
      error: function (error) {
        console.error("Ajax error:", error);
      },
    });
  }

  // Function for an invalid cart
  function invalidCart() {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Cart is empty!",
    });
  }

  // Function for an invalid address
  function invalidAddress() {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Add one address!",
    });
  }
}

function extractNumericValue(str) {
  const numericString = str.replace(/[^0-9.-]+/g, "");
  return parseFloat(numericString);
}

// Function to send a POST request with formData to the completed route
function sendCompleteRequest(response, formData) {
  const couponCodeElement = document.getElementById("couponMessage");
  const couponCode = couponCodeElement.innerText.split(" ")[0];

  const totalPrice = document.getElementById("total").innerText;
  const total = extractNumericValue(totalPrice);

  const requestData = {
    paymentMethod: "Razor Pay",
    formData: formData,
    couponCode,
    totalPrice: total,
  };

  // Make an AJAX request to the server for "/checkout/razor-pay/completed"
  $.ajax({
    url: "/checkout/razor-pay/completed",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(requestData),
    success: function (data) {
      // Handle success if needed
      window.location.href = "/success-page";
    },
    error: function (error) {
      // Handle the error if needed
      console.error("Completed route request error:", error);
    },
  });
}

// serch products in the shop
function submitSearch() {
  const searchInput = document.getElementById("search").value;
  const selectedCategory = document.getElementById("category").value;

  // Using fetch to send the search query to the server
  fetch(
    `/products-shop?search=${encodeURIComponent(
      searchInput
    )}&category=${encodeURIComponent(selectedCategory)}`
  )
    .then((response) => response.text())
    .then((data) => {})
    .catch((error) => console.error("Error:", error));
}

// delete address request
function deleteAddress(addressId) {
  const deleteAddressModal = document.getElementById("deleteAddressModal");
  deleteAddressModal.style.display = "block";

  function hideModel() {
    const deleteAddressModal = document.getElementById("deleteAddressModal");
    deleteAddressModal.style.display = "none";
  }

  function deleteAddressConfirmed() {
    hideModel();
    fetch(`/profile/delete-address?id=${addressId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          window.location.href = "/user-address";
        }
      })
      .catch((error) => {
        console.error("Error deleting address", error);
      });
  }

  const deleteConfirmButton = document.getElementById("deleteConfirmButton");
  deleteConfirmButton.addEventListener("click", deleteAddressConfirmed);

  const cancelBtn = document.getElementById("cancelBtn");
  cancelBtn.addEventListener("click", hideModel);
}


