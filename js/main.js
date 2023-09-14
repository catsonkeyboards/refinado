// main.js

import {
  clientId,
  openSpotifyLogin,
  handleAccessToken,
  fetchUserProfile,
  logout,
} from "./authModule.js";
import { updateUserProfilePicture, toggleDropdown } from "./profileModule.js";
import { fetchAllUserPlaylists, fetchPlaylistTracks } from "./spotifyAPI.js";

let allPlaylists = [];

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

  // Attach event listener for login buttons
  const loginButtons = document.querySelectorAll(
    ".login-button, .spotify-login"
  );
  loginButtons.forEach((button) => {
    button.addEventListener("click", openSpotifyLogin);
  });

  // Attach event listener for logout button
  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  // Add event listener for the "Home" button
  const homeButton = document.getElementById("home-item");
  if (homeButton) {
    homeButton.addEventListener("click", function () {
      // Clear playlist details
      const detailsDiv = document.getElementById("playlist-details");
      detailsDiv.innerHTML = "";

      // Clear tracks
      const contentDiv = document.getElementById("content");
      contentDiv.innerHTML = "";
    });
  }
});

// Fetch All User Playlists
document.addEventListener("DOMContentLoaded", async function () {
  const accessToken = localStorage.getItem("spotifyAccessToken");

  // Show loading indicator
  document.getElementById("loading").style.display = "block";

  allPlaylists = await fetchAllUserPlaylists(accessToken);

  // Hide loading indicator
  document.getElementById("loading").style.display = "none";

  const playlistSection = document.getElementById("playlist-section");
  let html = "";
  allPlaylists.forEach((playlist) => {
    html += `
    <div class="playlist-item" data-playlist-id="${playlist.id}">
    <img src="${
      playlist.images[0]?.url ||
      "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2"
    }" alt="${playlist.name} artwork" class="playlist-artwork">
        <div>
          <label>${playlist.name}</label>
          <small>(${playlist.tracks.total} tracks)</small>
        </div>
      </div>`;
  });
  playlistSection.innerHTML = html;
});


// Function to populate the playlist details
function populatePlaylistDetails(playlist, tracks) {
  const detailsDiv = document.getElementById("playlist-details");
  detailsDiv.innerHTML = `
    <a href="${playlist.external_urls.spotify}" target="_blank" class="playlist-link" title="Open in Spotify">
      <img src="${playlist.images[0]?.url || "default_image_url"}" alt="${playlist.name} artwork" class="playlist-artwork">
    </a>
    <div class="playlist-details">
      <div class="my-toggle-switch">
        <input type="checkbox" id="switch" />
        <label for="switch"></label>
        <span class="toggle-text">Show Duplicates</span>
      </div>
      <h2 title="Open in Spotify">${playlist.name}</h2>
      <p>${tracks.length} tracks</p>
      <p>Total length: ${calculatePlaylistLength(tracks)}</p>
    </div>
  `;
  
  // Scroll to the top of the content element
  const contentElement = document.getElementById("content");
  contentElement.scrollTop = 0;
}

// Function to calculate the total length of the playlist
function calculatePlaylistLength(tracks) {
  let totalMilliseconds = 0;
  tracks.forEach((track) => {
    totalMilliseconds += track.track.duration_ms;
  });

  const totalMinutes = Math.floor(totalMilliseconds / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return `${totalHours} hr ${remainingMinutes} min`;
}

// Function to populate the tracks in the main content area
function populateTracks(tracks) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = ""; // Clear existing content

  tracks.forEach((track, index) => {
    // Check if album images exist, if not use a default image
    const artworkURL = track.track.album.images?.[0]?.url || 'https://files.radio.co/humorous-skink/staging/default-artwork.png';
    const trackDiv = document.createElement("div");
    trackDiv.className = "track-item";
    trackDiv.innerHTML = `
    <div class="track-number">${index + 1}</div>
    <img src="${artworkURL}" alt="${track.track.name}" class="track-artwork">
    <div>
      <label>${track.track.name}</label>
      <small>${track.track.artists[0].name}</small>
    </div>
  `;
    contentDiv.appendChild(trackDiv);
  });
}

// Event listener for playlist clicks
document.addEventListener("click", async function (event) {
  if (event.target.closest(".playlist-item")) {
    const playlistId = event.target.closest(".playlist-item").dataset.playlistId;
    const accessToken = localStorage.getItem("spotifyAccessToken");

    // Clear existing tracks
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    // Show loading indicator for tracks
    const trackLoadingIndicator = document.getElementById('track-loading');
    if (trackLoadingIndicator) {  // Check if the element exists
      trackLoadingIndicator.style.display = 'block';
    } else {
      console.error("Track loading indicator element not found.");
    }

    // Fetch tracks and populate details
    const [tracks] = await Promise.all([
      fetchPlaylistTracks(accessToken, playlistId)
    ]);

    // Hide loading indicator for tracks
    if (trackLoadingIndicator) {  // Check if the element exists
      trackLoadingIndicator.style.display = 'none';
    }

    // Find the clicked playlist object using the playlistId
    const playlist = allPlaylists.find(pl => pl.id === playlistId);

    if (playlist && tracks) {
      populatePlaylistDetails(playlist, tracks);
      populateTracks(tracks);
    } else {
      console.error("Playlist or tracks are missing");
    }
  }
});