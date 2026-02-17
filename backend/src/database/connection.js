const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();

// Custom logging function for Sequelize
const sequelizeLogger = (msg) => {
  // Sequelize logs queries as strings, so we just log the message
  // The actual query execution uses proper types
  logger.debug('Database Query', {
    query: typeof msg === 'string' ? msg : JSON.stringify(msg),
  });
};

const sequelize = new Sequelize(
  process.env.DB_NAME || 'incident_tracker',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? sequelizeLogger : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully', {
      database: process.env.DB_NAME || 'incident_tracker',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
    });
  } catch (error) {
    logger.logError(error, {
      context: 'Database Connection',
      database: process.env.DB_NAME || 'incident_tracker',
      host: process.env.DB_HOST || 'localhost',
    });
    throw error;
  }
}

module.exports = {
  connectDatabase,
  sequelize,
  default: sequelize, // For compatibility
};

