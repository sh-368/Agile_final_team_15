// forumService.js

// Function to fetch all forums
function fetchForums(callback) {
  const query = "SELECT * FROM forums";
  global.db.all(query, (err, forums) => {
    if (err) {
      callback(new Error(`Error fetching forums: ${err.message}`), null);
    } else {
      callback(null, forums);
    }
  });
}

// forumService.js

// Function to fetch latest topics
function fetchLatestTopics(callback) {
  const query = `
      SELECT t.topic_id, t.title, t.created_at, u.user_id as author
      FROM topics t
      JOIN users u ON t.author_id = u.user_id
      ORDER BY created_at DESC
      LIMIT 5;`;
  global.db.all(query, [], (err, latestTopics) => {
    if (err) {
      callback(new Error(`Error fetching latest topics: ${err.message}`), null);
    } else {
      callback(null, latestTopics);
    }
  });
}

// Function to fetch posts for a specific topic
function fetchPostsForTopic(topicId, callback) {
  const query = `
      SELECT p.post_id, p.text, p.publication_date, u.user_id as author
      FROM posts p
      JOIN users u ON p.author_id = u.user_id
      WHERE p.topic_id = ?
      ORDER BY p.publication_date ASC;`;

  global.db.all(query, [topicId], (err, posts) => {
    if (err) {
      callback(new Error(`Error fetching posts: ${err.message}`), null);
    } else {
      callback(null, posts);
    }
  });
}

module.exports = { fetchForums, fetchLatestTopics, fetchPostsForTopic };
