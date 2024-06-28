# Use a base image with JDK 17
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the jar file into the container
COPY target/deukgeun-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on
EXPOSE 30000:8080

# Define the command to run the application
CMD ["java", "-jar", "app.jar"]
