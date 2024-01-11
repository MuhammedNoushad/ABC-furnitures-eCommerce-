function validate() {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const streetAddress = document.getElementById("streetAddress");
  const city = document.getElementById("city");
  const zipCode = document.getElementById("zipCode");
  const phoneNumber = document.getElementById("phoneNumber");

  // Error fields
  const firstNameError = document.getElementById("firstNameError");
  const lastNameError = document.getElementById("lastNameError");
  const emailError = document.getElementById("emailError");
  const streetAddressError = document.getElementById("streetAddressError");
  const cityError = document.getElementById("cityError");
  const zipCodeError = document.getElementById("zipCodeError");
  const phoneNumberError = document.getElementById("phoneNumberError");

  // Regex
  const nameRegex = /^[a-zA-Z0-9\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const streetAddressRegex = /^[a-zA-Z0-9\s,'-]+$/;
  const cityRegex = /^[a-zA-Z\s]+$/;
  const zipCodeRegex = /^\d{6}(?:[-\s]\d{4})?$/;
  const phoneNumberRegex = /^\d{10}$/;

  // First Name field
  if (firstName.value.trim() === "") {
    firstNameError.innerHTML = "First name is required";
    setTimeout(() => {
      firstNameError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!nameRegex.test(firstName.value)) {
    firstNameError.innerHTML = "Invalid name";
    setTimeout(() => {
      firstNameError.innerHTML = "";
    }, 5000);
    return false;
  }

  // Last Name field
  if (lastName.value.trim() === "") {
    lastNameError.innerHTML = "Last name is required";
    setTimeout(() => {
      lastNameError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!nameRegex.test(lastName.value)) {
    lastNameError.innerHTML = "Invalid name";
    setTimeout(() => {
      lastNameError.innerHTML = "";
    }, 5000);
    return false;
  }

  // Email field (assuming it exists)
  if (email.value.trim() === "") {
    emailError.innerHTML = "email is required";
    setTimeout(() => {
      emailError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!emailRegex.test(email.value)) {
    emailError.innerHTML = "Invalid email";
    setTimeout(() => {
      emailError.innerHTML = "";
    }, 5000);
    return false;
  }

  // Street Address field (assuming it exists)
  if (streetAddress.value.trim() === "") {
    streetAddressError.innerHTML = "streetAddress is required";
    setTimeout(() => {
      streetAddressError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!streetAddressRegex.test(streetAddress.value)) {
    streetAddressError.innerHTML = "Invalid streetAddress";
    setTimeout(() => {
      streetAddressError.innerHTML = "";
    }, 5000);
    return false;
  }

  // City field (assuming it exists)
  if (city.value.trim() === "") {
    cityError.innerHTML = "city is required";
    setTimeout(() => {
      cityError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!cityRegex.test(city.value)) {
    cityError.innerHTML = "Invalid city";
    setTimeout(() => {
      cityError.innerHTML = "";
    }, 5000);
    return false;
  }

  // Zip Code field (assuming it exists)
  if (zipCode.value.trim() === "") {
    zipCodeError.innerHTML = "zipCode is required";
    setTimeout(() => {
      zipCodeError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!zipCodeRegex.test(zipCode.value)) {
    zipCodeError.innerHTML = "Invalid zipCode";
    setTimeout(() => {
      zipCodeError.innerHTML = "";
    }, 5000);
    return false;
  }

  // Phone Number field (assuming it exists)
  if (phoneNumber.value.trim() === "") {
    phoneNumberError.innerHTML = "phoneNumber is required";
    setTimeout(() => {
      phoneNumberError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!phoneNumberRegex.test(phoneNumber.value)) {
    phoneNumberError.innerHTML = "Invalid phoneNumber";
    setTimeout(() => {
      phoneNumberError.innerHTML = "";
    }, 5000);
    return false;
  }

  // Add validation logic for other fields...

  return true;
}

const checkOut = document.querySelector("#checkOut");

checkOut.addEventListener("click", () => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Add address before checkout!",
  });
});

// update user mobile number 

function mobileValidate(userId) {
  const mobile = document.querySelector("#mobile");

  const mobileError = document.querySelector("#mobileError");

  const mobileRegex = /^\d{10}$/;

  if (mobile.value.trim() === "") {
    mobileError.innerHTML = "Please enter a mobile number";
    setTimeout(() => {
      mobileError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!mobileRegex.test(mobile.value)) {
    mobileError.innerHTML = "Invalid mobile number";
    setTimeout(() => {
      mobileError.innerHTML = "";
    }, 5000);
    return false;
  }

  // Make an AJAX request
  const formData = {
    mobile: mobile.value,
  };

  $.ajax({
    type: "POST",
    url: `/update-mobile?id=${userId}`,
    data: formData,
    success: function (data) {

      mobile.value = "";

      toastr.success("Password updated sucessfully", "Update password");

    },
    error: function (error) {
      mobile.value = "";

      // Show the mobile error
      mobileError.innerHTML = "Error updating mobile number. Please try again!";
      setTimeout(() => {
        mobileError.innerHTML = "";
      }, 5000);
    },
  });

  return false;
}



// validate the password changing page 

function passwordValidation(userId) {
  const currentPassword = document.querySelector("#currentPassword");
  const newPassword = document.querySelector("#newPassword");
  const confirmPassword = document.querySelector("#confirmPassword");

  const currentPasswordError = document.querySelector("#currentPasswordError");
  const newPasswordError = document.querySelector("#newPasswordError");
  const confirmPasswordError = document.querySelector("#confirmPasswordError");

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

  // current password
  if (currentPassword.value.trim() === "") {
    currentPasswordError.innerHTML = "Enter your password";
    setTimeout(() => {
      currentPasswordError.innerHTML = "";
    }, 5000);
    return false;
  }

  // new password
  if (newPassword.value.trim() === "") {
    newPasswordError.innerHTML = "Please enter the new password";
    setTimeout(() => {
      newPasswordError.innerHTML = "";
    }, 5000);
    return false;
  }
  if (!passwordRegex.test(newPassword.value)) {
    newPasswordError.innerHTML = "The password must be strong";
    setTimeout(() => {
      newPasswordError.innerHTML = "";
    }, 5000);
    return false;
  }

  // confirm new password
  if (confirmPassword.value.trim() === "") {
    confirmPasswordError.innerHTML = "Please confirm your password";
    setTimeout(() => {
      confirmPasswordError.innerHTML = "";
    }, 5000);
    return false;
  }

  if (newPassword.value !== confirmPassword.value) {
    newPasswordError.innerHTML = "Passwords do not match";
    confirmPasswordError.innerHTML = "Passwords do not match";
    setTimeout(() => {
      newPasswordError.innerHTML = "";
    }, 5000);
    return false;
  }

  if (!passwordRegex.test(confirmPassword.value)) {
    confirmPasswordError.innerHTML = "The password must be strong";
    setTimeout(() => {
      confirmPasswordError.innerHTML = "";
    }, 5000);
    return false;
  }

  // Make an AJAX request
  const formData = {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
  };

  $.ajax({
    type: "POST",
    url: `/update-password?id=${userId}`,
    data: formData,
    success: function (data) {

      currentPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";

      toastr.success("Password updated sucessfully", "Update password");
    },
    error: function (error) {
      currentPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";

      // show the password error
      currentPasswordError.innerHTML =
        "Incorrect current password.Please try again!";
      setTimeout(() => {
        currentPasswordError.innerHTML = "";
      }, 5000);
    },
  });

  return false;
}


function usernameValidation() {
  const editUserName = document.querySelector("#editUserName");
  const usernameError = document.querySelector("#usernameError");

  const nameRegex = /^[a-zA-Z0-9\s]+$/;

  if (editUserName.value.trim() === "") {
    usernameError.innerHTML = "Username is required";
    setTimeout(() => {
      usernameError.innerHTML = "";
    }, 5000);
    return false;
  }

  if (!nameRegex.test(editUserName.value)) {
    usernameError.innerHTML = "Invalid username";
    setTimeout(() => {
      usernameError.innerHTML = "";
    }, 5000);
    return false;
  }

  return true;
}


