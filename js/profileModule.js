// profileModule.js

import { fetchUserProfile } from './authModule.js';

export async function updateUserProfilePicture() {
    // Only proceed if a user is logged in
    const accessToken = localStorage.getItem("spotifyAccessToken");
    if (!accessToken) return;
  
    const data = await fetchUserProfile();
    const userProfile = document.getElementById("user-profile");
    
    // Create a new image element or get the existing one
    let newImg = document.getElementById("user-profile-pic") || document.createElement("img");
    newImg.id = "user-profile-pic";
    newImg.src = data ? (data.images[0]?.url || 'path/to/default/image.png') : 'path/to/default/image.png';
  
    // Remove the existing Material Icon if it exists
    const oldIcon = document.getElementById("user-profile-icon");
    if (oldIcon && userProfile.contains(oldIcon)) {
      userProfile.removeChild(oldIcon);
    }
  
    // Add or update the image
    if (!document.getElementById("user-profile-pic")) {
      userProfile.insertBefore(newImg, userProfile.firstChild);
    }
  }

export function toggleDropdown(event) {
  // Function to toggle the profile dropdown
  const userProfile = document.getElementById("user-profile");
  const profileDropdown = document.getElementById("profile-dropdown");

  if (
    userProfile &&
    profileDropdown &&
    (event.target === userProfile || userProfile.contains(event.target))
  ) {
    profileDropdown.style.display =
      profileDropdown.style.display === "block" ? "none" : "block";
  } else if (profileDropdown) {
    profileDropdown.style.display = "none";
  }
}
