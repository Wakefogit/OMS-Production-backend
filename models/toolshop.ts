'use strict';

import { ForeignKey, Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class ToolShop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id: number;
    uniqueKey: string;
    orderId: ForeignKey<number>;
    dieRefId: string;
    noOfCavity: number;
    bolsterEntry: string;
    backerEntry: string;
    specialBackerEntry: string;
    ringEntry: string;
    dieSetter: string;
    weldingChamber: string;
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
  ToolShop.init({
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
    dieRefId: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    noOfCavity: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    bolsterEntry: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    backerEntry: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    specialBackerEntry: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    ringEntry: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    dieSetter: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    weldingChamber: {
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
    modelName: 'tbl_toolShop',
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ["uniqueKey"]
      },
    ]
  });
  return ToolShop;
};