// forumService.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../../database.db");
// Function to fetch all forums
async function fetchForums() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM forums";
    db.all(query, [], (err, forums) => {
      if (err) {
        reject(err);
      } else {
        resolve(forums);
      }
    });
  });
}

// Function to fetch latest topics
async function fetchLatestTopics() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT t.topic_id, t.title, t.created_at, u.username as author
      FROM topics t
      JOIN users u ON t.author_id = u.user_id
      ORDER BY t.created_at DESC
      LIMIT 5;`;
    db.all(query, [], (err, latestTopics) => {
      if (err) {
        reject(err);
      } else {
        resolve(latestTopics);
      }
    });
  });
}

module.exports = { fetchForums, fetchLatestTopics };
