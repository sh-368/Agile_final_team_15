const express = require("express");
const router = express.Router();
const { validateSearchQuery } = require("../public/js/validation");
const getRandomImage = require("../public/js/unsplash");
const authMiddleware = require("../authMiddleware");
const forumService = require("../public/js/forumService");

// Route for Community page
router.get("/", async (req, res) => {
  let userLoggedIn = authMiddleware.isAuthenticatedMisc(
    req.session.cookie.isAuthenticated
  );

  let latestTopics = [];

  try {
    // Fetch and render all forums
    const forums = await forumService.fetchForums();
    latestTopics = await fetchLatestTopics();
    res.render("community", { forums, latestTopics, userLoggedIn });
  } catch (error) {
    console.error("Error rendering Community page:", error.message);
    
    // Fail gracefully
    res.redirect("/");
  }
});

// Endpoint to get all forums
router.get("/forums", (req, res) => {
  // Fetch and render all forums
  res.render("forums", { forums: [] });
});

// Endpoint to get a specific forum by ID
router.get("/forums/:forumId", (req, res) => {
  const forumId = req.params.forumId;
  // Fetch and render forum details
  res.render("forum", { forumId });
});

// Endpoint to get all topics in a forum
router.get("/forums/:forumId/topics", (req, res) => {
  const forumId = req.params.forumId;
  // Fetch and render all topics in the forum
  res.render("topics", { forumId, topics: [] });
});

// Endpoint to get a specific topic by ID
router.get("/forums/:forumId/topics/:topicId", (req, res) => {
  const { forumId, topicId } = req.params;
  // Fetch and render topic details and posts
  res.render("topic", { forumId, topicId, posts: [] });
});

module.exports = router;
