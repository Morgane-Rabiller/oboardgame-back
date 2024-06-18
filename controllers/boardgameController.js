const Boardgame = require("../models/boardgameModel");

const boardgameController = {
    read: async (req, res) => {

        try {
            const boardgames = await Boardgame.findAll({
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                }});

            return res.status(200).json({ message: "Success", data: boardgames });
        } catch (error) {
            return res.status(401).json({ message: "Echec", error })
        }
    }
}

module.exports = boardgameController;