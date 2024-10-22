/**
 * @module routes/link.route.js
 * @file Handles the all routes associated with authentication
 * @description This file defines routes related to managing links. It includes routes for adding, getting, updating, and deleting links. All routes require the user to be authenticated.
 */

import express from "express";
import {
  addLink,
  deleteLinkById,
  getLinks,
  updateLinkById,
} from "../controller/link.controller.js";
import isAuthenticated from "../middleware/isAutheticated.js";
import {
  linkIdValidation,
  linkValidation,
} from "../validators/link.route.validation/index.js";

const router = express.Router();

/**
 * @route POST /addlink
 * @description Adds a new link to the user's collection.
 * @access Protected - Requires authentication
 * @middleware linkValidation - Validates the link data in the request body
 * @middleware isAuthenticated - Ensures the user is logged in
 * @controller addLink - Handles adding the new link
 */
router.post("/addlink", linkValidation, isAuthenticated, addLink);

/**
 * @route GET /getlinks
 * @description Retrieves all links belonging to the authenticated user.
 * @access Protected - Requires authentication
 * @middleware isAuthenticated - Ensures the user is logged in
 * @controller getLinks - Handles fetching the user's links
 */
router.get("/getlinks", isAuthenticated, getLinks);

/**
 * @route /:linkId
 * @description Routes for updating or deleting a link by its ID.
 * @method PUT - Updates the link with the specified ID.
 * @method DELETE - Deletes the link with the specified ID.
 * @access Protected - Requires authentication
 * @middleware linkIdValidation To validate the parameter
 * @middleware isAuthenticated - Ensures the user is logged in
 * @controller updateLinkById - Handles updating the link
 * @controller deleteLinkById - Handles deleting the link
 */
router
  .route("/:linkId")
  .put(linkIdValidation, isAuthenticated, updateLinkById) // Update the link by ID
  .delete(linkIdValidation, isAuthenticated, deleteLinkById); // Delete the link by ID

export default router;
