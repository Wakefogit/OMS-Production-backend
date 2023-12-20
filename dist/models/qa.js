'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Qa extends sequelize_1.Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.tbl_order, { foreignKey: 'orderId' });
        }
    }
    Qa.init({
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
        modelName: 'tbl_qa',
        freezeTableName: true,
        timestamps: false,
        indexes: [
            {
                unique: false,
                fields: ["uniqueKey"]
            },
        ]
    });
    return Qa;
};
//# sourceMappingURL=qa.js.map