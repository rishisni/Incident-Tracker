const express = require('express');
const cors = require('cors');
require('dotenv').config();
const logger = require('./utils/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const { incidentRoutes } = require('./modules/incidents/routes');
const swaggerSetup = require('./utils/swagger');
const { connectDatabase } = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (should be early in the middleware chain)
app.use(requestLogger);

// Swagger Documentation
swaggerSetup(app);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/incidents', incidentRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
      });
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.logError(error, { context: 'Server startup' });
    process.exit(1);
  }
};

startServer();

module.exports = app;
