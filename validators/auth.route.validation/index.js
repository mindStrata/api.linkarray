/**
 * @module validators/auth.route.validation/index.js
 * @file This file handles the form data validations send from the client
 */
import { body } from "express-validator";

/**
 * @middleware loginValidation
 * @type {Array}
 * @description Uses the following validation rules, if not match, throws error.
 */
export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

/**
 * @middleware signupValidation
 * @type {Array}
 * @description Uses the following validation rules, if not match, throws error.
 */
export const signupValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/)
    .withMessage(
      "Username must contain at least one letter and can include numbers, but cannot consist solely of numbers"
    ),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character"),
];
