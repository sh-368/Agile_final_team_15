const express = require("express");
const router = express.Router();
const getRandomImage = require("../public/js/unsplash");
const fetchLatestTutorials = require("../public/js/tutorials");
const fetchRecommendedBooks = require("../public/js/books");

const axios = require("axios");

// Google Books API key
const googleBooksApiKey = "AIzaSyDHALjWAHWnwwiSkPVe7aUpo0xIPo9kJV0";

// Render resources page with Latest articles, tutorials, and recommended books
router.get("/", async (req, res, next) => {
  try {
    // Fetch latest tutorials
    const tutorialApiKey = "AIzaSyDWUEdwVZQM-7OXVGgBYTV600giNnuSZBA";
    const latestTutorials = await fetchLatestTutorials(tutorialApiKey);

    // Fetch latest articles
    const latestArticlesQuery = `
      SELECT article_id, title, subtitle, content, strftime('%Y-%m-%d %H:%M:%S', publication_date) AS publication_date, likes, views, (SELECT COUNT(*) FROM comments WHERE article_id = articles.article_id) AS comments_count
      FROM articles
      ORDER BY publication_date DESC
      LIMIT 3;`;

    global.db.all(latestArticlesQuery, [], async (err, latestArticles) => {
      if (err) {
        console.error("Database query error:", err);
        return next(err);
      }

      try {
        // Fetch random images related to computer science for each article
        const articlesWithImages = await Promise.all(
          latestArticles.map(async (article) => {
            const imageUrl = await getRandomImage();
            return { ...article, imageUrl };
          })
        );

        // Fetch recommended books with more details
        const recommendedBooks = await fetchRecommendedBooks(
          googleBooksApiKey,
          3
        );

        // Fetch random images related to computer science for each recommended book
        const booksWithImages = await Promise.all(
          recommendedBooks.map(async (book) => {
            const imageUrl = await getRandomImage();
            return { ...book, imageUrl };
          })
        );

        // Render the resources page and pass all the data to the template
        res.render("resources", {
          latestArticles: articlesWithImages,
          latestTutorials,
          latestBooks: booksWithImages,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        return next(error);
      }
    });
  } catch (error) {
    console.error("Error fetching latest tutorials:", error);
    return next(error);
  }
});

// Route to fetch latest tutorials
router.get("/tutorials", async (req, res) => {
  try {
    // YouTube API Key
    const apiKey = "AIzaSyDWUEdwVZQM-7OXVGgBYTV600giNnuSZBA";

    // Call the function to fetch latest tutorials
    const latestTutorials = await fetchLatestTutorials(apiKey, 3);

    res.json({ success: true, latestTutorials });
  } catch (error) {
    console.error("Error fetching latest tutorials:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
