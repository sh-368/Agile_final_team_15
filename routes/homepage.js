const express = require("express");
const router = express.Router();
const { validateSearchQuery } = require("../public/js/validation");
const getRandomImage = require("../public/js/unsplash");
const authMiddleware = require("../authMiddleware");
const articlesController = require("../controllers/articlesController");

let sliderCounter = 1;

router.get("/", async (req, res, next) => {
  const nbOfSlides = 3;
  sliderCounter = (sliderCounter % nbOfSlides) + 1;

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

      let userLoggedIn = authMiddleware.isAuthenticatedMisc(
        req.session.cookie.isAuthenticated
      );

      const latestArticlesGoogle = await articlesController.getArticles(
        "*",
        6,
        60
      );
      console.log("Latest articles Homepage", latestArticlesGoogle);

      // Render the homepage and pass the updated latest articles data to the template
      res.render("homepage", {
        userLoggedIn,
        nbOfSlides,
        sliderCounter,
        // latestArticles: articlesWithImages,
        latestArticlesGoogle,
      });
    } catch (error) {
      console.error("Error fetching random images:", error);
      return next(error);
    }
  });
});

router.get("/search", (req, res) => {
  res.render("search");
});

router.post("/search", (req, res, next) => {
  const searchQuery = req.body.searchQuery;
  console.log("Search Query:", searchQuery);

  try {
    validateSearchQuery(searchQuery);

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

      res.render("search", { searchResults: articles });
    });
  } catch (error) {
    console.error("Search query validation error:", error);

    // Get the previous page URL from the referer header
    const referer = req.headers.referer || "/";

    // Redirect to the previous page with a warning query parameter
    res.redirect(`${referer}?warning=invalid_search_query`);
  }
});

module.exports = router;
