PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Drop the previously created tables (if they exist) to recreate them
DROP TABLE IF EXISTS drafts;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS readers;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    auth_key TEXT NOT NULL
);

-- Create the settings table as a child table of users
CREATE TABLE IF NOT EXISTS settings (
    user_id INTEGER PRIMARY KEY,
    blogTitle TEXT NOT NULL,
    subtitle TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create the articles table
CREATE TABLE IF NOT EXISTS articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT,
    publication_date TEXT,
    likes INTEGER DEFAULT 0,
    author_id INTEGER,
    views INTEGER DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

-- Create the comments table
CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    publication_date TEXT,
    article_id INTEGER,
    reader_id INTEGER,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE,
    FOREIGN KEY (reader_id) REFERENCES users(user_id)
);

-- Create the saved_articles table
CREATE TABLE IF NOT EXISTS saved_articles (
    saved_article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER,
    reader_id INTEGER,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE,
    FOREIGN KEY (reader_id) REFERENCES users(user_id)
);

-- Create the drafts table
CREATE TABLE IF NOT EXISTS drafts (
    draft_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subtitle TEXT,
    text TEXT,
    author_id INTEGER,
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

-- Insert some default data for testing (optional)
INSERT INTO users (name, role, auth_key) VALUES
    ('Simon Star', 'author', 'some_auth_key_for_author'),
    ('John Doe', 'reader', 'some_auth_key_for_reader');

INSERT INTO settings (user_id, blogTitle, subtitle) VALUES
    (1, 'My Blog', 'A blog about interesting things');

INSERT INTO articles (title, subtitle, content, publication_date, author_id) VALUES
    ('Sample Article 1', 'Subtitle for Article 1', 'Content of Article 1', '2023-07-19', 1),
    ('Sample Article 2', 'Subtitle for Article 2', 'Content of Article 2', '2023-07-20', 1);

INSERT INTO drafts (title, subtitle, text, author_id) VALUES
    ('Draft 1', 'Subtitle for Draft 1', 'Draft content goes here', 1);

INSERT INTO comments (text, publication_date, article_id, reader_id) VALUES
    ('Great article!', '2023-07-19', 1, 2),
    ('Interesting read!', '2023-07-20', 2, 2);

COMMIT;