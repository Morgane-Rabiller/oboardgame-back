const { Sequelize } = require('../db/db');
const { Boardgame, UserBoardgame } = require('../models/associations');
const sanitizeHtml = require("sanitize-html");
const { Op } = require('sequelize');
const randomSelection = require('../services/randomSelection');

const defaultOptionsSanitize = {
    allowedTags: [],
    allowedAttributes: {},
};

// Note d'un jeu de la bibliothèque
const libraryController = {
    
    // Voir la note d'un jeu
    read: async (req, res) => {
        try {
            const userId = parseInt(req.user.id, 10);
            const boardgameId = parseInt(req.params.id);
            const boardgame = await UserBoardgame.findOne({ where: { user_id:userId, boardgame_id: boardgameId }});
            const note = boardgame.dataValues.note;
            if(!note) {
                return res.status(200).json({message: "Pas de note sur ce jeu.", note: null });
            }
            return res.status(200).json({ message: "Lecture de la note", note });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Echec de la recherche de la note." });
        }
    },

    // Ajout d'une note sur un jeu
    addNote: async (req, res) => {
        try {
            const { note } = req.body;
            const userId = parseInt(req.user.id, 10);
            const boardgameId = parseInt(req.params.id, 10);
            const currentNote = sanitizeHtml(note, defaultOptionsSanitize);
            let boardgameToUpdate;
            let boardgame;

            if (currentNote !== "") {
                boardgameToUpdate = await UserBoardgame.findOne({ where: { user_id: userId, boardgame_id: boardgameId }, include: [{ model: Boardgame, as: "boardgame", attributes: ['name']}]});
                boardgame = await boardgameToUpdate.update({ note : currentNote });
            }
            const boardgameName = boardgameToUpdate.boardgame.dataValues.name;
            const noteToAdd = boardgame.dataValues.note;
            
            return res.status(201).json({ message: `Note ajoutée pour le jeu ${boardgameName}`, noteToAdd });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Impossible d'ajouter une note"})
        }
    },

    // Supprimer la note d'un jeu
    delete: async (req, res) => {
        try {
            const userId = parseInt(req.user.id, 10);
            const boardgameId = parseInt(req.params.id, 10);
            const boardgameToUpdate = await UserBoardgame.findOne({ where: { user_id: userId, boardgame_id: boardgameId }, include: [{ model: Boardgame, as: "boardgame", attributes: ['name']}]});
            const boardgameName = boardgameToUpdate.boardgame.dataValues.name;
            
            await boardgameToUpdate.update({ note: null});
            return res.status(201).json({ message: `Suppression de la note pour le jeu ${boardgameName}` });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Echec de la suppression" });
        }
    }
}

module.exports = libraryController;