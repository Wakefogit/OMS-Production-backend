'use strict';

import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class DownloadTemplate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id: number;
    name: string;
    prefix: string;
    columnName: string;
    alias: string;
    queryAndFunction: string;
    createdBy: number;
    createdOn: Date;
    isDeleted: number;
    static associate(models) {
      // define association here
    }
  }
  DownloadTemplate.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    columnName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    queryAndFunction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'tbl_downloadTemplate',
    freezeTableName: true,
    timestamps: false
  });
  return DownloadTemplate;
};