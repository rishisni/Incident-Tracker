/**
 * @typedef {Object} Incident
 * @property {string} id - UUID
 * @property {string} title
 * @property {string} service
 * @property {'SEV1'|'SEV2'|'SEV3'|'SEV4'} severity
 * @property {'OPEN'|'MITIGATED'|'RESOLVED'} status
 * @property {string|null} owner
 * @property {string|null} summary
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * @typedef {Object} CreateIncidentRequest
 * @property {string} title
 * @property {string} service
 * @property {'SEV1'|'SEV2'|'SEV3'|'SEV4'} severity
 * @property {'OPEN'|'MITIGATED'|'RESOLVED'} status
 * @property {string|null} [owner]
 * @property {string|null} [summary]
 */

/**
 * @typedef {Object} UpdateIncidentRequest
 * @property {string} [title]
 * @property {string} [service]
 * @property {'SEV1'|'SEV2'|'SEV3'|'SEV4'} [severity]
 * @property {'OPEN'|'MITIGATED'|'RESOLVED'} [status]
 * @property {string|null} [owner]
 * @property {string|null} [summary]
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page
 * @property {number} limit
 * @property {string} [search]
 * @property {'SEV1'|'SEV2'|'SEV3'|'SEV4'} [severity]
 * @property {'OPEN'|'MITIGATED'|'RESOLVED'} [status]
 * @property {string} [sortBy]
 * @property {'ASC'|'DESC'} [order]
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Incident[]} data
 * @property {Object} pagination
 * @property {number} pagination.page
 * @property {number} pagination.limit
 * @property {number} pagination.total
 * @property {number} pagination.totalPages
 */
