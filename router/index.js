const express = require("express");
const router = express.Router();
const authController =require("../controllers/authController.js");
const userController =require("../controllers/userController.js");
const boardgameController =require("../controllers/boardgameController.js");
const libraryController = require("../controllers/libraryController.js");
const contactController = require("../controllers/contactController.js");

//LOGIN
router.post("/login", authController.login);

// USER
router.get("/user", userController.read);
router.post("/registerUser", userController.create);
router.put("/updatePassword", authController.authorize, userController.updatePassword);
router.delete("/deleteAccount", authController.authorize, userController.deleteAccount);
router.put('/updatePassword/:token', userController.updatePasswordIfForgot);
router.put('/validateAccount', authController.authorize, userController.validateAccount);

//BOARDGAME
router.get("/boardgame", authController.authorize, boardgameController.read);
router.post("/boardgame/create", authController.authorize, boardgameController.create);
router.put("/boardgame/update/:id", authController.authorize, boardgameController.update);
router.delete("/boardgame/delete/:id", authController.authorize, boardgameController.delete);

// LIBRARY
router.get("/library", authController.authorize,libraryController.read);
router.get("/library/random", authController.authorize, libraryController.findBoardgame);
router.post("/library/addBoardgame", authController.authorize, libraryController.addBoardgame);
router.put("/library/update/:id", authController.authorize, libraryController.update);
router.delete("/library/delete/:id", authController.authorize, libraryController.delete);

// CONTACT
router.post('/forgotPassword', contactController.forgotPassword);

module.exports = router;