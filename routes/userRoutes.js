const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/users", authController.protect, userController.getAllUsers);

router.get("/users/:id", userController.getOneUser);

// router.get("/login", authController.checkUserLogin);
router.get("/login", authController.protect, authController.checkUserLogin);

router.patch("/user/:id", userController.updateUser);

router.get("/logout", authController.protect, authController.logout);

module.exports = router;
