const bottone = document.querySelector(".bottone");
const checkbox = document.querySelector("#checkbox");
const error = document.querySelector(".error");
let welcome = document.querySelector(".container");
let correctAnswer = 0;
let wrongAnswer = 0;
let countdownInterval;

let currentQuestionIndex = 0;
let questions = []; // Definisco l'array di domande a livello globale per poterlo riempire dopo il fetch

// Avvia il quiz

bottone.addEventListener("click", function () {
  if (checkbox.checked) {
    let temp = document.querySelector("#template1");
    let clon = temp.content.cloneNode(true);
    document.body.appendChild(clon);
    document.body.removeChild(welcome);
    fetchQuestion();
  } else {
    error.classList.replace("error", "error-red");
  }
});

const apiUrl =
  "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy";

// Funzione per mischiare un array (Algoritmo di Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // scambia gli elementi
  }
}

const fetchQuestion = async () => {
  //   try {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Errore nella richiesta!");
  }
  const data = await response.json();
  questions = data.results; // Salva le domande nell'array
  shuffleArray(questions); // Mischiare l'array delle domande

  displayQuestion(questions[currentQuestionIndex]); // Visualizza la prima domanda
  //startCountdown()

  //   } catch (error) {
  //     console.error("Si è verificato un errore:", error);
  //   }
};

function setupTitleHTML(question) {
  let questionElement = document.querySelector("#questionHeader");
  if (!questionElement) {
    questionElement = document.createElement("h3");
    questionElement.id = "questionHeader";
    document.querySelector(".domanda").appendChild(questionElement);
  }
  questionElement.textContent = question.question;
}

function startCountdown(question, seconds = 5) {
  let countdownSvg = document.querySelector("#timer-container .circle");
  let countdownElement = document.querySelector("#timer");

  const max = 500;
  const step = max / seconds;

  if (countdownInterval) {
    stopCountdown();
  }

  countdownInterval = setInterval(function () {
    console.log(step);
    countdownElement.textContent = seconds;
    if (seconds === 0) {
      stopCountdown();
      currentQuestionIndex++;
      const nextQuestion = questions[currentQuestionIndex];
      displayQuestion(nextQuestion);
    } else {
      seconds--;
      countdownSvg.style.strokeDashoffset = max - step * seconds;
      countdownSvg.style.strokeDasharray = max;
    }
  }, 1000);
}

function stopCountdown() {
  clearInterval(countdownInterval);
  countdownInterval = undefined;
  seconds = 5;
}

function displayQuestion(question) {
  setupTitleHTML(question);
  const responseContainer = document.querySelector(".risposta");
  responseContainer.innerHTML = ""; // Pulisci le risposte precedenti

  if (!checkQuizValid()) return;

  startCountdown(question);

  const responses = [...question.incorrect_answers, question.correct_answer];
  shuffleArray(responses);

  responses.forEach((response) => {
    const button = document.createElement("button");
    button.innerText = response;
    button.classList.add("box", "box1");
    button.onclick = () => {
      setAnswerResult(response, question);
      currentQuestionIndex++;
      const nextQuestion = questions[currentQuestionIndex];
      displayQuestion(nextQuestion);
    };
    responseContainer.appendChild(button);
  });

  // Aggiorna il testo con il numero della domanda corrente e il numero totale delle domande
  document.querySelector(".numero-domande").textContent = `Question ${
    currentQuestionIndex + 1
  }/${questions.length}`;
}

function checkQuizValid() {
  const valid = currentQuestionIndex < questions.length;
  if (!valid) {
    endQuiz();
    // Qui potresti voler fare qualcosa di specifico quando l'utente ha risposto a tutte le domande
  }
  return valid;
}

function setAnswerResult(response, question) {
  if (response == question.correct_answer) {
    correctAnswer += 1;
    console.log(correctAnswer);
  } else {
    wrongAnswer += 1;
    console.log(wrongAnswer);
  }
}

function endQuiz() {
  let benchmark = document.querySelector(".benchmark");

  let temp = document.getElementsByTagName("template")[1];
  let clon = temp.content.cloneNode(true);
  document.body.appendChild(clon);
  document.body.removeChild(benchmark);
  stopCountdown();
}
