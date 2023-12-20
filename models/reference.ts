'use strict';

import { ForeignKey, Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Reference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id: number;
    uniqueKey: string;
    name: string;
    description: string;
    referenceGroupId: ForeignKey<number>;
    sortOrder: number;
    createdBy: number;
    createdOn: Date;
    updatedBy: number;
    updatedOn: Date;
    isDeleted: number;
    static associate(models) {
      // define association here
    }
  }
  Reference.init({
    id: {
      type: DataTypes.INTEGER,
      // primaryKey: true,
      // autoIncrement: true,
      // unique: true
    },
    uniqueKey: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    referenceGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_referenceGroup',
        key: 'id'
      }
    },
    sortOrder: {
      type: DataTypes.INTEGER,
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
    modelName: 'tbl_reference',
    freezeTableName: true,
    timestamps: false,
    indexes: [{
      unique: false,
      fields: ["id", "referenceGroupId"]
    }]
  });
  return Reference;
};