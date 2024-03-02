// reader.js
const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../authMiddleware");
const path = require("path");
const utils = require(path.join(__dirname, "../public/js/utils"));
const articlesController = require("../controllers/articlesController");

// Route for saving an article to the reader's saved articles
router.post("/save-article/:id", isAuthenticated, (req, res) => {
  const articleId = req.params.id;
  const readerId = req.session.userId; // Get the logged-in reader's ID from the session

  // Check if the article is already saved by the reader
  const querySavedArticle =
    "SELECT * FROM saved_articles WHERE article_id = ? AND reader_id = ?";
  global.db.get(
    querySavedArticle,
    [articleId, readerId],
    (err, savedArticle) => {
      if (err) {
        console.error("Error fetching saved article:", err);
        // Handle the error, e.g., render an error page or display an error message
        res.status(500).send("Internal Server Error");
        return;
      }

      if (savedArticle) {
        // If the article is already saved, display a message or handle accordingly
        console.log("Article is already saved by the reader");
        res.redirect("/reader/articles"); // Redirect to the Reader - Published Articles Page
        return;
      }

      // Insert the article into the saved_articles table
      const queryInsertSavedArticle =
        "INSERT INTO saved_articles (article_id, reader_id) VALUES (?, ?)";
      global.db.run(queryInsertSavedArticle, [articleId, readerId], (err) => {
        if (err) {
          console.error("Error inserting saved article:", err);
          // Handle the error, e.g., render an error page or display an error message
          res.status(500).send("Internal Server Error");
          return;
        }

        // Redirect back to the Reader - Published Articles Page after successfully saving the article
        res.redirect("/reader/articles");
      });
    }
  );
});

// Route for the Reader - Home Page
// Purpose: Render the Reader's Home Page with saved articles.
// Inputs: None (uses session data for user authentication)
// Outputs: Rendered HTML page with the Reader's Home Page data
router.get("/home", isAuthenticated, (req, res, next) => {
  // Fetch the reader's name from the session
  const readerName = req.session.userName;

  // Fetch the reader's saved articles from the database
  const querySavedArticles =
    "SELECT articles.* FROM articles JOIN saved_articles ON articles.article_id = saved_articles.article_id WHERE saved_articles.reader_id = ?";
  global.db.all(
    querySavedArticles,
    [req.session.userId],
    (err, savedArticles) => {
      if (err) {
        console.error("Error fetching saved articles:", err);
        // Handle the error, e.g., render an error page or display an error message
        res.status(500).send("Internal Server Error");
        return;
      }

      // Render the Reader - Home Page and pass the data (saved articles, readerName)
      res.render("reader-home", {
        readerName: readerName,
        savedArticles: savedArticles, // Pass the fetched saved articles to the template
        utils: utils,
      });
    }
  );
});

// Route for the Reader - Published Articles Page
// Purpose: Render the Reader's Published Articles Page with a list of all published articles.
// Inputs: None (uses session data for user authentication)
// Outputs: Rendered HTML page with the list of published articles
router.get("/articles", articlesController.loadArticlesPage);

// Route for the Reader - Article Page
// Purpose: Render the Reader's Article Page with details of a specific article.
// Inputs: Article ID from the URL parameter and session data for user authentication
// Outputs: Rendered HTML page with the article details and comments
router.get("/article/:id", isAuthenticated, (req, res) => {
  const articleId = req.params.id; // Get the article ID from the URL parameter
  const readerId = req.session.userId; // Get the logged-in user's ID from the session

  // Fetch the article data and the author's name from the database based on the articleId
  const queryArticle =
    "SELECT articles.*, users.name AS authorName FROM articles JOIN users ON articles.author_id = users.user_id WHERE article_id = ?";

  global.db.get(queryArticle, [articleId], (err, article) => {
    if (err) {
      console.error("Error fetching article:", err);
      // Handle the error, e.g., render an error page or display an error message
      res.status(500).send("Internal Server Error");
      return;
    }

    if (!article) {
      // Handle the case when the article is not found
      console.error("Article not found");
      // Render an error page or display an error message
      res.status(404).send("Not Found");
      return;
    }

    // Increment the view count in the database
    const updateViewsQuery =
      "UPDATE articles SET views = views + 1 WHERE article_id = ?";
    global.db.run(updateViewsQuery, [articleId], (err) => {
      if (err) {
        console.error("Error updating view count:", err);
      }

      // Fetch the comments for the article
      const queryComments = "SELECT * FROM comments WHERE article_id = ?";

      global.db.all(queryComments, [articleId], (err, comments) => {
        if (err) {
          console.error("Error fetching comments:", err);
          // Handle the error, e.g., render an error page or display an error message
          res.status(500).send("Internal Server Error");
          return;
        }

        // Update the article object with the comments array
        article.comments = comments;

        // Render the Reader - Article Page and pass the article data and req object
        res.render("reader-article", {
          article,
          comments,
          req,
          utils,
          readerId,
        });
      });
    });
  });
});

