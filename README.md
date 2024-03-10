https://docs.google.com/document/d/1CCGiZbU7r11pg6GEvsVHNuLEW8w9K8XsbCyCe_KkGC8/edit?resourcekey=0-alQZr4yI3vB_DF5wCPEMtw&tab=t.0#heading=h.hc18gxedosej

# CS Students Hub - Final Report

## Project Overview

Welcome to the CS Students Hub, a collaborative platform meticulously crafted to support and empower computer science students throughout their academic journey. This section provides comprehensive information on setting up, utilizing, and understanding the CS Students Hub, specifically tailored for the CM2040 Database Networks and the Web coursework.

## Installation Requirements

Ensure the following dependencies are installed on your system:

- **NodeJS**
  - Installation: [Node.js Website](https://nodejs.org/en/)
  - Recommended: Use the latest LTS version
- **SQLite3**
  - Windows users: Follow instructions [here](https://www.sqlitetutorial.net/download-install-sqlite/)
  - Mac users: Preinstalled
  - Linux users: Use a package manager (e.g., `apt install sqlite3`)

To install Node packages, execute the following command from the project directory:

<!-- ```bash -->
npm install

## Navigating Node SQLite3

While Node SQLite3 may differ in some aspects from MySQL, the fundamental concepts remain consistent. Refer to the following resources for guidance:

- **API Documentation**
- [SQLite Tutorials](https://www.sqlitetutorial.net/sqlite-nodejs/) (Featuring examples and tutorials around SQLite queries)

## Utilizing this Template

This template forms the bedrock for your coursework. Follow these steps to commence:

1. Run `npm run build-db` to instantiate the database (`database.db`).
2. Run `npm run start` to activate the web app (Accessible via [http://localhost:3000](http://localhost:3000)).

Additional commands:

- `npm run clean-db`: Eradicate the database for a pristine start.

## Progressing Forward

- Dive into the file structure and code intricacies.
- Assimilate insights from comments throughout the codebase.
- Access each route via the browser for a nuanced understanding of its functionality.
- Construct EJS pages for each route to retrieve and display data.
- Elevate the `create-user-record` page to enable text configuration in the record.
- Extend functionality by adding new routes and pages for users to create personalized records.

## Crafting Database Tables

All database tables should be sculpted by modifying `db_schema.sql`. This practice facilitates comprehensive review and recreation of your database by executing `npm run build-db`. Strictly avoid creating or modifying database tables through alternative means.

## Preparing for Immaculate Submission

Before submission, replicate this folder and eliminate the following files and folders:

- `node_modules`
- `.git` (The hidden folder housing your git repository)
- `database.db` (Your database)

Verify that your `package.json` file encompasses all dependencies for your project. Append the `--save` tag each time npm installs a dependency.

## Initiating Your Project

Refine this section to encompass essential settings for configuration files and provide concise instructions for accessing reader and author pages once the app is operational.

**Note**: We will ONLY execute `npm install`, `npm run build-db`, and `npm run start`. Additional package installations or running supplementary build scripts are expressly forbidden. Exercise caution when incorporating additional node dependencies.

# API Integration Overview

Our CS Student Hub utilizes several external APIs to enhance the user experience and provide valuable features. Below is a brief overview of the APIs integrated into our platform:

## YouTube API (`YOUTUBE_API_KEY`)

The [YouTube API](https://developers.google.com/youtube/v3), powered by Google, enables seamless integration of educational videos and content directly into our platform. This feature allows users to access a curated selection of instructional videos, tutorials, and lectures, enhancing the learning experience with visual and auditory aids.

## Google Books API (`GOOGLE_BOOKS_API_KEY`)

The [Google Books API](https://developers.google.com/books), empowers our platform to offer a comprehensive library of relevant books and study materials. Users can explore, search, and discover a wealth of literary resources, making our hub a one-stop destination for academic and reference materials.

## Unsplash API (`UNSPLASH_API_KEY`)

The [Unsplash API](https://unsplash.com/developers) enriches the visual aspect of our platform by providing high-quality and diverse images related to computer science and technology. This integration enhances the overall aesthetics of the hub, creating an engaging and visually appealing learning environment.

## Google Custom Search API (`GOOGLE_SEARCH_ENGINE_ID`, `GOOGLE_API_KEY`)

The [Google Custom Search API](https://developers.google.com/custom-search) is employed to offer an efficient and tailored search experience within our platform. Users can easily search for specific topics, articles, and tutorials, streamlining the process of discovering relevant information. The integration enhances the overall accessibility of resources.
