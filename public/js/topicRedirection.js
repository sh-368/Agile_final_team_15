document.addEventListener("DOMContentLoaded", function () {
  // Add click event listener to all elements with the "topic-link" class
  document.querySelectorAll(".topic-link").forEach(function (link) {
    link.addEventListener("click", function (event) {
      // Prevent default link behavior (opening the link)
      event.preventDefault();

      // Get the target URL from the link's "href" attribute
      var targetUrl = link.getAttribute("href");

      // Redirect to the target URL
      window.location.href = targetUrl;
    });
  });
});
