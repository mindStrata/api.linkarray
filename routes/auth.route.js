/**
 * @module routes/auth.route.js
 * @file Handles the all routes associated with authentication
 * @description This file defines routes related to user authentication. It includes routes for logging in and signing up users.
 */

import express from "express";
import { loginUser, signupUser } from "../controller/auth.controller.js";
import {
  loginValidation,
  signupValidation,
} from "../validators/auth.route.validation/index.js";

const router = express.Router();

/**
 * @route POST /login
 * @description Authenticates a user and logs them in.
 * @access Public
 * @middleware loginValidation - Validates the login data in the request body
 * @controller loginUser - Handles user authentication
 */
router.post("/login", loginValidation, loginUser);

/**
 * @route POST /signup
 * @description Registers a new user and creates an account.
 * @access Public
 * @middleware signupValidation - Validates the signup data in the request body
 * @controller signupUser - Handles user registration
 */
router.post("/signup", signupValidation, signupUser);

export default router;
