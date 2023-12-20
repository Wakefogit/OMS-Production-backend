'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class LoginTrack extends sequelize_1.Model {
        static associate(models) {
            // define association here
        }
    }
    LoginTrack.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tbl_user',
                key: 'id'
            }
        },
        ipAddress: {
            type: DataTypes.STRING,
        },
        browserAgent: {
            type: DataTypes.STRING,
        },
        sessionToken: {
            // type: DataTypes.STRING,
            type: "varchar(MAX)",
        },
        isLoggedIn: {
            type: DataTypes.INTEGER,
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
        modelName: 'tbl_loginTrack',
        freezeTableName: true,
        timestamps: false,
        indexes: [
            {
                unique: false,
                fields: ["userId", "isLoggedIn"]
            }
        ]
    });
    return LoginTrack;
};
//# sourceMappingURL=logintrack.js.map