document
  .getElementById("newImagesInput")
  .addEventListener("change", function (event) {
    const container = document.getElementById("existingImagesContainer");
    container.innerHTML = "";

    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = resizeImage(e.target.result, 100, 100); // Resize to 100x100 pixels
        img.alt = "New Image";
        img.classList.add("new-image");
        container.appendChild(img);
      };

      reader.readAsDataURL(files[i]);
    }
  });

function resizeImage(base64, maxWidth, maxHeight) {
  const img = new Image();
  img.src = base64;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let width = img.width;
  let height = img.height;

  if (width > maxWidth) {
    height *= maxWidth / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width *= maxHeight / height;
    height = maxHeight;
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg"); // Change to 'image/png' if needed
}

// delete single image of the product from product edit 
function deleteSingleImage(productId, filename) {
    // Fetch API to delete the image
    fetch("/admin/delete-single-image", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, filename }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle success or error
        if (data.success) {
          removeImage(filename);
        } else {
          console.error("Error deleting image:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // remove the deleted image
  function removeImage(filename) {
    const imageElement = document.querySelector(`[data-filename="${filename}"]`);
    if (imageElement) {
      imageElement.remove();
    }
  }
  
  // Assuming your delete link has an id like "deleteLink"
  const deleteLink = document.getElementById("deleteLink");
  
  // Add a click event listener to the delete link
  deleteLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default anchor click behavior
    deleteSingleImage(productId, filename);
  });