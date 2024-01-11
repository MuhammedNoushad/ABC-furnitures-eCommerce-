// remove deleted items without reload
function removeDeletedItemFromUI(categoryId) {
  const deletedItem = document.getElementById(`category-${categoryId}`);

  if (deletedItem) {
    deletedItem.remove();
  }
}

// function to delete a category
function confirmDelete(categoryId) {
  const confirmationModal = new bootstrap.Modal(
    document.getElementById("confirmationModal"),
    {
      backdrop: "static",
      keyboard: false,
    }
  );

  confirmationModal.show();

  const deleteButton = document.getElementById("deleteButton");

  deleteButton.addEventListener("click", function (event) {
    event.preventDefault();

    // Perform AJAX request
    $.ajax({
      url: `/admin/category/delete-category?id=${categoryId}`,
      type: "DELETE",
      success: function (data) {
        if (data.success) {
          removeDeletedItemFromUI(categoryId);
          confirmationModal.hide();
          toastr.success(data.message, "Delete category");
        }
      },
      error: function () {
        toastr.error("Error deleting category", "Delete category");
      },
    });
  });
}

// function to add new category
function addNewCategory() {
  const formData = $("#myForm").serialize();
  const categoryNameInput = $('input[name="categoryName"]');
  const categoryName = categoryNameInput.val().trim().toLowerCase();

  // Check if a category with the same name already exists in the UI
  const existingCategory = Array.from(
    document.querySelectorAll("#categoryTable tr")
  ).find(
    (row) => row.cells[0].textContent.trim().toLowerCase() === categoryName
  );

  if (existingCategory) {
    categoryNameInput.val("");

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Category already exists!",
    });
  } else {
    // Continue with the AJAX request
    $.ajax({
      url: "/admin/category/add-new-category",
      type: "POST",
      data: formData,
      success: function (data) {
        if (data.success) {
          // Update the UI with the new category
          addNewCategoryToUI(data.newCategory);

          toastr.success(data.message, "Add category");
          categoryNameInput.val("");
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
          });
        }
      },
      error: function () {
        toastr.error("Error adding category", "Add category");
      },
    });
  }
}

// Function to update the UI with the new category
function addNewCategoryToUI(newCategory) {
  const newCategoryName = newCategory.categoryName.trim().toLowerCase();

  const newRow = document.createElement("tr");
  newRow.id = `category-${newCategory._id}`;

  const categoryNameColumn = document.createElement("td");
  categoryNameColumn.textContent = newCategory.categoryName;

  const dateCreatedColumn = document.createElement("td");
  dateCreatedColumn.textContent = newCategory.createdOn;

  const listedColumn = document.createElement("td");
  listedColumn.textContent = newCategory.listed ? "Listed" : "Unlisted";

  const editColumn = document.createElement("td");
  const editLink = document.createElement("a");
  editLink.href = `/admin/category/edit-category?id=${newCategory._id}`;
  editLink.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit';
  editColumn.appendChild(editLink);

  const deleteColumn = document.createElement("td");
  const deleteLink = document.createElement("a");
  deleteLink.href = "#";
  deleteLink.onclick = function () {
    confirmDelete(newCategory._id);
  };
  deleteLink.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';
  deleteColumn.appendChild(deleteLink);

  // Append columns to the row
  newRow.appendChild(categoryNameColumn);
  newRow.appendChild(dateCreatedColumn);
  newRow.appendChild(listedColumn);
  newRow.appendChild(editColumn);
  newRow.appendChild(deleteColumn);

  // Append the new row at the end of the table
  const tableBody = document.querySelector("#categoryTable");
  tableBody.appendChild(newRow);
}


// block and unblock user admin side
function blockOrUnBlockUser(userId) {
  $.ajax({
    type: "PUT",
    url: `/admin/users/${userId}/block`,
    success: function (response) {
      const buttonText = response.is_blocked ? "UnBlock" : "Block";
      // Update text of the link inside the corresponding td
      $(`#${userId} a`).text(buttonText);

      response.is_blocked
        ? toastr.error("User is blocked", "Blocked user")
        : toastr.success("User is unblocked", "Unblocked user");
    },
    error: function (error) {
      console.error(error);
    },
  });
}

// delete products
function confirmDeleteProduct(productId) {
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
      url: `/admin/products/delete-product?id=${productId}`,
      type: "DELETE",
      success: function (data) {
        if (data.success) {
          removeDeletedItemFromUI(productId);
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
  function removeDeletedItemFromUI(productId) {
    const deletedItem = document.getElementById(productId);

    if (deletedItem) {
      deletedItem.remove();
    }
  }
}

// update the edited category
function editCategory(categoryId) {
  const categoryName = document.querySelector(
    'input[name="categoryName"]'
  ).value;
  const selectedList = document.querySelector(
    'input[name="list-unlist"]:checked'
  ).value;
  let categoryError = document.getElementById("categoryError");
  categoryError.innerText = "";

  if (categoryName.trim() === "") {
    categoryError.innerText = "Fill this empty field.";
    return;
  } else {
    const data = {
      categoryName,
      categoryId,
      "list-unlist": selectedList,
    };

    console.log(data);

    fetch("/admin/category/add-updated-category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 409) {
          toastr.error("Category already exists", "Category Management");
        }
      })
      .then((data) => {
        if (data.success) {
          window.location.href = "/admin/products/category-management";
        }
      })
      .catch((error) => {
        console.error("Error in editCategory:", error.message);
      });
  }
}
