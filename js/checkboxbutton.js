const bottone = document.querySelector(".bottone");
const checkbox = document.querySelector("#checkbox");
const error = document.querySelector("#error");
error.style.display = "none";

bottone.addEventListener("click", function () {
  if (checkbox.checked) {
    alert("bravo");
  } else {
    error.style.display = "block";
  }
});
