let timer;
let minutes = 25;
let seconds = 0;
let isRunning = false;

function startTimer() {
  isRunning = true;
  timer = setInterval(updateTimer, 1000);
  updateButton("Pause", pauseTimer);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timer);
  updateButton("Resume", resumeTimer);
}

function resumeTimer() {
  isRunning = true;
  timer = setInterval(updateTimer, 1000);
  updateButton("Pause", pauseTimer);
}

function resetTimer() {
  isRunning = false;
  clearInterval(timer);
  minutes = 25;
  seconds = 0;
  document.getElementById("timer").innerText = formatTime(minutes, seconds);
  updateButton("Start", startTimer);
}

function updateTimer() {
  if (minutes === 0 && seconds === 0) {
    clearInterval(timer);
    isRunning = false;
    alert("Pomodoro completed!");
    resetTimer();
    return;
  }
  if (seconds === 0) {
    minutes--;
    seconds = 59;
  } else {
    seconds--;
  }
  document.getElementById("timer").innerText = formatTime(minutes, seconds);
}

function updateButton(text, callback) {
  document.getElementById("startButton").innerText = text;
  document
    .getElementById("startButton")
    .removeEventListener("click", startTimer);
  document
    .getElementById("startButton")
    .removeEventListener("click", resumeTimer);
  document
    .getElementById("startButton")
    .removeEventListener("click", pauseTimer);
  document.getElementById("startButton").addEventListener("click", callback);
}

function formatTime(minutes, seconds) {
  const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
  const displaySeconds = seconds < 10 ? "0" + seconds : seconds;
  return `${displayMinutes}:${displaySeconds}`;
}

document.getElementById("startButton").addEventListener("click", startTimer);
document.getElementById("resetButton").addEventListener("click", resetTimer);
