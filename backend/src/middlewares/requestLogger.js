const logger = require('../utils/logger');

/**
 * HTTP Request Logger Middleware
 * Logs all incoming HTTP requests with details
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request start
  logger.info('Incoming Request', {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
  });

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function (chunk, encoding) {
    const responseTime = Date.now() - startTime;

    // Log response
    logger.http('HTTP Response', {
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip || req.connection.remoteAddress,
    });

    // Call original end
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = requestLogger;
