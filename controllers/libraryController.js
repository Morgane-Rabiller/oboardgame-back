const { Sequelize } = require('../db/db');
const { Boardgame, UserBoardgame } = require('../models/associations');
const sanitizeHtml = require("sanitize-html");
const { Op } = require('sequelize');
const randomSelection = require('../services/randomSelection');

const defaultOptionsSanitize = {
    allowedTags: [],
    allowedAttributes: {},
};

// Bibliothèque personnelle d'un utilisateur
const libraryController = {
    
    // Voir sa bibliothèque
    read: async (req, res) => {
        try {
            const userId = parseInt(req.user.id, 10);
            const boardgamesInLibrary = await UserBoardgame.findAll({ where: { user_id: userId }, include: [{ model: Boardgame, as: "boardgame", attributes: ['name']}], order: [[{ model: Boardgame, as: 'boardgame' }, 'name', 'ASC']]});

            const formattedResponse = boardgamesInLibrary.map(ub => ({
                ...ub.dataValues,
                name: ub.boardgame.name
            }));
            
            return res.status(200).json({ message: "Les jeux de ta bibliothèque !", data: formattedResponse });
        } catch (error) {
            console.log(error);
            
            return res.status(401).json({ message: "Tu n'as pas encore de jeux dans ta bibliothèque" });
        }
    },

    findBoardgame: async (req, res) => {
        try {
            const userId = parseInt(req.user.id, 10);
            const players = parseInt(req.query.players, 10);
            
            if(req.query.type === "---") {
                req.query.type = null;
            }
            if(req.query.time === "---") {
                req.query.time = null
            }
            // Initialisation d'un objet pour stocker les critères de recherche
            const searchCriteria = {
                user_id: userId,
                ...(players && { player_min:{ [Op.lte]: players }}),
                ...(players && { player_max: { [Op.gte]: players }}),
                ...(req.query.type && { type_game: req.query.type }),
                ...(req.query.age && { age: { [Op.gte]:parseInt(req.query.age, 10) }}),
                ...(req.query.time && { time: { [Op.lte]: parseInt(req.query.time, 10) }})
            };
    
            const filteredBoardgames = await UserBoardgame.findAll({
                where: searchCriteria,
                include: [{ model: Boardgame, as: "boardgame", attributes: ['name'] }]
            });
            
            const randomBoardgame = randomSelection(filteredBoardgames);
            
            if(!randomBoardgame) {
                return res.status(401).json({ message: "Aucun jeux correspondant à ta demande" });
            }

            await randomBoardgame.update({release_date: new Date()});
            
            const nameRandomGame = randomBoardgame.boardgame.dataValues.name;

            return res.status(200).json({ message: "Jeu sélectionné :", boardgameName: nameRandomGame });
            
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Echec de la demande" });
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
                    return res.status(401).json({ message: "Ce jeu est déjà dans ta bibliothèque"});
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
                return res.status(201).json({ message: "Le jeu a bien été ajouté dans ta bibliothèque", newUserBoardgame });
            } else {
                return res.status(
                    
                ).json({ message: "Jeu inexistant dans la base de données mais tu peux l'ajouter en spécifiant ses données" });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Erreur lors de la recherche" });
        }
        
    },

    // Modification des champs d'un des jeux de sa bibliothèque
    update: async (req, res) => {
        try {
            const { ...fieldToUpdate } = req.body;
            const userId = parseInt(req.user.id, 10);
            const boardgameId = parseInt(req.params.id, 10);
            if(fieldToUpdate.player_min > 10 || fieldToUpdate.player_min < 1) {
                return res.status(401).json({ message: "Le nombre minimum de joueur ne peut pas être supérieur 10 ou inférieur à 1 !"});
            }
            if(fieldToUpdate.player_max > 50 || fieldToUpdate.player_max < 1) {
                return res.status(401).json({ message: "Le nombre maximum de joueur ne peut pas être supérieur 50 ou inférieur à 1 !"});
            }
            if(fieldToUpdate.age < 2 || fieldToUpdate.age > 18) {
                return res.status(401).json({ message: "L'age ne peut pas être en dessous de 2 ans et est forcément autorisé au dessus de 18 ans !"});
            }
            
            
            const boardgameToUpdate = await UserBoardgame.findOne({ where: { user_id: userId, boardgame_id: boardgameId }});
            
            const boardgame = await boardgameToUpdate.update(fieldToUpdate);
            return res.status(201).json({ message: "Jeu modifié", boardgame });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Impossible de modifier le jeu"})
        }
    },

    // Supprimer un jeu de sa bibliothèque
    delete: async (req, res) => {
        try {
            const userId = parseInt(req.user.id, 10);
            const boardgameId = parseInt(req.params.id, 10);
            const boardgameToDelete = await UserBoardgame.findOne({ where: { user_id: userId, boardgame_id: boardgameId }, include: [{ model: Boardgame, as: "boardgame", attributes: ['name']}]});
            const boardgameName = boardgameToDelete.boardgame.dataValues.name;
            
            await boardgameToDelete.destroy();
            return res.status(201).json(`Jeu ${boardgameName} supprimé de la bibliothèque`);
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Echec de la supprission" });
        }
    }
}

module.exports = libraryController;