const express = require("express");
const router = express.Router();
const authController =require("../controllers/authController.js");
const userController =require("../controllers/userController.js");
const boardgameController =require("../controllers/boardgameController.js");

//LOGIN
router.post("/login", authController.login);

// USER
router.post("/registerUser", userController.create);

router.put("/updatePassword/:id", userController.updatePassword);

//BOARDGAME
router.get("/boardgame", boardgameController.read);

router.post("/boardgame/addBoardgame", authController.authorize, boardgameController.addBoardgameInLibrary);

router.post("/boardgame/create", authController.authorize, boardgameController.create);

module.exports = router;