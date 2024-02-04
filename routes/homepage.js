const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../authMiddleware");

let sliderCounter = 1; // Initializes the counter

// Route for the homepage
router.get("/", (req, res) => {
  const nbOfSlides = 3;
  // Increment the sliderCounter and reset to 1 if it exceeds the number of slides
  sliderCounter = (sliderCounter % nbOfSlides) + 1;

  res.render("homepage", { nbOfSlides, sliderCounter });
});

// Route for displaying search results
router.get("/search", isAuthenticated, (req, res) => {
  // Render search results
  res.render("search");
});

// Handles search bar requests
router.post("/search", isAuthenticated, (req, res, next) => {
  // Get the search query from the request body
  const searchQuery = req.body.searchQuery;
  console.log("Search Query:", searchQuery);

  try {
    // Validate the search query (e.g., check for empty string or inappropriate characters)
    validateSearchQuery(searchQuery);

    // Construct the database query to search for articles based on the title, subtitle, and content
    const query = `
      SELECT article_id, title, subtitle, content, strftime('%Y-%m-%d %H:%M:%S', publication_date) AS publication_date, likes, views, (SELECT COUNT(*) FROM comments WHERE article_id = articles.article_id) AS comments_count
      FROM articles
      WHERE title LIKE ? OR subtitle LIKE ? OR content LIKE ?
    `;

    const values = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];

    global.db.all(query, values, (err, articles) => {
      if (err) {
        console.error("Database query error:", err);
        return next(err);
      }

      // Render the search results page and pass the articles data to the template
      res.render("search", { searchResults: articles });
    });
  } catch (error) {
    console.error("Search query validation error:", error);
    return res.status(400).json({ error: "Invalid search query" });
  }
});

module.exports = router;
