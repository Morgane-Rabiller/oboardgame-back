const User = require("./userModel.js");
const Boardgame = require("./boardgameModel.js");
const db = require("../db/db.js");
const sequelize = require("sequelize");
const { DataTypes } = sequelize;

const UserBoardgame = db.define("user_boardgame", {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "id"
        }
    },
    boardgame_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Boardgame,
            key: "id"
        }
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
    type_game: {
        type: DataTypes.ENUM("Dés", "Cartes", "Plateau"),
        allowNull: false,
    },
},{ timestamps: false,
    freezeTableName: true
 });

// Association User -> Boardgame
User.belongsToMany(Boardgame, {
    as: "boardgame",
    through: UserBoardgame,
    foreignKey: "user_id",
    otherKey: "boardgame_id",
    timestamps: false
});

Boardgame.belongsToMany(User, {
    as: "user",
    through: UserBoardgame,
    foreignKey: "boardgame_id",
    otherKey: "user_id",
    timestamps: false
});

module.exports = {
    User, 
    Boardgame,
    UserBoardgame
};