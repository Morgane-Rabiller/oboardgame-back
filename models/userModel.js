const sequelize = require("sequelize");
const db = require("../db/db.js");
const { DataTypes } = sequelize;

const User = db.define(
    "user",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        pseudo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        check: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_at: {
            field: "created_at",
            type: DataTypes.DATE,
            allowNull: false,
        },
        updated_at: {
            field: "updated_at",
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "user",
        createdAt: "created_at",
        updatedAt: "updated_at",
        freezeTableName: true,
    }
);

module.exports = User;
