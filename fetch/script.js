const url = "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard";

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  })
  .then((data) => {
    console.log(data.results);
  })
  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });

console.log(data.results);
