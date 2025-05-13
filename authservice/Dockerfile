# Use an appropriate base image (e.g., Eclipse Temurin for JDK 17)
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy the built jar file from your local target folder to the container
COPY target/*.jar app.jar

# Expose the port that the application will run on
EXPOSE 8880

# Command to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
