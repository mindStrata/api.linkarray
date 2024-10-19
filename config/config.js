/**
 * @module config/config.js
 * @description Configuration settings for the application, including server port, database connection, and environment variables.
 */
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const config = {
  port: process.env.PORT || 4100, // Server port
  db: {
    uri: process.env.DATABASE_URI || "mongodb://localhost:27017/", // MongoDB connection URI
    dbName: process.env.DATABASE_NAME || "Dev-Database", // MongoDB database name
  },
  jwtSecret: process.env.JWT_SECRET || "some-jwt-secret", // JWT secret key for token signing
  APIKey: process.env.LINK_CLUSTER_API_KEY || "some-api-key", // API key for external services
  SERVER_ENVIRONMENT: process.env.NODE_ENV || "development", // Server environment (development or production)
  clientURL: process.env.CLIENT_URL || "http://localhost:5173", // Frontend client URL (React.js default)
};

export default config;
