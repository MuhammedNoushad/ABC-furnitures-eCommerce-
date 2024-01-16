// Function to navigate to the selected option's value
function navigateToSelectedOption() {
  // Get the select element
  var selectElement = document.getElementById("priceRange");

  // Get the selected value
  var selectedValue = selectElement.value;

  // Construct the URL based on the selected value
  var url = "/products-shop?priceRange=" + selectedValue;

  // Navigate to the URL
  window.location.href = url;
}

// function to sort the products by its category
function sortShop(categoryId) {
  // check if the price range is selected
  const priceRange = document.getElementById("priceRange").value;

  // Construct the URL based on whether a price range is selected
  const url = priceRange
    ? `/products-shop?id=${categoryId}&priceRange=${priceRange}`
    : `/products-shop?id=${categoryId}`;

  // Redirect to the constructed URL
  window.location.href = url;
}
