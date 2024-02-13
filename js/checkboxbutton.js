const bottone = document.querySelector(".bottone");
const checkbox = document.querySelector("#checkbox");
const error = document.querySelector(".error");

bottone.addEventListener("click", function () {
  if (checkbox.checked) {
    alert("bravo");
  } else {
    error.classList.replace("error", "error-red");
  }
});
