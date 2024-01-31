// utils.js
// Format publication date for comments section
function formatDate(dateString) {
  console.log("dateString: " + dateString);
  if (!dateString) {
    return "Invalid Date";
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatter.format(date);
}

module.exports = {
  formatDate,
};
