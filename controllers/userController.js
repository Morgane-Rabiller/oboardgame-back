const User = require("../models/userModel.js");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const sanitizeHtml = require("sanitize-html");

const defaultOptionsSanitize = {
    allowedTags: [],
    allowedAttributes: {},
};

const userController = {
    register: async (req, res) => {
        const { email, pseudo, password } = req.body;
        const currentEmail = sanitizeHtml(email, defaultOptionsSanitize);
        const currentPseudo = sanitizeHtml(pseudo, defaultOptionsSanitize);
        const currentPassword = sanitizeHtml(password, defaultOptionsSanitize);

        try {
            if(!currentEmail) {
                return res.status(401).json({ message: "L'email est obligatoire" });
            }
            if(!currentPseudo) {
                return res.status(401).json({ message: "Le pseudo est obligatoire" });
            }
            if(!currentPassword) {
                return res.status(401).json({ message: "Le mot de passe est obligatoire" });
            }
            const hashedPassword = await bcrypt.hash(currentPassword, 10);
            const user = await User.create({ email: currentEmail, pseudo: currentPseudo, password: hashedPassword });
            return res.status(201).json({ message: "Inscription réussie !", user: user });
        } catch(error) {
            console.log(error);
            return res.status(401).json({ message: "Echec de l'inscription" });
        }
    } 
}

module.exports = userController;