function validateAndSubmit() {
  if (validateForm()) {
    createCoupon();
    return false;
  } else {
    return false;
  }
}

function validateForm() {
  clearErrorMessages();

  // Get form inputs
  const name = document.getElementById("couponName").value.trim();
  const description = document.getElementById("couponDescription").value.trim();
  const offerPrice = document.getElementById("offerPrice").value.trim();
  const minimumAmount = document.getElementById("minimumAmount").value.trim();
  const expiryDate = document.getElementById("expiryDate").value.trim();

  let isValid = true;
  // Validation for Coupon Name
  if (!name) {
    displayErrorMessage("nameError", "Please enter a coupon name.");
    isValid = false;
  }

  // Validation for Description
  if (!description) {
    displayErrorMessage("descriptionError", "Please enter a description.");
    isValid = false;
  }

  // Validation for Offer Price
  if (!/^\d+(\.\d{1,2})?$/.test(offerPrice) || parseFloat(offerPrice) < 0) {
    displayErrorMessage(
      "offerPriceError",
      "Please enter a valid non-negative offer price."
    );
    isValid = false;
  }

  // Validation for Minimum Amount
  if (
    !/^\d+(\.\d{1,2})?$/.test(minimumAmount) ||
    parseFloat(minimumAmount) < 0
  ) {
    displayErrorMessage(
      "minimumAmountError",
      "Please enter a valid non-negative minimum amount."
    );
    isValid = false;
  }

  // Validation for Expiry Date
  if (!expiryDate) {
    displayErrorMessage("expiryDateError", "Please select an expiry date.");
    isValid = false;
  }

  // Hide error messages after 5 seconds
  setTimeout(clearErrorMessages, 5000);

  return isValid; // Form is valid
}

function displayErrorMessage(id, message) {
  const errorParagraph = document.getElementById(id);
  errorParagraph.innerText = message;
}

function clearErrorMessages() {
  const errorParagraphs = document.querySelectorAll(".text-danger");
  errorParagraphs.forEach((errorParagraph) => {
    errorParagraph.innerText = "";
  });
}

// send the fetch to create new coupon 
function createCoupon() {
  const couponNameInput = document.getElementById("couponName");

  const formData = {
    couponCode: couponNameInput.value.trim(),
    description: document.getElementById("couponDescription").value.trim(),
    discountAmount: document.getElementById("offerPrice").value.trim(),
    minimumPurchase: document.getElementById("minimumAmount").value.trim(),
    expirationDate: document.getElementById("expiryDate").value.trim(),
  };

  const endpoint = "/admin/coupons/add-new-coupon";
  fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        // Handle non-success status codes (e.g., 400, 500)
        console.log("Error response:", response.status);
        return response.json().then(data => Promise.reject(data));
      }

      return response.json();
    })
    .then((data) => {
      if (!data.success) {
        const errorMessage = data.message || "Failed to add/update coupon";
        throw new Error(errorMessage);
      }

      toastr.success(data.message, "Coupon management");
      resetForm();
    })
    .catch((error) => {
      console.error("Fetch Error:", error);
      if (error.message === "Coupon code already existing") {
        toastr.error("Coupon code is already in use by another coupon", "Coupon management");
      } else {
        // Log the entire response for further inspection
        console.error("Server Response:", error);
        toastr.error("Failed to add/update coupon", "Coupon management");
      }
    });
}







function resetForm() {
  // Clear input fields
  document.getElementById("couponName").value = "";
  document.getElementById("couponDescription").value = "";
  document.getElementById("offerPrice").value = "";
  document.getElementById("minimumAmount").value = "";
  document.getElementById("expiryDate").value = "";
}

function editedCouponSubmit(couponId) {
  if (validateFormUpdate()) {
    updateCoupon(couponId);
    return false;
  } else {
    return false;
  }
}

