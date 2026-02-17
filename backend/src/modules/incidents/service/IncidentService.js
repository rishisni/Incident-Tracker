const { IncidentRepository } = require('../repository/IncidentRepository');
const { IncidentMapper } = require('../mappers/IncidentMapper');
const {
  CreateIncidentDTO,
  UpdateIncidentDTO,
  IncidentDTO,
  PaginatedResponse,
  PaginationParams,
  FilterParams,
  SortParams,
} = require('../dto/IncidentDTO');
const { AppError } = require('../../../middlewares/errorHandler');

/**
 * @typedef {import('../dto/IncidentDTO').CreateIncidentDTO} CreateIncidentDTO
 * @typedef {import('../dto/IncidentDTO').UpdateIncidentDTO} UpdateIncidentDTO
 * @typedef {import('../dto/IncidentDTO').IncidentDTO} IncidentDTO
 * @typedef {import('../dto/IncidentDTO').PaginatedResponse} PaginatedResponse
 * @typedef {import('../dto/IncidentDTO').PaginationParams} PaginationParams
 * @typedef {import('../dto/IncidentDTO').FilterParams} FilterParams
 * @typedef {import('../dto/IncidentDTO').SortParams} SortParams
 */

class IncidentService {
  constructor() {
    this.repository = new IncidentRepository();
    this.mapper = new IncidentMapper();
  }

  /**
   * @param {CreateIncidentDTO} data
   * @returns {Promise<IncidentDTO>}
   */
  async createIncident(data) {
    const incident = await this.repository.create(data);
    return this.mapper.toDTO(incident);
  }

  /**
   * @param {string} id
   * @returns {Promise<IncidentDTO>}
   */
  async getIncidentById(id) {
    const incident = await this.repository.findById(id);
    if (!incident) {
      throw new AppError('Incident not found', 404);
    }
    return this.mapper.toDTO(incident);
  }

  /**
   * @param {PaginationParams} pagination
   * @param {FilterParams} filters
   * @param {SortParams} sort
   * @returns {Promise<PaginatedResponse<IncidentDTO>>}
   */
  async listIncidents(pagination, filters, sort) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const { rows, count } = await this.repository.findAll({
      ...pagination,
      offset,
      ...filters,
      ...sort,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: this.mapper.toDTOList(rows),
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
      },
    };
  }

  /**
   * @param {string} id
   * @param {UpdateIncidentDTO} data
   * @returns {Promise<IncidentDTO>}
   */
  async updateIncident(id, data) {
    const incident = await this.repository.update(id, data);
    if (!incident) {
      throw new AppError('Incident not found', 404);
    }
    return this.mapper.toDTO(incident);
  }
}

module.exports = { IncidentService };
