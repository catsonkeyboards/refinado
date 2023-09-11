// authModule.js

export const clientId = "9fdba1a5111447ebad9b2213859f814a";
export const redirectUri = "http://127.0.0.1:5500/redirect.html";
export const scopes =
  "user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public";

export function openSpotifyLogin() {
  // Function to open the Spotify login window
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes)}&response_type=token`;
  const authWindow = window.open(
    authUrl,
    "Spotify Auth",
    "width=400,height=500"
  );
}

export function handleAccessToken(accessToken) {
  // Function to handle the received access token
  // Store the access token or pass it to other parts of your app
  localStorage.setItem("spotifyAccessToken", accessToken);
  console.log("Access Token:", accessToken);
  // You can now redirect to your main app page
  window.location.href = "http://127.0.0.1:5500/index.html";
}

export function logout() {
  // Clear the stored access token
  localStorage.removeItem("spotifyAccessToken");

  // Redirect to home.html
  window.location.href = "home.html";
}

export async function fetchUserProfile() {
  const accessToken = localStorage.getItem("spotifyAccessToken");

  // Check if the token exists
  if (!accessToken) {
    // Handle UI when not logged in, if needed
    return;
  }

  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    // Token has expired, redirect to home.html
    localStorage.removeItem("spotifyAccessToken"); // Remove the expired token
    window.location.href = "home.html";
    return;
  }

  const data = await response.json();
  return data;
}
