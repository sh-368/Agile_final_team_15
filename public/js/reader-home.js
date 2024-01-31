// Function to handle the click event for the "Logout" button
$("#logoutButton").on("click", function () {
  // Send a POST request to the logout route
  $.post("/user/logout", function () {
    // Redirect to the login page after successful logout
    window.location.href = "/login";
  });
});
