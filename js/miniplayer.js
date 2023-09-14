// miniplayer.js

document.addEventListener("DOMContentLoaded", function () {
  const playPauseButton = document.getElementById("play-pause-button");
  const playIcon = document.getElementById("play-icon");
  const pauseIcon = document.getElementById("pause-icon");

  // Initially hide the pause icon
  pauseIcon.classList.add("hide");

  playPauseButton.addEventListener("click", function () {
    console.log("Button clicked");
    playIcon.classList.toggle("hide");
    pauseIcon.classList.toggle("hide");
  });
});
