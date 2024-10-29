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
            const boardgameId = parseInt(req.params.id);
            const boardgame = await UserBoardgame.findOne({ where: { user_id:userId, boardgame_id: boardgameId }});
            const note = boardgame.dataValues.note;
            if(!note) {
                return res.status(404).json({ message: "Pas de note sur ce jeu" });
            }
            
            return res.status(200).json({ message: "Lecture de la note", note });
        } catch (error) {
            console.log(error);
            
            return res.status(401).json({ message: "Echec de la recherche de la note." });
        }
    },

    // Modification des champs d'un des jeux de sa bibliothèque
    addNote: async (req, res) => {
        try {
            const { note } = req.body;
            const userId = parseInt(req.user.id, 10);
            const boardgameId = parseInt(req.params.id, 10);
            const currentNote = sanitizeHtml(note, defaultOptionsSanitize);
            let boardgame;

            if (currentNote !== "") {
                const boardgameToUpdate = await UserBoardgame.findOne({ where: { user_id: userId, boardgame_id: boardgameId }});
                boardgame = await boardgameToUpdate.update({ note : currentNote });
            }
            const noteToAdd = boardgame.dataValues.note;
            
            return res.status(201).json({ message: "Note ajoutée", noteToAdd });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Impossible d'ajouter une note"})
        }
    },

    // // Supprimer un jeu de sa bibliothèque
    // delete: async (req, res) => {
    //     try {
    //         const userId = parseInt(req.user.id, 10);
    //         const boardgameId = parseInt(req.params.id, 10);
    //         const boardgameToDelete = await UserBoardgame.findOne({ where: { user_id: userId, boardgame_id: boardgameId }, include: [{ model: Boardgame, as: "boardgame", attributes: ['name']}]});
    //         const boardgameName = boardgameToDelete.boardgame.dataValues.name;
            
    //         await boardgameToDelete.destroy();
    //         return res.status(201).json(`Jeu ${boardgameName} supprimé de la bibliothèque`);
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(401).json({ message: "Echec de la supprission" });
    //     }
    // }
}

module.exports = libraryController;