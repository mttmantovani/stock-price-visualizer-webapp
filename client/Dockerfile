FROM node:20

# Set the working directory
WORKDIR /app

# Copy the client code
COPY client/package*.json ./
COPY client/ .

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 5173

# Command to run the Vite development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]