const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../connection');

/**
 * @typedef {'SEV1'|'SEV2'|'SEV3'|'SEV4'} IncidentSeverity
 */

/**
 * @typedef {'OPEN'|'MITIGATED'|'RESOLVED'} IncidentStatus
 */

/**
 * @typedef {Object} IncidentAttributes
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

class Incident extends Model {}

Incident.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('SEV1', 'SEV2', 'SEV3', 'SEV4'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'MITIGATED', 'RESOLVED'),
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'incidents',
    timestamps: true,
    indexes: [
      {
        name: 'idx_incidents_severity',
        fields: ['severity'],
      },
      {
        name: 'idx_incidents_status',
        fields: ['status'],
      },
      {
        name: 'idx_incidents_service',
        fields: ['service'],
      },
      {
        name: 'idx_incidents_created_at',
        fields: ['createdAt'],
      },
      {
        name: 'idx_incidents_title',
        fields: ['title'],
        using: 'BTREE',
      },
    ],
  }
);

module.exports = Incident;

