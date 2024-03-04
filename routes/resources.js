const express = require("express");
const router = express.Router();
const authMiddleware = require("../authMiddleware");
const articlesController = require("../controllers/articlesController");
const getRandomImage = require("../public/js/unsplash");
const fetchLatestTutorials = require("../public/js/tutorials");
const fetchRecommendedBooks = require("../public/js/books");
require("dotenv").config();

const tutorialApiKey = process.env.GOOGLE_API_KEY;
const googleBooksApiKey = process.env.GOOGLE_API_KEY;

const axios = require("axios");

// Endpoint to get book details by ID
router.get("/book/:bookId", async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    // console.log("Book ID:", bookId);
    // Fetch book details using Google Books API
    const googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
    const response = await axios.get(googleBooksApiUrl, {
      params: {
        key: googleBooksApiKey,
      },
    });

    const volumeInfo = response.data.volumeInfo;
    const bookDetails = {
      title: volumeInfo.title,
      authors: volumeInfo.authors
        ? volumeInfo.authors.join(", ")
        : "Unknown Author",
      description: volumeInfo.description || "No description available",
      publishedDate: volumeInfo.publishedDate || "Unknown Published Date",
      imageUrl: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : null,
    };
    // console.log(bookDetails);

    res.json({ success: true, bookDetails });
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Render resources page with Latest articles, tutorials, and recommended books
router.get("/", async (req, res, next) => {
  try {
    
    // Fetch latest tutorials
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
      // console.log(latestArticles);
      try {
        // Fetch random images related to computer science for each article
        const articlesWithImages = await Promise.all(
          latestArticles.map(async (article) => {
            const imageUrl = await getRandomImage();
            return { ...article, imageUrl };
          })
        );
        // console.log(latestArticles);
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

        // Check if user is logged in
          let userLoggedIn = authMiddleware.isAuthenticatedMisc(req.session.cookie.isAuthenticated);

        // Get articles 
        const latestArticlesGoogle = await articlesController.getArticles("tech", 3, 60);

        // Render the resources page and pass all the data to the template
        res.render("resources", {
          userLoggedIn,
          latestArticlesGoogle,
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

// Route to fetch latest tutorials
router.get("/recommended-books", async (req, res) => {
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
