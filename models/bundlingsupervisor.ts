'use strict';

import { ForeignKey, Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class BundlingSupervisor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id: number;
    uniqueKey: string;
    orderId: ForeignKey<number>;
    finishQuantity: number;
    piecesPerBundle: number;
    bundleWeight: number;
    noOfBundles: number;
    totalNoOfPieces: number;
    correctionQty: number;
    actualFrontEndCoringLength: number;
    actualBackEndCoringLength: number;
    recovery: number;
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
  BundlingSupervisor.init({
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
    finishQuantity: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
      // allowNull: false
    },
    piecesPerBundle: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    bundleWeight: {
      // type: DataTypes.DOUBLE,
      type: "numeric(18,4)",
      // allowNull: false
    },
    noOfBundles: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    totalNoOfPieces: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    correctionQty: {
      // type: DataTypes.DOUBLE,
      type: "numeric(18,4)",
      // allowNull: false
    },
    actualFrontEndCoringLength: {
      // type: DataTypes.DOUBLE,
      type: "numeric(18,4)",
      // allowNull: false
    },
    actualBackEndCoringLength: {
      // type: DataTypes.DOUBLE,
      type: "numeric(18,4)",
      // allowNull: false
    },
    recovery: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
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
    updatedAdminId: {
      type: DataTypes.INTEGER,
    },
    adminUpdatedOn: {
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
    modelName: 'tbl_bundlingSupervisor',
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ["uniqueKey"]
      },
    ]
  });
  return BundlingSupervisor;
};