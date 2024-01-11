const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");
togglePassword.addEventListener("click", () => {
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  togglePassword.classList.toggle("bi-eye");
});

const toggleConfirmPassword = document.querySelector("#toggleConfirmPassword");
const confirmPassword = document.querySelector("#confirmPassword");
toggleConfirmPassword.addEventListener("click", () => {
  const type =
    confirmPassword.getAttribute("type") === "password" ? "text" : "password";
  confirmPassword.setAttribute("type", type);
  toggleConfirmPassword.classList.toggle("bi-eye");
});

