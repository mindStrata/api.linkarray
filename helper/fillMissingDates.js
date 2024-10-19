/**
 * @module helper/fillMissingDates.js
 * @description Utility functions for date manipulation and processing.
 */

/**
 * @function fillMissingDates
 * @description Fills in missing dates between the start and end dates,
 * returning an array of objects with dates and their corresponding registration counts.
 * If a date has no registration, the count is set to 0.
 *
 * @param {Date|string} startDate - The start date of the range.
 * @param {Date|string} endDate - The end date of the range.
 * @param {Array<Object>} registrations - An array of registration objects with dates as `_id` and counts.
 * @returns {Array<Object>} An array of objects, each containing a date and the associated count.
 */
export const fillMissingDates = (startDate, endDate, registrations) => {
  const dateCounts = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const registration = registrations.find((r) => r._id === dateStr);

    dateCounts.push({
      date: dateStr,
      count: registration ? registration.count : 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateCounts;
};
