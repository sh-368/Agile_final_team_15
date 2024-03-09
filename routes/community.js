const express = require("express");
const router = express.Router();
const axios = require("axios");
const path = require("path");
const utils = require(path.join(__dirname, "../public/js/utils"));
const { validateSearchQuery } = require("../public/js/validation");
const getRandomImage = require("../public/js/unsplash");
const authMiddleware = require("../authMiddleware");
const forumService = require("./forumService");

// Route for Community page
router.get("/", async (req, res) => {
  let userLoggedIn = authMiddleware.isAuthenticatedMisc(
    req.session.cookie.isAuthenticated
  );

  let latestTopics = [];
  let forums = [];
  let posts = [];

  try {
    const { forumId } = req.params;
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
    forumService.fetchForums((forumErr, fetchedForums) => {
      if (forumErr) {
        console.error("Error fetching forums:", forumErr.message);
        res.redirect("/");
        return;
      }

      forums = fetchedForums;

      // Fetch and render latest topics
      forumService.fetchLatestTopics((topicErr, topics) => {
        if (topicErr) {
          console.error("Error fetching latest topics:", topicErr.message);
          res.redirect("/tools");
          return;
        }

        latestTopics = topics;

        res.render("community", {
          forums,
          forumId,
          latestTopics,
          userLoggedIn,
          stackOverflowQuestions,
          posts,
          utils,
        });
      });
    });
  } catch (error) {
    console.error("Error fetching Stack Overflow questions:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

// Endpoint to get all forums
router.get("/forums", (req, res) => {
  // Fetch and render all forums
  res.render("forums", { forums: [], utils });
});

// Endpoint to get a specific forum by ID
router.get("/forums/:forumId", (req, res) => {
  console.log("Forum id Request Params:", req.params); // Log the params
  const forumId = req.params.forumId;
  // Fetch and render forum details
  res.render("forum", { forumId, utils });
});

// Route to get all topics in a forum
router.get("/forums/:forumId/topics", async (req, res) => {
  const { forumId } = req.params;
  try {
    const topics = await forumService.getTopicsInForum(forumId);
    res.render("topics", { forumId, topics, utils });
  } catch (error) {
    console.error(`Error fetching topics for forum ${forumId}:`, error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for the topic view
router.get("/topics/:topicId", async (req, res) => {
  const { topicId, forumId } = req.params;
  try {
    const { topic, posts } = await forumService.fetchTopicWithPosts(topicId);
    console.log("Forum id:", forumId);
    console.log("topic id:", topicId);
    res.render("topic-view", { forumId, topic, posts, utils });
  } catch (error) {
    console.error(`Error fetching topic ${topicId}:`, error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch topic and posts
router.get("/forums/:forumId/topics/:topicId", async (req, res) => {
  console.log("topic and post Request Params:", req.params); // Log the params
  const { forumId, topicId } = req.params;
  try {
    const { topic, posts } = await forumService.fetchTopicWithPosts(topicId);
    res.render("topic-view", { forumId, topic, posts, utils });
  } catch (error) {
    console.error(`Error fetching posts for topic ${topicId}:`, error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for handling post submissions
router.post("/forums/:forumId/topics/:topicId/posts", async (req, res) => {
  const {topicId } = req.params;
  const { text, authorId } = req.body;
  try {
    // Call the function to add the post to the database
    await forumService.addPostToTopic(
      topicId,
      text,
      authorId,
      (err, result) => {
        if (err) {
          console.error(`Error adding post to topic ${topicId}:`, err.message);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          // Redirect back to the topic view after the post is added
          res.redirect(`/forums/${forumId}/topics/${topicId}`);
        }
      }
    );
  } catch (error) {
    console.error(`Error adding post to topic ${topicId}:`, error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
