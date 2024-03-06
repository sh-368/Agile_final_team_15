let timer;
let minutes = 25;
let seconds = 0;
let isRunning = false;

function startTimer() {
  isRunning = true;
  timer = setInterval(updateTimer, 1000);
  document.getElementById("startButton").innerText = "Pause";
  document
    .getElementById("startButton")
    .removeEventListener("click", startTimer);
  document.getElementById("startButton").addEventListener("click", pauseTimer);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timer);
  document.getElementById("startButton").innerText = "Resume";
  document
    .getElementById("startButton")
    .removeEventListener("click", pauseTimer);
  document.getElementById("startButton").addEventListener("click", resumeTimer);
}

function resumeTimer() {
  isRunning = true;
  timer = setInterval(updateTimer, 1000);
  document.getElementById("startButton").innerText = "Pause";
  document
    .getElementById("startButton")
    .removeEventListener("click", resumeTimer);
  document.getElementById("startButton").addEventListener("click", pauseTimer);
}

function resetTimer() {
  isRunning = false;
  clearInterval(timer);
  minutes = 25;
  seconds = 0;
  document.getElementById("timer").innerText = "25:00";
  document.getElementById("startButton").innerText = "Start";
  document
    .getElementById("startButton")
    .removeEventListener("click", pauseTimer);
  document.getElementById("startButton").addEventListener("click", startTimer);
}

function updateTimer() {
  if (minutes === 0 && seconds === 0) {
    clearInterval(timer);
    isRunning = false;
    alert("Pomodoro completed!");
    return;
  }
  if (seconds === 0) {
    minutes--;
    seconds = 59;
  } else {
    seconds--;
  }
  const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
  const displaySeconds = seconds < 10 ? "0" + seconds : seconds;
  document.getElementById(
    "timer"
  ).innerText = `${displayMinutes}:${displaySeconds}`;
}

document.getElementById("startButton").addEventListener("click", startTimer);
document.getElementById("resetButton").addEventListener("click", resetTimer);
