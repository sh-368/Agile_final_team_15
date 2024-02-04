// author-home.js

// Add an event listener to the logout button
document.getElementById("logoutButton").addEventListener("click", function () {
  // Make a POST request to the logout route
  fetch("/author/logout", {
    method: "POST",
  })
    .then(function (response) {
      if (response.ok) {
        // Redirect to the login page
        window.location.href = "/login";
      } else {
        console.error("Logout request failed:", response.statusText);
      }
    })
    .catch(function (error) {
      console.error("Logout request failed:", error);
    });
});

function deleteArticle(articleId) {
  console.log("Deleting article with ID:", articleId);
  // Make an AJAX request to delete the specified article
  fetch("/author/delete-article/" + articleId, {
    method: "DELETE",
  })
    .then(function (response) {
      if (response.ok) {
        // Reload the page to reflect the updated article list
        window.location.reload();
      } else {
        console.error("Error deleting article:", response.statusText);
      }
    })
    .catch(function (error) {
      console.error("Error deleting article:", error);
    });
}

function publishArticle(draftId) {
  console.log("Publish article ID function: " + draftId);
  // Make an AJAX request to publish the specified article
  fetch("/author/publish-article/" + draftId, {
    method: "POST",
  })
    .then(function (response) {
      if (response.ok) {
        // Reload the page to reflect the updated article list
        window.location.reload();
        console.log("Draft has been published");
      } else {
        console.error("Error publishing article:", response.statusText);
      }
    })
    .catch(function (error) {
      console.error("Error publishing article:", error);
    });
}

// Function to fetch the comments count for a specific article
function getCommentsCount(articleId) {
  return fetch(`/reader/comments-count/${articleId}`)
    .then((response) => response.json())
    .then((data) => data.commentsCount)
    .catch((error) => {
      console.error("Error fetching comments count:", error);
      return 0; // Return 0 in case of an error
    });
}

// Function to render the published articles with comments count
function renderPublishedArticlesWithComments(articles) {
  const publishedArticlesContainer = document.querySelector(
    "#publishedArticlesContainer"
  );
  publishedArticlesContainer.innerHTML = ""; // Clear the container

  articles.forEach(async (article) => {
    // Fetch the comments count for each article
    const commentsCount = await getCommentsCount(article.article_id);

    const articleItem = document.createElement("div");
    articleItem.classList.add("article-item");
    articleItem.innerHTML = `
      <div class="article-title">${article.title}</div>
      <div class="article-details">
        Published: ${utils.formatDate(article.publication_date)}<br />
        Likes: <span id="likeCount-${article.article_id}">${
      article.likes
    }</span><br />
        Comments: ${commentsCount} <!-- Display the comments count here -->
      </div>
      <div class="article-actions">
        <a href="/author/edit/article/${
          article.article_id
        }" class="btn btn-primary btn-edit">Edit</a>
        <a href="/reader/article/${
          article.article_id
        }" class="btn btn-primary">Read Article</a>
        <button class="btn btn-danger btn-delete" onclick="deleteArticle('${
          article.article_id
        }')">Delete</button>
      </div>
    `;

    publishedArticlesContainer.appendChild(articleItem);
  });
}

// Fetch article data including likes and comments count, and update the DOM
function fetchAndRenderArticles() {
  fetch("/api/author/articles")
    .then((response) => response.json())
    .then(async (data) => {
      for (const article of data.publishedArticles) {
        article.comments_count = await getCommentsCount(article.article_id);
      }

      renderPublishedArticles(data.publishedArticles);
      renderDraftArticles(data.draftArticles);
    })
    .catch((error) => {
      console.error("Error fetching articles:", error);
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