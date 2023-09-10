const accessToken = localStorage.getItem('spotifyAccessToken');
console.log('Access Token:', accessToken);

// Function to fetch user's Spotify profile information
async function fetchUserProfile() {
  const accessToken = localStorage.getItem('spotifyAccessToken');
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const data = await response.json();
  return data;
}

// Function to update the user profile picture
async function updateUserProfilePicture() {
  const data = await fetchUserProfile();
  const userProfile = document.getElementById("user-profile");

  // Create a new image element
  const newImg = document.createElement("img");
  newImg.id = "user-profile-pic";
  newImg.src = data.images[0]?.url || 'path/to/default/image.png'; // Fallback to default image
  newImg.style.width = "40px";
  newImg.style.height = "40px";
  newImg.style.borderRadius = "50%";
  newImg.style.objectFit = "cover";

  // Remove the existing Material Icon if it exists
  const oldIcon = document.getElementById("user-profile-icon");
  if (oldIcon && userProfile.contains(oldIcon)) {
    userProfile.removeChild(oldIcon);
  }

  // Add the new image
  userProfile.appendChild(newImg);
}


function toggleDropdown(event) {
  const userProfile = document.getElementById("user-profile"); // Add this line
  const profileDropdown = document.getElementById("profile-dropdown");
  
  if (event.target === userProfile || userProfile.contains(event.target)) {
    profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
  } else {
    profileDropdown.style.display = "none";
  }
}

// Attach initial event listener
document.addEventListener("click", toggleDropdown);

// Call the function to update the user profile picture
updateUserProfilePicture();
