/**
 * @module middleware/checkRole.js
 * @description Middleware to check if the user has the required role.
 */
import createHttpError from "http-errors";

/**
 * @function checkRole
 * @description It verifies the user's role against the specified roles and grants or denies access accordingly. If the user is not authenticated or does not have the required role, an error is thrown.
 * @param {Array<string>} role - Array of roles allowed to access the route.
 */
const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user) return next(createHttpError(404, "Unauthorized...")); // Check if user is authenticated
    if (role.includes(req.user.role)) {
      return next(); // Proceed if user has the required role
    } else {
      return next(
        createHttpError.Unauthorized("Sorry, you do not have access")
      ); // Deny access
    }
  };
};

export default checkRole;
