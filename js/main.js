// main.js

import { clientId, openSpotifyLogin, handleAccessToken, fetchUserProfile, logout } from './authModule.js';
import { updateUserProfilePicture, toggleDropdown } from './profileModule.js';
import { fetchUserPlaylists } from './spotifyAPI.js';


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

// Fetch User Playlists

document.addEventListener("DOMContentLoaded", async function() {
  const accessToken = localStorage.getItem("spotifyAccessToken");
  const playlists = await fetchUserPlaylists(accessToken);

  const playlistSection = document.getElementById("playlist-section");
  let html = '';
  playlists.forEach(playlist => {
    html += `
      <div class="playlist-item">
        <img src="${playlist.images[0]?.url || 'https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2'}" alt="${playlist.name} artwork" class="playlist-artwork">
        <label>${playlist.name} (${playlist.tracks.total})</label>
      </div>`;
  });
  playlistSection.innerHTML = html;
});


