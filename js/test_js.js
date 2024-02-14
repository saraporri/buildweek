document.addEventListener("DOMContentLoaded", () => {
  const bottone = document.querySelector(".bottone");
  const checkbox = document.querySelector("#checkbox");
  const error = document.querySelector(".error");
  let welcome = document.querySelector(".container");
  let correctAnswer = 0;
  let wrongAnswer = 0;

  let currentQuestionIndex = 0;
  let questions = [];

  const apiUrl =
    "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy";

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  async function fetchQuestion() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Errore nella richiesta!");
      }
      const data = await response.json();
      questions = data.results;
      shuffleArray(questions);
      displayBenchmark(); // Mostra il benchmark prima di visualizzare la prima domanda
    } catch (error) {
      console.error("Si è verificato un errore:", error);
    }
  }

  function displayBenchmark() {
    // Assicurati che il template del benchmark sia visibile
    let temp = document.querySelector("#template1");
    let clon = temp.content.cloneNode(true);
    document.body.appendChild(clon);
    document.body.removeChild(welcome);
    displayQuestion(questions[currentQuestionIndex]); // Mostra la prima domanda
  }

  function displayQuestion(question) {
    let questionElement = document.querySelector("#questionHeader");
    if (!questionElement) {
      questionElement = document.createElement("h3");
      questionElement.id = "questionHeader";
      document.querySelector(".domanda").appendChild(questionElement);
    }
    questionElement.textContent = question.question;

    const responses = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(responses);
    const responseContainer = document.querySelector(".risposta");
    responseContainer.innerHTML = "";

    responses.forEach((response) => {
      const button = document.createElement("button");
      button.innerText = response;
      button.classList.add("box", "box1");
      button.onclick = () => {
        if (response === question.correct_answer) {
          correctAnswer++;
          console.log(correctAnswer);
        } else {
          wrongAnswer++;
          console.log(wrongAnswer);
        }
        if (currentQuestionIndex + 1 < questions.length) {
          currentQuestionIndex++;
          displayQuestion(questions[currentQuestionIndex]);
        } else {
          displayResults(); // Chiama la funzione per visualizzare i risultati al termine delle domande
        }
      };
      responseContainer.appendChild(button);
    });

    document.querySelector(".numero-domande").textContent = `Domanda ${
      currentQuestionIndex + 1
    }/${questions.length}`;
  }

  function displayResults() {
    // Rimuovi il benchmark e mostra i risultati
    document.querySelector(".benchmark")?.remove(); // Rimuovi il contenuto del quiz

    let template = document.querySelector("#template-results");
    let clone = template.content.cloneNode(true);
    document.body.appendChild(clone);
    initChart();
  }

  function initChart() {
    let ctx = document.getElementById("canvas").getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [correctAnswer, wrongAnswer],
            backgroundColor: ["#4caf50", "#f44336"],
          },
        ],
      },
    });
  }

  bottone.addEventListener("click", function () {
    if (checkbox.checked) {
      fetchQuestion();
    } else {
      error.classList.replace("error", "error-red");
    }
  });
});
