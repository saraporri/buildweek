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
const apiUrl =
  "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy";

const fetchQuestion = async () => {
  // return fetch(apiUrl)
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Errore nella richiesta!");
  //     }

  //     return response.json();
  //   })
  return {
    response_code: 0,
    results: [
      {
        type: "multiple",
        difficulty: "easy",
        category: "Science: Computers",
        question:
          "The numbering system with a radix of 16 is more commonly referred to as ",
        correct_answer: "Hexidecimal",
        incorrect_answers: ["Binary", "Duodecimal", "Octal"],
      },
      {
        type: "multiple",
        difficulty: "easy",
        category: "Science: Computers",
        question:
          "In any programming language, what is the most common way to iterate through an array?",
        correct_answer: "&#039;For&#039; loops",
        incorrect_answers: [
          "&#039;If&#039; Statements",
          "&#039;Do-while&#039; loops",
          "&#039;While&#039; loops",
        ],
      },
      {
        type: "boolean",
        difficulty: "easy",
        category: "Science: Computers",
        question:
          "The Python programming language gets its name from the British comedy group &quot;Monty Python.&quot;",
        correct_answer: "True",
        incorrect_answers: ["False"],
      },
      {
        type: "multiple",
        difficulty: "easy",
        category: "Science: Computers",
        question: "HTML is what type of language?",
        correct_answer: "Markup Language",
        incorrect_answers: [
          "Macro Language",
          "Programming Language",
          "Scripting Language",
        ],
      },
      {
        type: "multiple",
        difficulty: "easy",
        category: "Science: Computers",
        question:
          "What is the most preferred image format used for logos in the Wikimedia database?",
        correct_answer: ".svg",
        incorrect_answers: [".png", ".jpeg", ".gif"],
      },
      {
        type: "boolean",
        difficulty: "easy",
        category: "Science: Computers",
        question:
          "The programming language &quot;Python&quot; is based off a modified version of &quot;JavaScript&quot;.",
        correct_answer: "False",
        incorrect_answers: ["True"],
      },
      {
        type: "multiple",
        difficulty: "easy",
        category: "Science: Computers",
        question: "How many kilobytes in one gigabyte (in decimal)?",
        correct_answer: "1000000",
        incorrect_answers: ["1024", "1000", "1048576"],
      },
      {
        type: "multiple",
        difficulty: "easy",
        category: "Science: Computers",
        question: "In computing, what does LAN stand for?",
        correct_answer: "Local Area Network",
        incorrect_answers: [
          "Long Antenna Node",
          "Light Access Node",
          "Land Address Navigation",
        ],
      },
      {
        type: "multiple",
        difficulty: "easy",
        category: "Science: Computers",
        question:
          "When Gmail first launched, how much storage did it provide for your email?",
        correct_answer: "1GB",
        incorrect_answers: ["512MB", "5GB", "Unlimited"],
      },
      {
        type: "multiple",
        difficulty: "easy",
        category: "Science: Computers",
        question: "This mobile OS held the largest market share in 2012.",
        correct_answer: "iOS",
        incorrect_answers: ["Android", "BlackBerry", "Symbian"],
      },
    ],
  };
};



function displayQuestion(question) {
  let questionElement = document.querySelector("#questionHeader");
  if (questionElement == null) {
    questionElement = document.createElement("h3");
    questionElement.id = "questionHeader";
    document.querySelector(".domanda").appendChild(questionElement);
  }
  questionElement.textContent = question.question;

  const responses = [question.correct_answer,...question.incorrect_answers];
  const responseContainer = document.querySelector(".risposta");
  responseContainer.innerHTML = "";

  let correctAnswer = 0
  let wrongAnswer = 0 
  responses.forEach((response) => {
    const button = document.createElement("button");

    button.innerText = response;
    button.classList.add("box", "box1");
    button.onclick = () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        displayQuestion(questions[currentQuestionIndex]);
        if(button.innerText == question.correct_answer){
          correctAnswer += 1
        }
        else {
          wrongAnswer += 1
        }
      } else {
        console.log("Hai completato tutte le domande!");
      }
    };
    responseContainer.appendChild(button);
  });

  const domandeTotali = questions.length;
  document.querySelector(".numero-domande").textContent = `Domanda ${
    currentQuestionIndex + 1
  }/${domandeTotali}`;
}

fetchQuestion()
  .then((response) => {
    if (response.results.length !== 0) {
      questions = response.results;
      displayQuestion(questions[currentQuestionIndex]);
    }
  })
  .catch((error) => {
    alert("error: " + error.message);
  });
