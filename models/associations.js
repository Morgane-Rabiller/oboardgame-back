const User = require("./userModel.js");
const Boardgame = require("./boardgameModel.js");
const db = require("../db/db.js");
const sequelize = require("sequelize");
const PasswordResetToken = require("./passwordResetToken.js");
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
    note: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    release_date: {
        type: DataTypes.DATE,
        allowNull: true,
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

UserBoardgame.belongsTo(Boardgame, {
    as: "boardgame",
    foreignKey: "boardgame_id"
});

UserBoardgame.belongsTo(User, {
    as: "user",
    foreignKey: "user_id"
});

User.hasOne(PasswordResetToken, {
    foreignKey: 'user_id',
    as: 'passwordResetToken'
});
PasswordResetToken.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});


module.exports = {
    User, 
    Boardgame,
    UserBoardgame
};