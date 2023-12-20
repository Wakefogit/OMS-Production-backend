'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OperatorEntries', {
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
      batchNo: {
        type: Sequelize.NUMBER
      },
      buttWeigth: {
        type: Sequelize.NUMBER
      },
      pushOnBilletLength: {
        type: Sequelize.NUMBER
      },
      approxPushQty: {
        type: Sequelize.NUMBER
      },
      startTime: {
        type: Sequelize.DATE
      },
      endTime: {
        type: Sequelize.DATE
      },
      processTime: {
        type: Sequelize.STRING
      },
      productionRateActual: {
        type: Sequelize.NUMBER
      },
      dieWithAluminium: {
        type: Sequelize.NUMBER
      },
      diefailed: {
        type: Sequelize.NUMBER
      },
      dieFailureReasonRefId: {
        type: Sequelize.NUMBER
      },
      breakDownStartTime: {
        type: Sequelize.DATE
      },
      breakDownEndTime: {
        type: Sequelize.DATE
      },
      reasonForBreakDownRefId: {
        type: Sequelize.NUMBER
      },
      timeTakenBreakDown: {
        type: Sequelize.STRING
      },
      previousDayDieContinue: {
        type: Sequelize.NUMBER
      },
      nameOfOperator: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('OperatorEntries');
  }
};