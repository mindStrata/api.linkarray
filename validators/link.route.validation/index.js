/**
 * @module validators/link.route.validation/index.js
 * @file This file handles the form data validations send from the client
 */

import { body } from "express-validator";

/**
 * @middleware linkValidation
 * @type {Array}
 * @description Uses the following validation rules, if not match, throws error.
 */
export const linkValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Title must be 50 characters or less")
    .trim(),

  body("url")
    .notEmpty()
    .withMessage("URL is required")
    .isURL({ protocols: ["https"], require_protocol: true })
    .withMessage("Please provide a valid HTTPS URL")
    .trim(),
];
