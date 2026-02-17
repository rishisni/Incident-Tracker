const { Op } = require('sequelize');
const Incident = require('../../../database/models/Incident');
const {
  CreateIncidentDTO,
  UpdateIncidentDTO,
  PaginationParams,
  FilterParams,
  SortParams,
} = require('../dto/IncidentDTO');

/**
 * @typedef {import('../dto/IncidentDTO').CreateIncidentDTO} CreateIncidentDTO
 * @typedef {import('../dto/IncidentDTO').UpdateIncidentDTO} UpdateIncidentDTO
 * @typedef {import('../dto/IncidentDTO').PaginationParams} PaginationParams
 * @typedef {import('../dto/IncidentDTO').FilterParams} FilterParams
 * @typedef {import('../dto/IncidentDTO').SortParams} SortParams
 * @typedef {import('../../../database/models/Incident').default} Incident
 */

/**
 * @typedef {PaginationParams & FilterParams & SortParams} FindAllOptions
 */

class IncidentRepository {
  /**
   * @param {CreateIncidentDTO} data
   * @returns {Promise<Incident>}
   */
  async create(data) {
    return await Incident.create(data);
  }

  /**
   * @param {string} id
   * @returns {Promise<Incident|null>}
   */
  async findById(id) {
    return await Incident.findByPk(id);
  }

  /**
   * @param {FindAllOptions} options
   * @returns {Promise<{rows: Incident[], count: number}>}
   */
  async findAll(options) {
    const { page, limit, offset, search, severity, status, sortBy, order } = options;

    // Ensure limit and offset are numbers
    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const offsetNum = typeof offset === 'string' ? parseInt(offset, 10) : offset;

    // Build where clause
    /** @type {import('sequelize').WhereOptions} */
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { service: { [Op.like]: `%${search}%` } },
        { summary: { [Op.like]: `%${search}%` } },
      ];
    }

    if (severity) {
      where.severity = severity;
    }

    if (status) {
      where.status = status;
    }

    // Build order clause
    /** @type {import('sequelize').Order} */
    const orderBy = [];
    if (sortBy && ['title', 'service', 'severity', 'status', 'createdAt', 'updatedAt'].includes(sortBy)) {
      orderBy.push([sortBy, order || 'DESC']);
    } else {
      orderBy.push(['createdAt', 'DESC']);
    }

    const { rows, count } = await Incident.findAndCountAll({
      where,
      limit: limitNum,
      offset: offsetNum,
      order: orderBy,
    });

    return { rows, count };
  }

  /**
   * @param {string} id
   * @param {UpdateIncidentDTO} data
   * @returns {Promise<Incident|null>}
   */
  async update(id, data) {
    const incident = await Incident.findByPk(id);
    if (!incident) {
      return null;
    }

    await incident.update(data);
    return incident;
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const deleted = await Incident.destroy({
      where: { id },
    });
    return deleted > 0;
  }
}

module.exports = { IncidentRepository };
