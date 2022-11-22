const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const LoginMiddleware = require("../middlewares/LoginMiddleware");
const uploaduser = require("../modules/user.multer");
const UserController = require("../controllers/user.controller");
const userController = new UserController();

const AdviceController = require("../controllers/advice.controller");
const adviceController = new AdviceController();

//메인페이지
router.get("/", authMiddleware, userController.mainPage);

//메인페이지 메세지 열기
router.get("/msg", authMiddleware, userController.dailyMessage);

//회원가입
router.post("/signup", LoginMiddleware, userController.signup);

//중복검사
router.post("/signup/check", userController.check);

//로그인
router.post("/login", LoginMiddleware, userController.login);

//로그인테스트
router.post("/test", authMiddleware);

// 프로필 이미지 수정
router.put(
  "/mypage",
  authMiddleware,
  uploaduser.single("image"),
  userController.profileUpdate
);

//마이페이지
router.get("/mypage", authMiddleware, userController.mypage);

//검색
router.get("/search/:keyword", authMiddleware, userController.search);

//리워드
router.get("/reword", authMiddleware, userController.reword);

// 프로필 이미지 업로드
//router.put("/mypage", authMiddleware, userController.profileUpdate);

//조언 게시글 삭제
router.delete(
  "/advice/:adviceId",
  authMiddleware,
  adviceController.deleteAdvice
);

//리워드
router.put(
  "/mypage/reword/:missionId",
  authMiddleware,
  userController.getReword
);

module.exports = router;
