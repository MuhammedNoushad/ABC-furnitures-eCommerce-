(function ($) {
  "use strict";

  /* Validate */
  var input = $(".validate-input .input100");

  $(".validate-form").on("submit", function () {
    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    return check;
  });

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
})(jQuery);
