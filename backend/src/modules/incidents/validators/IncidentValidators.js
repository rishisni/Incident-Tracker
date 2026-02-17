const { z } = require('zod');

const severityEnum = z.enum(['SEV1', 'SEV2', 'SEV3', 'SEV4']);
const statusEnum = z.enum(['OPEN', 'MITIGATED', 'RESOLVED']);

const createIncidentSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
    service: z.string().min(1, 'Service is required').max(255, 'Service must be less than 255 characters'),
    severity: severityEnum,
    status: statusEnum,
    owner: z.string().max(255, 'Owner must be less than 255 characters').nullable().optional(),
    summary: z.string().nullable().optional(),
  }),
});

const updateIncidentSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters').optional(),
    service: z.string().min(1, 'Service is required').max(255, 'Service must be less than 255 characters').optional(),
    severity: severityEnum.optional(),
    status: statusEnum.optional(),
    owner: z.string().max(255, 'Owner must be less than 255 characters').nullable().optional(),
    summary: z.string().nullable().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid incident ID format'),
  }),
});

const getIncidentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid incident ID format'),
  }),
});

const listIncidentsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
    severity: severityEnum.optional(),
    status: statusEnum.optional(),
    sortBy: z.string().optional(),
    order: z.enum(['ASC', 'DESC']).optional(),
  }),
});

/**
 * @typedef {z.infer<typeof createIncidentSchema>['body']} CreateIncidentInput
 * @typedef {z.infer<typeof updateIncidentSchema>['body']} UpdateIncidentInput
 * @typedef {z.infer<typeof listIncidentsSchema>['query']} ListIncidentsQuery
 */

module.exports = {
  severityEnum,
  statusEnum,
  createIncidentSchema,
  updateIncidentSchema,
  getIncidentSchema,
  listIncidentsSchema,
  CreateIncidentInput: {},
  UpdateIncidentInput: {},
  ListIncidentsQuery: {},
};

