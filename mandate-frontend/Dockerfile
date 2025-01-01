# 1. Build stage
FROM node:16 AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build production bundle
RUN npm run build

# 2. Run stage - serve with NGINX
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run NGINX
ENTRYPOINT ["nginx", "-g", "daemon off;"]
