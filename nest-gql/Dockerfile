# Use official Node.js LTS image
FROM node:20-alpine

# Create and set working directory
WORKDIR /usr/src/app

# Install dependencies first (to cache dependencies)
COPY package*.json ./
RUN npm install

# Copy remaining files
COPY . .

# Expose NestJS port
EXPOSE 3000

# Run NestJS in watch mode for development
CMD ["npm", "run", "start:dev"]
