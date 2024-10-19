/**
 * @module middleware/isAuthenticated.js
 * @description Middleware to authenticate users by verifying JWT tokens from cookies.
 */
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { User } from "../models/user.model.js";

/**
 * @function isAuthenticated
 * @async
 * @description Checks for a valid JWT token in cookies and authenticates the user.
 * @returns {void} Does not return a value; calls the next middleware function or an error.
 */
const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies; // Retrieve token from cookies
  try {
    if (!token) {
      return next(createHttpError(404, "Login to your account")); // Check if token exists
    }
    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(createHttpError(401, "Token Expired")); // Handle expired token
        }
        return next(createHttpError(401, "Invalid Token")); // Handle invalid token
      }
      req.user = await User.findById({ _id: decoded._id }); // Fetch user by ID from token
      return next(); // Proceed to next middleware
    });
  } catch (error) {
    return next(error); // Pass error to next middleware
  }
};

export default isAuthenticated;
