'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Reference extends sequelize_1.Model {
        static associate(models) {
            // define association here
        }
    }
    Reference.init({
        id: {
            type: DataTypes.INTEGER,
            // primaryKey: true,
            // autoIncrement: true,
            // unique: true
        },
        uniqueKey: {
            primaryKey: true,
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        referenceGroupId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tbl_referenceGroup',
                key: 'id'
            }
        },
        sortOrder: {
            type: DataTypes.INTEGER,
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
        modelName: 'tbl_reference',
        freezeTableName: true,
        timestamps: false,
        indexes: [{
                unique: false,
                fields: ["id", "referenceGroupId"]
            }]
    });
    return Reference;
};
//# sourceMappingURL=reference.js.map