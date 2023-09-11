// auth.js

import { openSpotifyLogin, handleAccessToken, fetchUserProfile, logout } from './authModule.js';

const accessToken = localStorage.getItem("spotifyAccessToken");
console.log("Access Token:", accessToken);

// Listen for the access token message from the redirect window
window.addEventListener("message", function (event) {
  if (event.data.access_token) {
    handleAccessToken(event.data.access_token);
  }
});

// Attach the openSpotifyLogin function to your login buttons
document.addEventListener("DOMContentLoaded", function () {
  const loginButtons = document.querySelectorAll(
    ".login-button, .spotify-login"
  );
  loginButtons.forEach((button) => {
    button.addEventListener("click", openSpotifyLogin);
  });
});

// Conditional before adding event listener to Logout button in App page
document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      logout(); // This function is defined in auth.js
    });
  }
});
