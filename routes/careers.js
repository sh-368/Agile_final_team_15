const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    // Fetch job data from GitHub Jobs API
    const githubJobsResponse = await axios.get(
      "https://jobs.github.com/positions.json"
    );

    // Extract job data from the response
    const jobs = githubJobsResponse.data;

    // Render the careers view with job data
    res.render("careers", { jobs });
  } catch (error) {
    console.error("Error fetching job data:", error.message);
    // Handle the error and render an appropriate response
    res.render("error", { message: "Error fetching job data" });
  }
});

module.exports = router;