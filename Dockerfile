# Use the official Node.js image with the desired version (Node.js 22)
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# Expose the port your app will be listening on (replace 3000 with your app's port)
EXPOSE 9000

# Start the Node.js application
CMD ["node", "server.js"] 
