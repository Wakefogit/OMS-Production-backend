'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class DownloadTemplate extends sequelize_1.Model {
        static associate(models) {
            // define association here
        }
    }
    DownloadTemplate.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prefix: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        columnName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        queryAndFunction: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdOn: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isDeleted: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'tbl_downloadTemplate',
        freezeTableName: true,
        timestamps: false
    });
    return DownloadTemplate;
};
//# sourceMappingURL=downloadtemplate.js.map