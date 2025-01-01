# 1. Build stage (using Maven to compile + package)
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy the pom.xml file and download dependencies (cache for faster builds)
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy the actual source code
COPY src ./src

# Package the application (skip tests for speed)
RUN mvn clean package -DskipTests

# 2. Run stage (lightweight JRE)
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
