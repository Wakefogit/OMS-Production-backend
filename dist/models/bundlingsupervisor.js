'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class BundlingSupervisor extends sequelize_1.Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.tbl_order, { foreignKey: 'orderId' });
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
//# sourceMappingURL=bundlingsupervisor.js.map