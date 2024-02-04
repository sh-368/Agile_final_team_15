# Use an official Node runtime as the base image
FROM node

# Copy the current directory contents into the container at /usr/src/app
RUN mkdir -p ./app
COPY . ./app
WORKDIR /app

# Install any needed packages specified in package.json
RUN npm run build

# Expose the default Node.js port (80) for HTTP traffic
EXPOSE 80

# Start the Node.js application when the container starts
CMD ["npm", "start"]
