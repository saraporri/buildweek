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
    questionElement.innerText = question.question
      .replaceAll("&quot;", "")
      .replaceAll("&#039;", "'");

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
        } else {
          wrongAnswer++;
        }
        if (currentQuestionIndex + 1 < questions.length) {
          currentQuestionIndex++;
          displayQuestion(questions[currentQuestionIndex]);
        } else {
          displayResults();
          const percentualeCorrette = document.querySelector(
            ".percentualeCorrette"
          );
          const percentualeErrate =
            document.querySelector(".percentualeErrate");
          percentualeCorrette.innerText = `${
            (correctAnswer * 100) / questions.length
          } %`; // Chiama la funzione per visualizzare i risultati al termine delle domande
          percentualeErrate.innerText = `${
            (wrongAnswer * 100) / questions.length
          } %`;
          const numeroDomande = document.querySelectorAll(".num-questions");
          numeroDomande[0].innerText = ` ${correctAnswer}/${questions.length} questions`;
          numeroDomande[1].innerText = `${wrongAnswer}/${questions.length} questions`;
        }
      };
      responseContainer.appendChild(button);
    });

    document.querySelector(".numero-domande").textContent = `Question ${
      currentQuestionIndex + 1
    }/${questions.length}`;
  }

  function displayResults() {
    document.querySelector(".benchmark")?.remove(); // Rimuovi il contenuto del quiz

    let template = document.querySelector("#template-results");
    let clone = template.content.cloneNode(true);
    // Assegna una classe al clone per poterlo identificare
    clone.firstElementChild.classList.add("results-content");
    document.body.appendChild(clone);
    initChart();
    const rate = document.querySelector(".rate");
    rate.addEventListener("click", function () {
      let temp = document.querySelector(".review");
      let clon = temp.content.cloneNode(true);

      // Rimuovi il contenuto del template-results precedentemente aggiunto
      document.querySelector(".results-content")?.remove();
      document.body.appendChild(clon);
    });
  }
  function displayTestResults() {
    const congrats = document.querySelector(".congrats");
    const examResult = document.querySelector(".examResult");
    const certificate = document.querySelector(".certificate");
    if (correctAnswer >= 6) {
      congrats.innerText = "Congratulations!";
      examResult.innerText = "You passed the exam.";
      certificate.innerText =
        "We'll send you the certificate in few minutes. Check your email (including promotions / spam folder)";
    } else {
      congrats.innerText = "We are sorry.";
      examResult.innerText = "You haven't passed the exam.";
      certificate.innerText = "Shame on you.";
    }
  }
  function initChart() {
    displayTestResults();

    let ctx = document.getElementById("canvas").getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Corrette", "Errate"], // Queste etichette saranno usate nei tooltip
        datasets: [
          {
            data: [correctAnswer, wrongAnswer],
            backgroundColor: ["#00FFFF", "#C2128D"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        cutoutPercentage: 70,
        legend: {
          // Nota: Non è sotto 'plugins' in Chart.js 2.x
          display: false, // Nasconde la legenda
        },
        tooltips: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem, data) {
              let label = data.labels[tooltipItem.index];
              let value =
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return `${label}: ${value}`;
            },
          },
        },
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
