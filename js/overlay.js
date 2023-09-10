// Add this to your JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const privacyBtn = document.querySelector('.footer-links a[href="#"]');
    const closeBtn = document.getElementById('close-privacy');
    const overlay = document.getElementById('privacy-overlay');
  
    // Function to show the privacy policy
    function showPrivacyPolicy() {
      console.log("Showing privacy policy..."); // Log to console
      overlay.classList.add('show'); // Add the 'show' class to make it visible
      overlay.style.display = 'block';
      console.log("Privacy policy should now be visible."); // Log to console
    }
  
    // Function to hide the privacy policy
    function hidePrivacyPolicy() {
      console.log("Hiding privacy policy..."); // Log to console
      overlay.classList.remove('show'); // Remove the 'show' class to hide it
      overlay.style.display = 'none';
      console.log("Privacy policy should now be hidden."); // Log to console
    }
  
    privacyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showPrivacyPolicy();
    });
  
    closeBtn.addEventListener('click', function() {
      hidePrivacyPolicy();
    });
  });

  
// Hover effect for Login Buttons in the Home Page

document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.querySelector('.login-button');
    const spotifyLoginButton = document.querySelector('.spotify-login');
  
    function addHoverEffect() {
      loginButton.classList.add('hover-effect');
      spotifyLoginButton.classList.add('hover-effect');
    }
  
    function removeHoverEffect() {
      loginButton.classList.remove('hover-effect');
      spotifyLoginButton.classList.remove('hover-effect');
    }
  
    loginButton.addEventListener('mouseover', addHoverEffect);
    loginButton.addEventListener('mouseout', removeHoverEffect);
    spotifyLoginButton.addEventListener('mouseover', addHoverEffect);
    spotifyLoginButton.addEventListener('mouseout', removeHoverEffect);
  });
  