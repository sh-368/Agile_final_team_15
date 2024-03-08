const functions = require("firebase-functions");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
// Instantiate instance of Express app:
const app = express();
// Set config for Express app
const port = process.env.PORT || 443;
// Import the path module
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const authMiddleware = require("./authMiddleware");
const userRoutes = require("./routes/user");
const authorRoutes = require("./routes/author");
const readerRoutes = require("./routes/reader");
const homepageRoutes = require("./routes/homepage");
const resourcesRoutes = require("./routes/resources");
const toolsRoutes = require("./routes/tools");
const communityRoutes = require("./routes/community");
const careersRoutes = require("./routes/careers");

// Set up the database connection
global.db = new sqlite3.Database("./database.db", function (err) {
  if (err) {
    console.error(err);
    process.exit(1); // Bail out if unable to connect to the DB
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); // Enable foreign key constraints in SQLite
  }
});

// Set the app to use EJS for rendering
app.set("view engine", "ejs");

// Middleware for session management
app.use(
  session({
    secret: [
      "nhCL6aPj$eGwNp8mzDQFKf",
      "hnWH+dpVU$BczeR4Q7guf5",
      "fhR!+z7WjcTnpUGD4@ZQ=^",
      "azNR*Yke#=tpJ8C62!mqgB",
      "fr*=9SF!4yPtBTq8h5Qapc",
    ],

    // Save the session object in session store if not modified in current request:
    resave: false,

    // New session objects that are not yet modified.
    // This will save any sessions even if not logged in.
    // *Check Legal Cookie Policy per region
    saveUninitialized: true,

    // Cookie object config:
    cookie: {
      // Encrypts session object (the cookie)
      // Set to true if using HTTPS
      secure: false,

      // Expires cookies every 12 hours (Note: default is 400 days)
      maxAge: 43200000,

      // Sets default as no user logged in
      isAuthenticated: false,
    },
  })
);

// // Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Route for the Author Login Page
app.get("/login", (req, res) => {
  res.render("user-login");
});

// Route to handle author login form submission
app.post("/login", authMiddleware.handleLogin);

// Add the resources routes middleware (No authentication required)
app.use("/resources", resourcesRoutes);

// Add the tools routes middleware (No authentication required)
app.use("/tools", toolsRoutes);

// Add the Community routes middleware (No authentication required)
app.use("/community", communityRoutes);

// Add the Community routes middleware (No authentication required)
app.use("/careers", careersRoutes);

// Add the homepage routes middleware (No authentication required)
app.use("/", homepageRoutes);

// Add the reader routes middleware (No authentication required)
app.use("/reader", readerRoutes);

// Add the user routes middleware (No authentication required)
app.use("/user", userRoutes);

// Add the author routes middleware (Apply the isAuthenticated middleware to protect user routes)
app.use("/author", authorRoutes);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// export express app instance. Imported by Firebase functions:
exports.app = functions.region("europe-west1").https.onRequest(app);
