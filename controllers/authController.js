const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const sanitizeHtml = require("sanitize-html");

const defaultOptionsSanitize = {
    allowedTags: [],
    allowedAttributes: {},
};

const authController = {
    login: async (req, res) => {
        const { email, password } = req.body;
        const currentEmail = sanitizeHtml(email, defaultOptionsSanitize);
        const currentPassword = sanitizeHtml(password, defaultOptionsSanitize);

        try {
            const user = await User.findOne({ where: { email: currentEmail }});
            if (!user) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect" });
            } else if(!await bcrypt.compare(currentPassword, user.password)) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect" });
            } else {
                const token = jwt.sign({ user }, process.env.JWT_SECRET);
                return res.status(200).json({ message: "Connexion réussie !", token, user });
            }
        } catch(error) {
            console.log(error);
            res.status(401).json({ message: "Echec de la connexion" });
        }
    },
    authorize: (req, res, next) => {
        try {
            const header = req.headers["authorization"];
            
            const token = header.split(" ")[1];

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decodedToken.user;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Pas d'autorisation token", erreur: error });
        }
    }
}

module.exports = authController;