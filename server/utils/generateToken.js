/**
 * utils/generateToken.js
 * Helper to sign and return a JWT token
 */

const jwt = require("jsonwebtoken");

/**
 * @param {string} id  - MongoDB user _id
 * @returns {string}   - signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
