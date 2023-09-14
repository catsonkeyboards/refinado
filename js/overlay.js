// overlay.js

document.addEventListener('DOMContentLoaded', function() {
  const privacyBtn = document.querySelector('.footer-links a[href="#"]');
  const closeBtn = document.getElementById('close-privacy');
  const overlay = document.getElementById('privacy-overlay');
  const loginButton = document.querySelector('.login-button');
  const spotifyLoginButton = document.querySelector('.spotify-login');

  //Error Handling

  if (!privacyBtn || !closeBtn || !overlay || !loginButton || !spotifyLoginButton) {
    console.error("One or more elements are missing from the DOM.");
    return;
  }
  
  // Function to show the privacy policy
  function showPrivacyPolicy() {
    overlay.classList.add('show');
    overlay.style.display = 'block';
  }

  // Function to hide the privacy policy
  function hidePrivacyPolicy() {
    overlay.classList.remove('show');
    overlay.style.display = 'none';
  }

  if (privacyBtn) {
    privacyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showPrivacyPolicy();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      hidePrivacyPolicy();
    });
  }

  // Hover Effects for Login Buttons

  function addHoverEffect() {
    loginButton.classList.add('hover-effect');
    spotifyLoginButton.classList.add('hover-effect');
  }

  function removeHoverEffect() {
    loginButton.classList.remove('hover-effect');
    spotifyLoginButton.classList.remove('hover-effect');
  }

  if (loginButton) {
    loginButton.addEventListener('mouseover', addHoverEffect);
    loginButton.addEventListener('mouseout', removeHoverEffect);
  }

  if (spotifyLoginButton) {
    spotifyLoginButton.addEventListener('mouseover', addHoverEffect);
    spotifyLoginButton.addEventListener('mouseout', removeHoverEffect);
  }
});
