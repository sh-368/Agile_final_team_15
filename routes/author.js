// author.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const path = require("path");
const utils = require(path.join(__dirname, "../public/js/utils"));
const { isAuthenticated } = require("../authMiddleware");
const { v4: uuidv4 } = require("uuid");

// Route for the Author - Home Page
// Purpose: Render the Author's Home Page with their published and draft articles.
// Inputs: None (uses session data for user authentication)
// Outputs: Rendered HTML page with the Author's Home Page data
router.get("/", isAuthenticated, (req, res, next) => {
  const userId = req.session.userId;

  if (!userId) {
    // If the user is not authenticated, redirect to the login page or show an error message
    return res.redirect("/login");
  }

  // Check the user's role to determine if they are an author or reader
  const queryRole = "SELECT role FROM users WHERE user_id = ?";
  global.db.get(queryRole, [userId], (err, row) => {
    if (err) {
      return next(err);
    }
    if (!row) {
      // If the user is not found in the database, handle it as an error
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    const userRole = row.role;
    if (userRole === "author") {
      // If the user is an author, retrieve the necessary data from the database
      // Update the SQL query for fetching published articles
      const queryPublishedArticles =
        "SELECT article_id, title, subtitle, content, strftime('%Y-%m-%d %H:%M:%S', publication_date) AS publication_date, likes, views, (SELECT COUNT(*) FROM comments WHERE article_id = articles.article_id) AS comments_count FROM articles WHERE author_id = ? AND publication_date IS NOT NULL";
      const queryDraftArticles = "SELECT * FROM drafts WHERE author_id = ?";
      global.db.all(
        queryPublishedArticles,
        [userId],
        (err, publishedArticles) => {
          if (err) {
            return next(err);
          }
          global.db.all(queryDraftArticles, [userId], (err, draftArticles) => {
            if (err) {
              return next(err);
            }
            // Fetch the blog title and subtitle from the settings table based on the author ID
            const querySettings =
              "SELECT blogTitle, subtitle FROM settings WHERE user_id = ?";
            global.db.get(querySettings, [userId], (err, settingsRow) => {
              if (err) {
                return next(err);
              }
              // Render the Author - Homepage and pass the data
              res.render("author-home", {
                authorName: req.session.authorName,
                blogTitle: settingsRow ? settingsRow.blogTitle : "", // If settingsRow exists, set the blogTitle; otherwise, set an empty string
                subtitle: settingsRow ? settingsRow.subtitle : "", // If settingsRow exists, set the subtitle; otherwise, set an empty string
                publishedArticles: publishedArticles,
                draftArticles: draftArticles,
                utils: utils,
              });
            });
          });
        }
      );
    } else if (userRole === "reader") {
      // If the user is a reader, redirect to the Reader - Published Articles Page
      res.redirect("/reader/articles");
    } else {
      // Handle the case when the role is neither "author" nor "reader"
      res.redirect("/login");
    }
  });
});

// Route for creating or updating profile settings
// Purpose: Handle the form submission to create or update the profile settings (blog title, subtitle, and user name).
// Inputs: Blog title, subtitle, and user name submitted through the form
// Outputs: Redirects to the Author's Home Page after successful creation or update of settings
router.post("/create-author-settings", (req, res, next) => {
  const { blogTitle, subtitle, authorName } = req.body;
  // Retrieve the authorId from the session
  const authorId = req.session.userId;
  console.log("create-author-settings POST");
  console.log("AuthorID: " + authorId);

  // Check if settings already exist for the user
  const querySettings = "SELECT * FROM settings WHERE user_id = ?";
  global.db.get(querySettings, [authorId], (err, settingsRow) => {
    if (err) {
      return next(err);
    }
    console.log("Settings for the user:", settingsRow);

    // Update or insert the author settings
    if (settingsRow) {
      console.log("Settings will be updated");
      // Settings already exist, update the existing settings
      const updateSettingsQuery =
        "UPDATE settings SET blogTitle = ?, subtitle = ? WHERE user_id = ?";
      const updateSettingsValues = [blogTitle, subtitle, authorId];
      global.db.run(updateSettingsQuery, updateSettingsValues, (err) => {
        if (err) {
          return next(err);
        }
        // Update the author name in the users table
        const updateAuthorQuery = "UPDATE users SET name = ? WHERE user_id = ?";
        const updateAuthorValues = [authorName, authorId];
        global.db.run(updateAuthorQuery, updateAuthorValues, (err) => {
          if (err) {
            return next(err);
          }
          // Update the authorName in the session
          req.session.authorName = authorName;
          console.log("Author name updated successfully");
          // Redirect the user to the Author - Home Page after successfully creating the settings
          res.redirect("/home");
        });
      });
    } else {
      console.log("Settings will be created");
      // Settings do not exist, create new settings
      const insertSettingsQuery =
        "INSERT INTO settings (user_id, blogTitle, subtitle) VALUES (?, ?, ?)";
      const insertSettingsValues = [authorId, blogTitle, subtitle];
      global.db.run(insertSettingsQuery, insertSettingsValues, (err) => {
        if (err) {
          return next(err);
        }
        console.log("Settings created successfully");
        // Update the author name in the users table
        const createAuthorQuery = "UPDATE users SET name = ? WHERE user_id = ?";
        const createAuthorValues = [authorName, authorId];
        global.db.run(createAuthorQuery, createAuthorValues, (err) => {
          if (err) {
            return next(err);
          }
          // Update the authorName in the session
          req.session.authorName = authorName;
          console.log("Author name updated successfully");
          // Redirect the user to the Author - Home Page after successfully creating the settings
          res.redirect("/");
        });
      });
    }
  });
});

// Route for logging out the author
// Purpose: Handle the form submission to log out the user and destroy the session.
// Inputs: None (uses session data for user authentication)
// Outputs: Redirects the user to the login page or any other appropriate page after destroying the session
router.get("/edit/:type/:id", isAuthenticated, (req, res, next) => {
  const type = req.params.type; // Either "article" or "draft"
  const id = req.params.id; // The ID of the article or draft to be edited

  // Fetch the data (article or draft) from the database based on the ID
  let query, queryParams;

  if (type === "article") {
    query = "SELECT * FROM articles WHERE article_id = ?";
    queryParams = [id];
  } else if (type === "draft") {
    query = "SELECT * FROM drafts WHERE draft_id = ?";
    queryParams = [id];
  } else {
    // Handle the case when the type is neither "article" nor "draft"
    const error = new Error("Invalid type");
    error.statusCode = 404;
    return next(error);
  }

  global.db.get(query, queryParams, (err, row) => {
    if (err) {
      return next(err);
    }
    if (!row) {
      // If the article or draft is not found, handle it as an error
      const error = new Error(`${type} not found`);
      error.statusCode = 404;
      return next(error);
    }

    // Render the edit page and pass the data (article or draft) to the template
    res.render("edit", { type, content: row });
  });
});

// Route for handling the form submission when editing an article or draft
// Purpose: Handle the form submission when the author edits an article or draft and updates it in the database.
// Inputs: Article/Draft type ("article" or "draft") and ID of the article/draft to be edited, updated title, subtitle, and content submitted through the form
// Outputs: Redirects to the Author's Home Page after successful editing and updating of the article/draft
router.post("/edit/:type/:id", isAuthenticated, (req, res, next) => {
  const type = req.params.type; // Either "article" or "draft"
  console.log("type: " + type);
  const id = req.params.id; // The ID of the article or draft to be edited
  console.log("id: " + id);
  // Retrieve the updated data from the form submission
  const { title, subtitle, content } = req.body;
  // Update the article or draft in the database based on the ID and type
  let query, queryParams;
  if (type === "article") {
    query =
      "UPDATE articles SET title = ?, subtitle = ?, content = ? WHERE article_id = ?";
    queryParams = [title, subtitle, content, id];
    console.log("article updated");
  } else if (type === "draft") {
    query =
      "UPDATE drafts SET title = ?, subtitle = ?, text = ? WHERE draft_id = ?";
    queryParams = [title, subtitle, content, id];
  } else {
    // Handle the case when the type is neither "article" nor "draft"
    const error = new Error("Invalid type");
    console.log("Type is not an article or draft");
    error.statusCode = 404;
    return next(error);
  }
  global.db.run(query, queryParams, (err) => {
    if (err) {
      console.log("Query error ");
      return next(err);
    }
    // Redirect the user back to the Author - Home Page after editing the article or draft
    res.redirect("/author/home");
  });
});

// Route for creating a new draft
// Purpose: Render the create-draft page for the author to create a new draft.
// Inputs: None (uses session data for user authentication)
// Outputs: Rendered HTML page for creating a new draft
router.get("/create-draft", isAuthenticated, (req, res) => {
  // Retrieve the userId from the session
  const userId = req.session.userId;
  console.log("Session userId: " + userId);
  if (!userId) {
    console.error("User ID not found in the session");
    // Handle the case when the userId is not found in the session
    res.redirect("/login"); // Redirect to the login page
    return;
  }
  // Store the userId as authorId in the session
  req.session.authorId = userId;
  // Render the create-draft template and pass the authorId to the template
  res.render("create-draft", { authorId: userId });
});

// Route for handling the form submission when creating a new draft
// Purpose: Handle the form submission when the author creates a new draft and adds it to the database.
// Inputs: Draft title, subtitle, and text submitted through the form
// Outputs: Redirects to the Author's Home Page after successful creation of the draft
router.post("/create-draft", (req, res) => {
  // Retrieve the new draft data from the form submission
  const { title, subtitle, text } = req.body;
  // Retrieve the authorId from the session
  const authorId = req.session.userId;

  // Construct the query to insert the new draft into the database
  const query =
    "INSERT INTO drafts (title, subtitle, text, author_id) VALUES (?, ?, ?, ?)";
  const values = [title, subtitle, text, authorId];

  // Execute the query to insert the new draft into the database
  global.db.run(query, values, (err) => {
    if (err) {
      // Handle the error, e.g., render an error page or display an error message
      console.error("Error saving new draft:", err);
      // Redirect to the Author - Home Page
      res.redirect("/author/home");
    } else {
      // Redirect the user back to the Author - Home Page after creating the draft
      res.redirect("/author/home"); // Redirect to the Author - Home Page
    }
  });
});

// Route for deleting an article
// Purpose: Handle the request to delete an article from the database.
// Inputs: Article ID of the article to be deleted
// Outputs: Redirects to the Author's Home Page after successful deletion of the article
router.delete("/delete-article/:id", isAuthenticated, (req, res, next) => {
  const articleId = req.params.id;

  // Construct the query to delete the article from the database
  const query = "DELETE FROM articles WHERE article_id = ?";
  global.db.run(query, [articleId], (err) => {
    if (err) {
      return next(err);
    }
    // Redirect back to the Author - Home Page after successful deletion
    // res.redirect("/author/home");
    // Send a 200 OK response
    res.sendStatus(200);
  });
});

// Route for publishing a draft and moving it to the articles table
// Purpose: Handle the request to publish a draft by moving it from the drafts table to the articles table.
// Inputs: Draft ID of the draft to be published
// Outputs: Redirects to the Author's Home Page after successful publishing of the draft
router.post("/publish-article/:id", isAuthenticated, (req, res, next) => {
  const draftId = req.params.id;

  // Fetch the data of the draft from the drafts table
  const querySelectDraft = "SELECT * FROM drafts WHERE draft_id = ?";
  global.db.get(querySelectDraft, [draftId], (err, draft) => {
    if (err) {
      return next(err);
    }

    if (!draft) {
      // If the draft is not found, handle it as an error
      const error = new Error("Draft not found");
      error.statusCode = 404;
      return next(error);
    }

    // Insert the data from the draft into the articles table
    const queryInsertArticle =
      "INSERT INTO articles (title, subtitle, content, publication_date, author_id) VALUES (?, ?, ?, ?, ?)";
    const currentDate = new Date().toISOString();
    const values = [
      draft.title,
      draft.subtitle,
      draft.text,
      currentDate, // Set the current date as the publication_date
      draft.author_id,
    ];
    global.db.run(queryInsertArticle, values, (err) => {
      if (err) {
        return next(err);
      }

      // Delete the record of this draft from the drafts table
      const queryDeleteDraft = "DELETE FROM drafts WHERE draft_id = ?";
      global.db.run(queryDeleteDraft, [draftId], (err) => {
        if (err) {
          return next(err);
        }

        // Redirect back to the Author - Home Page after successful publishing
        res.redirect("/author/home");
      });
    });
  });
});

module.exports = router;
