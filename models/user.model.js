/**
 * @module models/user.model.js
 * @description Defines the Mongoose schema for User documents, including fields for
 * name, username, email, password, links, and user role, with automatic timestamps.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // User's name
    username: {
      type: String,
      required: [true, "Username is required."], // Username is required
      unique: [true, "Username is not available"], // Ensure unique usernames
    },
    email: {
      type: String,
      required: [true, "Email is required."], // Email is required
      unique: [true, "Email already exists"], // Ensure unique emails
    },
    password: {
      type: String,
      required: [true, "Password is required."], // Password is required
      minlength: [6, "Password must be at least 6 characters long"], // Minimum length for password
      select: false, // Do not return password by default
    },
    links: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Link", // Reference to Link model
        required: true, // Links are required
      },
    ],
    role: {
      type: String,
      enum: ["admin", "user", "guest"], // User roles
      required: true,
      default: "user", // Default role is user
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

/**
 * Middleware to hash the password before saving the user document.
 * @function
 * @param {Function} next - Callback to proceed to the next middleware.
 */
userSchema.pre("save", async function (next) {
  try {
    const genSalt = await bcrypt.genSalt(12); // Generate salt
    const hashedPassword = await bcrypt.hash(this.password, genSalt); // Hash the password
    this.password = hashedPassword; // Replace plain password with hashed password
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
});

/**
 * Method to compare a plain password with the hashed password.
 * @function comparePassword
 * @param {string} password - The plain password to compare.
 * @returns {Promise<boolean>} - Returns true if passwords match, else false.
 */
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password); // Compare passwords
  } catch (error) {
    throw error; // Throw error if comparison fails
  }
};

// Export the User model, ensuring it doesn't create a duplicate model if it already exists
export const User = mongoose.models.User || mongoose.model("User", userSchema);
