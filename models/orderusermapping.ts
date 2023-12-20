'use strict';

import { ForeignKey, Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class OrderUserMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id: number;
    uniqueKey: string;
    userId: ForeignKey<number>;
    orderId: ForeignKey<number>;
    isActive: number;
    createdBy: number;
    createdOn: Date;
    updatedBy: number;
    updatedOn: Date;
    isDeleted: number;
    static associate(models) {
      // define association here
      this.belongsTo(models.tbl_order, { foreignKey: 'orderId' })
      this.belongsTo(models.tbl_user, { foreignKey: 'userId' })
    }
  }
  OrderUserMapping.init({
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_user',
        key: 'id'
      }
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_order',
        key: 'id'
      }
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
    modelName: 'tbl_orderUserMapping',
    freezeTableName: true,
    timestamps: false
  });
  return OrderUserMapping;
};