const express = require("express");
const router = express.Router();
const axios = require("axios");
const { validateSearchQuery } = require("../public/js/validation");
const getRandomImage = require("../public/js/unsplash");
const authMiddleware = require("../authMiddleware");
const forumService = require("./forumService");

// Endpoint to get Stack Overflow questions
router.get("/stackoverflow-questions", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.stackexchange.com/2.3/questions",
      {
        params: {
          site: "stackoverflow",
          order: "desc",
          sort: "activity",
          tagged: "node.js", // You can specify tags based on your requirements
          filter: "withbody", // Include the body of the question
        },
      }
    );

    const questions = response.data.items;
    res.json({ questions });
  } catch (error) {
    console.error("Error fetching Stack Overflow questions:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for Community page
router.get("/", async (req, res) => {
  let userLoggedIn = authMiddleware.isAuthenticatedMisc(
    req.session.cookie.isAuthenticated
  );

  let latestTopics = [];
  let posts = [];

  try {
    const { forumId, topicId } = req.params;
    // Fetch questions from Stack Overflow API
    const stackOverflowResponse = await axios.get(
      "https://api.stackexchange.com/2.3/questions",
      {
        params: {
          site: "stackoverflow",
          order: "desc",
          sort: "activity",
          tagged: "node.js",
          filter: "withbody",
        },
      }
    );

    const stackOverflowQuestions = stackOverflowResponse.data.items;

    // Fetch and render all forums
    forumService.fetchForums((forumErr, forums) => {
      if (forumErr) {
        console.error("Error fetching forums:", forumErr.message);
        res.redirect("/");
        return;
      }

      // Fetch and render latest topics
      forumService.fetchLatestTopics((topicErr, topics) => {
        if (topicErr) {
          console.error("Error fetching latest topics:", topicErr.message);
          res.redirect("/tools");
          return;
        }

        latestTopics = topics;

        // Fetch posts
        forumService.fetchPostsForTopic(topicId, (postErr, fetchedPosts) => {
          if (postErr) {
            console.error("Error fetching posts:", postErr.message);
            res.redirect("/");
            return;
          }

          posts = fetchedPosts;

          res.render("community", {
            forums,
            forumId,
            latestTopics,
            userLoggedIn,
            posts,
            stackOverflowQuestions,
          });
        });
      });
    });
  } catch (error) {
    console.error("Error fetching Stack Overflow questions:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
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

// Route to get all topics in a forum
router.get("/forums/:forumId/topics", async (req, res) => {
  const { forumId } = req.params;
  try {
    const topics = await forumService.getTopicsInForum(forumId);
    res.render("topics", { forumId, topics });
  } catch (error) {
    console.error(`Error fetching topics for forum ${forumId}:`, error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get posts in a topic
router.get("/forums/:forumId/topics/:topicId", async (req, res) => {
  const { forumId, topicId } = req.params;
  try {
    const topic = await forumService.getTopicById(topicId);
    const posts = await forumService.getPostsInTopic(topicId);
    res.render("single-topic", { forumId, topic, posts });
  } catch (error) {
    console.error(`Error fetching posts for topic ${topicId}:`, error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
