'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class OrderTimeTrack extends sequelize_1.Model {
        static associate(models) {
            // define association here
        }
    }
    OrderTimeTrack.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tbl_order',
                key: 'id'
            }
        },
        workflowId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tbl_workFlow',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tbl_user',
                key: 'id'
            }
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            // allowNull: false
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
        modelName: 'tbl_orderTimeTrack',
        freezeTableName: true,
        timestamps: false
    });
    return OrderTimeTrack;
};
//# sourceMappingURL=ordertimetrack.js.map