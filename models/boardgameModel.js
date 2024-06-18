const sequelize = require("sequelize");
const db = require("../db/db.js");
const { DataTypes } = sequelize;

const Boardgame = db.define(
    "boardgame",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        player_min: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        player_max: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        time: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("Dés", "Cartes", "Plateau"),
            allowNull: false,
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
        tableName: "boardgame",
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = Boardgame;