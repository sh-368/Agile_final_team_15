const path = require("path");
const utils = require(path.join(__dirname, "../public/js/utils"));

function fetchForumsWithTopics() {
  return new Promise((resolve, reject) => {
    const forumQuery = "SELECT * FROM forums";
    global.db.all(forumQuery, async (err, forums) => {
      if (err) {
        reject(new Error(`Error fetching forums: ${err.message}`));
      } else {
        try {
          // Use Promise.all to wait for all async operations to complete
          const forumsWithTopics = await Promise.all(
            forums.map(async (forum) => {
              console.log("Fetch forum id", forum.forum_id);
              const topics = await getTopicsInForum(forum.forum_id);
              return { ...forum, topics };
            })
          );
          resolve(forumsWithTopics);
        } catch (err) {
          reject(new Error(`Error fetching topics for forums: ${err.message}`));
        }
      }
    });
  });
}
// Inside getTopicsInForum function
async function getTopicsInForum(forumId) {
  const topicsQuery = `
    SELECT t.topic_id, t.title
    FROM topics t
    WHERE t.forum_id = ?;`;
  const topics = await global.db.all(topicsQuery, [forumId]);
  console.log("Fetched topics for forum", forumId, ":", topics);
  return topics;
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
async function fetchTopicWithPosts(topicId) {
  const topicQuery = `
      SELECT t.topic_id, t.title, t.content, t.created_at, u.user_id as author
      FROM topics t
      JOIN users u ON t.author_id = u.user_id
      WHERE t.topic_id = ?;`;

  const postsQuery = `
      SELECT p.post_id, p.text, p.publication_date, u.user_id as author
      FROM posts p
      JOIN users u ON p.author_id = u.user_id
      WHERE p.topic_id = ?
      ORDER BY p.publication_date ASC;`;

  try {
    const topic = await global.db.get(topicQuery, [topicId]);
    const posts = await global.db.all(postsQuery, [topicId]);
    return { topic, posts };
  } catch (err) {
    throw new Error(`Error fetching topic and posts: ${err.message}`);
  }
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
