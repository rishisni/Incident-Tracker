const { IncidentService } = require('../service/IncidentService');
const {
  CreateIncidentInput,
  UpdateIncidentInput,
  ListIncidentsQuery,
} = require('../validators/IncidentValidators');
const logger = require('../../../utils/logger');

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {import('../validators/IncidentValidators').CreateIncidentInput} CreateIncidentInput
 * @typedef {import('../validators/IncidentValidators').UpdateIncidentInput} UpdateIncidentInput
 * @typedef {import('../validators/IncidentValidators').ListIncidentsQuery} ListIncidentsQuery
 */

class IncidentController {
  constructor() {
    this.service = new IncidentService();
  }

  /**
   * @swagger
   * /api/incidents:
   *   post:
   *     summary: Create a new incident
   *     tags: [Incidents]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateIncidentRequest'
   *     responses:
   *       201:
   *         description: Incident created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Incident'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  createIncident = async (req, res, next) => {
    try {
      /** @type {CreateIncidentInput} */
      const data = req.body;
      logger.info('Creating new incident', { title: data.title, severity: data.severity });
      const incident = await this.service.createIncident(data);
      logger.info('Incident created successfully', { id: incident.id, title: incident.title });
      res.status(201).json({
        success: true,
        data: incident,
      });
    } catch (error) {
      logger.logError(error, { context: 'Create Incident', data: req.body });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/incidents:
   *   get:
   *     summary: Get list of incidents with pagination, filtering, and sorting
   *     tags: [Incidents]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of items per page
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search in title, service, or summary
   *       - in: query
   *         name: severity
   *         schema:
   *           type: string
   *           enum: [SEV1, SEV2, SEV3, SEV4]
   *         description: Filter by severity
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [OPEN, MITIGATED, RESOLVED]
   *         description: Filter by status
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [title, service, severity, status, createdAt, updatedAt]
   *         description: Field to sort by
   *       - in: query
   *         name: order
   *         schema:
   *           type: string
   *           enum: [ASC, DESC]
   *           default: DESC
   *         description: Sort order
   *     responses:
   *       200:
   *         description: List of incidents
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedResponse'
   */
  listIncidents = async (req, res, next) => {
    try {
      /** @type {ListIncidentsQuery} */
      const query = req.query;
      // Convert string query params to numbers
      const page = parseInt(query.page, 10) || 1;
      const limit = parseInt(query.limit, 10) || 10;
      const offset = (page - 1) * limit;

      const result = await this.service.listIncidents(
        { page, limit, offset },
        {
          search: query.search,
          severity: query.severity,
          status: query.status,
        },
        {
          sortBy: query.sortBy,
          order: query.order || 'DESC',
        }
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/incidents/{id}:
   *   get:
   *     summary: Get incident by ID
   *     tags: [Incidents]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Incident ID
   *     responses:
   *       200:
   *         description: Incident details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Incident'
   *       404:
   *         description: Incident not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  getIncidentById = async (req, res, next) => {
    try {
      const { id } = req.params;
      logger.debug('Fetching incident by ID', { id });
      const incident = await this.service.getIncidentById(id);
      res.status(200).json({
        success: true,
        data: incident,
      });
    } catch (error) {
      logger.logError(error, { context: 'Get Incident By ID', id: req.params.id });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/incidents/{id}:
   *   patch:
   *     summary: Update an incident
   *     tags: [Incidents]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Incident ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateIncidentRequest'
   *     responses:
   *       200:
   *         description: Incident updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Incident'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Incident not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  updateIncident = async (req, res, next) => {
    try {
      const { id } = req.params;
      /** @type {UpdateIncidentInput} */
      const data = req.body;
      logger.info('Updating incident', { id, updates: Object.keys(data) });
      const incident = await this.service.updateIncident(id, data);
      logger.info('Incident updated successfully', { id, status: incident.status });
      res.status(200).json({
        success: true,
        data: incident,
      });
    } catch (error) {
      logger.logError(error, { context: 'Update Incident', id: req.params.id, data: req.body });
      next(error);
    }
  };
}

module.exports = { IncidentController };
