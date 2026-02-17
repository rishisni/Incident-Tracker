const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Create transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  }),

  // Error log file - rotates daily
  new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    format: logFormat,
    maxSize: '20m',
    maxFiles: '14d', // Keep 14 days of error logs
    zippedArchive: true,
  }),

  // Combined log file - rotates daily
  new DailyRotateFile({
    filename: path.join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    format: logFormat,
    maxSize: '20m',
    maxFiles: '30d', // Keep 30 days of combined logs
    zippedArchive: true,
  }),

  // HTTP access log file - rotates daily
  new DailyRotateFile({
    filename: path.join(logsDir, 'http-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'http',
    format: logFormat,
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: true,
  }),
];

// Create the logger
const logger = winston.createLogger({
  levels,
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: logFormat,
  transports,
  // Handle exceptions and rejections
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
  ],
  exitOnError: false,
});

// Create a stream object for Morgan HTTP logger
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

// Helper methods for structured logging
logger.logRequest = (req, res, responseTime) => {
  logger.http('HTTP Request', {
    method: req.method,
    url: req.originalUrl || req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
  });
};

logger.logError = (error, context = {}) => {
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    ...context,
  });
};

logger.logDatabaseQuery = (query, duration) => {
  logger.debug('Database Query', {
    query: query.replace(/\s+/g, ' ').trim(),
    duration: `${duration}ms`,
  });
};

logger.logDatabaseError = (error, query) => {
  logger.error('Database Error', {
    message: error.message,
    query: query ? query.replace(/\s+/g, ' ').trim() : undefined,
    stack: error.stack,
  });
};

module.exports = logger;
