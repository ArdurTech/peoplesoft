# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app for production
RUN npm run build

# Install a lightweight web server to serve the static build files
RUN npm install -g serve

# Expose port 3000 (or whichever port you want to serve the frontend)
EXPOSE 3000

# Command to serve the frontend app using the build folder
CMD ["serve", "-s", "build", "-l", "3000"]