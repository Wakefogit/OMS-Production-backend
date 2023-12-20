'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ReferenceGroup extends sequelize_1.Model {
        static associate(models) {
            // define association here
        }
    }
    ReferenceGroup.init({
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
        description: {
            type: DataTypes.STRING,
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
        modelName: 'tbl_referenceGroup',
        freezeTableName: true,
        timestamps: false
    });
    return ReferenceGroup;
};
//# sourceMappingURL=referencegroup.js.map