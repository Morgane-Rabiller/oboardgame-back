const User = require("../models/userModel.js");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const sanitizeHtml = require("sanitize-html");
const PasswordResetToken = require("../models/passwordResetToken.js");

const defaultOptionsSanitize = {
    allowedTags: [],
    allowedAttributes: {},
};

const userController = {
    passwordRegex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
    emailRegex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,

    read: async (req, res) => {
        try {
            const users = await User.findAll();

            if(!users) {
                return res.status(401).json({message: "Pas d'utilisateurs d'enregistrés"});
            }
            return res.status(200).json({message: "liste des utilisateurs", users});
        } catch (error) {
            return res.status(401).json({message: "Utilisateurs non trouvés", error});
        }
    },

    create: async (req, res) => {
        const { email, pseudo, password, passwordRepeat } = req.body;
        const currentEmail = sanitizeHtml(email, defaultOptionsSanitize);
        const currentPseudo = sanitizeHtml(pseudo, defaultOptionsSanitize);
        const currentPassword = sanitizeHtml(password, defaultOptionsSanitize);
        const currentPasswordRepeat = sanitizeHtml(passwordRepeat, defaultOptionsSanitize);
        
        try {
            const email = await User.findOne({ where: { email: currentEmail }});
            if(email) {
                return res.status(401).json({ message: "Cette adresse mail est déjà prise" });
            }
            if(!currentEmail) {
                return res.status(401).json({ message: "L'email est obligatoire" });
            }
            if(!currentPseudo) {
                return res.status(401).json({ message: "Le pseudo est obligatoire" });
            }
            if(!currentPassword) {
                return res.status(401).json({ message: "Le mot de passe est obligatoire" });
            }
            if (currentPseudo.length < 3) {
                return res.status(401).json({ message: "Ton pseudo doit comporter plus de 2 caractères" });
            }
            if (!userController.emailRegex.test(currentEmail)) {
                return res.status(401).json({ message: "Le format de l'adresse mail n'est pas correct" });
            }
            if (!userController.passwordRegex.test(currentPassword) || currentPassword.length < 8) {
                return res.status(401).json({ message: "Ton mot de passe doit comporter minimum 8 caractères dont une minuscule, une majuscule et un chiffre." });
            }
            if (currentPassword !== currentPasswordRepeat) {
                return res.status(401).json({ message: "Les mots de passe de correspondent pas." });
            }
            const hashedPassword = await bcrypt.hash(currentPassword, 10);
            const user = await User.create({ email: currentEmail, pseudo: currentPseudo, password: hashedPassword });
            return res.status(201).json({ message: "Inscription réussie ! Tu peux maintenant aller te connecter 😉", user: user });
        } catch(error) {
            console.log(error);
            return res.status(401).json({ message: "Echec de l'inscription" });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const id = parseInt(req.user.id, 10);
            const user = await User.findByPk(id);
            const oldPassword = user.dataValues.password;
            if(!user) {
                return res.status(401).json("Utilisateur non trouvé !");
            }

            const { password, newPassword, newPasswordRepeat } = req.body;

            const sanitizedPassword = sanitizeHtml(password, defaultOptionsSanitize);
            const sanitizedNewPassword = sanitizeHtml(newPassword, defaultOptionsSanitize);
            const sanitizedNewPasswordRepeat = sanitizeHtml(newPasswordRepeat, defaultOptionsSanitize);

            if (!(await bcrypt.compare(sanitizedPassword, oldPassword))) {
                return res
                    .status(401)
                    .json({
                        message: "L'ancien mot de passe n'est pas correct.",
                    });
            }

            if (!userController.passwordRegex.test(sanitizedNewPassword)) {
                return res
                    .status(401)
                    .json({
                        message:
                            "Ton mot de passe doit comporter minimum 8 caractères dont une minuscule, une majuscule et un chiffre.",
                    });
            }

            if (sanitizedNewPassword !== sanitizedNewPasswordRepeat) {
                return res
                    .status(401)
                    .json({
                        message:
                            "Les nouveaux mots de passe ne correspondent pas.",
                    });
            }

            if (sanitizedPassword === sanitizedNewPassword) {
                return res
                    .status(401)
                    .json({
                        message:
                            "L'ancien mot de passe et le nouveau sont les mêmes.",
                    });
            }
            const hashedPassword = await bcrypt.hash(sanitizedNewPassword, 10);

            await user.update({ password: hashedPassword });
            return res.status(201).json({ message: "Mot de passe modifié ✔" });
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Echec du changement de mot de passe" });
        }
    },

    deleteAccount: async (req, res) => {
        try {
            const idUser = parseInt(req.user.id);
            const userToDelete = await User.findByPk(idUser);

            if (!userToDelete) {
                return res.status(404).json("Utilisateur non trouvé");
            }
            await userToDelete.destroy({ where: { user_id: userToDelete } });
            res.status(201).json({
                message: "Compte supprimé ✔",
                user: userToDelete,
            });
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Echec de la suppression du compte !"});
        }
    },

    updatePasswordIfForgot: async (req, res) => {
        try {
            const token = req.params.token;
            const idToken = await PasswordResetToken.findOne({
                where: { token },
            });
            // Si le token unique ne se trouve pas dans la table, on retourne un message d'erreur
            if (!idToken) {
                return res.status(401).json({
                    message:
                        "Le lien n'est pas valide, refait une demande de changement de mot de passe pour que celui-ci fonctionne.",
                });
            }
            // Si la date d'expiration est passé, on supprime le token et on retourne un message d'erreur
            const expiration = idToken.dataValues.expiration;
            
            if (expiration < new Date()) {
                await PasswordResetToken.destroy({ where: { token } });
                return res.status(400).json({ message: "Le lien a expiré" });
            }
            const userId = idToken.dataValues.user_id;
            const currentUser = await User.findByPk(userId);
            const { password, passwordRepeat } = req.body;
            const newPassword = sanitizeHtml(password, defaultOptionsSanitize);
            const newPasswordRepeat = sanitizeHtml(passwordRepeat, defaultOptionsSanitize);

            if(!password || !passwordRepeat) {
                return res.status(401).json({message: "Merci de bien vouloir remplir tous les champs"});
            }
            if(newPassword !== newPasswordRepeat) {
                return res.status(401).json({message: "Les mots de passe ne sont pas identiques !"});
            }
            if(!userController.passwordRegex.test(newPassword)) {
                return res.status(401).json({message: "Ton mot de passe doit comporter minimum 8 caractères dont une minuscule, une majuscule et un chiffre."});
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Si tout se passe bien, on enregistre le nouveau mot de passe en base de données
            currentUser.update({ password: hashedPassword });
            await PasswordResetToken.destroy({ where: { token } });
            res.status(201).json({ message: `Ton mot de passe est bien modifié`});
        } catch (error) {
            console.log(error);
            res.status(401).json({
                message:
                    "Une erreur s'est produite, réessai ultérieurement ou contacte l'administrateur",
            });
        }
    },
}

module.exports = userController;