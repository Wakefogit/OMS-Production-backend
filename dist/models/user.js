'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends sequelize_1.Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.tbl_role, { foreignKey: 'roleId' });
            this.hasMany(models.tbl_orderUserMapping, { foreignKey: 'userId' });
        }
    }
    User.init({
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
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // unique: true
        },
        password: {
            type: DataTypes.STRING,
        },
        phoneNumber: {
            type: DataTypes.STRING,
        },
        profileUrl: {
            type: DataTypes.STRING,
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tbl_role',
                key: 'id'
            }
        },
        lastLogin: {
            type: DataTypes.DATE,
        },
        isActive: {
            type: DataTypes.INTEGER,
            // defaultValue: 1
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
            // defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'tbl_user',
        freezeTableName: true,
        timestamps: false,
        indexes: [
            {
                unique: false,
                fields: ["email", "firstName", "lastName"]
            }
        ]
    });
    return User;
};
//# sourceMappingURL=user.js.map