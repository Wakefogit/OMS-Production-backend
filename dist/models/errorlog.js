'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Errorlog extends sequelize_1.Model {
        static associate(models) {
            // define association here
        }
    }
    Errorlog.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        schemaName: {
            // type: DataTypes.STRING,
            type: "varchar(max)",
            allowNull: false
        },
        transType: {
            // type: DataTypes.STRING,
            type: "varchar(max)",
            allowNull: false
        },
        message: {
            // type: DataTypes.STRING,
            type: "varchar(max)",
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
        modelName: 'tbl_errorLog',
        freezeTableName: true,
        timestamps: false
    });
    return Errorlog;
};
//# sourceMappingURL=errorlog.js.map