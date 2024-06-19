// const { Sequelize } = require('../db/db');
const { Boardgame, User } = require('../models/associations');
// const sanitizeHtml = require("sanitize-html");

const defaultOptionsSanitize = {
    allowedTags: [],
    allowedAttributes: {},
};

const boardgameController = {
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

    searchOneBoardgame: async (req, res) => {
        try {
            const { name } = req.body;
            const sanitizedName = sanitizeHtml(name, defaultOptionsSanitize);
            // const user_id = parseInt(req.user.id, 10);
            const boardgame = await Boardgame.findOne({ where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), Sequelize.fn('lower', sanitizedName)) });
            if (boardgame) {
                console.log(boardgame);
                res.status(200).json({ message: "Jeu existant", boardgame });
            } else {
                boardgameController.create(req, res);
            }
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Erreur lors de la recherche" });
        }

    },

    create: async (req, res) => {
        res.status(200).json({ message: "Jeu inexistant" });
    }
}

module.exports = boardgameController;
