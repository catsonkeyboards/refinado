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
import { showDuplicates } from "./duplicates.js";

let allPlaylists = [];
let currentPlaylistId = null;
let currentTracks = [];
let originalTracks = [];
let originalDuplicates = []; // Declare this variable
let currentSortOrder = "custom";
let controller = new AbortController();

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

    // Remove 'selected' class from the currently selected playlist
    const currentlySelected = document.querySelector(".playlist-item.selected");
    if (currentlySelected) {
      currentlySelected.classList.remove("selected");
    }

    // Abort any ongoing fetch and create a new AbortController
    controller.abort();
    controller = new AbortController();
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
  originalTracks = [...tracks]; // Save the original order
  const detailsDiv = document.getElementById("playlist-details");
  detailsDiv.innerHTML = `
    <a href="${
      playlist.external_urls.spotify
    }" target="_blank" class="playlist-link" title="Open in Spotify">
      <img src="${playlist.images[0]?.url || "default_image_url"}" alt="${
    playlist.name
  } artwork" class="playlist-artwork">
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
      <select id="sort-by">
  <option value="custom">Custom Order</option>
  <option value="title">Title</option>
  <option value="artist">Artist</option>
</select>
    </div>
  `;

  // Scroll to the top of the content element
  const contentElement = document.getElementById("content");
  contentElement.scrollTop = 0;

  // Add event listener for the toggle switch
  const toggleSwitch = document.getElementById("switch");
  toggleSwitch.addEventListener("change", function () {
    if (this.checked) {
      const duplicates = showDuplicates(currentTracks, currentSortOrder);
      originalDuplicates = [...duplicates]; // Store the original duplicates
      populateTracks(duplicates, currentSortOrder);
    } else {
      populateTracks(currentTracks, currentSortOrder);
    }
  });

  const sortBySelect = document.getElementById("sort-by");
  if (sortBySelect) {
    sortBySelect.addEventListener("change", function () {
      currentSortOrder = this.value;

      if (toggleSwitch.checked) {
        // If "Show Duplicates" is on, sort the duplicates
        const duplicates = showDuplicates(currentTracks, currentSortOrder);
        populateTracks(duplicates, currentSortOrder);
      } else {
        // Otherwise, sort all tracks
        populateTracks(currentTracks, currentSortOrder);
      }
    });
  }
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
function populateTracks(tracks, sortOrder) {
  const toggleSwitch = document.getElementById("switch"); // Define toggleSwitch here
  if (sortOrder === "custom") {
    if (toggleSwitch.checked) {
      tracks = originalDuplicates;
    } else {
      tracks = originalTracks;
    }
  }

  // Sort tracks based on sortOrder
  if (sortOrder === "title") {
    tracks.sort((a, b) => a.track.name.localeCompare(b.track.name));
  } else if (sortOrder === "artist") {
    tracks.sort((a, b) =>
      a.track.artists[0].name.localeCompare(b.track.artists[0].name)
    );
  }
  // No need to sort for 'custom' as it will keep the original order
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = ""; // Clear existing content

  tracks.forEach((track, index) => {
    // Check if album images exist, if not use a default image
    const artworkURL =
      track.track.album.images?.[0]?.url ||
      "https://files.radio.co/humorous-skink/staging/default-artwork.png";
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
    const playlistId =
      event.target.closest(".playlist-item").dataset.playlistId;

    // Remove 'selected' class from the previously selected playlist
    const previouslySelected = document.querySelector(".playlist-item.selected");
    if (previouslySelected) {
      previouslySelected.classList.remove("selected");
    }

    // Add 'selected' class to the newly clicked playlist
    event.target.closest(".playlist-item").classList.add("selected");

      const accessToken = localStorage.getItem("spotifyAccessToken");

    // Abort any ongoing fetch and create a new AbortController
    controller.abort();
    controller = new AbortController();

    // Check if the clicked playlist is the same as the currently selected one
    if (playlistId === currentPlaylistId) {
      // Do nothing if it's the same playlist
      return;
    }

    // Update the currentPlaylistId
    currentPlaylistId = playlistId;

    // Clear existing tracks and details
    const contentDiv = document.getElementById("content");
    const detailsDiv = document.getElementById("playlist-details");
    contentDiv.innerHTML = "";
    detailsDiv.innerHTML = "";

    // Show loading lines
    const loadingLineForDetails = document.createElement("div");
    loadingLineForDetails.className = "loading-line";
    detailsDiv.appendChild(loadingLineForDetails);

    // Add multiple loading lines for tracks
    const numberOfLoadingLines = 10; // Adjust this number as needed
    for (let i = 0; i < numberOfLoadingLines; i++) {
      const loadingLineForTracks = document.createElement("div");
      loadingLineForTracks.className = "loading-line track-loading-line"; // Added a new class for track-specific styling
      contentDiv.appendChild(loadingLineForTracks);
    }

    try {
      // Fetch tracks and populate details
      const [tracks] = await Promise.all([
        fetchPlaylistTracks(accessToken, playlistId, controller.signal),
      ]);

      // Hide loading lines
      loadingLineForDetails.remove();
      document
        .querySelectorAll(".track-loading-line")
        .forEach((line) => line.remove());

      currentTracks = tracks;

      // Find the clicked playlist object using the playlistId
      const playlist = allPlaylists.find((pl) => pl.id === playlistId);

      if (playlist && tracks) {
        populatePlaylistDetails(playlist, tracks);
        populateTracks(tracks, "custom");
      } else {
        console.error("Playlist or tracks are missing");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  }
});
