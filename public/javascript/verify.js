$(document).ready(function () {
  const email = $("#email");
  const message = $("#message");
  $("#verifyEmail").click(function (e) {
    e.preventDefault(); // Prevent the default behavior of the link

    if (email.val() === "") {
      return; // Stop the function if the email is empty
    }

    // Make an AJAX POST request to your server
    $.ajax({
      type: "POST",
      url: "/verify-email", // Replace with the actual endpoint on your server
      data: { email: email.val() }, // Replace with the user's email
      success: function (response) {
        alert("Verification email sent!");
      },
      error: function (error) {
        alert("An error occurred while sending the verification email");
      },
    });
  });
});
