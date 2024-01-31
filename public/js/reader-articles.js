// reader-article.js
// Function to handle the "Like" button click event
function handleLikeButtonClick(articleId) {
  // Send a POST request to like the article
  $.ajax({
    method: "POST",
    url: `/reader/like-article/${articleId}`,
    success: function (data) {
      // Update the like count
      const likeCountSpan = document.getElementById(`likeCount-${articleId}`);
      likeCountSpan.textContent = data.likes;

      // Change the button color to grey
      const likeButton = document.getElementById(`likeButton-${articleId}`);
      likeButton.classList.remove("btn-primary");
      likeButton.classList.add("btn-secondary");
      likeButton.disabled = true;

      // Style the like count number
      likeCountSpan.classList.remove("bg-secondary"); // Remove the grey background (if already liked)
      likeCountSpan.classList.add(
        "bg-primary",
        "text-light",
        "px-2",
        "rounded"
      );
    },
    error: function (error) {
      console.error("Error liking article:", error);
    },
  });
}
// Function to handle the click event for the "Logout" button
$("#logoutButton").on("click", function () {
  // Send a POST request to the logout route
  $.post("/user/logout", function () {
    // Redirect to the login page after successful logout
    window.location.href = "/login";
  });
});

// Function to handle the "Save" button click
function handleSaveButtonClick(articleId) {
  // Send an HTTP POST request to the server to save the article
  $.ajax({
    url: `/reader/save-article/${articleId}`,
    type: "POST",
    success: function (data) {
      // Handle the response from the server (if needed)
      console.log("Article saved successfully.");
      // Optionally, you can update the UI to indicate that the article has been saved.
      // For example, you can disable the "Save" button or change its text to "Saved".
      $("#saveButton-" + articleId)
        .prop("disabled", true)
        .text("Saved");
    },
    error: function (error) {
      console.error("Error saving article:", error);
      // Handle the error response from the server (if needed)
    },
  });
}
