'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PPC extends sequelize_1.Model {
        static associate(models) {
            this.belongsTo(models.tbl_order, { foreignKey: 'orderId' });
        }
    }
    PPC.init({
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
        plantSelected: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        pressAllocationRefId: {
            // type: DataTypes.STRING,
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        plannedQty: {
            // type: DataTypes.INTEGER,
            type: "numeric(18,4)",
            // allowNull: false,
        },
        plannedInternalAlloy: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        plannedNoOfBilletAndLength: {
            // type: DataTypes.STRING,
            type: "varchar(max)",
            // allowNull: false,
        },
        productionRateRequired: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false,
        },
        plannedQuenching: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        frontEndCoringLength: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false,
        },
        backEndCoringLength: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false,
        },
        plantExtrusionLength: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false,
        },
        extrusionLengthRefId: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        plannedButtThickness: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false,
        },
        cutBilletsRefId: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        buttWeightPerInch: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false,
        },
        // priorityAssignmentRefId:{
        //   type: DataTypes.INTEGER,
        //   allowNull: false,
        // },
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
        modelName: 'tbl_ppc',
        freezeTableName: true,
        timestamps: false,
        indexes: [
            {
                unique: false,
                fields: ["uniqueKey"]
            },
        ]
    });
    return PPC;
};
//# sourceMappingURL=ppc.js.map