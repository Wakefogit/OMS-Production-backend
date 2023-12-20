'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ToolShop extends sequelize_1.Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.tbl_order, { foreignKey: 'orderId' });
        }
    }
    ToolShop.init({
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
        dieRefId: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        noOfCavity: {
            type: DataTypes.INTEGER,
            // allowNull: false
        },
        bolsterEntry: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        backerEntry: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        specialBackerEntry: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        ringEntry: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        dieSetter: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        weldingChamber: {
            type: DataTypes.STRING,
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
        modelName: 'tbl_toolShop',
        freezeTableName: true,
        timestamps: false,
        indexes: [
            {
                unique: false,
                fields: ["uniqueKey"]
            },
        ]
    });
    return ToolShop;
};
//# sourceMappingURL=toolshop.js.map