// Route for submitting a comment
// Purpose: Handle the form submission to add a new comment to an article.
// Inputs: Comment text and article ID submitted through the form, and session data for user authentication
// Outputs: Redirects back to the article page after successfully submitting the comment
router.post("/submit-comment", isAuthenticated, (req, res) => {
  const { article_id, text } = req.body;
  // Get the user ID from the session
  const reader_id = req.session.userId;
  console.log("comment readerID : " + reader_id);
  // Get the user name from the session
  const authorName = req.session.userName;
  console.log("comment reader username: " + authorName);
  // Create the comment object with the necessary properties
  const comment = {
    text: text,
    publication_date: new Date().toISOString(),
    article_id: article_id,
    reader_id: reader_id,
    // Add the authorName property to the comment object
    authorName: authorName,
  };

  // Insert the comment into the comments table
  const query =
    "INSERT INTO comments (text, publication_date, article_id, reader_id) VALUES (?, ?, ?, ?)";
  global.db.run(
    query,
    [
      comment.text,
      comment.publication_date,
      comment.article_id,
      comment.reader_id,
    ],
    (err) => {
      if (err) {
        console.error("Error inserting comment:", err);
        // Handle the error, e.g., render an error page or display an error message
        res.status(500).send("Internal Server Error");
        return;
      }
      // Redirect back to the article page after submitting the comment
      res.redirect(`/reader/article/${article_id}`);
    }
  );
});

// Route for deleting a comment
// Purpose: Handle the request to delete a comment from the database.
// Inputs: Comment ID of the comment to be deleted
// Outputs: Sends a status code 200 if the deletion is successful
router.delete("/delete-comment/:id", isAuthenticated, (req, res) => {
  const commentId = req.params.id;
  const readerId = req.session.userId; // Get the logged-in user's ID from the session

  // Check if the comment exists and belongs to the logged-in user
  const queryComment =
    "SELECT * FROM comments WHERE comment_id = ? AND reader_id = ?";
  global.db.get(queryComment, [commentId, readerId], (err, comment) => {
    if (err) {
      console.error("Error fetching comment:", err);
      // Handle the error, e.g., render an error page or display an error message
      res.status(500).send("Internal Server Error");
      return;
    }

    if (!comment) {
      // Handle the case when the comment is not found or does not belong to the user
      console.error("Comment not found or does not belong to the user");
      // Render an error page or display an error message
      res.status(404).send("Comment not found or does not belong to the user");
      return;
    }

    // Delete the comment from the comments table
    const queryDeleteComment = "DELETE FROM comments WHERE comment_id = ?";
    global.db.run(queryDeleteComment, [commentId], (err) => {
      if (err) {
        console.error("Error deleting comment:", err);
        // Handle the error, e.g., render an error page or display an error message
        res.status(500).send("Internal Server Error");
        return;
      }
      // Comment deleted successfully
      res.sendStatus(200);
    });
  });
});

// Route for rendering the Success Page
// Purpose: Render the Success Page for any success message or action.
// Inputs: None
// Outputs: Rendered HTML page with the success message
router.get("/success-page", (req, res) => {
  res.render("success-page");
});

// Route for handling the "Like" button click
// Purpose: Handle the request when the user clicks the "Like" button on an article.
// Inputs: Article ID of the liked article
// Outputs: Sends the updated like count as a JSON response
router.post("/like-article/:id", isAuthenticated, (req, res) => {
  const articleId = req.params.id;
  const readerId = req.session.userId; // Get the logged-in user's ID from the session

  // Check if the user has already liked the article
  const queryLikedArticle = "SELECT likes FROM articles WHERE article_id = ?";
  global.db.get(queryLikedArticle, [articleId], (err, article) => {
    if (err) {
      console.error("Error fetching liked article:", err);
      // Handle the error, e.g., render an error page or display an error message
      res.status(500).send("Internal Server Error");
      return;
    }

    // Check if the user has already liked the article
    let likes = article.likes || 0;
    let liked = false;

    if (req.session.likes) {
      liked = req.session.likes[articleId] === true;
    }

    if (liked) {
      // If the user has already liked the article, remove the like
      likes--;
      req.session.likes[articleId] = false;
    } else {
      // If the user has not liked the article, add a like
      likes++;
      if (!req.session.likes) {
        req.session.likes = {};
      }
      req.session.likes[articleId] = true;
    }

    // Update the "likes" count in the "articles" table
    const queryUpdateLikes =
      "UPDATE articles SET likes = ? WHERE article_id = ?";
    global.db.run(queryUpdateLikes, [likes, articleId], (err) => {
      if (err) {
        console.error("Error updating likes count:", err);
        // Handle the error, e.g., render an error page or display an error message
        res.status(500).send("Internal Server Error");
        return;
      }
      // Send the updated like count as the response
      res.json({ likes });
    });
  });
});

module.exports = router;
