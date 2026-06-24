/**
 * utils/calculateFine.js
 * Helper to compute late return fines
 */

const FINE_PER_DAY = 5; // ₹5 per day overdue
const MAX_FINE     = 100; // ₹100 maximum fine cap

/**
 * @param {Date} dueDate    - when book was due back
 * @param {Date} returnDate - when it was actually returned (defaults to now)
 * @returns {number}        - fine amount in rupees
 */
const calculateFine = (dueDate, returnDate = new Date()) => {
  const due    = new Date(dueDate);
  const ret    = new Date(returnDate);
  const diffMs = ret - due;

  if (diffMs <= 0) return 0; // returned on time

  const overdueDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const fine        = overdueDays * FINE_PER_DAY;
  return Math.min(fine, MAX_FINE);
};

module.exports = calculateFine;
