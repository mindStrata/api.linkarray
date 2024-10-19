/**
 * @module controllers/user.controller.js
 * @description Controller functions for user-related operations.
 */
import createHttpError from "http-errors";
import { Link } from "../models/link.model.js";
import { User } from "../models/user.model.js";

/**
 * @function getProfile
 * @async
 * @description Retrieves the user profile based on the authenticated user's ID for update and customization.
 * If the user is not found, an error is thrown.
 * @access private Authentication is required
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const getProfile = async (req, res, next) => {
  const getUser = req.user;
  // If empty throw error
  if (!getUser) return next(createHttpError(404, "Something went wrong"));
  try {
    const user = await User.findById(getUser._id).populate("links");
    // If user is not found then throw error
    if (!user)
      return next(createHttpError.NotFound("User not found, try again"));
    res.status(200).json({
      success: true,
      message: "Profile details fetched successfully",
      user,
      error: null,
    });
  } catch (error) {
    // res.status(500).json({ message: "Server error", error: error.message });
    return next(error);
  }
};

/**
 * @function deleteAccount
 * @async
 * @description Delete user account by user id
 * @access private Authentication is required
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const deleteAccount = async (req, res, next) => {
  const getUser = req.user;
  // If empty throw error
  if (!getUser) return next(createHttpError(404, "User not found"));
  try {
    const deletedUser = await User.findByIdAndDelete(getUser._id);
    // If user is not found then throw error
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Delete the all data from the database associated with the user id
    const deleteLinks = await Link.deleteMany({ user: getUser._id });
    res.status(200).json({
      message: "User and associated data deleted successfully",
      deletedUser,
      deletedLinksCount: deleteLinks.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

// Will be added in the future
// export const updateProfileById = async (req, res, next) => {};

/**
 * @function getUserByUsername
 * @async
 * @description Delete user account by user id
 * @access public Anyone can see user profile by the userid
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const getUserByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).populate("links");
    // If user is not found then throw error
    if (!user) return next(createHttpError(404, "User doesn not exist"));
    res.json({
      success: true,
      message: "User details fetched successfuly",
      user,
      error: null,
    });
  } catch (error) {
    // Pass the error to the error handler
    return next(error);
  }
};
