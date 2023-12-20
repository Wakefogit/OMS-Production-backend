'use strict';
import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Errorlog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id: number;
    schemaName: string;
    transType: string;
    message: string;
    createdBy: number;
    createdOn: Date;
    updatedBy: number;
    updatedOn: Date;
    isDeleted: number;
    static associate(models) {
      // define association here
    }
  }
  Errorlog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    schemaName: {
      // type: DataTypes.STRING,
      type: "varchar(max)",
      allowNull: false
    },
    transType: {
      // type: DataTypes.STRING,
      type: "varchar(max)",
      allowNull: false
    },
    message: {
      // type: DataTypes.STRING,
      type: "varchar(max)",
      allowNull: false
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
    modelName: 'tbl_errorLog',
    freezeTableName: true,
    timestamps: false
  });
  return Errorlog;
};