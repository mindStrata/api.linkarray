/**
 * @module controllers/auth.controller.js
 * @description Controller functions for link operations (CRUD).
 */
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { User } from "../models/user.model.js";

/**
 * @function signupUser
 * @async
 * @description Registers user.
 * @access public
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const signupUser = async (req, res, next) => {
  // Validate the parameter or values
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(createHttpError(404, errorMessages));
  }
  // If OK, then procced
  const data = req.body;
  try {
    // const isExist = await User.find({ email: data.email } || {username: data.username});
    // if (isExist) return next(createHttpError.Conflict("User already exists"));
    const newUser = await User.create(data);
    // If the user is user is not stored on the database the throw internal server error
    if (!newUser) return next(createHttpError(505, "Something went wrong"));
    const token = jwt.sign({ _id: newUser._id }, config.jwtSecret, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: config.SERVER_ENVIRONMENT === "development" ? false : true,
      maxAge: 60 * 60 * 1000, // One hour validity
    });
    res.status(201).json({
      success: true,
      message: "Registration & Login successful",
      newUser,
      token,
      error: null,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @function loginUser
 * @async
 * @description Controller user for user login, if the provided credential is invalid the throws error, if all okay the sends cookie and respose data to the client.
 * @access public
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send back the user profile.
 * @param {Function} next - The next middleware function to call in the stack.
 * @returns {Promise<void>} Does not return a value; sends the user profile as a response or calls next with an error.
 */
export const loginUser = async (req, res, next) => {
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
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    // Throw error if the user is not found
    if (!user) return next(createHttpError.NotFound());
    if (!user.password)
      return next(createHttpError(500, "Something went wrong..."));
    const isMatched = await user.comparePassword(password);
    // Throw error if the password is not matched
    if (!isMatched) return next(createHttpError(401, "Invalid credentials"));
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, {
      expiresIn: "1h", //JWT token will expire within an hour
    });
    /* res.cookie("token", token, {
      // httpOnly: config.SERVER_ENVIRONMENT === "development" ? false : true,
      httpOnly: true,
      sameSite: "None",
      // sameSite: "Strict",
      secure: config.SERVER_ENVIRONMENT,
      maxAge: 60 * 60 * 1000, // One hour validity
    }); */
    res.cookie("token", token, {
      httpOnly: true, // Keep httpOnly for security purposes
      sameSite: "None", // Allow cross-origin cookies
      secure: config.SERVER_ENVIRONMENT === "production" ? true : false, // Secure only in production (HTTPS)
      maxAge: 60 * 60 * 1000, // One hour validity
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      error: null,
    });
  } catch (error) {
    return next(error);
    // console.log(error);
  }
};
