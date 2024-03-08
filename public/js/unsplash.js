// const fetch = require("node-fetch");
require("dotenv").config();

const accessKey = process.env.UNSPLASH_API_KEY;
const apiUrl =
  "https://api.unsplash.com/photos/random?query=computer%20science";

// Rate limiting variables
const requestLimit = 5; // Adjust this based on the Unsplash rate limits
const interval = 1000; // Adjust this based on the Unsplash rate limits
let requestsMade = 0;

// Function to fetch a random image from Unsplash
async function getRandomImage() {
  try {
    if (requestsMade >= requestLimit) {
      console.log(
        "Rate limit reached. Waiting before making the next request."
      );
      return null;
    }

    const response = await fetch(`${apiUrl}&client_id=${accessKey}`);
    const data = await response.text();

    if (response.ok) {
      // If the response is successful, parse the JSON
      const jsonData = JSON.parse(data);

      if (jsonData && jsonData.urls && jsonData.urls.regular) {
        // Increment the requests counter
        requestsMade++;
        return jsonData.urls.regular;
      } else {
        console.error("Error: Unexpected JSON structure from Unsplash");
        return null;
      }
    } else {
      console.error("Error fetching image from Unsplash:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error.message);
    return null;
  }
}

// Example usage
getRandomImage().then((imageUrl) => {
  if (imageUrl) {
    // Now you can use this imageUrl for your article
  } else {
    console.log("Failed to fetch a random image.");
  }
});

module.exports = getRandomImage;
