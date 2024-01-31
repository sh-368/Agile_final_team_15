// reader-article.js
// Submit comment form using AJAX
$("#commentForm").submit(function (event) {
  event.preventDefault();

  const formData = $(this).serialize();

  $.ajax({
    type: "POST",
    url: "/reader/submit-comment",
    data: formData,
    success: function (response) {
      console.log("Comment submitted successfully:", response);
      // Clear the form and redirect the user to the success page
      $("#commentForm")[0].reset();
      window.location.reload();
    },
    error: function (error) {
      console.error("Error submitting comment:", error);
    },
  });
});

// Function to delete a comment using AJAX
function deleteComment(articleId, commentId) {
  console.log("articleID delete: " + articleId);
  $.ajax({
    type: "DELETE",
    url: `/reader/delete-comment/${commentId}`,
    success: function (response) {
      // Comment deleted successfully
      console.log("Comment deleted:", response);
      // Redirect the user to the success page
      // window.location.href = "/reader/success-page";
      // Reload the page to reflect the comment added
      console.log("delete comment pressed");
      window.location.reload();
    },
    error: function (error) {
      console.error("Error deleting comment:", error);
    },
  });
}
// reader-articles.js
function handleLikeButtonClick(articleId) {
  // Send a POST request to like/unlike the article
  $.ajax({
    method: "POST",
    url: `/reader/like-article/${articleId}`,
    success: function (data) {
      // Update the like count
      const likeCountSpan = document.getElementById(`likeCount-${articleId}`);
      likeCountSpan.textContent = data.likes;

      // Toggle the liked state of the article
      const article = publishedArticles.find((a) => a.article_id === articleId);
      article.liked = !article.liked;

      // Update the like button
      const likeButton = document.getElementById(`likeButton-${articleId}`);
      likeButton.textContent = article.liked ? "Liked" : "Like";
      likeButton.classList.toggle("btn-primary");
      likeButton.classList.toggle("btn-secondary");
      likeButton.disabled = article.liked;

      // Style the like count number
      likeCountSpan.classList.toggle("bg-primary");
      likeCountSpan.classList.toggle("bg-secondary");
      likeCountSpan.classList.toggle("text-light");
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
