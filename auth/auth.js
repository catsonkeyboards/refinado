// auth.js

// Your Spotify API credentials
const clientId = "9fdba1a5111447ebad9b2213859f814a";
const redirectUri = "http://127.0.0.1:5500/redirect.html";
const scopes = "user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public"; // Add other scopes as needed

// Function to open the Spotify login window
function openSpotifyLogin() {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
  const authWindow = window.open(authUrl, "Spotify Auth", "width=400,height=500");
}

// Function to handle the received access token
function handleAccessToken(accessToken) {
  // Store the access token or pass it to other parts of your app
  localStorage.setItem("spotifyAccessToken", accessToken);
  console.log('Access Token:', accessToken);
  // You can now redirect to your main app page
  window.location.href = "http://127.0.0.1:5500/index.html";
}

// Listen for the access token message from the redirect window
window.addEventListener("message", function (event) {
  if (event.data.access_token) {
    handleAccessToken(event.data.access_token);
  }
});

// Attach the openSpotifyLogin function to your login buttons
document.addEventListener("DOMContentLoaded", function () {
  const loginButtons = document.querySelectorAll(".login-button, .spotify-login");
  loginButtons.forEach((button) => {
    button.addEventListener("click", openSpotifyLogin);
  });
});

function logout() {
  // Clear the stored access token
  localStorage.removeItem('spotifyAccessToken');

  
  // Redirect to home.html
  window.location.href = 'home.html';
}

document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", function() {
    logout(); // This function is defined in auth.js
  });
});
