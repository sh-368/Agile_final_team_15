const axios = require("axios");

async function fetchRecommendedBooks(apiKey, maxResults = 3) {
  try {
    // Google Books API endpoint
    const googleBooksApiUrl = "https://www.googleapis.com/books/v1/volumes";

    // Fetch recommended books from the Google Books API
    const response = await axios.get(googleBooksApiUrl, {
      params: {
        q: "computer science",
        key: apiKey,
        maxResults: maxResults,
      },
    });

    // Extract relevant book information
    const recommendedBooks = response.data.items.map((item) => {
      const volumeInfo = item.volumeInfo;
      // Extracting the Book ID
      const bookId = item.id;
      
      return {
        bookId: bookId,
        title: volumeInfo.title,
        authors: volumeInfo.authors
          ? volumeInfo.authors.join(", ")
          : "Unknown Author",
        description: volumeInfo.description || "No description available",
        publishedDate: volumeInfo.publishedDate || "Unknown Published Date",
        imageUrl: volumeInfo.imageLinks
          ? volumeInfo.imageLinks.thumbnail
          : null,
      };
    });


    return recommendedBooks;
  } catch (error) {
    console.error("Error fetching recommended books:", error.message);
    throw error;
  }
}

module.exports = fetchRecommendedBooks;
