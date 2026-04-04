/**
 * Centralized error handling middleware
 */
const errorHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = null;

  // Prisma errors
  if (error.code) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Resource already exists';
        details = `Duplicate value for ${error.meta?.target?.join(', ')}`;
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found';
        details = 'The requested resource does not exist';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint violation';
        details = error.meta?.field_name;
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
        details = error.message;
    }
  }
  // Validation errors (Joi)
  else if (error.isJoi || error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = error.details ? error.details.map(detail => detail.message) : error.message;
  }
  // JWT errors
  else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication failed';
    details = error.message;
  }
  // Custom application errors
  else if (error.status || error.statusCode) {
    statusCode = error.status || error.statusCode;
    message = error.message;
    details = error.details;
  }
  // Default server errors
  else if (error.message) {
    message = error.message;
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

/**
 * Handle 404 routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
};

/**
 * Async error wrapper for route handlers
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};