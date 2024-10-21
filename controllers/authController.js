const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const sanitizeHtml = require("sanitize-html");
const RateLimiterMemory = require('rate-limiter-flexible/lib/RateLimiterMemory');

const defaultOptionsSanitize = {
    allowedTags: [],
    allowedAttributes: {},
};

const rateLimiter = new RateLimiterMemory({
    points: 3, // Nombre de requêtes autorisées
    duration: 5 * 60, // Durée de la fenêtre en secondes (5 minutes)
});

const authController = {
    login: async (req, res) => {
        const { email, password } = req.body;
        
        const currentEmail = sanitizeHtml(email, defaultOptionsSanitize);
        const currentPassword = sanitizeHtml(password, defaultOptionsSanitize);

        try {
            await rateLimiter.consume(email);
            if(!currentPassword || !currentEmail) {
                return res.status(401).json({ message: "Tous les champs sont obligatoires !" });
            }
            const user = await User.findOne({ where: { email: currentEmail }, attributes: ['id', 'email', 'password', 'pseudo', 'check']});
            if (!user) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect" });
            } else if(!await bcrypt.compare(currentPassword, user.password)) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect" });
            } else {
                const token = jwt.sign({ user }, process.env.JWT_SECRET);
                
                res.cookie('token', token, {
                    httpOnly: true, // Empêche l'accès via JavaScript
                    secure: process.env.NODE_ENV === 'production', // Assure que le cookie est envoyé via HTTPS en production
                    sameSite: 'Strict', // Limite l'envoi du cookie uniquement pour des requêtes provenant de ton site
                    maxAge: 7257600000, // Durée de vie du cookie (1 heure)
                  });
                return res.status(200).json({ message: "Connexion réussie !", user });
            }
        } catch(error) {
            console.log(error);
            res.status(401).json({ message: "Trop de tentatives de connexion. Réessaie dans 5 minutes." });
        }
    },
    logout: async (req, res) => {
        res.clearCookie('token'); // Efface le cookie du token
        res.status(200).json({ message: 'Déconnexion réussie' });
    },
    authorize: (req, res, next) => {
        
        try {
            const token = req.cookies.token;

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decodedToken.user;
            next();
        } catch (error) {
            return res.status(404).json({ message: "Pas d'autorisation token", erreur: error });
        }
    }
}

module.exports = authController;