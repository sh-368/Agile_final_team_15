// community.js
$(document).ready(function () {
  // Event listener for clicking on a forum
  $(".forum-section ul a").on("click", function (e) {
    e.preventDefault();
    const forumId = $(this).attr("href").split("/").pop();
    loadTopics(forumId);
  });

  // Event listener for clicking on a topic
  $(".latest-topics-section ul a").on("click", function (e) {
    e.preventDefault();
    const forumId = $(this).attr("href").split("/")[2];
    const topicId = $(this).attr("href").split("/").pop();
    loadPosts(forumId, topicId);
  });

  // Function to load topics for a forum
  function loadTopics(forumId) {
    // Perform an AJAX request to fetch topics for the forum
    $.get(`/forums/${forumId}/topics`, function (data) {
      // Replace the content of the topics section with the loaded topics
      $(".latest-topics-section ul").html(data);
    });
  }

  // Function to load posts for a topic
  function loadPosts(forumId, topicId) {
    // Perform an AJAX request to fetch posts for the topic
    $.get(`/forums/${forumId}/topics/${topicId}`, function (data) {
      // Replace the content of the single-topic-section with the loaded posts
      $(".single-topic-section").html(data);
    });
  }
});
