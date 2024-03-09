const express = require("express");
const router = express.Router();
const axios = require("axios");
const path = require("path");
const utils = require(path.join(__dirname, "../public/js/utils"));
const authMiddleware = require("../authMiddleware");
const forumService = require("./forumService");

// community.js

// Route for Community page
router.get("/", async (req, res) => {
  let userLoggedIn = authMiddleware.isAuthenticatedMisc(
    req.session.cookie.isAuthenticated
  );

  let latestTopics = [];
  let forums = [];
  let posts = [];

  try {
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
    forumService
      .fetchForumsWithTopics()
      .then((fetchedForums) => {
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
            latestTopics,
            userLoggedIn,
            stackOverflowQuestions,
            posts,
            utils,
          });
        });
      })
      .catch((err) => {
        console.error("Error fetching forums with topics:", err.message);
        res.redirect("/");
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
          tagged: "node.js",
          filter: "withbody",
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
router.get("/forums", async (req, res) => {
  try {
    const forums = await forumService.fetchForumsWithTopics();
    res.render("forums-view", { forums, utils });
  } catch (error) {
    console.error(`Error fetching forums: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for the topic view
router.get("/topics/:topicId", async (req, res) => {
  const { topicId } = req.params;
  try {
    let userLoggedIn = authMiddleware.isAuthenticatedMisc(
      req.session.cookie.isAuthenticated
    );
    const { topic, posts } = await forumService.fetchTopicWithPosts(topicId);
    res.render("topic-view", {
      topicId,
      topic,
      posts,
      utils,
      userLoggedIn,
      userId: req.session.userId,
    });
  } catch (error) {
    console.error(`Error fetching topic ${topicId}:`, error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for handling post submissions
router.post("/forums/:forumId/topics/:topicId/posts", async (req, res) => {
  const { forumId, topicId } = req.params;
  const { text, authorId } = req.body;
  try {
    let userLoggedIn = authMiddleware.isAuthenticatedMisc(
      req.session.cookie.isAuthenticated
    );
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
