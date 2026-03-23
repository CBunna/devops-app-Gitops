# Stage 1: Build the application

# Define base image

FROM node:20-alpine AS build

# Set working directory

WORKDIR /app

# Copy package*.json to /app directory

COPY package*.json ./

# Install dependencies

RUN npm install

# Copy the rest of the code to /app directory

COPY . .

# Build the application

RUN npm run build

# Stage 2: Serve the application with Nginx

FROM nginx:stable-alpine

# Copy the build output to Nginx server

COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80

EXPOSE 80

# Start Nginx server

CMD ["nginx", "-g", "daemon off;"]
