const express = require("express");
const router = express.Router();
const { validateSearchQuery } = require("../public/js/validation");
const getRandomImage = require("../public/js/unsplash");
const authMiddleware = require("../authMiddleware");
const forumService = require("./forumService");

// Route for Community page
router.get("/", (req, res) => {
  let userLoggedIn = authMiddleware.isAuthenticatedMisc(
    req.session.cookie.isAuthenticated
  );
  const { forumId, topicId } = req.params;

  let latestTopics = [];
  let posts = []; // Define an empty array for posts

  // Fetch and render all forums
  forumService.fetchForums((forumErr, forums) => {
    if (forumErr) {
      console.error("Error fetching forums:", forumErr.message);
      // Fail gracefully
      res.redirect("/");
      return;
    }

    // Fetch and render latest topics
    forumService.fetchLatestTopics((topicErr, topics) => {
      if (topicErr) {
        console.error("Error fetching latest topics:", topicErr.message);
        // Fail gracefully
        res.redirect("/tools");
        return;
      }

      latestTopics = topics;

      // Fetch posts
      forumService.fetchPostsForTopic(topicId, (postErr, fetchedPosts) => {
        if (postErr) {
          console.error("Error fetching posts:", postErr.message);
          // Fail gracefully
          res.redirect("/"); // or redirect to an error page
          return;
        }

        posts = fetchedPosts; // Assign the fetched posts to the posts variable

        res.render("community", { forums, latestTopics, userLoggedIn, posts });
      });
    });
  });
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
  forumService.fetchPostsForTopic(topicId, (postErr, posts) => {
    if (postErr) {
      console.error(
        `Error fetching posts for topic ${topicId}: ${postErr.message}`
      );
      // Handle error gracefully
      res.redirect("/"); // or redirect to an error page
      return;
    }

    // Ensure that the posts variable is defined even if there are no posts
    const postsToRender = posts || [];

    res.render("topic", { forumId, topicId, posts });
  });
});

module.exports = router;
