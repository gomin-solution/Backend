const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const LoginMiddleware = require("../middlewares/LoginMiddleware");
const UserController = require("../controllers/user.controller");
const userController = new UserController();

router.get("/", authMiddleware, userController.mainPage);
router.post("/signup", LoginMiddleware, userController.signup);
router.post("/signup/check", userController.check);
router.post("/login", LoginMiddleware, userController.login);
router.post("/test", authMiddleware);

module.exports = router;
