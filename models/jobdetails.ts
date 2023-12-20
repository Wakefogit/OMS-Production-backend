'use strict';

import { ForeignKey, Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class JobDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id: number;
    jobId: ForeignKey<number>;
    std_alloy: string;
    customer_name: string;
    customer_delivery_dt: Date;
    cut_len: string;
    cut_len_uom: string;
    cut_len_tolerance_upper: number;
    cut_len_tolerance_lower: number;
    tool_detail: string;
    die_issued_by_ts: string;
    po_qty: number;
    po_release_status: string;
    internal_alloy: string;
    no_of_pieces: number;
    order_qty: number
    order_qty_uom: string;
    po: string;
    po_release_dt: Date;
    planned_press: string;
    profile_unit_weight_kg_m: number;
    material_code: string;
    so: string;
    so_release_dt: Date;
    so_creation_dt: Date;
    temper: string;
    qty_tolerance_min: number;
    qty_tolerance_max: number;
    so_line_items: number;
    zone: string;
    customer_technical_data_sheet: string;
    end_use: string;
    component_1: string;
    component_2: string;
    Requirement1_qty: number;
    requirement2_qty: number;
    order_type: string;
    plant: string;
    teco_status: string;
    createdBy: number;
    createdOn: Date;
    updatedOn: Date;
    isDeleted: number;
    static associate(models) {
      // define association here
      this.belongsTo(models.tbl_job, { foreignKey: 'jobId' })
    }
  }
  JobDetails.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_job',
        key: 'id'
      }
    },
    std_alloy: {
      // type: DataTypes.STRING,
      type: "varchar(120)",
    },
    customer_name: {
      // type: DataTypes.STRING,
      type: "varchar(110)",
    },
    customer_delivery_dt: {
      type: DataTypes.DATE,
    },
    cut_len: {
      // type: DataTypes.STRING,
      type: "varchar(120)",
    },
    cut_len_uom: {
      // type: DataTypes.STRING,
      type: "varchar(120)",
    },
    cut_len_tolerance_upper: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
    },
    cut_len_tolerance_lower: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
    },
    tool_detail: {
      // type: DataTypes.STRING,
      type: "varchar(max)",
    },
    die_issued_by_ts: {
      // type: DataTypes.STRING,
      type: "varchar(max)",
    },
    po_qty: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
    },
    po_release_status: {
      // type: DataTypes.STRING,
      type: "varchar(140)",
    },
    internal_alloy: {
      // type: DataTypes.STRING,
      type: "varchar(120)",
    },
    no_of_pieces: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
    },
    order_qty: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
    },
    order_qty_uom: {
      // type: DataTypes.STRING,
      type: "varchar(140)",
    },
    po: {
      // type: DataTypes.STRING,
      type: "varchar(120)",
    },
    po_release_dt: {
      type: DataTypes.DATE,
    },
    planned_press: {
      // type: DataTypes.STRING,
      type: "varchar(100)",
    },
    profile_unit_weight_kg_m: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
    },
    material_code: {
      // type: DataTypes.STRING,
      type: "varchar(100)",
    },
    so: {
      // type: DataTypes.STRING,
      type: "varchar(100)",
    },
    so_release_dt: {
      type: DataTypes.DATE,
    },
    so_creation_dt: {
      type: DataTypes.DATE,
    },
    temper: {
      // type: DataTypes.STRING,
      type: "varchar(200)",
    },
    qty_tolerance_min: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
    },
    qty_tolerance_max: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
    },
    so_line_items: {
      type: DataTypes.INTEGER,
    },
    zone: {
      // type: DataTypes.STRING,
      type: "varchar(140)",
    },
    customer_technical_data_sheet: {
      // type: DataTypes.STRING,
      type: "char(200)",
    },
    end_use: {
      // type: DataTypes.STRING,
      type: "varchar(200)",
    },
    component_1: {
      // type: DataTypes.STRING,
      type: "varchar(140)",
    },
    component_2: {
      // type: DataTypes.STRING,
      type: "varchar(140)",
    },
    Requirement1_qty: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
    },
    requirement2_qty: {
      // type: DataTypes.INTEGER,
      type: "numeric(18,4)",
    },
    order_type: {
      // type: DataTypes.STRING,
      type: "varchar(140)",
    },
    plant: {
      // type: DataTypes.STRING,
      type: "varchar(140)",
    },
    teco_status: {
      // type: DataTypes.STRING,
      type: "varchar(140)",
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedOn: {
      type: DataTypes.DATE,
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'tbl_jobDetails',
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ["po"]
      },
      {
        unique: false,
        fields: ["po_release_dt"]
      },
      {
        unique: false,
        fields: ["component_1"]
      },
      {
        unique: false,
        fields: ["plant"]
      },
      {
        unique: false,
        fields: ["planned_press"]
      },
      {
        unique: false,
        fields: ["so"]
      },
    ]
  });
  return JobDetails;
};