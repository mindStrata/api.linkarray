/**
 * @module routes/user.route.js
 * @file Handles the all routes associated with authentication
 * @description This file defines routes related to user operations. It includes routes for getting the user profile, deleting an account, and fetching a user by their
 */

import express from "express";
import {
  deleteAccount,
  getProfile,
  getUserByUsername,
} from "../controller/user.controller.js";
import isAuthenticated from "../middleware/isAutheticated.js";
import { usernameValidation } from "../validators/user.route.validation/index.js";

const router = express.Router();

/**
 * @route /profile
 * @description Route for user profile management
 * @method GET - Retrieves the current user's profile.
 * @method DELETE - Deletes the current user's account.
 * @access Protected - Requires authentication
 * @middleware isAuthenticated - Ensures the user is logged in
 * @controller getProfile, deleteAccount - Handles fetching and deleting the profile
 */
router
  .route("/profile")
  .get(isAuthenticated, getProfile) // Get the authenticated user's profile
  .delete(isAuthenticated, deleteAccount); // Delete the authenticated user's account

/**
 * @route /:username
 * @description Route for fetching a user by their username.
 * @method GET - Retrieves the profile of a user based on their username.
 * @access Public
 * @middleware usernameValidation - Ensures the username parameter is valid
 * @controller getUserByUsername - Handles the logic for fetching a user by username
 */
router.get("/:username", usernameValidation, getUserByUsername);

export default router;
