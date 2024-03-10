const path = require("path");
const utils = require(path.join(__dirname, "../public/js/utils"));

function fetchForumsWithTopics() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        f.forum_id,
        f.title AS forum_title,
        f.description AS forum_description,
        t.topic_id,
        t.title AS topic_title
      FROM
        forums f
      LEFT JOIN
        topics t ON f.forum_id = t.forum_id
      ORDER BY
        f.forum_id, t.topic_id;
    `;

    global.db.all(query, (err, rows) => {
      if (err) {
        reject(new Error(`Error fetching forums with topics: ${err.message}`));
      } else {
        const forumsWithTopics = [];
        let currentForum = null;

        for (const row of rows) {
          if (!currentForum || currentForum.forum_id !== row.forum_id) {
            // New forum, create a new entry
            currentForum = {
              forum_id: row.forum_id,
              title: row.forum_title,
              description: row.forum_description,
              topics: [],
            };
            forumsWithTopics.push(currentForum);
          }

          // Add topic information to the current forum
          if (row.topic_id) {
            currentForum.topics.push({
              topic_id: row.topic_id,
              title: row.topic_title,
            });
          }
        }

        resolve(forumsWithTopics);
      }
    });
  });
}

// Function to fetch latest topics
function fetchLatestTopics(callback) {
  const query = `
      SELECT t.topic_id, t.title, t.created_at, t.forum_id, u.user_id as author
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

// Function to fetch both topic details and posts for a specific topic
function fetchTopicWithPosts(topicId) {
  return new Promise((resolve, reject) => {
    const topicQuery = `
        SELECT t.topic_id, t.title, t.content, t.publication_date, u.name as author
        FROM topics t
        JOIN users u ON t.author_id = u.user_id
        WHERE t.topic_id = ?;`;

    const postsQuery = `
        SELECT p.post_id, p.text, p.publication_date, u.name as author
        FROM posts p
        JOIN users u ON p.author_id = u.user_id
        WHERE p.topic_id = ?
        ORDER BY p.publication_date ASC;`;

    global.db.all(topicQuery, [topicId], (err, topic) => {
      if (err) {
        reject(new Error(`Error fetching topic: ${err.message}`));
      } else {
        global.db.all(postsQuery, [topicId], (err, posts) => {
          if (err) {
            reject(new Error(`Error fetching posts: ${err.message}`));
          } else {
            console.log("Fetched topic:", topic);
            console.log("Fetched posts:", posts);
            resolve({ topic, posts });
          }
        });
      }
    });
  });
}

// Function to add a post to a specific topic
function addPostToTopic(topicId, text, authorId, callback) {
  console.log("Adding comment");
  const query = `
    INSERT INTO posts (text, publication_date, topic_id, author_id)
    VALUES (?, datetime('now'), ?, ?);`;
  global.db.run(query, [text, topicId, authorId], (err) => {
    if (err) {
      callback(new Error(`Error adding post: ${err.message}`), null);
    } else {
      callback(null, { success: true });
    }
  });
}

module.exports = {
  fetchForumsWithTopics,
  fetchLatestTopics,
  fetchPostsForTopic,
  fetchTopicWithPosts,
  addPostToTopic,
};
