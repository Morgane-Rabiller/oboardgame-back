const express = require("express");
const router = express.Router();
const authController =require("../controllers/authController.js");
const userController =require("../controllers/userController.js");

router.post("/login", authController.login);

router.post("/register", userController.register);

module.exports = router;