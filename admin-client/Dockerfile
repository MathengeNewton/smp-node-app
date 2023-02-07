# Use the latest Node.js image as the base
FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy the package.json file and install the dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Set environment variables
ENV NODE_ENV production

# Build the Next.js application
RUN npm run build

# Specify what port to listen on
EXPOSE 3000

# Start the Next.js application
CMD [ "npm", "start" ]
