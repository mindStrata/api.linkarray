/**
 * @module validators/admin.route.validation/index.js
 * @file This file handles the parameter validation of userid (_id)
 */
import { param } from "express-validator";

/**
 * @middleware userIdValidation
 * @type {Array}
 * @description Uses the following validation rules, if not match, throws error.
 */
export const userIdValidation = [
  param("userid")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
];
