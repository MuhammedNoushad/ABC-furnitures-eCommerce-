// // show the input field to enter referral
// function displayReferralInput() {
//   const referral = document.getElementById("referral");

//   if (referral.style.display === "none") {
//     referral.style.display = "block";
//   } else {
//     referralMessage.innerText = "";
//     referral.style.display = "none";
//   }
// }

// // check the given referral is valid or not
// function applyReferralCode() {
//   var referralCode = document.getElementById("referralCode").value;
//   const referralinput = document.getElementById("referralCode");
//   const referralMessage = document.getElementById("referralMessage");

//   // Check if referral code is not empty before sending the request
//   if (referralCode.trim() !== "") {
//     // Perform AJAX request using Fetch API
//     fetch("/referral-check", {
//       method: "POST", // or 'GET' depending on your server configuration
//       headers: {
//         "Content-Type": "application/json",
//         // Add any other headers if needed
//       },
//       body: JSON.stringify({
//         referralCode: referralCode,
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // Handle the response from the server
//         if (data.success) {
//           hideValidate(referralinput);
//           referralMessage.innerText = data.message;
//         } else {
//           referralMessage.innerText = "";

//           showValidate(referralinput, data.message);
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   } else {
//     // Show validation error if referral code is empty
//     showValidate(
//       referralinput,
//       "Referral code is empty. Please enter a valid code."
//     );
//   }
// }

// function showValidate(input, message) {
//   var thisAlert = $(input).parent();
//   $(thisAlert).addClass("alert-validate");
//   $(thisAlert).attr("data-validate", message);
// }

// function hideValidate(input) {
//   var thisAlert = $(input).parent();
//   $(thisAlert).removeClass("alert-validate");
//   $(thisAlert).attr("data-validate", "This field is required");
// }

// to share the referral link to others
function shareReferralLink() {
  const referral = document.getElementById("referralLink").value;

  if (navigator.share) {
    navigator
      .share({
        title: "Check out this referral link",
        url: referral,
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  }
}
