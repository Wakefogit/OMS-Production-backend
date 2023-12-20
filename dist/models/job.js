'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Job extends sequelize_1.Model {
        static associate(models) {
            // define association here
            this.hasOne(models.tbl_jobDetails, { foreignKey: 'jobId' });
        }
    }
    Job.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        statusRefId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        errorMsg: {
            type: DataTypes.STRING,
        },
        isManual: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
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
        modelName: 'tbl_job',
        freezeTableName: true,
        timestamps: false
    });
    return Job;
};
//# sourceMappingURL=job.js.map