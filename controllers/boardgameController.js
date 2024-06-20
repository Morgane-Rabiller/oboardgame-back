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
    
    // Création du jeu dans la base de données
    create: async (req, res) => {
        try {
            const { name, ...fieldToCreate } = req.body;
            const sanitizedName = sanitizeHtml(name, defaultOptionsSanitize);
            const boardgame = await Boardgame.findOne({ where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), Sequelize.fn('lower', sanitizedName)) });
            
            // Si le jeu existe déjà dans la base de données, on ne le crée pas une deuxième fois.
            if(boardgame) {
                return res.status(401).json({ message: "Ce jeu est déjà présent dans la base de données, tu ne peux pas créer de doublon !"})
            }
            // Si il n'est pas dans la base de données, on le crée
            const newBoardgame = await Boardgame.create({name:sanitizedName, ...fieldToCreate});
            
            return res.status(201).json({ message: "Jeu crée", newBoardgame });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Jeu non crée" });
            
        }
    },
    

}

module.exports = boardgameController;
