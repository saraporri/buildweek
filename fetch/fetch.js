fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy")
  .then((response) => response.json())
  .then((data) => {
    // Manipolazione del DOM basata sui dati ottenuti
    data.results.forEach((item) => {
      const element = document.createElement("h3");
      element.innerText = item.question;
      document.querySelector(".domanda").appendChild(element);
    });
  })
  .catch((error) => {
    console.error("Si è verificato un errore:", error);
  });
