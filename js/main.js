const bottone = document.querySelector(".bottone");
const checkbox = document.querySelector("#checkbox");
const error = document.querySelector(".error");
let welcome = document.querySelector(".container");
let correctAnswer = 0;
let wrongAnswer = 0;

let currentQuestionIndex = 0;
let questions = []; // Definisco l'array di domande a livello globale per poterlo riempire dopo il fetch

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
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Errore nella richiesta!");
    }
    const data = await response.json();
    questions = data.results; // Salva le domande nell'array
    shuffleArray(questions); // Mischiare l'array delle domande
    displayQuestion(questions[currentQuestionIndex]); // Visualizza la prima domanda
  } catch (error) {
    console.error("Si è verificato un errore:", error);
  }
};

function displayQuestion(question) {
  let questionElement = document.querySelector("#questionHeader");
  if (!questionElement) {
    questionElement = document.createElement("h3");
    questionElement.id = "questionHeader";
    document.querySelector(".domanda").appendChild(questionElement);
  }
  questionElement.textContent = question.question;

  const responses = [...question.incorrect_answers, question.correct_answer];
  const responseContainer = document.querySelector(".risposta");
  responseContainer.innerHTML = ""; // Pulisci le risposte precedenti

  responses.forEach((response) => {
    const button = document.createElement("button");
    button.innerText = response;
    button.classList.add("box", "box1");
    button.onclick = () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        displayQuestion(questions[currentQuestionIndex]);
        if (button.innerText == question.correct_answer) {
          correctAnswer += 1;
          console.log(correctAnswer);
        } else {
          wrongAnswer += 1;
          console.log(wrongAnswer);
        }
      } else {
        let benchmark = document.querySelector(".benchmark");

        let temp = document.getElementsByTagName("template")[1];
        let clon = temp.content.cloneNode(true);
        document.body.appendChild(clon);
        document.body.removeChild(benchmark);
        // Qui potresti voler fare qualcosa di specifico quando l'utente ha risposto a tutte le domande
      }
    };
    responseContainer.appendChild(button);
  });

  // Aggiorna il testo con il numero della domanda corrente e il numero totale delle domande
  document.querySelector(".numero-domande").textContent = `Domanda ${
    currentQuestionIndex + 1
  }/${questions.length}`;
}

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
