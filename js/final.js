document.addEventListener("DOMContentLoaded", () => {
  const bottone = document.querySelector(".bottone");
  const checkbox = document.querySelector("#checkbox");
  const error = document.querySelector(".error");
  let welcome = document.querySelector(".container");
  let correctAnswer = 0;
  let wrongAnswer = 0;
  let countdownInterval;

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
    if (welcome) {
      document.body.removeChild(welcome);
    }
    let temp = document.querySelector("#template1");
    let clon = temp.content.cloneNode(true);
    document.body.appendChild(clon);
    displayQuestion(questions[currentQuestionIndex]);
  }

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
      countdownElement.textContent = seconds;
      if (seconds === 0) {
        stopCountdown();
        if (currentQuestionIndex + 1 < questions.length) {
          currentQuestionIndex++;
          displayQuestion(questions[currentQuestionIndex]);
        } else {
          endQuiz();
        }
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
  }

  function displayQuestion(question) {
    setupTitleHTML(question);

    const responseContainer = document.querySelector(".risposta");
    responseContainer.innerHTML = ""; // Pulisci le risposte precedenti

    startCountdown(question);

    const responses = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(responses);

    responses.forEach((response) => {
      const button = document.createElement("button");
      button.innerText = response;
      button.classList.add("box", "box1");
      button.onclick = () => {
        stopCountdown(); // Fermare il countdown una volta che una risposta è stata selezionata
        setAnswerResult(response, question);
        if (currentQuestionIndex + 1 < questions.length) {
          currentQuestionIndex++;
          displayQuestion(questions[currentQuestionIndex]);
        } else {
          endQuiz();
        }
      };
      responseContainer.appendChild(button);
    });

    document.querySelector(".numero-domande").textContent = `QUESTION ${
      currentQuestionIndex + 1
    }`;
    document.querySelector(".pink-num").textContent = ` / ${questions.length}`;
  }

  function setAnswerResult(response, question) {
    if (response == question.correct_answer) {
      correctAnswer += 1;
    } else {
      wrongAnswer += 1;
    }
  }

  function displayResults() {
    document.querySelector(".benchmark")?.remove(); // Rimuovi il contenuto del quiz

    let template = document.querySelector("#template-results");
    let clone = template.content.cloneNode(true);
    document.body.appendChild(clone);

    // Calcola le percentuali
    const percentCorrect = ((correctAnswer / questions.length) * 100).toFixed(
      0
    );
    const percentWrong = ((wrongAnswer / questions.length) * 100).toFixed();

    // Seleziona e aggiorna gli elementi nel DOM per visualizzare le percentuali e il totale
    const percentualeCorrette = document.querySelector(".percentualeCorrette");
    const percentualeErrate = document.querySelector(".percentualeErrate");
    const numQuestionsCorrect = document.querySelector(
      ".stats .correct .num-questions"
    );
    const numQuestionsWrong = document.querySelector(
      ".stats .wrong .num-questions"
    );

    if (
      percentualeCorrette &&
      percentualeErrate &&
      numQuestionsCorrect &&
      numQuestionsWrong
    ) {
      percentualeCorrette.textContent = `${percentCorrect}%`;
      percentualeErrate.textContent = `${percentWrong}%`;
      numQuestionsCorrect.textContent = `${correctAnswer}/${questions.length} questions`;
      numQuestionsWrong.textContent = `${wrongAnswer}/${questions.length} questions`;
    }

    initChart();
    displayTestResults(); // Mostra i risultati del test

    // Aggiunge l'evento click al bottone "RATE US" per mostrare il template di review
    document.querySelector(".rate").addEventListener("click", function () {
      displayReview();
    });
  }

  function displayReview() {
    // Rimuovi il contenitore dei risultati
    const resultsContainer =
      document.body.querySelector(".results-content") ||
      document.body.querySelector(".results");
    if (resultsContainer) {
      resultsContainer.remove();
    }

    // Mostra il template di review
    let reviewTemplate = document.querySelector(".review");
    let clone = reviewTemplate.content.cloneNode(true);
    document.body.appendChild(clone);
  }

  function displayTestResults() {
    const congrats = document.querySelector(".congrats");
    const examResult = document.querySelector(".examResult");
    const certificate = document.querySelector(".certificate");
    const testResults = document.querySelector(".testResults");
    if (correctAnswer >= questions.length * 0.6) {
      // Supponendo che il 60% sia la soglia di superamento
      congrats.innerText = "Congratulations!";
      examResult.innerText = "You passed the exam.";
      certificate.innerText =
        "We'll send you the certificate in a few minutes. Check your email (including promotions / spam folder)";
      testResults.classList.add("happy");
    } else {
      congrats.innerText = "We are sorry.";
      examResult.innerText = "You haven't passed the exam.";
      certificate.innerText = "Please try again.";
      testResults.classList.add("sad");
    }
  }

  function initChart() {
    let ctx = document.getElementById("canvas").getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Correct", "Wrong"],
        datasets: [
          {
            data: [correctAnswer, wrongAnswer],
            backgroundColor: ["#00FFFF", "#C2128D"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutoutPercentage: 70,
        legend: {
          display: false,
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

  function endQuiz() {
    displayResults(); // Chiamata modificata per visualizzare i risultati alla fine del quiz
  }

  bottone.addEventListener("click", function () {
    if (checkbox.checked) {
      fetchQuestion();
    } else {
      error.classList.replace("error", "error-red");
    }
  });
});
