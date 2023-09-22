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

let allPlaylists;
let playlistSection;
let originalPlaylistsOrder = [];
let currentPlaylistId = null;
let currentTracks = [];
let originalTracks = [];
let originalDuplicates = [];
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

  async function initializePage() {
    const accessToken = localStorage.getItem("spotifyAccessToken");

    // Show loading indicator
    document.getElementById("loading").style.display = "block";

    allPlaylists = await fetchAllUserPlaylists(accessToken);
    console.log("Fetched Playlists:", allPlaylists);
    originalPlaylistsOrder = [...allPlaylists]; // Store the original order

    // Hide loading indicator
    document.getElementById("loading").style.display = "none";

    // Display the fetched playlists
    displayPlaylists(allPlaylists);
    setupPlaylistSortOptions();

    const playlistSection = document.getElementById("playlist-section");
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
      const currentlySelected = document.querySelector(
        ".playlist-item.selected"
      );
      if (currentlySelected) {
        currentlySelected.classList.remove("selected");
      }

      // Abort any ongoing fetch and create a new AbortController
      controller.abort();
      controller = new AbortController();
    });
  }

  initializePage();
});

// Function for setting up Playlist Sort Options
function setupPlaylistSortOptions() {
  const playlistSortOptions = document.getElementById("playlist-options");
  if (playlistSortOptions) {
      Array.from(playlistSortOptions.getElementsByClassName("option")).forEach((option) => {
          option.addEventListener("click", function () {
              console.log("Playlist sort option clicked:", this.getAttribute("data-value"));
              const selectedSortOrder = this.getAttribute("data-value");
              const sortedPlaylists = sortPlaylists(selectedSortOrder, allPlaylists);
              displayPlaylists(sortedPlaylists);
          });
      });
  } else {
      console.error("playlistSortOptions element not found");
  }
}

// Function for setting up Tracks Sort Options
function setupTrackSortOptions() {
  const trackSortOptions = document.getElementById("track-selected-options");
  if (trackSortOptions) {
      Array.from(trackSortOptions.getElementsByClassName("option")).forEach((option) => {
          option.addEventListener("click", function () {
              console.log("Track sort option clicked:", this.getAttribute("data-value"));
              const selectedSortOrder = this.getAttribute("data-value");
              const sortedTracks = sortTracks(selectedSortOrder, currentTracks);
populateTracks(sortedTracks, selectedSortOrder);
          });
      });
  } else {
      console.error("TrackSortOptions element not found");
  }
}

// Function for sorting tracks
function sortTracks(option, tracks) {
  // Implement your track sorting logic here
  // For now, just returning the tracks as they are
  return tracks;
}

// Function for setting up the dropdown
function setupDropdown(selectedOptionId, optionsId, optionClass) {
  const selectedOption = document.getElementById(selectedOptionId);
  const options = document.getElementById(optionsId);

  if (selectedOption && options) {
    const arrow = selectedOption.querySelector(".arrow");
    selectedOption.addEventListener("click", function () {
      options.style.display =
        options.style.display === "block" ? "none" : "block";
      arrow.innerHTML =
        options.style.display === "block" ? "&#9650;" : "&#9660;"; // Toggle arrow
    });

    Array.from(options.getElementsByClassName(optionClass)).forEach(
      (option) => {
        option.addEventListener("click", function () {
          selectedOption.innerHTML = `<span class="arrow">&#9660;</span>${this.textContent}`;
          options.style.display = "none";
        });
      }
    );

    // Close the dropdown when clicking outside of it
    document.addEventListener("click", function (event) {
      if (
        !selectedOption.contains(event.target) &&
        !options.contains(event.target)
      ) {
        options.style.display = "none";
      }
    });
  } else {
    console.error("Elements not found");
  }
}

