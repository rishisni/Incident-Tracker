/**
 * @typedef {'SEV1'|'SEV2'|'SEV3'|'SEV4'} IncidentSeverity
 */

/**
 * @typedef {'OPEN'|'MITIGATED'|'RESOLVED'} IncidentStatus
 */

/**
 * @typedef {Object} IncidentDTO
 * @property {string} id
 * @property {string} title
 * @property {string} service
 * @property {IncidentSeverity} severity
 * @property {IncidentStatus} status
 * @property {string|null} owner
 * @property {string|null} summary
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} CreateIncidentDTO
 * @property {string} title
 * @property {string} service
 * @property {IncidentSeverity} severity
 * @property {IncidentStatus} status
 * @property {string|null} [owner]
 * @property {string|null} [summary]
 */

/**
 * @typedef {Object} UpdateIncidentDTO
 * @property {string} [title]
 * @property {string} [service]
 * @property {IncidentSeverity} [severity]
 * @property {IncidentStatus} [status]
 * @property {string|null} [owner]
 * @property {string|null} [summary]
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page
 * @property {number} limit
 * @property {number} offset
 */

/**
 * @typedef {Object} FilterParams
 * @property {string} [search]
 * @property {IncidentSeverity} [severity]
 * @property {IncidentStatus} [status]
 */

/**
 * @typedef {Object} SortParams
 * @property {string} [sortBy]
 * @property {'ASC'|'DESC'} [order]
 */

/**
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {T[]} data
 * @property {{page: number, limit: number, total: number, totalPages: number}} pagination
 */

module.exports = {
  IncidentDTO: {},
  CreateIncidentDTO: {},
  UpdateIncidentDTO: {},
  PaginationParams: {},
  FilterParams: {},
  SortParams: {},
  PaginatedResponse: {},
};

