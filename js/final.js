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
      displayBenchmark();
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
    questionElement.textContent = question.question
      .replaceAll("&quot;", '"')
      .replaceAll("&#039;", "'");
  }

  function startCountdown(question, seconds = 60) {
    let countdownSvg = document.querySelector("#timer-container .circle");
    let countdownElement = document.querySelector("#timer");

    const max = 500;
    const step = max / seconds;

    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(function () {
      if (seconds === 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        if (currentQuestionIndex + 1 < questions.length) {
          currentQuestionIndex++;
          displayQuestion(questions[currentQuestionIndex]);
        } else {
          endQuiz();
        }
      } else {
        seconds--;
        countdownElement.textContent = seconds;
        countdownSvg.style.strokeDashoffset = max - step * seconds;
        countdownSvg.style.strokeDasharray = `${max}`;
      }
    }, 1000);
  }

  function stopCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  function displayQuestion(question) {
    setupTitleHTML(question);

    const responseContainer = document.querySelector(".risposta");
    responseContainer.innerHTML = "";

    startCountdown(question);

    const responses = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(responses);

    responses.forEach((response) => {
      const button = document.createElement("button");
      button.textContent = response.replaceAll("&#039;", "'");
      button.classList.add("box");
      button.onclick = () => {
        stopCountdown();
        setAnswerResult(response, question);
        if (currentQuestionIndex + 1 < questions.length) {
          currentQuestionIndex++;
          setTimeout(() => {
            displayQuestion(questions[currentQuestionIndex]);
          }, 2000);
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
    const responseButtons = document.querySelectorAll(".risposta button");
    responseButtons.forEach((button) => {
      button.classList.add(
        button.textContent === question.correct_answer ? "giusta" : "sbagliata"
      );
    });

    if (response === question.correct_answer) {
      correctAnswer++;
    } else {
      wrongAnswer++;
    }
  }

  function displayResults() {
    document.querySelector(".benchmark").remove();
    let template = document.querySelector("#template-results");
    let clone = template.content.cloneNode(true);
    document.body.appendChild(clone);

    document.querySelector(".percentualeCorrette").textContent = `${(
      (correctAnswer / questions.length) *
      100
    ).toFixed(0)}%`;
    document.querySelector(".percentualeErrate").textContent = `${(
      (wrongAnswer / questions.length) *
      100
    ).toFixed(0)}%`;
    document.querySelector(
      ".stats .correct .num-questions"
    ).textContent = `${correctAnswer}/${questions.length} questions`;
    document.querySelector(
      ".stats .wrong .num-questions"
    ).textContent = `${wrongAnswer}/${questions.length} questions`;

    initChart();
    displayTestResults();

    document.querySelector(".rate").addEventListener("click", () => {
      document.querySelector(".results").style.display = "none"; // Nasconde i risultati
      displayReview();
    });
  }

  function displayReview() {
    let reviewTemplate = document.querySelector("template.review");
    let clone = reviewTemplate.content.cloneNode(true);
    document.body.appendChild(clone);
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
        legend: { display: false },
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

  function displayTestResults() {
    let congrats = document.querySelector(".congrats");
    let examResult = document.querySelector(".examResult");
    let certificate = document.querySelector(".certificate");
    let testResults = document.querySelector(".testResults");
    if (correctAnswer >= questions.length * 0.6) {
      congrats.textContent = "Congratulations!";
      examResult.textContent = "You passed the exam.";
      certificate.textContent =
        "We'll send you the certificate in a few minutes. Check your email (including promotions/spam folder).";
      testResults.classList.add("happy");
    } else {
      congrats.textContent = "We are sorry.";
      examResult.textContent = "You haven't passed the exam.";
      certificate.textContent = "Please try again.";
      testResults.classList.add("sad");
    }
  }

  function endQuiz() {
    displayResults();
  }

  bottone.addEventListener("click", function () {
    if (checkbox.checked) {
      fetchQuestion();
    } else {
      error.classList.add("error-red");
    }
  });
});
