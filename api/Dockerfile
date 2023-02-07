FROM node:16-alpine

WORKDIR /app

# Copy and download dependencies
COPY [".env","secret-key"]

COPY package.json ./

RUN npm install

# Copy the source files into the image
COPY . .

EXPOSE 8082

CMD npm start