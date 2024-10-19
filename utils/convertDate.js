/**
 * @module utils/convertDate.js
 * @function
 * @description Converts a UTC date string to the local date and time in a human-readable format.
 * @param {string} utcDateString - The UTC date string (ISO format or any parsable date string).
 * @returns {string} The formatted local date and time string with time zone information.
 *
 * @example
 * const localDate = convertUtcDateToLocal("2024-10-18T14:30:00Z");
 * console.log(localDate); // Outputs something like "October 18, 2024 at 10:30:00 AM EDT"
 */
function convertUtcDateToLocal(utcDateString) {
  // Convert the input UTC date string into a Date object
  const utcDate = new Date(utcDateString);

  // Define the formatting options for displaying the date and time
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true, // Display time in 12-hour format (AM/PM)
    timeZoneName: "short", // Show the local time zone abbreviation
  };

  // Create a date formatter using the Intl.DateTimeFormat API
  const dateFormatter = new Intl.DateTimeFormat("en-US", options);

  // Format the UTC date into the local date and time
  const formattedDate = dateFormatter.format(utcDate);

  // Return the formatted date string
  return formattedDate;
}

export default convertUtcDateToLocal;
