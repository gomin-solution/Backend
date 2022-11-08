const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const LoginMiddleware = require("../middlewares/LoginMiddleware");
const UserController = require("../controllers/user.controller");
const userController = new UserController();

//메인페이지
router.get("/", authMiddleware, userController.mainPage);

//회원가입
router.post("/signup", LoginMiddleware, userController.signup);

//중복검사
router.post("/signup/check", userController.check);

//로그인
router.post("/login", LoginMiddleware, userController.login);

//로그인테스트
router.post("/test", authMiddleware);

module.exports = router;
