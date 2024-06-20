const { Sequelize } = require('../db/db');
const { Boardgame, UserBoardgame } = require('../models/associations');
const sanitizeHtml = require("sanitize-html");

const defaultOptionsSanitize = {
    allowedTags: [],
    allowedAttributes: {},
};

const libraryController = {

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
                return res.status(
                    
                ).json({ message: "Jeu inexistant dans la base de données mais tu peux l'ajouter en spécifiant ses données" });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Erreur lors de la recherche" });
        }
        
    },

    // Modification des champs d'un des jeux d'une bibliothèque utilisateur
    update: async (req, res) => {
        try {
            const { ...fieldToUpdate } = req.body;
            const userId = parseInt(req.user.id, 10);
            const boardgameId = parseInt(req.params.id, 10);
            const boardgameToUpdate = await UserBoardgame.findOne({ where: { user_id: userId, boardgame_id: boardgameId }});
            
            const boardgame = await boardgameToUpdate.update(fieldToUpdate);
            return res.status(201).json({ message: "Jeu modifié", boardgame });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Impossible de modifier le jeu"})
        }
    },

    delete: async (req, res) => {
        try {
            
            const userId = parseInt(req.user.id, 10);
            const boardgameId = parseInt(req.params.id, 10);
            const boardgameToDelete = await UserBoardgame.findOne({ where: { user_id: userId, boardgame_id: boardgameId }});
            
            await boardgameToDelete.destroy();
            return res.status(201).json("Jeu supprimé de la bibliothèque");
        } catch (error) {
            console.log(errror);
            return res.status(401).json({ message: "Echec de la supprission" });
        }
    }
}

module.exports = libraryController;