const express = require("express");
const router = express.Router();
const authController =require("../controllers/authController.js");
const userController =require("../controllers/userController.js");

router.post("/login", authController.login);

router.post("/registerUser", userController.create);

router.put("/updatePassword/:id", userController.updatePassword)

module.exports = router;