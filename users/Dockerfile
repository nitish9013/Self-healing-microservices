# =========================================================
# BUILD STAGE
# =========================================================
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Maven wrapper + project files
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .

# Make Maven wrapper executable
RUN chmod +x mvnw

# Download dependencies first for better Docker layer caching
RUN ./mvnw dependency:go-offline -B

# Copy application source
COPY src src

# Build Spring Boot application
RUN ./mvnw clean package -DskipTests


# =========================================================
# RUNTIME STAGE
# =========================================================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy generated Spring Boot JAR
COPY --from=build /app/target/*.jar app.jar

# Documentation/default container port
EXPOSE 8082

# Start application
ENTRYPOINT ["java", "-jar", "app.jar"]