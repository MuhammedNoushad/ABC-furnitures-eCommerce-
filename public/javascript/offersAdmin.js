// add offer to each products
function submitOffer(productId) {
  let offerPercentage = document.getElementById(`offerInput${productId}`).value;

  if (
    isNaN(offerPercentage) ||
    offerPercentage > 100 ||
    offerPercentage <= 0 ||
    offerPercentage.trim() === ""
  ) {
    toastr.error(
      "Please enter a valid offer percentage (1-100).",
      "Offer management"
    );
    return;
  }

  fetch("/admin/products/add-product-offer", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      offerPercentage: offerPercentage,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      if (data.success) {
        offerPercentage = "";
        $("#applyOfferModal" + productId).modal("hide");
        toastr.success(data.message, "Offer management");

        updatePrice(data.salePrice, productId);
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error("there was some problem while fetching the data" + error);
    });
}

function updatePrice(amount, productId) {

  const salePriceInput = document.getElementById(`salePrice${productId}`);
  salePriceInput.innerText = amount;
}



// remove the offer on the product
function removeOffer(productId) {
  fetch("/admin/products/remove-product-offer", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        $("#removeOfferModal" + productId).modal("hide");

        updatePrice(data.salePrice, productId);
        // changeButtonAndModel(categoryId, "Apply offer");
        window.location.reload();
      }
    });
}

// add offer to a category
function submitOfferCategory(categoryId) {
  const offerPercentage = document.getElementById(
    `offerInput${categoryId}`
  ).value;
  if (
    isNaN(offerPercentage) ||
    offerPercentage > 100 ||
    offerPercentage <= 0 ||
    offerPercentage.trim() === ""
  ) {
    toastr.error(
      "Please enter a valid offer percentage (1-100).",
      "Offer management"
    );
    return;
  }

  fetch("/admin/products/add-category-offer", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      categoryId: categoryId,
      offerPercentage: offerPercentage,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      if (data.success) {
        offerPercentage.value = "";
        toastr.success(data.message, "Offer management");
        $("#applyOfferModal" + categoryId).modal("hide");

        window.location.reload();
      }
    })
    .catch((error) => {
      console.error("there was some problem while fetching the data" + error);
    });
}

// remove offer from the category
function removeOfferCategory(categoryId) {
  fetch("/admin/products/remove-category-offer", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      categoryId: categoryId,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        $("#removeOfferModal" + categoryId).modal("hide");

        window.location.reload();
      }
    });
}
