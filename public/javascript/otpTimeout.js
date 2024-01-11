(function ($) {
  "use strict";

  /* Validate */
  var input = $(".validate-input .input100");

  function validateFormManually() {
    var input = $(".validate-input .input100");
    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    return check;
  }

  $(".validate-form .input100").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr("type") == "email" || $(input).attr("name") == "email") {
      if (
        $(input)
          .val()
          .trim()
          .match(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
          ) == null
      ) {
        return false;
      }
    } else if ($(input).attr("name") === "password") {
      // Password length check
      if ($(input).val().trim().length < 6) {
        showValidate(input, "Password should be at least 6 characters long");
        return false;
      }

      // Additional check for the password pattern
      if (
        $(input)
          .val()
          .trim()
          .match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/) === null
      ) {
        showValidate(
          input,
          "Password should contain at least one letter, one number, and may include special characters"
        );
        return false;
      }
    } else if ($(input).attr("name") === "confirmPassword") {
      if (
        $(input).val().trim().length < 6 ||
        $(input).val().trim() !== $('input[name="password"]').val().trim()
      ) {
        showValidate(
          input,
          "Passwords do not match or are less than 6 characters"
        );
        return false;
      }
    } else if ($(input).attr("name") === "mobile") {
      let mobileValue = $(input).val().trim();

      // Check if the value is not empty and contains only numbers
      if (!/^\d+$/.test(mobileValue)) {
        showValidate(input, "Mobile number should contain only numbers");
        return false;
      }

      // Check if the mobile number length is not equal to 10 characters
      if (mobileValue.length !== 10) {
        showValidate(input, "Mobile number should be 10 digits long");
        return false;
      }
    } else {
      if ($(input).val().trim() === "") {
        showValidate(input, "This field should not be empty");
        return false;
      }
    }

    return true;
  }

  function showValidate(input, message) {
    var thisAlert = $(input).parent();
    $(thisAlert).addClass("alert-validate");
    $(thisAlert).attr("data-validate", message);
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).removeClass("alert-validate");
    $(thisAlert).attr("data-validate", "This field is required");
  }



  function validateForm() {
    // Get the value of the OTP input field
    var otpInputValue = document.getElementById("inputOtp").value;

    // Check if the OTP input is empty
    if (!otpInputValue.trim()) {
      // Display an error message (you can customize this part)
      var messageElement = document.getElementById("message");
      if (messageElement) {
        messageElement.innerHTML = "Please enter the OTP.";
      }

      // Prevent the form from submitting
      return false;
    }

    // If validation passes, the form will submit
    return true;
  }

  // signup form request
  document
    .getElementById("signupButton")
    .addEventListener("click", function () {
      if (validateFormManually()) {
        const emailInput = document.getElementById("email");
        const usernameInput = document.getElementById("username");

        // Fetch form data
        const formData = {
          username: document.getElementById("username").value,
          email: document.getElementById("email").value,
          mobile: document.getElementById("mobileNumber").value,
          password: document.getElementById("password").value,
          // Add other form fields as needed
        };

        // Create fetch request
        fetch("/user-registration", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
    window.location.href = "/verify-user";

            } else {
              // Display specific error messages
              if (data.errorType === "email") {
                showValidate(emailInput, data.message);
              } else if (data.errorType === "username") {
                showValidate(usernameInput, data.message);
              } else {
                document.getElementById("errorMessage").innerHTML =
                  data.message;
              }
            }
          })
          .catch((error) => {
            console.error("Sign up failed", error.message);
            document.getElementById("errorMessage").innerHTML =
              "Sign up failed. Please try again.";
          });
      }
    });

  
})(jQuery);
