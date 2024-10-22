/**
 * @module controllers/link.controller.js
 * @description Controller functions for link operations (CRUD).
 */
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Link } from "../models/link.model.js";
import { User } from "../models/user.model.js";

/**
 * @function addLink
 * @async
 * @description Add link based on authenticated userid.
 * @access private Authentication is required
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const addLink = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(createHttpError(404, errorMessages));
  }
  const { title, url } = req.body;
  try {
    const link = await Link.create({ title, url, user: req.user._id });
    /* Throw internal server error, if the new link is not stored on the database */
    if (!link) return next(createHttpError(500, "Something went wrong"));
    // Update the certain user document and increment the version +1,
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { links: link._id }, $inc: { __v: 1 } },
      { new: true }
    );
    res.status(201).send({
      success: true,
      message: "Link created successfully",
      link,
      error: null,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @function getLinks
 * @async
 * @description Get all links by the useri.
 * @access private Authentication is required
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const getLinks = async (req, res, next) => {
  try {
    const links = await Link.find({ user: req.user._id });
    res.status(200).send({
      success: true,
      message: "Links fetched successfully",
      links,
      error: null,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @function updateLinkById
 * @async
 * @description Update links by the link id.
 * @access private Authentication is required
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const updateLinkById = async (req, res, next) => {
  // Check validation of the fields
  const errors = validationResult(req);
  // Check validation error, if yes, then demonstrate it to the user
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(createHttpError(404, errorMessages));
  }
  // Proceed next if there is no any validation error
  const { linkId } = req.params;
  try {
    const link = await Link.findById({ _id: linkId });
    // console.log(link);
    if (
      link.url === req.body.url ||
      link.isVisible === req.body.isVisible ||
      link.title === req.body.title
    )
      return next(createHttpError(400, "Values are exactly same"));
    const updateLink = await Link.findByIdAndUpdate(
      linkId,
      {
        $set: req.body,
        $inc: { __v: 1 }, // Update the link and increment the version of a particular document
      },
      { new: true, runValidators: true }
    );
    if (!updateLink) return next(createHttpError(404, "User not found"));
    res.status(200).json({
      success: true,
      message: "Link updated successfully",
      updateLink,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function deleteLinkById
 * @async
 * @description Delete links by the link id.
 * @access private Authentication is required
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const deleteLinkById = async (req, res, next) => {
  // Check validation of the fields
  const errors = validationResult(req);
  // Check validation error, if yes, then demonstrate it to the user
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(createHttpError(404, errorMessages));
  }
  // Proceed next if there is no any validation error
  const { linkId } = req.params;

  try {
    const deleteLink = await Link.findByIdAndDelete(linkId);
    // Delete the link id from the user's link array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { links: linkId } }, // Use $pull to remove the linkId from the links array
      { new: true } // Option to return the updated document
    );

    // If the link id is invalid or not found, throw error
    if (!deleteLink) return next(createHttpError(404, "Link not found"));
    res.status(200).json({
      success: true,
      message: "Link deleted successfully",
      deleteLink,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
