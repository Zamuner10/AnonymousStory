# Etapa 1: Build da aplicação usando a imagem oficial do OpenJDK 25
FROM openjdk:25-ea-jdk-slim AS builder
WORKDIR /app

# Instala o Maven para realizar a compilação
RUN apt-get update && apt-get install -y maven

COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Execução leve com a imagem do Java 25
FROM openjdk:25-ea-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]