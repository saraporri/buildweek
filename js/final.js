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
    questionElement.textContent = question.question
      .replaceAll("&quot;", '"')
      .replaceAll("&#039;", "'");
  }

  function startCountdown(question, seconds = 300) {
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

    startCountdown(question, 60);

    const responses = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(responses);

    responses.forEach((response) => {
      const button = document.createElement("button");
      button.textContent = response
        .replaceAll("&quot;", '"')
        .replaceAll("&#039;", "'");
      button.classList.add("box", "box1");
      button.onclick = () => {
        stopCountdown();
        setAnswerResult(button.textContent, question);
        setTimeout(() => {
          if (currentQuestionIndex + 1 < questions.length) {
            currentQuestionIndex++;
            displayQuestion(questions[currentQuestionIndex]);
          }, 2000);
          // displayQuestion(questions[currentQuestionIndex]);
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
    let risposta = document.querySelector(".box");
    if (response == question.correct_answer) {
      risposta.classList.add("giusta");
      correctAnswer += 1;
    } else {
      risposta.classList.add("sbagliata");

      wrongAnswer += 1;
    }
  }

  function displayResults() {
    document.querySelector(".benchmark")?.remove();
    let template = document.querySelector("#template-results");
    let clone = template.content.cloneNode(true);
    document.body.appendChild(clone);

    const percentCorrect = ((correctAnswer / questions.length) * 100).toFixed(
      0
    );
    const percentWrong = ((wrongAnswer / questions.length) * 100).toFixed(0);

    document.querySelector(
      ".percentualeCorrette"
    ).textContent = `${percentCorrect}%`;
    document.querySelector(
      ".percentualeErrate"
    ).textContent = `${percentWrong}%`;
    document.querySelector(
      ".stats .correct .num-questions"
    ).textContent = `${correctAnswer}/${questions.length} questions`;
    document.querySelector(
      ".stats .wrong .num-questions"
    ).textContent = `${wrongAnswer}/${questions.length} questions`;

    initChart();
    displayTestResults();
  }

  function displayReview() {
    let reviewTemplate = document.querySelector("#review-template");
    let clone = reviewTemplate.content.cloneNode(true);
    document.body.appendChild(clone);
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

  function initChart() {
    let ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Correct", "Wrong"],
        datasets: [
          {
            data: [correctAnswer, wrongAnswer],
            backgroundColor: ["#4CAF50", "#f44336"],
            borderColor: ["#ffffff", "#ffffff"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: "top",
        },
        animation: {
          animateScale: true,
          animateRotate: true,
        },
      },
    });
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
