// main.js

import { clientId, openSpotifyLogin, handleAccessToken, fetchUserProfile, logout } from './authModule.js';
import { updateUserProfilePicture, toggleDropdown } from './profileModule.js';


// Attach event listeners after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Attach event listener for the Open Spotify button
  const openSpotifyButton = document.getElementById("open-spotify-btn");
  if (openSpotifyButton) {
    openSpotifyButton.addEventListener("click", function () {
      window.open("https://open.spotify.com/", "_blank");
    });
  }

  // Attach event listener for toggling the profile dropdown
  document.addEventListener("click", toggleDropdown);

  // Update the user profile picture
  updateUserProfilePicture();
});

document.addEventListener("DOMContentLoaded", function () {
  const loginButtons = document.querySelectorAll(".login-button, .spotify-login");
  loginButtons.forEach((button) => {
    button.addEventListener("click", openSpotifyLogin);
  });

  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
});

