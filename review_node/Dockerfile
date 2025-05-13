FROM node:18-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Set environment variables
ENV PORT=8082
ENV NODE_ENV=production
ENV DB_HOST=mysql
ENV DB_USER=root
ENV DB_PASSWORD=rootpassword
ENV DB_NAME=reviews_db
ENV EUREKA_HOST=eureka-server
ENV EUREKA_PORT=8761
ENV HOSTNAME=reviews-service

# Expose the application port
EXPOSE 8082

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q -O /dev/null http://localhost:8082/health || exit 1

# Start command
CMD ["node", "app.js"]
