//////////////////////////////////////////////////////////
////                 SERVER.LINKARRAY                ////
////////////////////////////////////////////////////////

/**
 * @author Mind Strata (https://github.com/mindstrata)
 *
 * @module app
 * @file This file is the entry point of this express.js server
 * @description This particular file starts the server and configures the other integrations e.g., routing, middleware and errorHandler etc.
 */

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import createHttpError from "http-errors";
import { marked } from "marked";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/config.js";
import connectDatabase from "./config/db.js";
import checkAPIKey from "./middleware/checkAPIKey.js";
import adminRouter from "./routes/admin.route.js";
import authRouter from "./routes/auth.route.js";
import linkRouter from "./routes/link.route.js";
import userRouter from "./routes/user.route.js";
import errorMiddleware from "./utils/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @description Initializes the Express application for handling HTTP requests.
 */
const app = express();
const PORT = config.port;

/**
 * @description Sets up the EJS template engine for rendering views.
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/**
 * @middleware CORS
 * @description Configures CORS to allow requests from the frontend
 */
app.use(cors({ origin: config.clientURL, credentials: true }));

/**
 * @middleware morgan
 * @description Sets up HTTP request logging using the 'dev' format, which provides concise output for development.
 */
app.use(morgan("dev"));

/**
 * @description Parse the cookie through out the server and client
 * Uses the JWT secret from the config for signed cookies if applicable.
 */
app.use(cookieParser(config.jwtSecret));

/**
 * @description Parses incoming requests with JSON payloads
 */
app.use(express.json());

/**
 * @description Serves static files from the 'public' directory
 */
app.use(express.static(path.join(__dirname, "public")));

/**
 * @middleware checkAPIKey
 * @description Sets up the route for the users page
 * @route /api/v1/user
 * @route /api/v1/auth
 * @route /api/v1/link
 * @route /api/v1/admin
 * @function checkAPIKey
 * @description checkAPIKey function works as a middleware that prevent unwanted api request by requiring API key
 */
app.use("/api/v1/user", checkAPIKey, userRouter);
app.use("/api/v1/auth", checkAPIKey, authRouter);
app.use("/api/v1/link", checkAPIKey, linkRouter);
app.use("/api/v1/admin", checkAPIKey, adminRouter);

/**
 * @description Main/entry/home route
 * @route GET /
 */
app.get("/", (req, res) => {
  res.render("index");
});

/**
 * @description Main/entry/home route
 * @route GET /docs
 */
app.get("/docs", (req, res) => {
  const filePath = path.join(__dirname, "public", "docs", "document.md"); // Change to your Markdown file path
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading the Markdown file.");
    }
    // Convert Markdown to HTML
    const htmlContent = marked(data);

    // Render the EJS template with the converted HTML
    res.render("markdown", { content: htmlContent });
  });
});

/**
 * @description Handles 404 or NotFound errors by forwarding them to the error handler with error message and error status
 */
app.all("*", async (req, res, next) => {
  /**
   * @method GET
   * @return {next}
   * @description Based on request method provides different error message e.g, for GET "Page not found" and for other methods (POST, PUT, PATCH, DELETED) return "Rote not found".
   * */
  if (req.method === "GET") {
    next(createHttpError.NotFound("Page not found"));
  } else {
    next(createHttpError.NotFound("Rote not found"));
  }
});

/**
 * @function errorHandler
 * @description Error handling middleware
 * @param {Error} err - Error object
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {Function} next - Next middleware function
 */
app.use(errorMiddleware);

/**
 * @description Starts the Express server based on database connection
 * @function connectDatabase
 * @description Use to connect the database to the server
 * @return {Promise<void>} Resolves if the database connects successfully; otherwise, the server shuts down.
 * @param {number} port - The port on which the server will listen
 */
app.listen(PORT, () => {
  connectDatabase()
    .then(() => {
      console.log(`Server running on 🚀http://localhost:${PORT}`);
    })
    .catch((err) => {
      console.log(`Error occured to run the server ${err}`);
      process.exit(1);
    });
});

/* app.listen(PORT, () => {
  console.log(`Server running on 🚀http://localhost:${PORT}`);
}); */

export default app;
