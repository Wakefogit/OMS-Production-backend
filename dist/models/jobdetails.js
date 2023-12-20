'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class JobDetails extends sequelize_1.Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.tbl_job, { foreignKey: 'jobId' });
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
//# sourceMappingURL=jobdetails.js.map