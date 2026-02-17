const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * @typedef {import('express').Express} Express
 */

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Incident Tracker API',
      version: '1.0.0',
      description: 'Production-grade incident management system API',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Incident: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the incident',
            },
            title: {
              type: 'string',
              description: 'Title of the incident',
            },
            service: {
              type: 'string',
              description: 'Service affected by the incident',
            },
            severity: {
              type: 'string',
              enum: ['SEV1', 'SEV2', 'SEV3', 'SEV4'],
              description: 'Severity level of the incident',
            },
            status: {
              type: 'string',
              enum: ['OPEN', 'MITIGATED', 'RESOLVED'],
              description: 'Current status of the incident',
            },
            owner: {
              type: 'string',
              nullable: true,
              description: 'Owner assigned to the incident',
            },
            summary: {
              type: 'string',
              nullable: true,
              description: 'Summary description of the incident',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the incident was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the incident was last updated',
            },
          },
        },
        CreateIncidentRequest: {
          type: 'object',
          required: ['title', 'service', 'severity', 'status'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
            },
            service: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
            },
            severity: {
              type: 'string',
              enum: ['SEV1', 'SEV2', 'SEV3', 'SEV4'],
            },
            status: {
              type: 'string',
              enum: ['OPEN', 'MITIGATED', 'RESOLVED'],
            },
            owner: {
              type: 'string',
              nullable: true,
              maxLength: 255,
            },
            summary: {
              type: 'string',
              nullable: true,
            },
          },
        },
        UpdateIncidentRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
            },
            service: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
            },
            severity: {
              type: 'string',
              enum: ['SEV1', 'SEV2', 'SEV3', 'SEV4'],
            },
            status: {
              type: 'string',
              enum: ['OPEN', 'MITIGATED', 'RESOLVED'],
            },
            owner: {
              type: 'string',
              nullable: true,
              maxLength: 255,
            },
            summary: {
              type: 'string',
              nullable: true,
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Incident',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  minimum: 1,
                },
                limit: {
                  type: 'integer',
                  minimum: 1,
                },
                total: {
                  type: 'integer',
                  minimum: 0,
                },
                totalPages: {
                  type: 'integer',
                  minimum: 0,
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * @param {Express} app
 */
const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerSetup;
