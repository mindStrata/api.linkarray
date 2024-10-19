/**
 * @module validators/user.route.validation/index.js
 * @file This file handles the parameter validation of username
 */
import { param } from "express-validator";

/**
 * @middleware usernameValidation
 * @type {Array}
 * @description Uses the following validation rules, if not match, throws error.
 */
export const usernameValidation = [
  param("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/)
    .withMessage(
      "Username must contain at least one letter and can include numbers, but cannot consist solely of numbers"
    ),
];