// Function for displaying the Playlists that are fetched
function displayPlaylists(playlists) {
  console.log(
    "Displaying playlists:",
    playlists.map((p) => p.name)
  ); // Log the names of the playlists to be displayed

  playlistSection = document.getElementById("playlist-section");
  let html = "";
  playlists.forEach((playlist) => {
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
}

// Function for Sorting Playlists
function sortPlaylists(option, playlists) {
  console.log("Sorting by:", option);
  if (option === "recent") {
    return [...originalPlaylistsOrder];
  } else if (option === "alphabetical") {
    const sorted = [...playlists].sort((a, b) => a.name.localeCompare(b.name));
    console.log(
      "Sorted playlists:",
      sorted.map((p) => p.name)
    ); // Add this line
    return sorted;
  }
  return playlists;
}

// Event listener for playlist clicks
document.addEventListener("click", async function (event) {
  if (event.target.closest(".playlist-item")) {
    const playlistId =
      event.target.closest(".playlist-item").dataset.playlistId;

    // Remove 'selected' class from the previously selected playlist
    const previouslySelected = document.querySelector(
      ".playlist-item.selected"
    );
    if (previouslySelected) {
      previouslySelected.classList.remove("selected");
    }

    // Add 'selected' class to the newly clicked playlist
    event.target.closest(".playlist-item").classList.add("selected");

    // Retrieve the access token from local storage
    const accessToken = localStorage.getItem("spotifyAccessToken");

    // Check if the access token exists
    if (!accessToken) {
      console.error("Access token not found!");
      return; // Exit the function if no access token is found
    }
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
        <h2 title="Open in Spotify">${playlist.name}</h2>
        <p>${tracks.length} tracks</p>
        <p>Total length: ${calculatePlaylistLength(tracks)}</p>
        <div class="custom-dropdown">
            <div class="selected-option" id="track-selected-option">
                <span class="arrow">&#9660;</span>Custom Order
            </div>
            <div class="options" id="track-options">
                <div class="option" data-value="custom">Custom Order</div>
                <div class="option" data-value="title">Title</div>
                <div class="option" data-value="artist">Artist</div>
            </div>
        </div>
        <div class="toggle-switch-wrapper">
            <div class="my-toggle-switch">
                <input type="checkbox" id="show-duplicates-switch" />
                <label for="show-duplicates-switch"></label>
                <span class="toggle-text">Show Duplicates</span>
            </div>
            <div class="my-toggle-switch">
                <input type="checkbox" id="cross-duplicates-switch" />
                <label for="cross-duplicates-switch"></label>
                <span class="toggle-text">Cross-Duplicates</span>
            </div>
        </div>
    </div>
`;

  // Scroll to the top of the content element
  const contentElement = document.getElementById("content");
  contentElement.scrollTop = 0;

  // Event listener for dropdown
  setupDropdown("track-selected-option", "track-options", "option");

  // Add event listener for the 'Show Duplicates' toggle switch
  const showDuplicatesSwitch = document.getElementById(
    "show-duplicates-switch"
  );
  if (showDuplicatesSwitch) {
    showDuplicatesSwitch.addEventListener("change", function () {
      if (this.checked) {
        const duplicates = showDuplicates(currentTracks, currentSortOrder);
        originalDuplicates = [...duplicates]; // Store the original duplicates
        populateTracks(duplicates, currentSortOrder);
      } else {
        populateTracks(currentTracks, currentSortOrder);
      }
    });
  } else {
    console.error("Show Duplicates switch not found");
  }

  // Add event listener for the 'Cross-Duplicates' toggle switch
  const crossDuplicatesSwitch = document.getElementById(
    "cross-duplicates-switch"
  );
  if (crossDuplicatesSwitch) {
    crossDuplicatesSwitch.addEventListener("change", function () {
      if (this.checked) {
        // Code to handle when 'Cross-Duplicates' is turned ON
      } else {
        // Code to handle when 'Cross-Duplicates' is turned OFF
      }
    });
  } else {
    console.error("Cross Duplicates switch not found");
  }

  setupTrackSortOptions();
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
  const toggleSwitch = document.getElementById("show-duplicates-switch");
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
