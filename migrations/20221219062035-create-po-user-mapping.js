'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('POUserMappings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.NUMBER
      },
      uniqueKey: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.NUMBER
      },
      productionOrderId: {
        type: Sequelize.NUMBER
      },
      statusRefId: {
        type: Sequelize.NUMBER
      },
      isActive: {
        type: Sequelize.NUMBER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('POUserMappings');
  }
};