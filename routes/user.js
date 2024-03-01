const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
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
      if (row) {
        // User already exists, handle accordingly
        res.send("User already exists");
      } else {
        // User does not exist, proceed with insertion
        console.log("User does not exist. Proceeding to creation")
        // Hash the password using bcrypt before inserting it into the database

        bcrypt.hash(password, 10, function(err, hash) {
          // Store hash in your password DB.
          console.log(hash);
          
          global.db.run(
            "INSERT INTO users (name, role, password) VALUES (?, ?, ?);",
            [name, role, hash],
            function (err) {
              if (err) {
                console.error("Error inserting new user:", err);
                next(err); // Send the error to the error handler
              } else {
                console.log("successfully created user!")
                const userId = this.lastID;
                res.redirect("/login");
              }
            }
          );

        });
        
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
