const sequelize =require( "sequelize");
const db = require("../db/db.js");
const User = require("./userModel.js");

const { DataTypes } = sequelize;

const PasswordResetToken = db.define("passwordResetTokens", {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key:'id'
        },
    },
    token: {
        type: DataTypes.STRING,
        allowNull :false,
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull :false,
    },
},{ 
    timestamps: false
 });

module.exports = PasswordResetToken;