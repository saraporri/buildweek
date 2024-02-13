const bottone = document.querySelector(".bottone");
const checkbox = document.querySelector("#checkbox");
const error = document.querySelector(".error");
let welcome = document.querySelector('.container')

bottone.addEventListener("click", function () {
  if (checkbox.checked) {
    let temp = document.getElementsByTagName("template")[0];
    let clon = temp.content.cloneNode(true);
    document.body.appendChild(clon);
    document.body.removeChild(welcome);
  } else {
    error.classList.replace("error", "error-red");
  }
});






