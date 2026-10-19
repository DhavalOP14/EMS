FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Install bash and dos2unix to fix Windows line endings
RUN apk add --no-cache bash dos2unix

# Copy project files
COPY . .

# Convert Windows CRLF line endings to Linux LF and grant execution rights
RUN dos2unix ./mvnw && chmod +x ./mvnw

# Run Maven build using bash
RUN ./mvnw clean package -DskipTests

# Stage 2: Minimal runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]