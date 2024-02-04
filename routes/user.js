const express = require("express");
const router = express.Router();
// Route for creating a user record
// Purpose: Render the page for creating a new user record.
// Inputs: None
// Outputs: Rendered HTML page for creating a new user record
router.get("/create-user-record", (req, res) => {
  res.render("create-user-record");
});

// Route for adding a new user record to the database
// Purpose: Handle the form submission to add a new user record to the database.
// Inputs: User name, role, and password submitted through the form
// Outputs: Redirects to the appropriate page after successfully adding the user record
router.post("/create-user-record", (req, res, next) => {
  console.log("Received a request to create a new user.");
  const { name, role, password } = req.body;
  console.log("Form data:", name, role, password);
  // Check if the user already exists in the database
  global.db.get("SELECT * FROM users WHERE name = ?", [name], (err, row) => {
    if (err) {
      next(err); // Send the error to the error handler
    } else {
      console.log("Query result:", row);
      if (row) {
        // User already exists, handle accordingly
        res.send("User already exists");
      } else {
        // User does not exist, proceed with insertion

        // Hash the password using bcrypt before inserting it into the database
        const hashedPassword = bcrypt.hashSync(password, 10);

        global.db.run(
          "INSERT INTO users (name, role, auth_key) VALUES (?, ?, ?);",
          [name, role, hashedPassword],
          function (err) {
            if (err) {
              console.error("Error inserting new user:", err);
              next(err); // Send the error to the error handler
            } else {
              const userId = this.lastID;
              if (role === "author") {
                // Redirect to the create-author-settings view if the role is "author"
                res.redirect("/author/create-author-settings");
              } else {
                res.redirect("/reader/home");
              }
            }
          }
        );
      }
    }
  });
});

// Route for logging out the author
// Purpose: Handle the form submission to log out the user and destroy the session.
// Inputs: None (uses session data for user authentication)
// Outputs: Redirects the user to the login page or any other appropriate page after destroying the session
router.post("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    // Redirect the author to the login page or any other appropriate page
    res.redirect("/login");
  });
});

module.exports = router;
