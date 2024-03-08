const bcrypt = require("bcrypt");

// Middleware to check if the user is authenticated (route protection)
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Middleware to check if the user is authenticated (misc check)
const isAuthenticatedMisc = (cookieAuthValue) => {
  if (cookieAuthValue) {
    return true;
  } else {
    return false;
  }
};

// Middleware to handle the author login
const handleLogin = (req, res) => {
  const { username, password } = req.body;
  console.log("Received login request.");
  console.log("Form data:", username, password);
  // Fetch the user from the database based on the provided username
  const query = "SELECT * FROM users WHERE name = ?";
  global.db.get(query, [username], (err, user) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.redirect("/login");
    } else if (user) {
      console.log("Retrieved User from Database:", user);
      console.log("Stored Hashed Password from Database:", user.auth_key);
      console.log("Provided Password:", password);
      console.log("Stored Hashed Password:", user.auth_key);
      // User found, check if the provided password matches the stored hashed password
      if (bcrypt.compareSync(password, user.password)) {
        console.log("Password Matched!");
        // Password matches, user is authenticated
        req.session.isAuthenticated = true;
        req.session.userId = user.user_id; // Store the user ID in the session for future reference
        req.session.authorID = user.user_id; // Store the user ID in the session for future reference
        req.session.readerID = user.user_id; // Store the user ID in the session for future reference
        req.session.userName = user.name; // Store the user name in the session for future reference
        req.session.authorName = user.name; // Store the author name in the session for future reference
        req.session.readerName = user.name; // Store the author name in the session for future reference
        console.log("Session authorName:", req.session.authorName); // Debugging log

        // Depending on the user's role (author or reader), redirect to the appropriate route
        if (user.role === "author") {
          res.redirect("/author");
        } else if (user.role === "reader") {
          res.redirect("/reader");
        } else {
          // Handle other roles as needed
          res.redirect("/"); // Redirect to the homepage for unknown roles
        }
      } else {
        console.log("Password Not Matched!");
        // Password does not match
        res.redirect("/login");
      }
    } else {
      // User not found
      res.redirect("/login");
    }
  });
};

module.exports = { isAuthenticated, handleLogin, isAuthenticatedMisc };
