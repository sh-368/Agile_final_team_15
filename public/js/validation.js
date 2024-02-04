// Function to validate the search query
const validateSearchQuery = (query) => {
  // Check if the query is a non-empty string
  if (typeof query !== "string" || query.trim() === "") {
    throw new Error("Search query must be a non-empty string");
  }

  // You can add more validation logic if needed

  // If the query passes validation, return true
  return true;
};

module.exports = { validateSearchQuery };
