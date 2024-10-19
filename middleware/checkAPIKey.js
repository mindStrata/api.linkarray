/**
 * @module middleware/checkAPIKey.js
 * @description Middleware to validate the API key from request headers.
 * It checks the API key in production mode and allows all requests in development mode.
 */
import createHttpError from "http-errors";
import config from "../config/config.js";

/**
 * @function checkAPIKey
 * @description Middleware to validate the API key from request headers. Allows all requests in development mode and checks for a valid API key in production mode.
 * @returns {void}
 */

const checkAPIKey = (req, res, next) => {
  const apiKey = req.headers["linkarray-api-key"];

  // Allow all requests in development environment
  if (config.SERVER_ENVIRONMENT === "development") {
    return next();
  } else if (config.SERVER_ENVIRONMENT === "production") {
    if (!apiKey) return next(createHttpError.NotFound("API Key is required"));

    const validApiKey = config.APIKey;
    if (apiKey !== validApiKey) {
      return next(createHttpError.Unauthorized("Invalid API Key"));
    }
    // Proceed if API key is valid
    return next();
  }
};

export default checkAPIKey;
