const axios = require("axios");

async function fetchLatestTutorials(apiKey, maxResults = 3) {
  try {
    // YouTube API endpoint for searching videos in a specific category (e.g., tutorials)
    const apiUrl = "https://www.googleapis.com/youtube/v3/search";

    // Make request to YouTube API
    const response = await axios.get(apiUrl, {
      params: {
        part: "snippet",
        type: "video",
        q: "computer science tutorial",
        key: apiKey,
        maxResults: maxResults,
      },
    });

    // Extract relevant video information
    const tutorials = response.data.items.map((item) => {
      return {
        title: item.snippet.title,
        description: item.snippet.description,
        videoId: item.id.videoId,
        thumbnail: item.snippet.thumbnails.default.url,
      };
    });

    return tutorials;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error.message);
    throw error;
  }
}

module.exports = fetchLatestTutorials;
