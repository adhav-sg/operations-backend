# Use the Node official image
# https://hub.docker.com/_/node
FROM node:lts

# Create and change to the app directory.
WORKDIR /app

# Copy local code to the container image
COPY . ./

# Install packages
RUN npm ci

# Build the application
RUN npm run build

# Serve the app
CMD ["npm", "run", "start:prod"]