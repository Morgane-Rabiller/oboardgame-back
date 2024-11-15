const contactMail = require("../services/contactMail.js");
const { addTokenUser } = require("./authController.js");
require("dotenv").config();
const User = require("../models/userModel.js");
const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require('uuid');

const sanitizeHtml = require("sanitize-html");
const createHtmlForgotPassword = require("../services/templateHtml/ForgotPassword.js");
const PasswordResetToken = require("../models/passwordResetToken.js");

const defaultOptionsSanitize = {
    allowedTags: [],
    allowedAttributes: {},
};

const contactController = {
    forgotPassword: async (req, res) => {
        
        // Récupération de l'adresse mail de l'utilisateur
        const { email } = req.body;
        const currentEmail = sanitizeHtml(email.toLowerCase(), defaultOptionsSanitize);
        try {
            const user = await User.findOne({ where: { email: currentEmail } });
            
            if(!user) {
                return res.status(401).json({message: "Adresse mail non valide !"})
            }
            
            const userId = user.dataValues.id;
            
            const userToDestroy = await PasswordResetToken.findOne({ where: { user_id: userId }});
            // Si l'id de l'utilisateur qui fait la demande est déjà présente dans la table de génération de token, je le supprime de cette table.
            if (userToDestroy) {
                await PasswordResetToken.destroy({ where: { user_id: userId }});
            }
            const tokenGenerated = contactController.generateUniqueToken();
            const expiration = tokenGenerated.expiration;
            // J'enregistre le nouveau token unique généré pour l'url
            await PasswordResetToken.create({
                user_id: userId,
                token: tokenGenerated.token,
                expiration: expiration,
            });
            // Création du contenu du mail
            const htmlConfirmation = createHtmlForgotPassword(
                user.dataValues.pseudo,
                `https://oboardgame.mogo-r.fr/nouveau-mot-de-passe/${tokenGenerated.token}`
            );
            // Envoi du mail
            await contactMail.sendMail(email, "Mot de passe oublié", htmlConfirmation);
            return res
                .status(200)
                .json({
                    message: "Mail envoyé ✔",
                    expiration,
                });
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Adresse mail non correct" });
        }
    },
    
    // Génération d'un token unique pour l'url
    generateUniqueToken: () => {
        const date = new Date();
        // Expiration du token unique
        const expirationDate = new Date(date.getTime() + 1 * 60 * 60 * 1500);
        const hmacHash = CryptoJS.HmacSHA256(
            uuidv4(),
            process.env.HMAC_SECRET
        );
        return { token: hmacHash.toString(), expiration: expirationDate };
    },

    contactAdmin: async (req, res) => {
        
        // Récupération de l'adresse mail de l'utilisateur
        const { email, object, content } = req.body;
        const currentEmail = sanitizeHtml(email.toLowerCase(), defaultOptionsSanitize);
        const currentObject = sanitizeHtml(object, defaultOptionsSanitize);
        const currentContent = sanitizeHtml(content, defaultOptionsSanitize);
        try {
            
            // Envoi du mail
            await contactMail.receiveMail(currentEmail, currentObject, currentContent);
            return res
                .status(200)
                .json({
                    message: "Mail envoyé ✔",
                });
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Erreur lors de l'envoi du mail" });
        }
    },
};

module.exports = contactController;
