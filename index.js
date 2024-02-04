const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const app = express();
const port = 80;
// Import the path module
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const authMiddleware = require("./authMiddleware");
const userRoutes = require("./routes/user");
const authorRoutes = require("./routes/author");
const readerRoutes = require("./routes/reader");
const homepageRoutes = require("./routes/homepage");

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
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    // Set to true if using HTTPS
    cookie: { secure: false },
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

// Add the reader routes middleware (No authentication required for reader routes)
app.use("/", homepageRoutes);

// Add the reader routes middleware (No authentication required for reader routes)
app.use("/reader", readerRoutes);

// Add the user routes middleware (No authentication required for user routes)
app.use("/user", userRoutes);

// Add the author routes middleware (Apply the isAuthenticated middleware to protect author routes)
app.use("/author", authMiddleware.isAuthenticated, authorRoutes);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
