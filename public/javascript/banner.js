function submitBannerForm(event) {
  event.preventDefault();

  // Validate the form fields
  if (!validate()) {
      // If validation fails, do not proceed with the form submission
      return;
  }

  // Collect form data manually
  const formData = new FormData(bannerForm);

  // Send AJAX request
  $.ajax({
      type: "POST",
      url: "/admin/products/post-new-banner",
      data: formData,
      success: function (data) {

          window.location.href = "/admin/products/banner-management";
      },
      error: function (xhr, status, error) {
          // Handle AJAX error
          console.error(xhr, status, error);
          alert("Error occurred while submitting the form. Please try again.");
      },
      cache: false,
      contentType: false,
      processData: false,
  });
}

function validate() {
  const bannerName = document.getElementById("bannerName");
  const category = document.getElementById("category");
  const imageFiles = document.getElementById("imageInput");
  const description = document.getElementById("description");
  const offerPercentage = document.getElementById("offerPercentage");

  // Error fields
  const bannerNameError = document.getElementById("bannerNameError");
  const categoryError = document.getElementById("categoryError");
  const imageError = document.getElementById("imageError");
  const descriptionError = document.getElementById("descriptionError");
  const offerPercentageError = document.getElementById("offerPercentageError");

  // Regex
  const bannerNameRegex = /^[a-zA-Z0-9\s]+$/;
  const descriptionRegex = /^[A-Za-z ]+$/;
  const offerPercentageRegex = /^[0-9]+$/;

  if (bannerName.value.trim() === "") {
      bannerNameError.innerHTML = "Product name is required";
      setTimeout(() => {
          bannerNameError.innerHTML = "";
      }, 5000);
      return false;
  }
  if (!bannerNameRegex.test(bannerName.value)) {
      bannerNameError.innerHTML = "Invalid product name";
      setTimeout(() => {
          bannerNameError.innerHTML = "";
      }, 5000);
      return false;
  }

  if (description.value.trim() === "") {
      descriptionError.innerHTML = "Description is required";
      setTimeout(() => {
          descriptionError.innerHTML = "";
      }, 5000);
      return false;
  }
  if (!descriptionRegex.test(description.value)) {
      descriptionError.innerHTML = "Only allow alphabets in here";
      setTimeout(() => {
          descriptionError.innerHTML = "";
      }, 5000);
      return false;
  }

  if (offerPercentage.value.trim() === "") {
      offerPercentageError.innerHTML = "Offer percentage quantity is required";
      setTimeout(() => {
          offerPercentageError.innerHTML = "";
      }, 5000);
      return false;
  }
  if (!offerPercentageRegex.test(offerPercentage.value)) {
      offerPercentageError.innerHTML = "Invalid offer percentage quantity";
      setTimeout(() => {
          offerPercentageError.innerHTML = "";
      }, 5000);
      return false;
  }

  // Check if the image input is empty
  if (imageFiles.files.length === 0) {
      imageError.innerHTML = "Image is required";
      setTimeout(() => {
          imageError.innerHTML = "";
      }, 5000);
      return false;
  }

  return true;
}

// delete banner 
function confirmDeleteBanner(bannerId) {
    const confirmationModal = new bootstrap.Modal(
      document.getElementById("confirmationModal"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
  
    confirmationModal.show();
  
    const deleteButton = document.getElementById("productDeleteButton");
  
    deleteButton.addEventListener("click", function (event) {
      event.preventDefault();
  
      $.ajax({
        url: `/admin/products/delete-banner?id=${bannerId}`,
        type: "DELETE",
        success: function (data) {
          if (data.success) {
            removeDeletedItemFromUI(bannerId);
            confirmationModal.hide();
            toastr.success(data.message, "Delete product");
          }
        },
        error: function () {
          toastr.error("Error deleting product", "Delete product");
        },
      });
    });
  
    // Function to remove the deleted item from the UI
    function removeDeletedItemFromUI(bannerId) {
      const deletedItem = document.getElementById(bannerId);
  
      if (deletedItem) {
        deletedItem.remove();
      }
    }
  }

// validate edit banner 
function validateEditBanner() {
  const bannerName = document.getElementById("bannerName");
  const imageFiles = document.getElementById("imageInput");
  const description = document.getElementById("description");
  const offerPercentage = document.getElementById("offerPercentage");

  // Error fields
  const bannerNameError = document.getElementById("bannerNameError");
  const imageError = document.getElementById("imageError");
  const descriptionError = document.getElementById("descriptionError");
  const offerPercentageError = document.getElementById("offerPercentageError");

  // Regex
  const bannerNameRegex = /^[a-zA-Z0-9\s]+$/;
  const descriptionRegex = /^[A-Za-z ]+$/;
  const offerPercentageRegex = /^[0-9]+$/;

  if (bannerName.value.trim() === "") {
      bannerNameError.innerHTML = "Product name is required";
      setTimeout(() => {
          bannerNameError.innerHTML = "";
      }, 5000);
      return false;
  }
  if (!bannerNameRegex.test(bannerName.value)) {
      bannerNameError.innerHTML = "Invalid product name";
      setTimeout(() => {
          bannerNameError.innerHTML = "";
      }, 5000);
      return false;
  }

  if (description.value.trim() === "") {
      descriptionError.innerHTML = "Description is required";
      setTimeout(() => {
          descriptionError.innerHTML = "";
      }, 5000);
      return false;
  }
  if (!descriptionRegex.test(description.value)) {
      descriptionError.innerHTML = "Only allow alphabets in here";
      setTimeout(() => {
          descriptionError.innerHTML = "";
      }, 5000);
      return false;
  }

  if (offerPercentage.value.trim() === "") {
      offerPercentageError.innerHTML = "Offer percentage quantity is required";
      setTimeout(() => {
          offerPercentageError.innerHTML = "";
      }, 5000);
      return false;
  }
  if (!offerPercentageRegex.test(offerPercentage.value)) {
      offerPercentageError.innerHTML = "Invalid offer percentage quantity";
      setTimeout(() => {
          offerPercentageError.innerHTML = "";
      }, 5000);
      return false;
  }

  // Check if the image input is empty
  if (imageFiles.files.length === 0) {
      imageError.innerHTML = "Image is required";
      setTimeout(() => {
          imageError.innerHTML = "";
      }, 5000);
      return false;
  }

  return true;
}