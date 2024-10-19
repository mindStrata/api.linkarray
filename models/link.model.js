/**
 * @module models/link.model.js
 * @description Defines the Mongoose schema for Link documents, including fields for
 * title, URL, visibility, and user association, with automatic timestamps.
 */

import mongoose from "mongoose";

/**
 * Schema for a Link document in MongoDB.
 * @type {mongoose.Schema}
 */
const LinkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Title is required
      minlength: [3, "Minimum length 3 characters"],
      maxlength: [50, "Maximum length is 50"],
      trim: true, // Trim whitespace
    },
    url: {
      type: String,
      required: true, // URL is required
      // match: /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-]*)*\/?$/, // URL format validation
      trim: true, // Trim whitespace
    },
    isVisible: {
      type: Boolean,
      default: true, // Default visibility is true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true, // User is required
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

export const Link = mongoose.models.Link || mongoose.model("Link", LinkSchema);
