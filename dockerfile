# Use an official Node runtime as the base image
FROM node

# Copy the current directory contents into the container at /usr/src/app
RUN mkdir -p /app
COPY . /app
WORKDIR /app

# Get and set env vars from build parameters
ARG GOOGLE_API_KEY
ENV GOOGLE_API_KEY $GOOGLE_API_KEY
ARG GOOGLE_SEARCH_ENGINE_ID
ENV GOOGLE_SEARCH_ENGINE_ID $GOOGLE_SEARCH_ENGINE_ID

# Install any needed packages specified in package.json
RUN apt-get update && apt-get install sqlite3
RUN npm install && npm run build-db

# Expose the default Node.js port (80) for HTTP traffic
EXPOSE 443

# Start the Node.js application when the container starts
CMD ["npm", "run", "start"]
