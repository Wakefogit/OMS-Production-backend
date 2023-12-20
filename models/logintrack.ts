'use strict';

import { ForeignKey, Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class LoginTrack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id: number;
    uniqueKey: string;
    userId: ForeignKey<number>;
    ipAddress: string;
    browserAgent: string;
    sessionToken: string;
    isLoggedIn: number;
    isActive: number;
    createdBy: number;
    createdOn: Date;
    updatedBy: number;
    updatedOn: Date;
    isDeleted: number;
    static associate(models) {
      // define association here
    }
  }
  LoginTrack.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_user',
        key: 'id'
      }
    },
    ipAddress: {
      type: DataTypes.STRING,
    },
    browserAgent: {
      type: DataTypes.STRING,
    },
    sessionToken: {
      // type: DataTypes.STRING,
      type: "varchar(MAX)",
    },
    isLoggedIn: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.INTEGER,
      defaultValue: 1
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
    modelName: 'tbl_loginTrack',
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ["userId", "isLoggedIn"]
      }
    ]
  });
  return LoginTrack;
};