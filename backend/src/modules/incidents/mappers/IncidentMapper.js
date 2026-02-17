const Incident = require('../../../database/models/Incident');
const { IncidentDTO } = require('../dto/IncidentDTO');

/**
 * @typedef {import('../dto/IncidentDTO').IncidentDTO} IncidentDTO
 * @typedef {import('../../../database/models/Incident').default} Incident
 */

class IncidentMapper {
  /**
   * @param {Incident} model
   * @returns {IncidentDTO}
   */
  toDTO(model) {
    return {
      id: model.id,
      title: model.title,
      service: model.service,
      severity: model.severity,
      status: model.status,
      owner: model.owner,
      summary: model.summary,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  /**
   * @param {Incident[]} models
   * @returns {IncidentDTO[]}
   */
  toDTOList(models) {
    return models.map((model) => this.toDTO(model));
  }
}

module.exports = { IncidentMapper };
