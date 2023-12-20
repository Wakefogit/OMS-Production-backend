'use strict';

import { ForeignKey, Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class OperatorEntry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id: number;
    uniqueKey: string;
    orderId: ForeignKey<number>;
    dieTrialRefId: number;
    dieWithAluminiumRefId: number;
    previousDayDie_continueRefId: number;
    batchNo: string;
    actualInternalAlloy: string;
    startTime: Date;
    endTime: Date;
    processTime: string;
    noOfBilletAndLength: string;
    actualButtThickness: number;
    breakThroughPressure: number;
    pushOnBilletLength: number;
    pushQtyInKgs: number;
    actualProductionRate: number;
    buttWeightInKgs: number;
    diefailRefId: number;
    dieFailureReason: string;
    breakDown: string;
    breakDownDuration: string;
    logEndScrapLengthInMm: number;
    logEndScrapInKgs: number;
    operatorName: string;
    remarks: string;
    isActive: number;
    updatedAdminId: number;
    adminUpdatedOn: Date;
    createdBy: number;
    createdOn: Date;
    updatedBy: number;
    updatedOn: Date;
    isDeleted: number;
    
    static associate(models) {
      // define association here
      this.belongsTo(models.tbl_order, { foreignKey: 'orderId' })
    }
  }
  OperatorEntry.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    uniqueKey: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_order',
        key: 'id'
      }
    },
    dieTrialRefId: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    dieWithAluminiumRefId: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    previousDayDie_continueRefId: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    batchNo: {
      // type: DataTypes.STRING,
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    actualInternalAlloy: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    startTime: {
      type: DataTypes.DATE,
      // allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      // allowNull: false
    },
    processTime: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    noOfBilletAndLength: {
      // type: DataTypes.STRING,
      type: "varchar(max)",
      // allowNull: false
    },
    actualButtThickness: {
      // type: DataTypes.DOUBLE,
      type: "numeric(18,4)",
      // allowNull: false
    },
    breakThroughPressure: {
      // type: DataTypes.DOUBLE,
      type: "numeric(18,4)",
      // allowNull: false
    },
    pushOnBilletLength: {
      // type: DataTypes.DOUBLE,
      type: "numeric(18,4)",
      // allowNull: false
    },
    pushQtyInKgs: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
      // allowNull: false
    },
    actualProductionRate: {
      // type: DataTypes.DOUBLE,
      type: "numeric(18,4)",
      // allowNull: false
    },
    buttWeightInKgs: {
      // type: DataTypes.DOUBLE,
      type: "numeric(18,4)",
      // allowNull: false
    },
    diefailRefId: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    dieFailureReason: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    breakDown: {
      // type: DataTypes.STRING,
      type: "varchar(max)",
      // allowNull: false
    },
    breakDownDuration: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    logEndScrapLengthInMm: {
      // type: DataTypes.DOUBLE,
      type: "numeric(18,4)",
      // allowNull: false
    },
    logEndScrapInKgs: {
      // type: DataTypes.DOUBLE,
      type: "numeric(18,4)",
      // allowNull: false
    },
    operatorName: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    remarks: {
      // type: DataTypes.STRING,
      type: "varchar(max)",
      // allowNull: false,
    },
    isActive: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    updatedAdminId:{
      type: DataTypes.INTEGER,
    },
    adminUpdatedOn:{
      type: DataTypes.DATE
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedBy: {
      type: DataTypes.INTEGER
    },
    updatedOn: {
      type: DataTypes.DATE
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'tbl_operatorEntry',
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ["uniqueKey"]
      },
    ]
  });
  return OperatorEntry;
};