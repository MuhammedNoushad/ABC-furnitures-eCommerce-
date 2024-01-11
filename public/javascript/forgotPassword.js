function changePassword() {
  const emailInput = document.getElementById("email");
  let email = emailInput.value;

  if (
    $(emailInput).attr("type") == "email" ||
    $(emailInput).attr("name") == "email" ||
    true // Always execute the fetch request if it's not an email input
  ) {
    if (
      email
        .trim()
        .match(
          /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
        ) == null
    ) {
      showValidate(emailInput, "Invalid email format");
      return false;
    }
  }

  // Fetch request
  fetch("/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        toastr.error("Sorry,email is not existing.");
        emailInput.value = "";
      }
    })
    .then((data) => {
      if (data.success) {
        window.location.href = "change-password/verify-email";
      }
    });
}

function showValidate(input, message) {
  var thisAlert = $(input).parent();
  $(thisAlert).addClass("alert-validate");
  $(thisAlert).attr("data-validate", message);
}
