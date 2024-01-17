// add product validation
function validateAddProducts() {
  const productName = document.getElementById("product_title");
  const regPrice = document.getElementById("product_regPrice");
  const salePrice = document.getElementById("product_salePrice");
  const description = document.getElementById("prod_description");
  const stock = document.getElementById("prod_stock");
  const image = document.getElementById("product_images");

  // Error feilds
  const productNameError = document.getElementById("nameError");
  const regPriceError = document.getElementById("regPriceError");
  const salePriceError = document.getElementById("salePriceError");
  const descriptionError = document.getElementById("descError");
  const stockError = document.getElementById("sotckError");
  const imageError = document.getElementById("brandError");

  // Regex
  const productNameRegex = /^[a-zA-Z0-9\s]+$/;
  const regPriceRegex = /^\d+(\.\d{1,2})?$/;
  const salePriceRegex = /^\d+(\.\d{1,2})?$/;
  const descriptionRegex = /^[A-Za-z0-9\s\S]+$/;
  const stockrRegex = /^[0-9]+$/;
  const imageRegex = /\.(jpg|jpeg|png|gif)$/i;

  if (productName.value.trim() === "") {
    productNameError.innerHTML = "Product name is required";
    setTimeout(() => {
      productNameError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!productNameRegex.test(productName.value)) {
    productNameError.innerHTML = "Invalid product name";
    setTimeout(() => {
      productNameError.innerHTML = "";
    }, 5000);
    return false;
  }

  if (regPrice.value.trim() === "") {
    regPriceError.innerHTML = "Regular price is required";
    setTimeout(() => {
      regPriceError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!regPriceRegex.test(regPrice.value)) {
    regPriceError.innerHTML = "Invalid regular price";
    setTimeout(() => {
      regPriceError.innerHTML = "";
    }, 5000);
    return false;
  }

  //mobile feild
  if (salePrice.value.trim() === "") {
    salePriceError.innerHTML = "Sale price is required";
    setTimeout(() => {
      salePriceError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!salePriceRegex.test(salePrice.value)) {
    salePriceError.innerHTML = "Invalid sale price";
    setTimeout(() => {
      salePriceError.innerHTML = "";
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
    descriptionError.innerHTML = "  Only allow alphabets in here";
    setTimeout(() => {
      descriptionError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (image.value.trim() === "") {
    imageError.innerHTML = "Image field can't be empty";
    setTimeout(() => {
      stockError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!imageRegex.test(image.value)) {
    imageError.innerHTML = "Invalid image path";
    setTimeout(() => {
      imageError.innerHTML = "";
    }, 5000);
    return false;
  }

  if (stock.value.trim() === "") {
    stockError.innerHTML = "Stock quantity is required";
    setTimeout(() => {
      stockError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!stockrRegex.test(stock.value)) {
    stockError.innerHTML = "Invalid stock quantity";
    setTimeout(() => {
      stockError.innerHTML = "";
    }, 5000);
    return false;
  }
  return true;
}

// edit product validation
function validateEditProducts() {
  const productName = document.getElementById("product_title");
  const regPrice = document.getElementById("product_regPrice");
  const salePrice = document.getElementById("product_salePrice");
  const description = document.getElementById("prod_description");
  const stock = document.getElementById("prod_stock");

  // Error feilds
  const productNameError = document.getElementById("nameError");
  const regPriceError = document.getElementById("regPriceError");
  const salePriceError = document.getElementById("salePriceError");
  const descriptionError = document.getElementById("descError");
  const stockError = document.getElementById("sotckError");

  // Regex
  const productNameRegex = /^[a-zA-Z0-9\s]+$/;
  const regPriceRegex = /^\d+(\.\d{1,2})?$/;
  const salePriceRegex = /^\d+(\.\d{1,2})?$/;
  const descriptionRegex = /^[A-Za-z0-9\s\S]+$/;
  const stockrRegex = /^[0-9]+$/;

  if (productName.value.trim() === "") {
    productNameError.innerHTML = "Product name is required";
    setTimeout(() => {
      productNameError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!productNameRegex.test(productName.value)) {
    productNameError.innerHTML = "Invalid product name";
    setTimeout(() => {
      productNameError.innerHTML = "";
    }, 5000);
    return false;
  }

  if (regPrice.value.trim() === "") {
    regPriceError.innerHTML = "Regular price is required";
    setTimeout(() => {
      regPriceError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!regPriceRegex.test(regPrice.value)) {
    regPriceError.innerHTML = "Invalid regular price";
    setTimeout(() => {
      regPriceError.innerHTML = "";
    }, 5000);
    return false;
  }

  //mobile feild
  if (salePrice.value.trim() === "") {
    salePriceError.innerHTML = "Sale price is required";
    setTimeout(() => {
      salePriceError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!salePriceRegex.test(salePrice.value)) {
    salePriceError.innerHTML = "Invalid sale price";
    setTimeout(() => {
      salePriceError.innerHTML = "";
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
    descriptionError.innerHTML = "  Only allow alphabets in here";
    setTimeout(() => {
      descriptionError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (stock.value.trim() === "") {
    stockError.innerHTML = "Stock quantity is required";
    setTimeout(() => {
      stockError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!stockrRegex.test(stock.value)) {
    stockError.innerHTML = "Invalid stock quantity";
    setTimeout(() => {
      stockError.innerHTML = "";
    }, 5000);
    return false;
  }
  return true;
}

// function to sort the order details
function redirectToStatus(select) {
  // Get the selected value from the dropdown
  var status = select.value;

  // Check if the selected status is empty
  if (status === "All") {
    // If it's empty, navigate to "/admin/orderDetails"
    window.location.href = "/admin/products/products-orders";
  } else {
    // If a status is selected, navigate to "/admin/orderDetails?id=" + status
    window.location.href = "/admin/products/products-orders?status=" + status;
  }
}

// sort by orders per page
function orderPerPage(select) {
  const ordersPerPage = select.value;

  if (ordersPerPage === "All")
    window.location.href = "/admin/products/products-orders";
  else
    window.location.href =
      "/admin/products/products-orders?ordersPerPage=" + ordersPerPage;
}
