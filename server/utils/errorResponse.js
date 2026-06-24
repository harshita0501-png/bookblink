/**
 * utils/errorResponse.js
 * Custom Error class for consistent API error responses
 */

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
