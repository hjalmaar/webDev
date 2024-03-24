
function logoutAndRedirect() {
    // Remove the token from localStorage
    localStorage.removeItem('authToken');
    
    // Redirect to the starting page or login page
    window.location.href = '/index';
  }
  
  // Check if the logout link exists before adding the event listener
  const logoutLink = document.querySelector('.logout a');
  if (logoutLink) {
    logoutLink.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the link from navigating
      logoutAndRedirect();
    });
  } else {
    console.error("Logout link not found. Make sure the class is correct and the DOM is fully loaded.");
  }
  
  
  