// call the createCoupon function when user clicked Submit
function createCoupon() {
  const formData = {
    couponCode: document.getElementById("couponName").value.trim(),
    description: document.getElementById("couponDescription").value.trim(),
    discountAmount: document.getElementById("offerPrice").value.trim(),
    minimumPurchase: document.getElementById("minimumAmount").value.trim(),
    expirationDate: document.getElementById("expiryDate").value.trim(),
  };
  const endpoint = "/admin/coupons/add-new-coupon";

  fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        toastr.success("Coupon added successfully.", "Coupon management");
        resetForm();
      }
    })
    .catch((error) => {
      // Handle errors
      console.error("Error:", error);
    });
}

// call the createCoupon function when user clicked Submit
function updateCoupon(couponId) {
  const formData = {
    couponId,
    couponCode: document.getElementById("couponName").value.trim(),
    description: document.getElementById("couponDescription").value.trim(),
    discountAmount: document.getElementById("offerPrice").value.trim(),
    minimumPurchase: document.getElementById("minimumAmount").value.trim(),
    expirationDate: document.getElementById("expiryDate").value.trim(),
  };
  const endpoint = `/admin/coupons/edit-coupon`;

  fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        toastr.error("Coupon already exists");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        toastr.success(data.message, "Coupon management");
        resetForm();
      } else {
        toastr.error(data.message, "Coupon management");
      }
    })
    .catch((error) => {
      toastr.error(error.message, "Coupon management");
      // Handle other errors if needed
      console.error("Error:", error);
    });
}

function validateFormUpdate() {
  clearErrorMessages();

  // Get form inputs
  const name = document.getElementById("couponName").value.trim();
  const description = document.getElementById("couponDescription").value.trim();
  const offerPrice = document.getElementById("offerPrice").value.trim();
  const minimumAmount = document.getElementById("minimumAmount").value.trim();
  const expiryDate = document.getElementById("expiryDate").value.trim();

  let isValid = true;
  // Validation for Coupon Name
  if (!name) {
    displayErrorMessage("nameError", "Please enter a coupon name.");
    isValid = false;
  }

  // Validation for Description
  if (!description) {
    displayErrorMessage("descriptionError", "Please enter a description.");
    isValid = false;
  }

  // Validation for Offer Price
  if (!/^\d+(\.\d{1,2})?$/.test(offerPrice) || parseFloat(offerPrice) < 0) {
    displayErrorMessage(
      "offerPriceError",
      "Please enter a valid non-negative offer price."
    );
    isValid = false;
  }

  // Validation for Minimum Amount
  if (
    !/^\d+(\.\d{1,2})?$/.test(minimumAmount) ||
    parseFloat(minimumAmount) < 0
  ) {
    displayErrorMessage(
      "minimumAmountError",
      "Please enter a valid non-negative minimum amount."
    );
    isValid = false;
  }

  // Hide error messages after 5 seconds
  setTimeout(clearErrorMessages, 5000);

  return isValid; // Form is valid
}

function confirmCouponDelete(couponId) {
  const confirmationModal = new bootstrap.Modal(
    document.getElementById("confirmationModal")
  );
  const productDeleteButton = document.getElementById("productDeleteButton");

  productDeleteButton.setAttribute("data-coupon-id", couponId);

  confirmationModal.show();

  productDeleteButton.addEventListener("click", function () {
    const confirmedCouponId =
      productDeleteButton.getAttribute("data-coupon-id");

    deleteCoupon(`/admin/coupons/delete-coupon/${couponId}`, couponId);

    confirmationModal.hide();
  });

  const cancelButton = document.querySelector(
    "#confirmationModal .btn-secondary"
  );
  cancelButton.addEventListener("click", function () {
    confirmationModal.hide();
  });

  function deleteCoupon(apiEndpoint, couponId) {
    fetch(apiEndpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            `Failed to delete coupon. Status code: ${response.status}`
          );
        }
      })
      .then((data) => {
        if (data.success) {
          toastr.success("Coupon deleted successfully", "Coupon deleted");
          const deletedRow = document.getElementById(couponId);
          if (deletedRow) {
            deletedRow.remove();
          } else {
            console.warn("Row not found in the table");
          }
        } else {
          console.error(
            "Failed to delete coupon. Server returned success: false"
          );
          toastr.error("Failed to delete coupon", "Error");
        }
      })
      .catch((error) => {
        console.error("Error during delete operation:", error);
        toastr.error("Error during delete operation", "Error");
      });
  }
}
