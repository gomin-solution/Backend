const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const LoginMiddleware = require("../middlewares/LoginMiddleware");
const LogoutMiddleware = require("../middlewares/LogoutMiddleware");
const uploaduser = require("../modules/user.multer");
const UserController = require("../controllers/user.controller");
const userController = new UserController();

const AdviceController = require("../controllers/advice.controller");
const adviceController = new AdviceController();

//메인페이지
router.get("/", authMiddleware, userController.mainPage);

//행운의편지 메세지 열기
router.put("/msg", authMiddleware, userController.dailyMessage);

//회원가입
router.post("/signup", LoginMiddleware, userController.signup);

//비밀번호 변경
router.put("/password", authMiddleware, userController.passwordChange);

//중복검사
router.post("/signup/check", userController.check);

//로그인
router.post("/login", LoginMiddleware, userController.login);

//로그아웃
router.delete("/logout", LogoutMiddleware);

//로그인테스트
router.post("/test", authMiddleware);

// 프로필 이미지 수정
router.put(
  "/mypage",
  authMiddleware,
  uploaduser.single("image"),
  userController.profileUpdate
);

//설정 페이지(관리자 인경우 신고 리스트 보내기)
router.get("/setting", authMiddleware, userController.setting);

//내가 쓴 글 조회
router.get("/mypost", authMiddleware, userController.myPost);

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
router.put("/reword/:missionId", authMiddleware, userController.getReword);

module.exports = router;
