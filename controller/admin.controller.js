/**
 * @module controllers/admin.controller.js
 * @description Controller functions for admin's operations.
 */

import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { fillMissingDates } from "../helper/fillMissingDates.js";
import { Link } from "../models/link.model.js";
import { User } from "../models/user.model.js";

/**
 * @function getDashboard
 * @async
 * @description To get all details and overviews.
 * @access private Aithentication is required and the role should be 'admin'.
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const getDashboard = async (req, res, next) => {
  try {
    const users = await User.find().populate("links");
    const links = await Link.find();
    // Get last thirty days registered users
    const today = new Date();
    let thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: thirtyDaysAgo,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dateCounts = fillMissingDates(
      thirtyDaysAgo,
      today,
      userRegistrations
    );

    res.json({
      success: true,
      message: "User registrations for the last 30 days",
      usersCount: users,
      linksCount: links,
      registrations: dateCounts,
      error: null,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @function getUserById
 * @async
 * @descriptionGet user details by id to induce further operation by the admin.
 * @access private aithentication is required and the role should be 'admin'.
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const getUserById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(createHttpError(404, errorMessages));
  }
  const { userid } = req.params;
  try {
    const user = await User.findById({ _id: userid }).populate("links");
    if (!user) return next(createHttpError(404, "User not found"));
    res.json({
      success: true,
      message: "User fetched by id successfully",
      user,
      error: null,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @function updatUserById
 * @async
 * @description To get user details by ID for CRUD Operation.
 * @access private Aithentication is required and the role should be 'admin'.
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const updatUserById = async (req, res, next) => {
  // Validate the all parameter and the values
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(createHttpError(404, errorMessages));
  }
  const { userid } = req.params;
  const data = req.body;
  try {
    const existingEmail = await User.findOne({ email: data.email });
    // If the email exist on the database the throw error
    if (existingEmail)
      return next(
        createHttpError(401, "Email already in use, try with en another email")
      );
    const updatedUser = await User.findByIdAndUpdate(
      userid,
      {
        $set: req.body,
        $inc: { __v: 1 }, // Increment the version per update
      },
      { new: true, runValidators: true }
    );
    // Throw error if the user is not found
    if (!updatedUser) return next(createHttpError(404, "User not found"));

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function deleteUserById
 * @async
 * @description To delete a user by ID.
 * @access private Aithentication is required and the role should be 'admin'.
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const deleteUserById = async (req, res, next) => {
  // Validate the parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(createHttpError(404, errorMessages));
  }
  const { userid } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(userid);
    // Throw error if the user is not found
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Delete the corresponding links of the user
    const deleteLinks = await Link.deleteMany({ user: userid });
    res.status(200).json({
      success: true,
      message: "User and associated data deleted successfully",
      deletedUser,
      deletedLinksCount: deleteLinks.deletedCount,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
