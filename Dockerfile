# Use the official Node.js image for Node 22
FROM node:22

# Install PM2 globally
RUN npm install -g pm2

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose the port that your app will run on (replace 3000 with your app's port)
EXPOSE 9000

# Start the app using PM2
CMD ["pm2", "start", "server.js", "--no-daemon"]  # Replace server.js with your entry point file
