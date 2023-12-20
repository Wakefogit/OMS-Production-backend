'use strict';

import { ForeignKey, Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id: number;
    uniqueKey: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profileUrl: string;
    phoneNumber: string;
    roleId: ForeignKey<number>;
    lastLogin: Date;
    isActive: number;
    createdBy: number;
    createdOn: Date;
    updatedBy: number;
    updatedOn: Date;
    isDeleted: number;
    static associate(models) {
      // define association here
      this.belongsTo(models.tbl_role, { foreignKey: 'roleId' })
      this.hasMany(models.tbl_orderUserMapping, { foreignKey: 'userId' })
    }
  }
  User.init({
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true
    },
    password: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    profileUrl: {
      type: DataTypes.STRING,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_role',
        key: 'id'
      }
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    isActive: {
      type: DataTypes.INTEGER,
      // defaultValue: 1
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
      // defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'tbl_user',
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ["email", "firstName", "lastName"]
      }
    ]
  });
  return User;
};