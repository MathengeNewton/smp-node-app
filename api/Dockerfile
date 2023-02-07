# Use the official Node.js image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Set the command to start the Fastify server
CMD ["npm", "start"]
