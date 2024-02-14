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
    startCountdown();
  } else {
    error.classList.replace("error", "error-red");
  }
});

function startCountdown() {
  let seconds = 60; 
  let countdown = document.querySelector(".countdown");
  countdown.appendChild(countdownInterval);
  
  
  let countdownInterval = setInterval(function() {
  countdownElement.textContent = seconds;
  if (seconds === 0) {
      clearInterval(countdownInterval);
      countdownElement.textContent = "Countdown terminato!";

  } else {
      seconds--; 
  }
  }, 1000); 
}

