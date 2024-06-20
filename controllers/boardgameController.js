const { Sequelize } = require('../db/db');
const { Boardgame, UserBoardgame } = require('../models/associations');
const sanitizeHtml = require("sanitize-html");

const defaultOptionsSanitize = {
    allowedTags: [],
    allowedAttributes: {},
};

const boardgameController = {
    // Voir tous les jeux de société de la base de données
    read: async (req, res) => {

        try {
            const boardgames = await Boardgame.findAll({
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                include: ["user"]});

            return res.status(200).json({ message: "Success", data: boardgames });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Echec", error })
        }
    },

    // Ajouter un jeu de société à sa bibliothèque si il est déjà existant dans la base de données
    addBoardgame: async (req, res) => {
        try {
            const { name } = req.body;
            const sanitizedName = sanitizeHtml(name, defaultOptionsSanitize);
            const userId = parseInt(req.user.id, 10);
            const boardgame = await Boardgame.findOne({ where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), Sequelize.fn('lower', sanitizedName)) });

            // Si le jeu est présent dans la base de données
            if (boardgame) {
                let newUserBoardgame;
                const lineIsPresent = await UserBoardgame.findOne({ where: { user_id: userId, boardgame_id: boardgame.id }});

                // Si la ligne est déjà présente dans la bibliothèque, l'utilisateur ne peux pas l'ajouter une seconde fois
                if (lineIsPresent) {
                    return res.status(401).json({ message: "Ce jeu est déjà présent dans ta bibliothèque, tu ne peux pas faire de doublon !"});
                }
                // Sinon, on l'ajoute à sa bibliothèque
                newUserBoardgame = await UserBoardgame.create({
                    user_id: userId, 
                    boardgame_id: boardgame.id, 
                    player_min: boardgame.player_min, 
                    player_max: boardgame.player_max, 
                    time: boardgame.time, 
                    age: boardgame.age, 
                    type_game: boardgame.type
                });
                return res.status(201).json({ message: "Jeu existant dans la base de données et bien ajouté à ta librairie", newUserBoardgame });
            } else {
                return res.status(200).json({ message: "Jeu inexistant dans la base de données mais tu peux l'ajouter en spécifiant ses données" });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Erreur lors de la recherche" });
        }

    },

    create: async (req, res) => {
        try {

            return res.status(200).json({ message: "Création du jeu" });
        } catch (error) {
            
        }
    },
}

module.exports = boardgameController;
