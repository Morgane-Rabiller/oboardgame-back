const { Sequelize } = require('../db/db');
const { Boardgame, UserBoardgame } = require('../models/associations');
const sanitizeHtml = require("sanitize-html");
const log4js = require("log4js");

log4js.configure({
    appenders: { logger: { type: "file", filename: "logger.log" } },
    categories: { default: { appenders: ["logger"], level: "debug" } },
  });

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
                order: [["name", "ASC"]]
            });

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
            
            if(name === "") {
                return res.status(401).json({ message: "Tu as oublié le nom du jeu !" });
                // return res.status(401).json({ message: "Merci de remplir tous les champs" });
            }
            if(fieldToCreate.type === null || fieldToCreate.time === null){
                
                return res.status(401).json({ message: "Merci de remplir tous les champs !" });
            }
            const boardgame = await Boardgame.findOne({ where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), Sequelize.fn('lower', sanitizedName)) });
            
            // Si le jeu existe déjà dans la base de données, on ne le crée pas une deuxième fois.
            if(boardgame) {
                return res.status(401).json({ message: "Ce jeu est déjà présent dans la base de données, tu ne peux pas créer de doublon !"})
            }
            // Si il n'est pas dans la base de données, on le crée
            const newBoardgame = await Boardgame.create({name:sanitizedName, ...fieldToCreate});

            // Mise en place de logs pour surveiller les créations de jeux
            const currentUser = req.user.pseudo;
            const logger = log4js.getLogger();
            logger.level = "debug";
            logger.debug(`L'utilisateur ${currentUser} à créé le jeu "${newBoardgame.dataValues.name}", dont l'id est ${newBoardgame.dataValues.id}`);
            
            return res.status(201).json({ message: "Jeu crée", newBoardgame });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Jeu non crée" });
        }
    },

    // Mise à jour d'un jeu de société dans la base de données globale
    update: async (req, res) => {
        try {
            const { ...fieldToUpdate } = req.body;
            const boardgameId = parseInt(req.params.id, 10);
            const boardgameToUpdate = await Boardgame.findByPk(boardgameId);
            if(!boardgameToUpdate) {
                return res.status(401).json({ message: "Pas de jeu existant avec cet identifiant" });
            }

            await boardgameToUpdate.update(fieldToUpdate);
            return res.status(201).json({ message: "Mise à jour du jeu effectuée", boardgameToUpdate });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Echec de la mise à jour" });
        }
    },
    
    // Suppression d'un jeu de la base de données globale
    delete: async (req, res) => {
        const boardgameId = parseInt(req.params.id, 10);
        const boardgameToDelete = await Boardgame.findByPk(boardgameId);
        if(!boardgameToDelete) {
            return res.status(401).json({ message: "Jeu non existant" });
        }
        await boardgameToDelete.destroy();
        res.status(201).json({ message: `Jeu ${boardgameToDelete.dataValues.name} supprimé` });
    }

}

module.exports = boardgameController;
