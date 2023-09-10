// Assuming you have the Spotify API response stored in a variable called `data`
const userProfile = document.getElementById("user-profile");

// Function to toggle dropdown
function toggleDropdown(event) {
  const profileDropdown = document.getElementById("profile-dropdown");
  if (event.target === userProfile || userProfile.contains(event.target)) {
    profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
  } else {
    profileDropdown.style.display = "none";
  }
}

// Attach initial event listener
document.addEventListener("click", toggleDropdown);

// Replace the icon with the image from Spotify
const newImg = document.createElement("img");
newImg.id = "user-profile-pic";
newImg.src = data.images[0].url;
newImg.style.width = "40px";
newImg.style.height = "40px";
newImg.style.borderRadius = "50%";
newImg.style.objectFit = "cover";

// Remove the existing Material Icon
const oldIcon = document.getElementById("user-profile-icon");
userProfile.removeChild(oldIcon);

// Add the new image
userProfile.appendChild(newImg);
