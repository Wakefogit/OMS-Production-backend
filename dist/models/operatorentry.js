'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class OperatorEntry extends sequelize_1.Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.tbl_order, { foreignKey: 'orderId' });
        }
    }
    OperatorEntry.init({
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
        dieTrialRefId: {
            type: DataTypes.INTEGER,
            // allowNull: false
        },
        dieWithAluminiumRefId: {
            type: DataTypes.INTEGER,
            // allowNull: false
        },
        previousDayDie_continueRefId: {
            type: DataTypes.INTEGER,
            // allowNull: false
        },
        batchNo: {
            // type: DataTypes.STRING,
            type: DataTypes.INTEGER,
            // allowNull: false
        },
        actualInternalAlloy: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        startTime: {
            type: DataTypes.DATE,
            // allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            // allowNull: false
        },
        processTime: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        noOfBilletAndLength: {
            // type: DataTypes.STRING,
            type: "varchar(max)",
            // allowNull: false
        },
        actualButtThickness: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false
        },
        breakThroughPressure: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false
        },
        pushOnBilletLength: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false
        },
        pushQtyInKgs: {
            // type: DataTypes.INTEGER,
            type: "numeric(18,4)",
            // allowNull: false
        },
        actualProductionRate: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false
        },
        buttWeightInKgs: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false
        },
        diefailRefId: {
            type: DataTypes.INTEGER,
            // allowNull: false
        },
        dieFailureReason: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        breakDown: {
            // type: DataTypes.STRING,
            type: "varchar(max)",
            // allowNull: false
        },
        breakDownDuration: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        logEndScrapLengthInMm: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false
        },
        logEndScrapInKgs: {
            // type: DataTypes.DOUBLE,
            type: "numeric(18,4)",
            // allowNull: false
        },
        operatorName: {
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
        modelName: 'tbl_operatorEntry',
        freezeTableName: true,
        timestamps: false,
        indexes: [
            {
                unique: false,
                fields: ["uniqueKey"]
            },
        ]
    });
    return OperatorEntry;
};
//# sourceMappingURL=operatorentry.js.map