document.addEventListener("DOMContentLoaded", function () {
  const newCardButton = document.getElementById("newCardButton");
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const answerElement = document.getElementById("answer");

  let sessionToken = null;
  let correctAnswerIndex = null;

  newCardButton.addEventListener("click", getNewQuestion);

  function getSessionToken() {
    fetch("https://opentdb.com/api_token.php?command=request")
      .then((response) => response.json())
      .then((data) => {
        sessionToken = data.token;
      })
      .catch((error) => console.error("Error fetching session token:", error));
  }

  function resetSessionToken() {
    fetch(
      `https://opentdb.com/api_token.php?command=reset&token=${sessionToken}`
    )
      .then(() => {
        sessionToken = null;
        getSessionToken();
      })
      .catch((error) => console.error("Error resetting session token:", error));
  }

  function getNewQuestion() {
    if (!sessionToken) {
      getSessionToken();
      return;
    }

    const apiUrl = `https://opentdb.com/api.php?amount=1&category=18&difficulty=medium&type=multiple&token=${sessionToken}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const questionData = data.results[0];
        const question = decodeURIComponent(questionData.question);
        const correctAnswer = decodeURIComponent(questionData.correct_answer);

        if (questionData.type === "multiple") {
          const options = questionData.incorrect_answers.map((option) =>
            decodeURIComponent(option)
          );
          correctAnswerIndex = Math.floor(Math.random() * (options.length + 1));
          options.splice(correctAnswerIndex, 0, correctAnswer);

          questionElement.innerHTML = `<strong>Question:</strong> ${question}`;
          answerElement.innerHTML = "";
          optionsElement.innerHTML = options
            .map(
              (option, index) =>
                `<button onclick="checkAnswer(${index})">${option}</button>`
            )
            .join(" ");
        } else {
          questionElement.innerHTML = `<strong>Question:</strong> ${question}`;
          answerElement.innerHTML = `<strong>Answer:</strong> ${correctAnswer}`;
          optionsElement.innerHTML = "";
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  function checkAnswer(index) {
    if (index === correctAnswerIndex) {
      answerElement.innerHTML = "<strong>Your Answer is Correct!</strong>";
    } else {
      answerElement.innerHTML = "<strong>Incorrect Answer. Try Again!</strong>";
    }
    resetSessionToken();
  }

  window.checkAnswer = checkAnswer;
});
