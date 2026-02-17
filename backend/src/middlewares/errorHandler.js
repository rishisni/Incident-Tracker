const { ZodError } = require('zod');
const logger = require('../utils/logger');

/**
 * @typedef {Object} AppErrorShape
 * @property {number} [statusCode]
 * @property {string} [code]
 */

class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} [statusCode=500]
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error handler middleware.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Zod validation errors
  if (err instanceof ZodError) {
    logger.warn('Validation Error', {
      errors: err.errors,
      path: req.path,
      method: req.method,
    });
    res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Sequelize errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    logger.warn('Database Validation Error', {
      message: err.message,
      path: req.path,
      method: req.method,
    });
    res.status(400).json({
      success: false,
      error: 'Database Validation Error',
      message: err.message,
    });
    return;
  }

  if (err.name === 'SequelizeDatabaseError') {
    logger.logError(err, {
      context: 'Database Error',
      path: req.path,
      method: req.method,
    });
    
    // Provide more helpful error messages in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    let errorMessage = 'An internal database error occurred';
    
    if (isDevelopment && err.message) {
      // Check for common database errors
      if (err.message.includes("doesn't exist")) {
        errorMessage = 'Database table does not exist. Please run migrations: npm run migrate';
      } else if (err.message.includes('SQL syntax')) {
        errorMessage = `SQL Syntax Error: ${err.message}`;
      } else {
        errorMessage = err.message;
      }
    }
    
    res.status(500).json({
      success: false,
      error: 'Database Error',
      message: errorMessage,
      ...(isDevelopment && { details: err.message }),
    });
    return;
  }

  // Custom application errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error based on status code
  if (statusCode >= 500) {
    logger.logError(err, {
      context: 'Server Error',
      statusCode,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.warn('Client Error', {
      message: err.message,
      statusCode,
      path: req.path,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = {
  AppError,
  errorHandler,
};

