/**
 * @module routes/admin.route.js
 * @file Handles the all routes associated with admin
 * @description  This file defines routes for admin-specific operations. These routes are protected by authentication and role-based access control. The routes include fetching dashboard data, retrieving/updating/deleting user details.
 */
import express from "express";
import {
  deleteUserById,
  getDashboard,
  getUserById,
  updatUserById,
} from "../controller/admin.controller.js";
import checkRole from "../middleware/checkRole.js";
import isAuthenticated from "../middleware/isAutheticated.js";
import { userIdValidation } from "../validators/admin.route.validation/index.js";

const router = express.Router();

/**
 * @route GET /dashboard
 * @description Fetches admin dashboard data.
 * @access Protected - Only authenticated users with 'admin' role
 * @middleware isAuthenticated - Ensures the user is logged in
 * @middleware checkRole(["admin"]) - Ensures the user has the 'admin' role
 * @returns {object} 200 - Admin dashboard data
 */
router.get("/dashboard", isAuthenticated, checkRole(["admin"]), getDashboard);

/**
 * @route GET /dashboard/user/:userid
 * @description Fetches the user details for a specific user by ID.
 * @access Protected - Only authenticated users with 'admin' role
 * @middleware userIdValidation - Validates the 'userid' parameter
 * @middleware isAuthenticated - Ensures the user is logged in
 * @middleware checkRole(["admin"]) - Ensures the user has the 'admin' role
 * @param {string} userid - The ID of the user to fetch
 */
router.get(
  "/dashboard/user/:userid",
  userIdValidation,
  isAuthenticated,
  checkRole(["admin"]),
  getUserById
);

/**
 * @route PUT /dashboard/user/:userid
 * @description Updates the details of a specific user by ID.
 * @access Protected - Only authenticated users with 'admin' role
 * @middleware userIdValidation - Validates the 'userid' parameter
 * @middleware isAuthenticated - Ensures the user is logged in
 * @middleware checkRole(["admin"]) - Ensures the user has the 'admin' role
 * @param {string} userid - The ID of the user to update
 */
router.put(
  "/dashboard/user/:userid",
  userIdValidation,
  isAuthenticated,
  checkRole(["admin"]),
  updatUserById
);

/**
 * @route DELETE /dashboard/user/:userid
 * @description Deletes a specific user by ID.
 * @access Protected - Only authenticated users with 'admin' role
 * @middleware userIdValidation - Validates the 'userid' parameter
 * @middleware isAuthenticated - Ensures the user is logged in
 * @middleware checkRole(["admin"]) - Ensures the user has the 'admin' role
 */
router.delete(
  "/dashboard/user/:userid",
  userIdValidation,
  isAuthenticated,
  checkRole(["admin"]),
  deleteUserById
);

export default router;
