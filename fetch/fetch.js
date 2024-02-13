let currentQuestionIndex = 0;
const apiUrl =
  "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy";

function fetchQuestion() {
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore nella richiesta!");
      }
      return response.json();
    })
    .then((data) => {
      if (currentQuestionIndex < data.results.length) {
        const question = data.results[currentQuestionIndex];
        displayQuestion(question);
        currentQuestionIndex++;
      }
    })
    .catch((error) => {
      console.error("Si è verificato un errore:", error);
    });
}

const questionElement = document.createElement("h3");

function displayQuestion(question) {
  questionElement.textContent = question.question; // Correzione qui
  document.querySelector(".domanda").appendChild(questionElement); // Assicurati che l'elemento esista
}

// Assumi che questa sia l'unica volta che vuoi avviare fetchQuestion all'inizio.
fetchQuestion();

// Aggiungi un listener solo se è necessario caricare nuove domande al click
document.querySelectorAll(".box").forEach((box) => {
  box.addEventListener("click", function () {
    questionElement.remove();
    fetchQuestion();
  });
});
