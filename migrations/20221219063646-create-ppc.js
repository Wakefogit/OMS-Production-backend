'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PPCs', {
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
      productionOrderId: {
        type: Sequelize.NUMBER
      },
      alloy: {
        type: Sequelize.STRING
      },
      quenching: {
        type: Sequelize.STRING
      },
      productionRate: {
        type: Sequelize.NUMBER
      },
      billetLength: {
        type: Sequelize.NUMBER
      },
      noOfBillet: {
        type: Sequelize.NUMBER
      },
      piecesPerBillet: {
        type: Sequelize.NUMBER
      },
      buttThickness: {
        type: Sequelize.NUMBER
      },
      extrusionLength: {
        type: Sequelize.STRING
      },
      coringOrPipingLength_frontEnd: {
        type: Sequelize.NUMBER
      },
      coringOrPipingLength_backEnd: {
        type: Sequelize.NUMBER
      },
      pressEntry: {
        type: Sequelize.NUMBER
      },
      plantRefId: {
        type: Sequelize.NUMBER
      },
      remarks: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('PPCs');
  }
};