// let currentQuestionIndex = 0;
// const apiUrl =
//   "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy";

// function fetchQuestion() {
//   fetch(apiUrl)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Errore nella richiesta!");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       if (currentQuestionIndex < data.results.length) {
//         document.querySelectorAll(".box").forEach((box) => {
//           box.addEventListener("click", function () {
//             const question = data.results[currentQuestionIndex];
//             displayQuestion(question);
//             currentQuestionIndex++;
//           });
//         });
//       }
//     })
//     .catch((error) => {
//       console.error("Si è verificato un errore:", error);
//     });
// }

// const questionElement = document.createElement("h3");

// function displayQuestion(question) {
//   questionElement.textContent = question.question; // Correzione qui
//   document.querySelector(".domanda").appendChild(questionElement); // Assicurati che l'elemento esista
// }

// // Assumi che questa sia l'unica volta che vuoi avviare fetchQuestion all'inizio.
// fetchQuestion();

// // Aggiungi un listener solo se è necessario caricare nuove domande al click
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

  const allAnswers = [...question.incorrect_answers];
  allAnswers.push(question.correct_answer); // Aggiungi la risposta corretta all'array delle risposte
  shuffleArray(allAnswers); // Mischiare le risposte

  const responseContainer = document.querySelector(".risposta");
  responseContainer.innerHTML = ""; // Pulisci le risposte precedenti

  allAnswers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer;
    button.classList.add("box", "box1");
    button.onclick = () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        displayQuestion(questions[currentQuestionIndex]);
      } else {
        console.log("Hai completato tutte le domande!");
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
fetchQuestion();
