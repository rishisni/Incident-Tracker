'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incidents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      service: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      severity: {
        type: Sequelize.ENUM('SEV1', 'SEV2', 'SEV3', 'SEV4'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('OPEN', 'MITIGATED', 'RESOLVED'),
        allowNull: false,
      },
      owner: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create indexes for better query performance
    await queryInterface.addIndex('incidents', ['severity'], {
      name: 'idx_incidents_severity',
    });

    await queryInterface.addIndex('incidents', ['status'], {
      name: 'idx_incidents_status',
    });

    await queryInterface.addIndex('incidents', ['service'], {
      name: 'idx_incidents_service',
    });

    await queryInterface.addIndex('incidents', ['createdAt'], {
      name: 'idx_incidents_created_at',
    });

    await queryInterface.addIndex('incidents', ['title'], {
      name: 'idx_incidents_title',
      using: 'BTREE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('incidents');
  },
};
