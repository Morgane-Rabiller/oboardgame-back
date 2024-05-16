const User = require("./userModel.js");
const Boardgame = require("./boardgameModel.js");

// Association User -> Boardgame
User.belongsToMany(Boardgame, {
    as: "boardgame",
    through: "user_boardgame",
    foreignKey: "user_id",
    otherKey: "boardgame_id",
    timestamps: false
});

Boardgame.belongsToMany(User, {
    as: "user",
    through: "user_boardgame",
    foreignKey: "boardgame_id",
    otherKey: "user_id",
    timestamps: false
});

module.exports = {
    User, 
    Boardgame
};